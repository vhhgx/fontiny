import path from 'node:path'
import type { FontinyFormat } from './asset.js'

export const supportedFontFormats = ['ttf', 'otf', 'woff', 'woff2', 'svg'] as const

export const getFontFormat = (filePath: string) => {
  return path.extname(filePath).slice(1).toLowerCase() as FontinyFormat
}

export const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`
}

export const toUnicodeLabel = (codePoint: number) => {
  return `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`
}

export const toUnicodeRange = (unicodes: number[]) => {
  return [...new Set(unicodes)]
    .sort((a, b) => a - b)
    .map(toUnicodeLabel)
    .join(', ')
}
