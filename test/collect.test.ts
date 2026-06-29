import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, describe, expect, it } from 'vitest'
import { runCollectCommand } from '../src/commands/collect.js'

const root = process.cwd()
const tmpDir = path.join(root, 'tmp', 'vitest-collect')

afterEach(async () => {
  await fs.remove(tmpDir)
})

describe('collect command', () => {
  it('collects unique visible characters from source files', async () => {
    await fs.ensureDir(tmpDir)
    await fs.writeFile(path.join(tmpDir, 'a.txt'), '你好 Fontiny\n你好', 'utf8')

    await runCollectCommand('tmp/vitest-collect/*.txt', {
      out: 'tmp/vitest-collect/chars.txt',
    })

    const chars = await fs.readFile(path.join(tmpDir, 'chars.txt'), 'utf8')
    expect(chars).toContain('你')
    expect(chars).toContain('好')
    expect(chars).toContain('F')
    expect(chars.indexOf('你')).toBe(chars.lastIndexOf('你'))
  })
})
