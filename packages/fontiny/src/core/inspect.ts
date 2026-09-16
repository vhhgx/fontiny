import path from 'node:path'
import fs from 'fs-extra'
import { FontinyError } from './errors.js'
import { createFont } from './fontEngine.js'
import { formatBytes, getFontFormat, toUnicodeLabel } from './format.js'
import type { FontinyFormat } from './asset.js'

export type FontInspectResult = {
  file: string
  format: FontinyFormat
  size: number
  sizeLabel: string
  family?: string
  subfamily?: string
  fullName?: string
  postscriptName?: string
  version?: string
  glyphs: number
  unicodes: number[]
  unicodeCount: number
  unicodeLabels: string[]
}

export async function inspectFont(filePath: string): Promise<FontInspectResult> {
  const absolutePath = path.resolve(filePath)
  if (!(await fs.pathExists(absolutePath))) {
    throw new FontinyError(`字体文件不存在：${filePath}`)
  }

  const stat = await fs.stat(absolutePath)
  if (!stat.isFile()) {
    throw new FontinyError(`路径不是文件：${filePath}`)
  }

  const format = getFontFormat(absolutePath)
  const buffer = await fs.readFile(absolutePath)
  const font = await createFont(buffer, format, {
    hinting: true,
    kerning: true,
  })
  const data = font.get()
  const unicodes = data.glyf
    .flatMap((glyf) => glyf.unicode ?? [])
    .filter((unicode) => Number.isFinite(unicode))
    .sort((a, b) => a - b)
  const uniqueUnicodes = [...new Set(unicodes)]

  return {
    file: absolutePath,
    format,
    size: stat.size,
    sizeLabel: formatBytes(stat.size),
    family: data.name?.fontFamily,
    subfamily: data.name?.fontSubFamily,
    fullName: data.name?.fullName,
    postscriptName: data.name?.postScriptName,
    version: data.name?.version,
    glyphs: data.glyf.length,
    unicodes: uniqueUnicodes,
    unicodeCount: uniqueUnicodes.length,
    unicodeLabels: uniqueUnicodes.map(toUnicodeLabel),
  }
}

export function hasText(font: FontInspectResult, text: string) {
  const available = new Set(font.unicodes)
  const required = [...new Set(Array.from(text))]
  const missing = required.filter((char) => !available.has(char.codePointAt(0)!))

  return {
    ok: missing.length === 0,
    total: required.length,
    missing,
  }
}
