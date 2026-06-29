import path from 'node:path'
import fs from 'fs-extra'
import fg from 'fast-glob'
import type { FontinyAsset, FontinyFormat } from './asset.js'

const fontExtensions = new Set(['ttf', 'otf', 'woff', 'woff2', 'svg'])

const normalizeExt = (filePath: string) => {
  return path.extname(filePath).slice(1).toLowerCase() as FontinyFormat
}

export const isSupportedFont = (filePath: string) => {
  return fontExtensions.has(normalizeExt(filePath))
}

const toAbsolutePath = (pattern: string, cwd: string) => {
  return path.isAbsolute(pattern) ? pattern : path.resolve(cwd, pattern)
}

export async function resolveAssets(patterns: string[], cwd: string): Promise<FontinyAsset[]> {
  const directFiles: string[] = []
  const globPatterns: string[] = []

  for (const pattern of patterns) {
    if (!fg.isDynamicPattern(pattern)) {
      const filePath = toAbsolutePath(pattern, cwd)
      if ((await fs.pathExists(filePath)) && (await fs.stat(filePath)).isFile()) {
        directFiles.push(filePath)
        continue
      }
    }

    globPatterns.push(pattern)
  }

  const globFiles = globPatterns.length
    ? await fg(globPatterns, {
        cwd,
        absolute: true,
        onlyFiles: true,
        unique: true,
      })
    : []

  const fontFiles = [...new Set([...directFiles, ...globFiles])].filter(isSupportedFont).sort()

  return Promise.all(
    fontFiles.map(async (inputPath) => {
      const ext = normalizeExt(inputPath)
      const originalBuffer = await fs.readFile(inputPath)
      const relativeFromCwd = path.relative(cwd, inputPath)
      const relativePath =
        relativeFromCwd.startsWith('..') || path.isAbsolute(relativeFromCwd)
          ? path.basename(inputPath)
          : relativeFromCwd
      const basename = path.basename(inputPath, path.extname(inputPath))

      return {
        inputPath,
        relativePath,
        basename,
        ext,
        originalBuffer,
        currentBuffer: Buffer.from(originalBuffer),
        currentType: ext,
        outputs: new Map(),
        meta: {},
      }
    })
  )
}
