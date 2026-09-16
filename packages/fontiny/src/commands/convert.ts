import pc from 'picocolors'
import Fontiny from '../index.js'
import { parseFormats, printSizeReport } from './common.js'
import type { FontinyConfig } from '../config/schema.js'

type ConvertCommandOptions = {
  formats?: string
  out?: string
  report?: boolean
  watch?: boolean
}

export async function runConvertCommand(input: string | undefined, options: ConvertCommandOptions, config: FontinyConfig) {
  const result = await Fontiny()
    .src(input ?? config.input ?? 'input/**/*.{ttf,otf,woff,woff2}')
    .formats(parseFormats(options.formats).length ? parseFormats(options.formats) : config.formats ?? ['woff2'])
    .dest(options.out ?? config.output ?? 'output')
    .run()

  console.log(pc.green(`已转换 ${result.files.length} 个字体文件。`))
  if (options.report !== false) {
    printSizeReport(result)
  }
  if (result.errors.length > 0) {
    console.log(pc.yellow(`${result.errors.length} 个字体文件转换失败。`))
    process.exitCode = 1
  }
}
