import { hasText, inspectFont } from 'fontiny'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.file || !body.text) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing file or text.',
    })
  }

  const font = await inspectFont(body.file)
  return hasText(font, body.text)
})
