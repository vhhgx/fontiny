import type { FontinyFormat } from '../core/asset.js'
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
