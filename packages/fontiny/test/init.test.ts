import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, describe, expect, it } from 'vitest'
import { runInitCommand } from '../src/commands/init.js'

const root = process.cwd()
const tmpDir = path.join(root, 'tmp', 'vitest-init')

afterEach(async () => {
  process.chdir(root)
  await fs.remove(tmpDir)
})

describe('init command', () => {
  it('creates config and working directories', async () => {
    await fs.ensureDir(tmpDir)
    process.chdir(tmpDir)

    await runInitCommand()

    expect(await fs.pathExists(path.join(tmpDir, 'fontiny.config.js'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'input'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'icons'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'output'))).toBe(true)
  })
})
