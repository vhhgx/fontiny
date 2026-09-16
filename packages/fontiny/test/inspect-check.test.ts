import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, describe, expect, it } from 'vitest'
import Fontiny, { hasText, inspectFont } from '../src/index.js'
import { runCheckCommand } from '../src/commands/check.js'

const root = process.cwd()
const tmpDir = path.join(root, 'tmp', 'vitest-inspect')

afterEach(async () => {
  await fs.remove(tmpDir)
})

describe('inspect and check helpers', () => {
  it('inspects subset output and verifies required text coverage', async () => {
    await Fontiny()
      .src('assets/fonts/ysbth.ttf')
      .text('你好Fontiny')
      .formats(['woff2'])
      .dest(tmpDir)
      .run()

    const font = await inspectFont(path.join(tmpDir, 'assets/fonts/ysbth.woff2'))
    expect(font.format).toBe('woff2')
    expect(font.glyphs).toBeGreaterThan(0)
    expect(font.unicodeCount).toBeGreaterThan(0)

    expect(hasText(font, '你好Fontiny').ok).toBe(true)
    expect(hasText(font, '春雨').missing).toEqual(['春', '雨'])
  })

  it('checks coverage from a text file', async () => {
    await Fontiny()
      .src('assets/fonts/ysbth.ttf')
      .text('你好Fontiny')
      .formats(['woff2'])
      .dest(tmpDir)
      .run()

    const textFile = path.join(tmpDir, 'text.txt')
    await fs.writeFile(textFile, '你好Fontiny', 'utf8')

    await expect(
      runCheckCommand(path.join(tmpDir, 'assets/fonts/ysbth.woff2'), {
        textFile,
      })
    ).resolves.toBeUndefined()
  })
})
