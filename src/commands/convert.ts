import pc from 'picocolors'
import Fontiny from '../index.js'
import { parseFormats } from './common.js'
import type { FontinyConfig } from '../config/schema.js'

type ConvertCommandOptions = {
  formats?: string
  out?: string
}

export async function runConvertCommand(input: string, options: ConvertCommandOptions, config: FontinyConfig) {
  const result = await Fontiny()
    .src(input ?? config.input ?? 'input/**/*.{ttf,otf,woff,woff2}')
    .formats(parseFormats(options.formats).length ? parseFormats(options.formats) : config.formats ?? ['woff2'])
    .dest(options.out ?? config.output ?? 'output')
    .run()

  console.log(pc.green(`Converted ${result.files.length} font file(s).`))
  if (result.errors.length > 0) {
    console.log(pc.yellow(`${result.errors.length} file(s) failed.`))
  }
}
