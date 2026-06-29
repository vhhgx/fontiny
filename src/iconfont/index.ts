import path from 'node:path'
import fs from 'fs-extra'
import type svgtofont from 'svgtofont'
import type { SvgToFontOptions } from 'svgtofont'

export type IconfontFormat = 'ttf' | 'woff' | 'woff2' | 'svg'

export type IconfontResult = Awaited<ReturnType<typeof svgtofont>>

export class IconfontPipeline {
  private cwd: string
  private input = 'icons'
  private output = 'output/icons'
  private fontName = 'fontiny-icons'
  private outputFormats: IconfontFormat[] = ['ttf', 'woff', 'woff2', 'svg']
  private shouldGenerateCss: boolean | SvgToFontOptions['css'] = true
  private shouldGenerateTypes: SvgToFontOptions['typescript'] = false
  private start = 0xe001
  private codepointsFile?: string
  private extraOptions: Partial<SvgToFontOptions> = {}

  constructor(options: { cwd?: string } = {}) {
    this.cwd = path.resolve(options.cwd ?? process.cwd())
  }

  src(input: string) {
    this.input = input
    return this
  }

  name(fontName: string) {
    this.fontName = fontName
    return this
  }

  formats(formats: IconfontFormat[]) {
    this.outputFormats = formats
    return this
  }

  css(options: boolean | SvgToFontOptions['css'] = true) {
    this.shouldGenerateCss = options
    return this
  }

  types(options: SvgToFontOptions['typescript'] = true) {
    this.shouldGenerateTypes = options
    return this
  }

  startCodepoint(codepoint: number) {
    this.start = codepoint
    return this
  }

  codepoints(filePath?: string) {
    this.codepointsFile = filePath
    return this
  }

  dest(output: string) {
    this.output = output
    return this
  }

  options(options: Partial<SvgToFontOptions>) {
    this.extraOptions = { ...this.extraOptions, ...options }
    return this
  }

  async run(): Promise<IconfontResult> {
    const { default: svgtofont } = await import('svgtofont')
    const allFormats = ['ttf', 'woff', 'woff2', 'svg', 'eot', 'symbol.svg'] as const
    const excludeFormat = allFormats.filter((format) => {
      return format === 'eot' || format === 'symbol.svg' || !this.outputFormats.includes(format)
    })

    const codepoints = this.codepointsFile
      ? await fs.readJson(path.resolve(this.cwd, this.codepointsFile))
      : undefined

    return svgtofont({
      src: path.resolve(this.cwd, this.input),
      dist: path.resolve(this.cwd, this.output),
      fontName: this.fontName,
      css: this.shouldGenerateCss,
      typescript: this.shouldGenerateTypes,
      startUnicode: this.start,
      generateInfoData: true,
      website: null as unknown as SvgToFontOptions['website'],
      emptyDist: false,
      excludeFormat,
      ...(codepoints
        ? {
            getIconUnicode: (name) => {
              const value = codepoints[name]
              if (!value) {
                return undefined as unknown as [string, number]
              }
              const codepoint = Number.parseInt(String(value).replace(/^U\+|^0x/i, ''), 16)
              return [String.fromCodePoint(codepoint), codepoint]
            },
          }
        : {}),
      ...this.extraOptions,
    })
  }
}

export function iconfont(options?: { cwd?: string }) {
  return new IconfontPipeline(options)
}
