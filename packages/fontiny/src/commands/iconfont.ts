import pc from 'picocolors'
import fs from 'fs-extra'
import { iconfont, type IconfontFormat } from '../iconfont/index.js'
import type { FontinyConfig } from '../config/schema.js'
import { parseCodepoint, parseList } from './common.js'

type IconfontCommandOptions = {
  name?: string
  formats?: string
  out?: string
  css?: boolean
  types?: boolean
  startCodepoint?: string
  codepoints?: string
}

export async function runIconfontCommand(input: string, options: IconfontCommandOptions, config: FontinyConfig) {
  const iconConfig = config.iconfont ?? {}
  const formats = (parseList(options.formats) as IconfontFormat[] | undefined) ??
    iconConfig.formats ?? ['ttf', 'woff', 'woff2', 'svg']

  await iconfont()
    .src(input ?? iconConfig.input ?? 'icons')
    .name(options.name ?? iconConfig.name ?? 'fontiny-icons')
    .formats(formats)
    .css(options.css ?? iconConfig.css ?? true)
    .types(options.types ?? iconConfig.types ?? false)
    .startCodepoint(parseCodepoint(options.startCodepoint) ?? iconConfig.startCodepoint ?? 0xe001)
    .codepoints(options.codepoints ?? iconConfig.codepoints)
    .dest(options.out ?? iconConfig.output ?? 'output/icons')
    .run()

  console.log(pc.green('Iconfont generated.'))
}
