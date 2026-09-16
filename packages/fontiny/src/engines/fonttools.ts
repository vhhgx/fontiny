import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'
import fs from 'fs-extra'
import type { FontinyFileResult, FontinyFormat } from '../core/asset.js'
import { FontinyError } from '../core/errors.js'
import { outputPathFor } from '../core/write.js'
import { resolveAssets } from '../core/scan.js'
import { textToCodePoints } from '../core/text.js'

const execFileAsync = promisify(execFile)

export type FonttoolsSubsetOptions = {
  input: string
  output: string
  text?: string
  textFile?: string
  unicodes?: number[]
  formats: FontinyFormat[]
  cwd?: string
}

export type FonttoolsSubsetResult = {
  files: FontinyFileResult[]
  warnings: string[]
  errors: Array<{ input?: string; message: string }>
}

export async function checkFonttoolsAvailability() {
  try {
    const result = await execFileAsync('pyftsubset', ['--version'])
    return {
      available: true,
      version: `${result.stdout}${result.stderr}`.trim(),
    }
  } catch {
    return {
      available: false,
      version: undefined,
    }
  }
}

async function assertFonttoolsAvailable() {
  const result = await checkFonttoolsAvailability()
  if (!result.available) {
    throw new FontinyError(
      'fontTools 引擎不可用。安装命令：pip install fonttools brotli。也可以继续使用默认内置引擎：--engine builtin。'
    )
  }
}

function unicodeArg(unicodes: number[]) {
  return unicodes
    .map((codePoint) => `U+${codePoint.toString(16).toUpperCase()}`)
    .join(',')
}

async function resolveTextOptions(options: FonttoolsSubsetOptions) {
  const unicodes = new Set<number>()

  if (options.text) {
    textToCodePoints(options.text).forEach((codePoint) => unicodes.add(codePoint))
  }

  if (options.unicodes) {
    options.unicodes.forEach((codePoint) => unicodes.add(codePoint))
  }

  if (options.textFile) {
    return {
      args: ['--text-file', path.resolve(options.cwd ?? process.cwd(), options.textFile)],
      cleanup: async () => undefined,
    }
  }

  if (unicodes.size > 0) {
    return {
      args: ['--unicodes', unicodeArg([...unicodes])],
      cleanup: async () => undefined,
    }
  }

  return {
    args: ['--unicodes', '*'],
    cleanup: async () => undefined,
  }
}

function flavorArgs(format: FontinyFormat) {
  if (format === 'woff' || format === 'woff2') {
    return ['--flavor', format]
  }

  if (format === 'svg') {
    throw new FontinyError('fontTools 引擎不支持输出 SVG font。如需 SVG 输出，请使用内置引擎：--engine builtin。')
  }

  return []
}

export async function runFonttoolsSubset(
  options: FonttoolsSubsetOptions
): Promise<FonttoolsSubsetResult> {
  await assertFonttoolsAvailable()

  const cwd = path.resolve(options.cwd ?? process.cwd())
  const assets = await resolveAssets([options.input], cwd)
  if (assets.length === 0) {
    throw new FontinyError(`没有匹配到支持的字体文件：${options.input}`)
  }
  const outputDir = path.resolve(cwd, options.output)
  const textOptions = await resolveTextOptions(options)
  const result: FonttoolsSubsetResult = {
    files: [],
    warnings: [],
    errors: [],
  }

  try {
    for (const asset of assets) {
      // 单个文件失败不中断整个批次，记录到 errors 后继续处理其余文件。
      try {
        const outputDetails: FontinyFileResult['outputDetails'] = []
        const outputs: string[] = []

        for (const format of options.formats) {
          const filename = `${asset.basename}.${format}`
          const outputPath = outputPathFor(outputDir, asset, filename)
          await fs.ensureDir(path.dirname(outputPath))

          const args = [
            asset.inputPath,
            '--output-file',
            outputPath,
            ...textOptions.args,
            ...flavorArgs(format),
            '--layout-features=*',
            '--name-IDs=*',
            '--glyph-names',
            '--symbol-cmap',
          ]

          await execFileAsync('pyftsubset', args, {
            cwd,
            maxBuffer: 1024 * 1024 * 10,
          })

          const stat = await fs.stat(outputPath)
          outputs.push(outputPath)
          outputDetails.push({
            path: outputPath,
            size: stat.size,
            format,
          })
        }

        result.files.push({
          input: asset.inputPath,
          originalSize: asset.originalBuffer.length,
          outputs,
          outputDetails,
        })
      } catch (error) {
        result.errors.push({
          input: asset.inputPath,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }
  } finally {
    await textOptions.cleanup()
  }

  return result
}
