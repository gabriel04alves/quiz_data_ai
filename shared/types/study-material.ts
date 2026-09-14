export interface StudyMaterialSummary {
  slug: string
  title: string
  topic: string
  wordCount: number
  readingMinutes: number
}

export interface StudyMaterialTocItem {
  id: string
  label: string
  level: 1 | 2 | 3
}

export interface StudyMaterialDetail extends StudyMaterialSummary {
  html: string
  toc: StudyMaterialTocItem[]
}

export interface StudyMaterialsResponse {
  materiais: StudyMaterialSummary[]
}

export interface StudyMaterialResponse {
  material: StudyMaterialDetail
}
