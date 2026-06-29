import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, describe, expect, it } from 'vitest'
import { iconfont } from '../src/iconfont/index.js'

const root = process.cwd()
const tmpDir = path.join(root, 'tmp', 'vitest-iconfont')

afterEach(async () => {
  await fs.remove(tmpDir)
})

describe('iconfont', () => {
  it('generates icon font assets from SVG icons', async () => {
    await iconfont()
      .src('fixtures/icons')
      .name('test-icons')
      .formats(['ttf', 'woff2', 'svg'])
      .css(true)
      .types(true)
      .dest(tmpDir)
      .run()

    expect(await fs.pathExists(path.join(tmpDir, 'test-icons.ttf'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'test-icons.woff2'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'test-icons.svg'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'test-icons.css'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'info.json'))).toBe(true)
  }, 30000)

  it('uses fixed icon codepoints from mapping file', async () => {
    const codepointsPath = path.join(root, 'tmp', 'vitest-iconfont-codepoints.json')
    await fs.writeJson(codepointsPath, {
      home: 'E101',
      user: 'E102',
    })

    await iconfont()
      .src('fixtures/icons')
      .name('fixed-icons')
      .formats(['ttf'])
      .codepoints(codepointsPath)
      .dest(tmpDir)
      .run()

    const info = await fs.readJson(path.join(tmpDir, 'info.json'))
    expect(info.home.encodedCode).toBe('\\e101')
    expect(info.user.encodedCode).toBe('\\e102')

    await fs.remove(codepointsPath)
  }, 30000)
})
