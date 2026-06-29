import chokidar from 'chokidar'

export async function runWithWatch(
  patterns: string[],
  task: () => Promise<void>,
  options: { enabled?: boolean }
) {
  if (!options.enabled) {
    await task()
    return
  }

  let running = false
  let pending = false

  const run = async () => {
    if (running) {
      pending = true
      return
    }

    running = true
    try {
      await task()
    } finally {
      running = false
      if (pending) {
        pending = false
        await run()
      }
    }
  }

  await run()

  const watcher = chokidar.watch(patterns, {
    ignoreInitial: true,
    ignored: ['node_modules/**', 'dist/**', '.git/**'],
  })

  watcher.on('all', async () => {
    await run()
  })

  console.log(`Watching ${patterns.join(', ')}`)
}
