import { describe, expect, it } from 'vitest'
import { runWithWatch } from '../src/commands/watch.js'

describe('watch helper', () => {
  it('runs the task once when watch is disabled', async () => {
    let count = 0

    await runWithWatch(['input/**/*.ttf'], async () => {
      count += 1
    }, { enabled: false })

    expect(count).toBe(1)
  })
})
