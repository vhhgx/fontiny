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

async function assertFonttoolsAvailable() {
  try {
    await execFileAsync('pyftsubset', ['--version'])
  } catch {
    throw new FontinyError(
      'fontTools engine is not available. Install with: pip install fonttools brotli. Or use default engine: --engine builtin.'
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
    throw new FontinyError('fontTools engine does not support SVG font output. Use --engine builtin for SVG.')
  }

  return []
}

export async function runFonttoolsSubset(
  options: FonttoolsSubsetOptions
): Promise<FonttoolsSubsetResult> {
  await assertFonttoolsAvailable()

  const cwd = path.resolve(options.cwd ?? process.cwd())
  const assets = await resolveAssets([options.input], cwd)
  const outputDir = path.resolve(cwd, options.output)
  const textOptions = await resolveTextOptions(options)
  const result: FonttoolsSubsetResult = {
    files: [],
    warnings: [],
    errors: [],
  }

  try {
    for (const asset of assets) {
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
    }
  } finally {
    await textOptions.cleanup()
  }

  return result
}
