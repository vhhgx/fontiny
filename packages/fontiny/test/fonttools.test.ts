import { describe, expect, it, vi } from 'vitest'

describe('fonttools engine', () => {
  it('reports a clear setup error when pyftsubset is unavailable', async () => {
    vi.resetModules()
    vi.doMock('node:child_process', () => ({
      execFile: (_command: string, _args: string[], callback: (error: Error) => void) => {
        callback(new Error('not found'))
      },
    }))

    const { runFonttoolsSubset } = await import('../src/engines/fonttools.js')

    await expect(
      runFonttoolsSubset({
        input: 'assets/fonts/ysbth.ttf',
        output: 'tmp/fonttools',
        text: '你好',
        formats: ['woff2'],
      })
    ).rejects.toThrow('fontTools engine is not available')

    vi.doUnmock('node:child_process')
  })
})
