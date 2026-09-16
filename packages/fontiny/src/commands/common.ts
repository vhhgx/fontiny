import type { FontinyFormat } from '../core/asset.js'
import type { FontinyRunResult } from '../core/asset.js'
import { formatBytes } from '../core/format.js'
import { parseUnicodeList } from '../core/text.js'

export const parseList = (value?: string) => {
  return value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export const parseFormats = (value?: string) => {
  return (parseList(value) ?? []) as FontinyFormat[]
}

export const parseUnicodes = (value?: string) => {
  return value ? parseUnicodeList(value) : undefined
}

export const parseCodepoint = (value?: string) => {
  if (!value) {
    return undefined
  }

  const normalized = value.replace(/^U\+/i, '')
  const radix = normalized.startsWith('0x') ? 16 : 16
  return Number.parseInt(normalized.replace(/^0x/i, ''), radix)
}

export function printSizeReport(result: FontinyRunResult) {
  for (const file of result.files) {
    console.log(`${file.input}`)
    console.log(`  original: ${formatBytes(file.originalSize)}`)

    for (const output of file.outputDetails) {
      const reduced = file.originalSize > 0
        ? ((1 - output.size / file.originalSize) * 100).toFixed(1)
        : '0.0'
      console.log(
        `  ${output.format ?? 'output'}: ${formatBytes(output.size)} (${reduced}% reduced)`
      )
    }
  }
}
