import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { eq, sql } from 'drizzle-orm'
import * as schema from '../server/db/schema'
import { recordPreparedUsage, sampleChunks } from '../server/services/chunk-sampler'
import { prepareQuestions, validateQuestions, type GeneratorDependencies } from '../server/services/question-generator'
import { DIFFICULTIES, PreparationError, type QuestionDatabase, type PreparedQuestions } from '../server/services/question-types'

const timestamp = Date.UTC(2026, 8, 11, 12)
const day = 86_400_000
const input = { userId: 'test-user', topic: 'test' }
const quiet = () => {}

function seededRandom(seed = 42): () => number {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 }
}
function validOutput() {
  return { questions: DIFFICULTIES.map((difficulty, index) => ({
    position: index + 1, difficulty, stem: `Qual conceito está descrito no trecho de número ${index + 1}?`,
    options: ['Primeiro conceito', 'Segundo conceito', 'Terceiro conceito', 'Quarto conceito'],
    correct_index: 0, explanation: 'O trecho apresenta explicitamente o primeiro conceito como definição.',
  })) }
}
function envelope(payload: unknown): Response {
  return Response.json({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(payload) }] } }] })
}
function dependencies(db: QuestionDatabase, transport: typeof fetch = async () => envelope(validOutput())): GeneratorDependencies {
  return { db, apiKey: 'fake-key', transport, random: seededRandom(), now: () => timestamp, log: quiet }
}
async function database(run: (db: QuestionDatabase) => Promise<void>): Promise<void> {
  const client = createClient({ url: 'file::memory:' })
  const db = drizzle(client, { schema })
  try {
    await migrate(db, { migrationsFolder: 'server/db/migrations' })
    await db.insert(schema.users).values({ id: input.userId, email: 't05@selbetti.com.br', displayName: 'Teste T05', createdAt: timestamp })
    await run(db)
  } finally { client.close() }
}
async function seed(db: QuestionDatabase): Promise<void> {
  await db.insert(schema.chunks).values(Array.from({ length: 23 }, (_, index) => ({
    id: `chunk-${String(index).padStart(2, '0')}`, topic: index === 22 ? 'other' : 'test',
    sourceFile: 'test/material.md', content: 'Material de estudo para verificação do gerador. '.repeat(10),
    contentHash: `hash-${index}`, active: index === 21 ? 0 : 1, createdAt: timestamp,
  })))
  const output = validOutput()
  await db.insert(schema.questions).values(Array.from({ length: 23 }, (_, index) => {
    const draft = output.questions[index % 7]!
    return { id: `question-${index}`, chunkId: `chunk-${String(index).padStart(2, '0')}`,
      topic: index === 22 ? 'other' : 'test', sourceFile: 'test/material.md', difficulty: draft.difficulty,
      stem: draft.stem, options: JSON.stringify(draft.options), correctIndex: draft.correct_index,
      explanation: draft.explanation, createdAt: timestamp }
  }))
}
async function snapshot(db: QuestionDatabase) {
  return { chunks: await db.select().from(schema.chunks).orderBy(schema.chunks.id),
    seen: await db.select().from(schema.seenChunks), rounds: await db.select().from(schema.rounds) }
}
function checkPrepared(result: PreparedQuestions): void {
  assert.equal(result.questions.length, 7)
  assert.equal(new Set(result.questions.map(question => question.chunkId)).size, 7)
  assert.equal(new Set(result.questions.map(question => question.id)).size, 7)
  validateQuestions({ questions: result.questions.map(question => ({ ...question, correct_index: question.correctIndex })) })
}
async function test(name: string, run: (db: QuestionDatabase) => Promise<void>) {
  await database(async db => { await seed(db); await run(db) })
  console.log(`[OK] ${name}`)
}

async function simulatedChecks(): Promise<void> {
  await test('geração válida, contrato REST, uma chamada e registro transacional', async db => {
    let calls = 0
    const before = await snapshot(db)
    const result = await prepareQuestions(input, dependencies(db, async (url, init) => {
      calls++
      assert.match(String(url), /gemini-3\.1-flash-lite:generateContent$/)
      const body = JSON.parse(String(init?.body))
      assert.equal(body.generationConfig.responseMimeType, 'application/json')
      const material = JSON.parse(body.contents[0].parts[0].text)
      assert.equal(material.length, 7)
      assert.deepEqual(material.map((chunk: { difficulty: string }) => chunk.difficulty), DIFFICULTIES)
      assert.match(body.systemInstruction.parts[0].text, /Sem pegadinhas de leitura/)
      assert.equal((init?.headers as Record<string, string>)['x-goog-api-key'], 'fake-key')
      return envelope(validOutput())
    }))
    checkPrepared(result)
    assert.equal(calls, 1)
    assert.equal(result.source, 'llm')
    assert.deepEqual(await snapshot(db), before)
    await assert.rejects(db.transaction(async tx => { await recordPreparedUsage(tx, result, timestamp); throw new Error('rollback') }), /rollback/)
    assert.deepEqual(await snapshot(db), before)
    await db.transaction(tx => recordPreparedUsage(tx, result, timestamp))
    const after = await snapshot(db)
    assert.equal(after.seen.length, 7)
    assert.equal(after.chunks.reduce((sum, chunk) => sum + chunk.timesUsed, 0), 7)
    assert.deepEqual(new Set(after.seen.map(row => row.chunkId)), new Set(result.questions.map(question => question.chunkId)))
    assert.equal(after.rounds.length, 0)
  })
  await test('janela de sete dias e relaxamentos para três e zero dias', async db => {
    const mark = async (count: number, age: number) => {
      await db.delete(schema.seenChunks)
      await db.insert(schema.seenChunks).values(Array.from({ length: count }, (_, index) => ({
        id: `seen-${index}`, userId: input.userId, chunkId: `chunk-${String(index).padStart(2, '0')}`, seenAt: timestamp - age * day,
      })))
    }
    const events: number[] = []
    const deps = { ...dependencies(db), log: (event: string, details: Record<string, unknown>) => { if (event === 'janela_relaxada') events.push(Number(details.days)) } }
    await mark(7, 1)
    const sample = await sampleChunks(input, deps)
    assert(sample.every(item => Number(item.chunk.id.slice(-2)) >= 7 && item.chunk.topic === 'test' && item.chunk.active === 1))
    assert.deepEqual(events, [])
    await mark(15, 5)
    await sampleChunks(input, deps)
    assert.deepEqual(events, [3])
    events.length = 0
    await mark(15, 1)
    await sampleChunks(input, deps)
    assert.deepEqual(events, [3, 0])
    const allTopics = await sampleChunks({ userId: input.userId }, { ...deps, random: () => 0.999999 })
    assert(allTopics.some(item => item.chunk.topic === 'other'))
  })
  await test('ponderação favorece material menos usado', async db => {
    await db.update(schema.chunks).set({ timesUsed: 100 }).where(sql`${schema.chunks.id} >= 'chunk-07'`)
    const deps = dependencies(db)
    let low = 0
    let high = 0
    for (let i = 0; i < 200; i++) {
      for (const { chunk } of await sampleChunks(input, deps)) {
        if (chunk.timesUsed === 0) low++; else high++
      }
    }
    assert(low > high * 3, `frequências: pouco usados=${low}, muito usados=${high}`)
  })
  const mutations: Array<[string, (output: ReturnType<typeof validOutput>) => void]> = [
    ['opção duplicada com espaços e caixa', value => { value.questions[0]!.options[1] = ' PRIMEIRO CONCEITO ' }],
    ['seis perguntas', value => { value.questions.pop() }],
    ['posição duplicada', value => { value.questions[1]!.position = 1 }],
    ['posição fracionária', value => { value.questions[0]!.position = 1.5 }],
    ['dificuldade incorreta', value => { value.questions[0]!.difficulty = 'dificil' }],
    ['índice fracionário', value => { value.questions[0]!.correct_index = 0.5 }],
    ['índice fora do intervalo', value => { value.questions[0]!.correct_index = 4 }],
    ['opção vazia', value => { value.questions[0]!.options[0] = ' ' }],
    ['enunciado curto', value => { value.questions[0]!.stem = 'curto' }],
    ['explicação curta', value => { value.questions[0]!.explanation = 'curta' }],
  ]
  for (const [name, mutate] of mutations) {
    await test(`fallback: ${name}`, async db => {
      const output = validOutput()
      mutate(output)
      let calls = 0
      const result = await prepareQuestions(input, dependencies(db, async () => { calls++; return envelope(output) }))
      assert.equal(calls, 1)
      assert.equal(result.source, 'fallback')
      checkPrepared(result)
      assert(result.questions.every(question => question.id.startsWith('question-')))
    })
  }
  for (const failure of ['json', 'http', 'network', 'timeout', 'body-timeout', 'blocked']) {
    await test(`fallback: ${failure}`, async db => {
      let calls = 0
      let signal: AbortSignal | null | undefined
      const deps = dependencies(db, async (_url, init) => {
        calls++
        signal = init?.signal
        if (failure === 'http') return new Response('', { status: 503 })
        if (failure === 'network') throw new Error('falha simulada')
        if (failure === 'json') return new Response('{')
        if (failure === 'blocked') return Response.json({ candidates: [{ finishReason: 'SAFETY' }] })
        if (failure === 'body-timeout') return new Response(new ReadableStream({ start() {} }))
        return new Promise<Response>(() => {})
      })
      deps.timeoutMs = 10
      const result = await prepareQuestions(input, deps)
      assert.equal(calls, 1)
      assert.equal(result.source, 'fallback')
      checkPrepared(result)
      if (failure.includes('timeout')) assert.equal(signal?.aborted, true)
    })
  }
  await test('fallback prioriza inéditos, ignora inativos/corrompidos e registra apenas os entregues', async db => {
    await db.insert(schema.seenChunks).values(Array.from({ length: 7 }, (_, index) => ({
      id: `seen-${index}`, userId: input.userId, chunkId: `chunk-0${index}`, seenAt: timestamp - 30 * day,
    })))
    await db.update(schema.questions).set({ active: 0 }).where(eq(schema.questions.id, 'question-7'))
    await db.update(schema.questions).set({ options: 'invalid json' }).where(eq(schema.questions.id, 'question-8'))
    const result = await prepareQuestions(input, dependencies(db, async () => new Response('', { status: 500 })))
    checkPrepared(result)
    assert(result.questions.every(question => Number(question.chunkId.slice(-2)) >= 7 && Number(question.chunkId.slice(-2)) < 21))
    assert(result.questions.every(question => !['question-7', 'question-8'].includes(question.id)))
    await db.transaction(tx => recordPreparedUsage(tx, result, timestamp))
    const changed = (await db.select().from(schema.chunks)).filter(chunk => chunk.timesUsed > 0)
    assert.deepEqual(new Set(changed.map(chunk => chunk.id)), new Set(result.questions.map(question => question.chunkId)))
  })
  await test('fallback encontra combinação que uma escolha gulosa perderia', async db => {
    await db.delete(schema.questions)
    const assignment = ['facil', 'facil', 'facil', 'medio', 'medio', 'medio', 'dificil', 'dificil'] as const
    await db.insert(schema.questions).values(assignment.map((difficulty, index) => ({
      id: `trap-${index}`, chunkId: `chunk-0${index === 7 ? 0 : index}`, topic: 'test', sourceFile: 'test/material.md',
      difficulty, stem: validOutput().questions[0]!.stem, options: JSON.stringify(['A', 'B', 'C', 'D']),
      correctIndex: 0, explanation: validOutput().questions[0]!.explanation, createdAt: timestamp,
    })))
    const result = await prepareQuestions(input, dependencies(db, async () => new Response('', { status: 500 })))
    checkPrepared(result)
    assert.equal(result.questions.find(question => question.chunkId === 'chunk-00')?.difficulty, 'dificil')
    await db.delete(schema.questions).where(eq(schema.questions.id, 'trap-6'))
    const before = await snapshot(db)
    await assert.rejects(prepareQuestions(input, dependencies(db, async () => new Response('', { status: 500 }))),
      (error: unknown) => error instanceof PreparationError && error.code === 'PREPARATION_UNAVAILABLE' && !error.consumeAttempt)
    assert.deepEqual(await snapshot(db), before)
  })
  await test('material insuficiente e falha total não alteram banco nem consomem tentativa', async db => {
    let calls = 0
    const deps = dependencies(db, async () => { calls++; return new Response('', { status: 500 }) })
    const before = await snapshot(db)
    await assert.rejects(prepareQuestions({ ...input, topic: 'other' }, deps),
      (error: unknown) => error instanceof PreparationError && error.code === 'INSUFFICIENT_MATERIAL' && !error.consumeAttempt)
    assert.equal(calls, 0)
    await db.delete(schema.questions)
    await assert.rejects(prepareQuestions(input, deps),
      (error: unknown) => error instanceof PreparationError && error.code === 'PREPARATION_UNAVAILABLE' && !error.consumeAttempt)
    assert.equal(calls, 1)
    assert.deepEqual(await snapshot(db), before)
  })
  await test('chave ausente usa fallback sem requisição ou exposição de segredo', async db => {
    const events: Array<{ event: string, details: Record<string, unknown> }> = []
    const deps = dependencies(db, async () => { throw new Error('transporte não deve ser chamado') })
    deps.apiKey = ''
    deps.log = (event, details) => { events.push({ event, details }) }
    const result = await prepareQuestions(input, deps)
    checkPrepared(result)
    assert.equal(result.source, 'fallback')
    assert.equal(events.find(entry => entry.event === 'concluido')?.details.calls, 0)
    assert(!JSON.stringify(events).includes('apiKey'))
  })
  await test('chunk removido após preparação aborta todo o registro de uso', async db => {
    const result = await prepareQuestions(input, dependencies(db))
    await db.update(schema.chunks).set({ active: 0 }).where(eq(schema.chunks.id, result.questions[0]!.chunkId))
    const before = await snapshot(db)
    await assert.rejects(db.transaction(tx => recordPreparedUsage(tx, result)),
      (error: unknown) => error instanceof PreparationError && !error.consumeAttempt)
    assert.deepEqual(await snapshot(db), before)
  })
}

async function liveCheck(): Promise<void> {
  const source = createClient({ url: process.env.TURSO_DATABASE_URL || 'file:./.data/dev.db', authToken: process.env.TURSO_AUTH_TOKEN || undefined })
  try {
    const material = await drizzle(source, { schema }).select().from(schema.chunks).where(eq(schema.chunks.active, 1))
    await database(async db => {
      await db.insert(schema.chunks).values(material)
      const result = await prepareQuestions({ userId: input.userId, topic: 'mdm' }, {
        db, apiKey: process.env.LLM_API_KEY || '', model: process.env.LLM_MODEL || 'gemini-3.1-flash-lite',
      })
      checkPrepared(result)
      assert.equal(result.source, 'llm')
      await db.transaction(tx => recordPreparedUsage(tx, result))
      await mkdir('.data', { recursive: true })
      await writeFile('.data/t05-live-review.json', JSON.stringify({ ...result, questions: result.questions.map(question => ({
        ...question, sourceContent: material.find(chunk => chunk.id === question.chunkId)!.content,
      })) }, null, 2), 'utf8')
      console.log('[OK] chamada real única; revisão em .data/t05-live-review.json; histórico de teste isolado em memória')
    })
  } finally { source.close() }
}

const flags = process.argv.slice(2)
if (flags.some(flag => flag !== '--live')) throw new Error('Use npm run questions:check [-- --live]')
;(flags.includes('--live') ? liveCheck() : simulatedChecks()).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Falha na verificação')
  process.exitCode = 1
})
