import type { StudyMaterialResponse } from '../../../shared/types/study-material'

export default defineEventHandler(async (event): Promise<StudyMaterialResponse> => {
  const slug = getRouterParam(event, 'slug')?.trim()

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'material inválido' })
  }

  const material = await getStudyMaterial(slug)

  if (!material) {
    throw createError({ statusCode: 404, statusMessage: 'material não encontrado' })
  }

  return { material }
})
