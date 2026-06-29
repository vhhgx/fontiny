export const textToCodePoints = (text: string) => {
  return [...new Set(Array.from(text).map((char) => char.codePointAt(0)!))]
}

export const parseUnicodeList = (value: string) => {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap((item) => {
      const normalized = item.replace(/^U\+/i, '')
      if (normalized.includes('-')) {
        const [startRaw, endRaw] = normalized.split('-')
        const start = Number.parseInt(startRaw.replace(/^U\+/i, ''), 16)
        const end = Number.parseInt(endRaw.replace(/^U\+/i, ''), 16)
        if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
          throw new Error(`Invalid unicode range: ${item}`)
        }
        return Array.from({ length: end - start + 1 }, (_, index) => start + index)
      }

      const codePoint = Number.parseInt(normalized, 16)
      if (!Number.isFinite(codePoint)) {
        throw new Error(`Invalid unicode value: ${item}`)
      }
      return [codePoint]
    })
}
