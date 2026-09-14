import { createHash } from 'node:crypto'
import MarkdownIt from 'markdown-it'
import type {
  StudyMaterialDetail,
  StudyMaterialSummary,
  StudyMaterialTocItem,
} from '../../shared/types/study-material'

interface MaterialSource extends StudyMaterialSummary {
  storageKey: string
  sourceFile: string
}

const markdown = new MarkdownIt({
  breaks: false,
  html: false,
  linkify: true,
  typographer: false,
})

const defaultLinkOpen = markdown.renderer.rules.link_open

markdown.renderer.rules.link_open = (tokens, index, options, environment, renderer) => {
  const token = tokens[index]!
  let href = token.attrGet('href') ?? ''

  if (href.startsWith('#')) {
    try {
      href = `#${slugify(decodeURIComponent(href.slice(1)))}`
      token.attrSet('href', href)
    } catch {
      token.attrSet('href', '#')
    }
  }

  if (/^https?:\/\//i.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }

  return defaultLinkOpen
    ? defaultLinkOpen(tokens, index, options, environment, renderer)
    : renderer.renderToken(tokens, index, options)
}

let catalogPromise: Promise<MaterialSource[]> | undefined

function materialStorage() {
  return useStorage('study-materials')
}

function storageKeyParts(storageKey: string): string[] {
  return storageKey.includes(':')
    ? storageKey.split(':')
    : storageKey.split('/')
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' e ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function plainHeading(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/\\([\\`*{}\[\]()#+.!_-])/g, '$1')
    .trim()
}

function topicLabel(topic: string): string {
  const normalized = topic.replace(/-/g, ' ').trim()
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`
}

function fallbackTitle(fileName: string): string {
  const withoutExtension = fileName.replace(/\.md$/i, '')
  const normalized = withoutExtension.replace(/[-_]+/g, ' ').trim()
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`
}

function extractTitle(markdownSource: string, fileName: string): string {
  const heading = markdownSource.match(/^#[\t ]+(.+?)[\t ]*$/m)?.[1]
  return heading ? plainHeading(heading) : fallbackTitle(fileName)
}

function countWords(markdownSource: string): number {
  return markdownSource.match(/[\p{L}\p{N}]+/gu)?.length ?? 0
}

async function readMarkdown(storageKey: string): Promise<string> {
  const source = await materialStorage().getItem<string>(storageKey)

  if (typeof source !== 'string') {
    throw new Error(`Material de estudo indisponível no bundle: ${storageKey}`)
  }

  return source
}

function sourceSlug(topic: string, fileName: string): string {
  const topicSlug = slugify(topic)
  const fileSlug = slugify(fileName.replace(/\.md$/i, ''))
  return topicSlug === fileSlug ? fileSlug : `${topicSlug}-${fileSlug}`
}

async function buildCatalog(): Promise<MaterialSource[]> {
  const keys = await materialStorage().getKeys()
  const validKeys = keys.filter((key) => {
    const parts = storageKeyParts(key)
    return parts.length === 2 && parts[0] !== '' && /\.md$/i.test(parts[1] ?? '')
  })

  const candidates = await Promise.all(validKeys.map(async (storageKey) => {
    const [topic = '', fileName = ''] = storageKeyParts(storageKey)
    const sourceFile = `${topic}/${fileName}`
    const markdownSource = await readMarkdown(storageKey)
    const wordCount = countWords(markdownSource)

    return {
      storageKey,
      sourceFile,
      slug: sourceSlug(topic, fileName),
      title: extractTitle(markdownSource, fileName),
      topic: topicLabel(topic),
      wordCount,
      readingMinutes: Math.max(1, Math.ceil(wordCount / 220)),
    }
  }))

  const slugCounts = new Map<string, number>()
  for (const candidate of candidates) {
    slugCounts.set(candidate.slug, (slugCounts.get(candidate.slug) ?? 0) + 1)
  }

  return candidates
    .map(candidate => slugCounts.get(candidate.slug) === 1
      ? candidate
      : {
          ...candidate,
          slug: `${candidate.slug}-${createHash('sha256').update(candidate.sourceFile).digest('hex').slice(0, 8)}`,
        })
    .sort((left, right) => left.title.localeCompare(right.title, 'pt-BR'))
}

async function getCatalogSources(): Promise<MaterialSource[]> {
  catalogPromise ??= buildCatalog()
  return catalogPromise
}

function renderMaterial(source: MaterialSource, markdownSource: string): StudyMaterialDetail {
  const tokens = markdown.parse(markdownSource, {})
  const firstTitleIndex = tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1')

  if (
    firstTitleIndex >= 0
    && tokens[firstTitleIndex + 1]?.type === 'inline'
    && tokens[firstTitleIndex + 2]?.type === 'heading_close'
  ) {
    tokens.splice(firstTitleIndex, 3)
  }

  const toc: StudyMaterialTocItem[] = []
  const usedIds = new Map<string, number>()

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]!
    if (token.type !== 'heading_open' || !/^h[1-3]$/.test(token.tag)) continue

    const inlineToken = tokens[index + 1]
    if (!inlineToken || inlineToken.type !== 'inline') continue

    const label = plainHeading(inlineToken.content)
    const baseId = slugify(label) || `secao-${toc.length + 1}`
    const occurrences = usedIds.get(baseId) ?? 0
    const id = occurrences === 0 ? baseId : `${baseId}-${occurrences + 1}`
    const level = Number(token.tag.slice(1)) as 1 | 2 | 3

    usedIds.set(baseId, occurrences + 1)
    token.attrSet('id', id)
    toc.push({ id, label, level })
  }

  return {
    slug: source.slug,
    title: source.title,
    topic: source.topic,
    wordCount: source.wordCount,
    readingMinutes: source.readingMinutes,
    html: markdown.renderer.render(tokens, markdown.options, {}),
    toc,
  }
}

export async function listStudyMaterials(): Promise<StudyMaterialSummary[]> {
  return (await getCatalogSources()).map(({ storageKey: _storageKey, sourceFile: _sourceFile, ...summary }) => summary)
}

export async function getStudyMaterial(slug: string): Promise<StudyMaterialDetail | null> {
  const source = (await getCatalogSources()).find(material => material.slug === slug)
  if (!source) return null

  return renderMaterial(source, await readMarkdown(source.storageKey))
}
