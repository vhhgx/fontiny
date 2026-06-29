import pc from 'picocolors'
import Fontiny from '../index.js'
import { css, manifest } from '../plugins/index.js'
import type { FontinyConfig } from '../config/schema.js'
import { parseFormats, parseUnicodes } from './common.js'

type SubsetCommandOptions = {
  text?: string
  textFile?: string
  unicodes?: string
  formats?: string
  out?: string
  css?: boolean
  manifest?: boolean
}

export async function runSubsetCommand(input: string, options: SubsetCommandOptions, config: FontinyConfig) {
  const pipeline = Fontiny()
    .src(input ?? config.input ?? 'input/**/*.{ttf,otf,woff,woff2}')
    .subset({
      text: options.text ?? config.text,
      textFile: options.textFile ?? config.textFile,
      unicodes: parseUnicodes(options.unicodes) ?? config.unicodes,
    })
    .formats(parseFormats(options.formats).length ? parseFormats(options.formats) : config.formats ?? ['woff2'])
    .dest(options.out ?? config.output ?? 'output')

  if (options.css || config.css) {
    pipeline.use(css(typeof config.css === 'object' ? config.css : {}))
  }

  if (options.manifest || config.manifest) {
    pipeline.use(manifest(typeof config.manifest === 'object' ? config.manifest : {}))
  }

  const result = await pipeline.run()
  console.log(pc.green(`Processed ${result.files.length} font file(s).`))
  if (result.errors.length > 0) {
    console.log(pc.yellow(`${result.errors.length} file(s) failed.`))
  }
}
