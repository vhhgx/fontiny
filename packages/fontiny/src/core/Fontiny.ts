import path from 'node:path'
import { convert, type ConvertOptions } from '../plugins/convert.js'
import { css, type CssOptions } from '../plugins/css.js'
import { subset, type SubsetOptions } from '../plugins/subset.js'
import { FontinyError, toErrorMessage } from './errors.js'
import { resolveAssets } from './scan.js'
import { outputPathFor, writeAssetOutputs } from './write.js'
import type { FontinyFormat, FontinyRunResult } from './asset.js'
import type { FontinyContext, FontinyPlugin } from './context.js'

export type FontinyOptions = {
  cwd?: string
}

export class FontinyPipeline {
  private readonly cwd: string
  private patterns: string[] = []
  private outputDir = 'output'
  private plugins: FontinyPlugin[] = []
  private textOptions?: SubsetOptions
  private formatOptions?: ConvertOptions
  private cssOptions?: CssOptions | boolean

  constructor(options: FontinyOptions = {}) {
    this.cwd = path.resolve(options.cwd ?? process.cwd())
  }

  src(pattern: string | string[]) {
    this.patterns = Array.isArray(pattern) ? pattern : [pattern]
    return this
  }

  use(plugin: FontinyPlugin) {
    this.plugins.push(plugin)
    return this
  }

  text(text: string) {
    this.textOptions = { ...(this.textOptions ?? {}), text }
    return this
  }

  subset(options: SubsetOptions) {
    this.textOptions = { ...(this.textOptions ?? {}), ...options }
    return this
  }

  formats(formats: FontinyFormat[]) {
    this.formatOptions = { formats }
    return this
  }

  css(options: CssOptions | boolean = true) {
    this.cssOptions = options
    return this
  }

  dest(dir: string) {
    this.outputDir = dir
    return this
  }

  private getPipelinePlugins() {
    const plugins = [...this.plugins]
    const hasConvert = plugins.some((plugin) => plugin.name === 'convert')

    if (this.textOptions) {
      plugins.push(subset(this.textOptions))
    }

    if (!hasConvert) {
      plugins.push(convert(this.formatOptions ?? { formats: ['woff2'] }))
    }

    if (this.cssOptions) {
      plugins.push(css(this.cssOptions === true ? {} : this.cssOptions))
    }

    return plugins
  }

  async run(): Promise<FontinyRunResult> {
    if (this.patterns.length === 0) {
      throw new FontinyError('No input source specified. Call .src() before .run().')
    }

    const assets = await resolveAssets(this.patterns, this.cwd)
    if (assets.length === 0) {
      throw new FontinyError(`No supported font files matched: ${this.patterns.join(', ')}`)
    }

    const outputDir = path.resolve(this.cwd, this.outputDir)
    const result: FontinyRunResult = {
      files: [],
      warnings: [],
      errors: [],
    }

    const ctx: FontinyContext = {
      cwd: this.cwd,
      outputDir,
      warnings: result.warnings,
      errors: result.errors,
      files: result.files,
      shared: new Map(),
      resolveOutputPath: (asset, filename) => outputPathFor(outputDir, asset, filename),
    }

    const plugins = this.getPipelinePlugins()
    const processedAssets = []

    for (const asset of assets) {
      try {
        for (const plugin of plugins) {
          await plugin.transform?.(asset, ctx)
        }
        processedAssets.push(asset)
      } catch (error) {
        result.errors.push({
          input: asset.inputPath,
          message: toErrorMessage(error),
        })
      }
    }

    for (const plugin of plugins) {
      await plugin.afterAll?.(processedAssets, ctx)
    }

    for (const asset of processedAssets) {
      result.files.push(await writeAssetOutputs(outputDir, asset))
    }

    return result
  }
}

export default function Fontiny(options?: FontinyOptions) {
  return new FontinyPipeline(options)
}
