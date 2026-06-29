import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveAssets } from '../src/core/scan.js'

describe('asset scanning', () => {
  it('uses a safe relative path for absolute files outside cwd', async () => {
    const fontPath = path.resolve(process.cwd(), 'assets/fonts/ysbth.ttf')
    const assets = await resolveAssets([fontPath], path.resolve(process.cwd(), 'fixtures'))

    expect(assets).toHaveLength(1)
    expect(assets[0].relativePath).toBe('ysbth.ttf')
  })
})
