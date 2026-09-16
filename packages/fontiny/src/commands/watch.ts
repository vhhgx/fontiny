import chokidar from 'chokidar'
import pc from 'picocolors'

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
    } catch (error) {
      // watch 模式需要常驻：任务失败只打印错误，继续监听。
      console.error(pc.red(error instanceof Error ? error.message : String(error)))
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

  watcher.on('error', (error) => {
    console.error(pc.red(error instanceof Error ? error.message : String(error)))
  })
  watcher.on('all', () => {
    void run()
  })

  console.log(`正在监听：${patterns.join(', ')}`)
}
