import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
  vi.doUnmock('node:child_process')
})

describe('doctor command', () => {
  it('prints fontTools install guidance when pyftsubset is unavailable', async () => {
    vi.doMock('node:child_process', () => ({
      execFile: (_command: string, _args: string[], callback: (error: Error) => void) => {
        callback(new Error('not found'))
      },
    }))
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const { runDoctorCommand } = await import('../src/commands/doctor.js')
    await runDoctorCommand()

    const output = log.mock.calls.flat().join('\n')
    expect(output).toContain('Fontiny 环境检查')
    expect(output).toContain('fontTools 引擎：未安装')
    expect(output).toContain('pip install fonttools brotli')
  })
})
