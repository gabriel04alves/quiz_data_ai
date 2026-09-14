import type { StudyMaterialsResponse } from '../../../shared/types/study-material'

export default defineEventHandler(async (): Promise<StudyMaterialsResponse> => ({
  materiais: await listStudyMaterials(),
}))
