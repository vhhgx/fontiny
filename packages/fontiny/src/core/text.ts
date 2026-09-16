export const textToCodePoints = (text: string) => {
  return [...new Set(Array.from(text).map((char) => char.codePointAt(0)!))]
}

// 过滤控制字符（C0、DEL）：文本文件末尾的换行符等不应进入子集/检查范围。
export const filterVisibleChars = (text: string) => {
  return Array.from(text)
    .filter((char) => {
      const codePoint = char.codePointAt(0)!
      return codePoint > 31 && codePoint !== 127
    })
    .join('')
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
          throw new Error(`无效的 Unicode 范围：${item}`)
        }
        return Array.from({ length: end - start + 1 }, (_, index) => start + index)
      }

      const codePoint = Number.parseInt(normalized, 16)
      if (!Number.isFinite(codePoint)) {
        throw new Error(`无效的 Unicode 值：${item}`)
      }
      return [codePoint]
    })
}
