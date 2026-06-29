import Fontiny, { css, manifest } from '../../../src/index'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const input = body.input ?? 'input/**/*.{ttf,otf,woff,woff2}'
  const output = body.output ?? 'output'
  const formats = body.formats ?? ['woff2']

  const pipeline = Fontiny()
    .src(input)
    .subset({
      text: body.text,
      textFile: body.textFile,
      unicodes: body.unicodes,
      hinting: body.hinting,
    })
    .formats(formats)
    .dest(output)

  if (body.css) {
    pipeline.use(css(typeof body.css === 'object' ? body.css : {}))
  }

  if (body.manifest) {
    pipeline.use(manifest(typeof body.manifest === 'object' ? body.manifest : {}))
  }

  return await pipeline.run()
})
