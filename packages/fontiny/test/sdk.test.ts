import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, describe, expect, it } from 'vitest'
import Fontiny, { css, manifest, subset, convert, rename } from '../src/index.js'

const root = process.cwd()
const tmpDir = path.join(root, 'tmp', 'vitest-sdk')
const fontPath = 'assets/fonts/ysbth.ttf'

afterEach(async () => {
  await fs.remove(tmpDir)
})

describe('Fontiny SDK', () => {
  it('subsets and converts fonts with the convenience API', async () => {
    const result = await Fontiny()
      .src(fontPath)
      .text('你好Fontiny')
      .formats(['ttf', 'woff2'])
      .css()
      .dest(tmpDir)
      .run()

    expect(result.errors).toEqual([])
    expect(result.files).toHaveLength(1)
    expect(await fs.pathExists(path.join(tmpDir, 'assets/fonts/ysbth.ttf'))).toBe(true)
    expect(await fs.pathExists(path.join(tmpDir, 'assets/fonts/ysbth.woff2'))).toBe(true)

    const cssText = await fs.readFile(path.join(tmpDir, 'fontiny.css'), 'utf8')
    expect(cssText).toContain('@font-face')
    expect(cssText).toContain('ysbth.woff2')
    expect(cssText.match(/src:/g)).toHaveLength(1)
    expect(cssText).toContain('font-weight: 400')
    expect(cssText).toContain('font-style: normal')
  })

  it('supports explicit plugin composition', async () => {
    const result = await Fontiny()
      .src(fontPath)
      .use(subset({ text: '测试' }))
      .use(convert({ formats: ['woff2'] }))
      .use(css())
      .use(manifest())
      .dest(tmpDir)
      .run()

    expect(result.errors).toEqual([])
    expect(await fs.pathExists(path.join(tmpDir, 'assets/fonts/ysbth.woff2'))).toBe(true)
    const manifestJson = await fs.readJson(path.join(tmpDir, 'fontiny.manifest.json'))
    expect(manifestJson.files[0].originalSize).toBeGreaterThan(0)
    expect(manifestJson.files[0].outputs[0].size).toBeGreaterThan(0)
  })

  it('supports rename metadata before conversion', async () => {
    await Fontiny()
      .src(fontPath)
      .use(rename({ family: 'BrandFont', subfamily: 'Regular' }))
      .formats(['ttf'])
      .dest(tmpDir)
      .run()

    const { inspectFont } = await import('../src/index.js')
    const info = await inspectFont(path.join(tmpDir, 'assets/fonts/ysbth.ttf'))
    expect(info.family).toBe('BrandFont')
  })
})
