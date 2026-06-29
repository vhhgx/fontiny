import { inspectFont } from '../../../src/index'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (!query.file || typeof query.file !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing file query parameter.',
    })
  }

  return await inspectFont(query.file)
})
