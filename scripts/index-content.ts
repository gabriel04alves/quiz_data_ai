import { createHash, randomUUID } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createClient, type Transaction } from '@libsql/client'

const MIN_CHUNK_CHARACTERS = 200
const LARGE_SECTION_CHARACTERS = 1_500 * 4
const TARGET_CHUNK_CHARACTERS = 800 * 4

interface SourceFile {
  absolutePath: string
  sourceFile: string
  topic: string
}

interface ChunkCandidate {
  content: string
  contentHash: string
  heading: string | null
}

interface IndexedFile extends SourceFile {
  chunks: ChunkCandidate[]
  discardedShort: number
}

interface TopicSummary {
  filesRead: number
  created: number
  maintained: number
  reactivated: number
  removed: number
  discardedShort: number
}

function sortByName<T extends { name: string }>(entries: T[]): T[] {
  return entries.sort((left, right) => left.name.localeCompare(right.name))
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function contentHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

function splitAtWordBoundaries(text: string, maximumLength: number): string[] {
  const parts: string[] = []
  let remaining = text.trim()

  while (remaining.length > maximumLength) {
    const candidate = remaining.slice(0, maximumLength + 1)
    const boundary = Math.max(
      candidate.lastIndexOf('\n'),
      candidate.lastIndexOf(' '),
      candidate.lastIndexOf('\t'),
    )
    const splitAt = boundary > 0 ? boundary : maximumLength
    parts.push(remaining.slice(0, splitAt).trim())
    remaining = remaining.slice(splitAt).trim()
  }

  if (remaining) {
    parts.push(remaining)
  }

  return parts
}

function splitSection(content: string, heading: string | null): string[] {
  if (content.length <= LARGE_SECTION_CHARACTERS) {
    return [content]
  }

  const headingPrefix = heading ? `## ${heading}` : ''
  const body = headingPrefix && content.startsWith(headingPrefix)
    ? content.slice(headingPrefix.length).trim()
    : content
  const bodyLimit = Math.max(
    MIN_CHUNK_CHARACTERS,
    TARGET_CHUNK_CHARACTERS - (headingPrefix ? headingPrefix.length + 2 : 0),
  )
  const paragraphs = body.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean)
  const blocks: string[] = []
  let current = ''

  const flushCurrent = () => {
    if (current) {
      blocks.push(current)
      current = ''
    }
  }

  for (const paragraph of paragraphs) {
    if (paragraph.length > bodyLimit) {
      flushCurrent()
      blocks.push(...splitAtWordBoundaries(paragraph, bodyLimit))
      continue
    }

    const combined = current ? `${current}\n\n${paragraph}` : paragraph
    if (combined.length > bodyLimit) {
      flushCurrent()
      current = paragraph
    } else {
      current = combined
    }
  }

  flushCurrent()

  return blocks.map((block) => normalizeText(
    headingPrefix ? `${headingPrefix}\n\n${block}` : block,
  ))
}

function chunkMarkdown(markdown: string): { chunks: ChunkCandidate[], discardedShort: number } {
  const normalizedMarkdown = normalizeText(markdown)
  const lines = normalizedMarkdown ? normalizedMarkdown.split('\n') : []
  const sections: Array<{ heading: string | null, lines: string[] }> = []
  let currentHeading: string | null = null
  let currentLines: string[] = []

  const flushSection = () => {
    const content = normalizeText(currentLines.join('\n'))
    if (content) {
      sections.push({ heading: currentHeading, lines: currentLines })
    }
  }

  for (const line of lines) {
    const headingMatch = line.match(/^##(?!#)[\t ]+(.+?)[\t ]*$/)
    if (headingMatch) {
      flushSection()
      currentHeading = headingMatch[1]!.trim()
      currentLines = [`## ${currentHeading}`]
    } else {
      currentLines.push(line)
    }
  }
  flushSection()

  const chunks: ChunkCandidate[] = []
  let discardedShort = 0

  for (const section of sections) {
    const sectionContent = normalizeText(section.lines.join('\n'))
    for (const part of splitSection(sectionContent, section.heading)) {
      const content = normalizeText(part)
      if (content.length < MIN_CHUNK_CHARACTERS) {
        discardedShort += 1
        continue
      }

      chunks.push({
        content,
        contentHash: contentHash(content),
        heading: section.heading,
      })
    }
  }

  return { chunks, discardedShort }
}

async function discoverSourceFiles(contentDirectory: string): Promise<SourceFile[]> {
  const rootEntries = sortByName(await readdir(contentDirectory, { withFileTypes: true }))
  const sourceFiles: SourceFile[] = []

  for (const entry of rootEntries) {
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      console.warn(`[aviso] arquivo solto ignorado: ${entry.name}`)
      continue
    }

    if (!entry.isDirectory()) {
      continue
    }

    const topic = entry.name
    const topicDirectory = resolve(contentDirectory, topic)
    const topicEntries = sortByName(await readdir(topicDirectory, { withFileTypes: true }))

    for (const topicEntry of topicEntries) {
      const sourceFile = `${topic}/${topicEntry.name}`
      if (topicEntry.isDirectory()) {
        console.warn(`[aviso] subpasta aninhada ignorada: ${sourceFile}/`)
      } else if (topicEntry.isFile() && topicEntry.name.toLowerCase().endsWith('.md')) {
        sourceFiles.push({
          absolutePath: resolve(topicDirectory, topicEntry.name),
          sourceFile,
          topic,
        })
      }
    }
  }

  return sourceFiles
}

function getTopicSummary(summaries: Map<string, TopicSummary>, topic: string): TopicSummary {
  const existing = summaries.get(topic)
  if (existing) {
    return existing
  }

  const summary: TopicSummary = {
    filesRead: 0,
    created: 0,
    maintained: 0,
    reactivated: 0,
    removed: 0,
    discardedShort: 0,
  }
  summaries.set(topic, summary)
  return summary
}

async function deactivateMissingChunks(
  transaction: Transaction,
  file: IndexedFile,
): Promise<number> {
  const hashes = [...new Set(file.chunks.map(chunk => chunk.contentHash))]
  const hashFilter = hashes.length > 0
    ? ` AND content_hash NOT IN (${hashes.map(() => '?').join(', ')})`
    : ''
  const result = await transaction.execute({
    sql: `UPDATE chunks SET active = 0 WHERE source_file = ? AND active = 1${hashFilter}`,
    args: [file.sourceFile, ...hashes],
  })
  return result.rowsAffected
}

async function upsertChunk(
  transaction: Transaction,
  file: IndexedFile,
  chunk: ChunkCandidate,
): Promise<'created' | 'maintained' | 'reactivated'> {
  const existing = await transaction.execute({
    sql: 'SELECT active FROM chunks WHERE content_hash = ? LIMIT 1',
    args: [chunk.contentHash],
  })

  if (existing.rows.length > 0) {
    if (Number(existing.rows[0]!.active) === 0) {
      await transaction.execute({
        sql: `UPDATE chunks
              SET topic = ?, source_file = ?, heading = ?, content = ?, active = 1
              WHERE content_hash = ?`,
        args: [file.topic, file.sourceFile, chunk.heading, chunk.content, chunk.contentHash],
      })
      return 'reactivated'
    }
    return 'maintained'
  }

  const inserted = await transaction.execute({
    sql: `INSERT INTO chunks
            (id, topic, source_file, heading, content, content_hash, times_used, active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 0, 1, ?)
          ON CONFLICT (content_hash) DO NOTHING`,
    args: [
      randomUUID(),
      file.topic,
      file.sourceFile,
      chunk.heading,
      chunk.content,
      chunk.contentHash,
      Date.now(),
    ],
  })

  return inserted.rowsAffected === 1 ? 'created' : 'maintained'
}

async function synchronizeFiles(
  transaction: Transaction,
  files: IndexedFile[],
  summaries: Map<string, TopicSummary>,
): Promise<void> {
  // Arquivos que saíram de content/ (ou tópicos renomeados/removidos): desativa os chunks.
  // Soft delete, porque perguntas e respostas antigas referenciam chunks.
  const currentSourceFiles = new Set(files.map(file => file.sourceFile))
  const activeSources = await transaction.execute(
    'SELECT source_file, topic, COUNT(*) AS total FROM chunks WHERE active = 1 GROUP BY source_file, topic',
  )
  for (const row of activeSources.rows) {
    const sourceFile = String(row.source_file)
    if (currentSourceFiles.has(sourceFile)) {
      continue
    }
    const result = await transaction.execute({
      sql: 'UPDATE chunks SET active = 0 WHERE source_file = ? AND topic = ? AND active = 1',
      args: [sourceFile, String(row.topic)],
    })
    getTopicSummary(summaries, String(row.topic)).removed += result.rowsAffected
  }

  for (const file of files) {
    const summary = getTopicSummary(summaries, file.topic)
    summary.removed += await deactivateMissingChunks(transaction, file)
  }

  for (const file of files) {
    const summary = getTopicSummary(summaries, file.topic)
    const uniqueChunks = [...new Map(
      file.chunks.map(chunk => [chunk.contentHash, chunk]),
    ).values()]

    for (const chunk of uniqueChunks) {
      const result = await upsertChunk(transaction, file, chunk)
      summary[result] += 1
    }
  }
}

function logSummaries(summaries: Map<string, TopicSummary>): void {
  for (const [topic, summary] of [...summaries.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    console.log(
      `[${topic}] arquivos=${summary.filesRead} criados=${summary.created} `
      + `mantidos=${summary.maintained} reativados=${summary.reactivated} `
      + `removidos=${summary.removed} descartados=${summary.discardedShort} `
      + '(motivo: menos de 200 caracteres)',
    )
  }
}

async function main(): Promise<void> {
  const contentDirectory = resolve(process.cwd(), 'content')
  const sourceFiles = await discoverSourceFiles(contentDirectory)
  const summaries = new Map<string, TopicSummary>()
  const indexedFiles: IndexedFile[] = []

  for (const sourceFile of sourceFiles) {
    const markdown = await readFile(sourceFile.absolutePath, 'utf8')
    const { chunks, discardedShort } = chunkMarkdown(markdown)
    indexedFiles.push({ ...sourceFile, chunks, discardedShort })

    const summary = getTopicSummary(summaries, sourceFile.topic)
    summary.filesRead += 1
    summary.discardedShort += discardedShort
  }

  const url = process.env.TURSO_DATABASE_URL || 'file:./.data/dev.db'
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined
  const client = createClient({ url, authToken })
  let transaction: Transaction | undefined

  try {
    transaction = await client.transaction('write')
    await synchronizeFiles(transaction, indexedFiles, summaries)
    await transaction.commit()
    logSummaries(summaries)
  } catch (error) {
    if (transaction && !transaction.closed) {
      await transaction.rollback()
    }
    throw error
  } finally {
    transaction?.close()
    client.close()
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Falha ao indexar o conteúdo: ${message}`)
  process.exitCode = 1
})
