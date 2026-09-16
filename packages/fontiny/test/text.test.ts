import { describe, expect, it } from 'vitest'
import { parseUnicodeList, textToCodePoints } from '../src/index.js'

describe('text helpers', () => {
  it('deduplicates unicode code points from text', () => {
    expect(textToCodePoints('你好你A')).toEqual([0x4f60, 0x597d, 0x41])
  })

  it('parses unicode values and ranges', () => {
    expect(parseUnicodeList('U+0041,U+0042-0043')).toEqual([0x41, 0x42, 0x43])
  })
})
