import type { FontinyFormat } from '../core/asset.js'
import type { FontinyRunResult } from '../core/asset.js'
import { FontinyError } from '../core/errors.js'
import { formatBytes } from '../core/format.js'
import { parseUnicodeList } from '../core/text.js'

export const FONT_FORMATS: FontinyFormat[] = ['ttf', 'otf', 'woff', 'woff2', 'svg']

export const parseList = (value?: string) => {
  return value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export const parseFormats = (value?: string) => {
  const list = parseList(value) ?? []
  const invalid = list.filter((item) => !FONT_FORMATS.includes(item as FontinyFormat))
  if (invalid.length > 0) {
    throw new FontinyError(`不支持的输出格式：${invalid.join(', ')}（可选：${FONT_FORMATS.join(', ')}）`)
  }
  return list as FontinyFormat[]
}

export const parseEngine = (value?: string) => {
  if (value === undefined) {
    return undefined
  }
  if (value !== 'builtin' && value !== 'fonttools') {
    throw new FontinyError(`无效的引擎：${value}（可选：builtin、fonttools）`)
  }
  return value
}

export const parseUnicodes = (value?: string) => {
  return value ? parseUnicodeList(value) : undefined
}

export const parseCodepoint = (value?: string) => {
  if (!value) {
    return undefined
  }

  const normalized = value.replace(/^U\+/i, '').replace(/^0x/i, '')
  const codepoint = Number.parseInt(normalized, 16)
  if (!Number.isFinite(codepoint)) {
    throw new FontinyError(`无效的码位：${value}（示例：E001 或 0xE001）`)
  }
  return codepoint
}

export function printSizeReport(result: FontinyRunResult) {
  for (const file of result.files) {
    const rows = [
      ['原始文件', '-', formatBytes(file.originalSize), '-'],
      ...file.outputDetails.map((output) => {
        const reduced = file.originalSize > 0
          ? `${((1 - output.size / file.originalSize) * 100).toFixed(1)}%`
          : '0.0%'
        return ['输出文件', output.format ?? 'output', formatBytes(output.size), reduced]
      }),
    ]
    const widths = ['项目', '格式', '体积', '压缩率'].map((title, index) => {
      return Math.max(title.length, ...rows.map((row) => row[index].length))
    })
    const formatRow = (row: string[]) => {
      return `| ${row.map((cell, index) => cell.padEnd(widths[index], ' ')).join(' | ')} |`
    }

    console.log(`文件：${file.input}`)
    console.log(formatRow(['项目', '格式', '体积', '压缩率']))
    console.log(`| ${widths.map((width) => '-'.repeat(width)).join(' | ')} |`)
    rows.forEach((row) => console.log(formatRow(row)))
  }
}
