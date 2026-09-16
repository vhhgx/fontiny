import path from 'node:path'
import { inspectFont } from '../core/inspect.js'

type InspectCommandOptions = {
  json?: boolean
  unicodes?: boolean
}

export async function runInspectCommand(input: string, options: InspectCommandOptions) {
  const result = await inspectFont(input)

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log(`文件：${path.relative(process.cwd(), result.file) || result.file}`)
  console.log(`格式：${result.format}`)
  console.log(`字体族：${result.family ?? '-'}`)
  console.log(`子族：${result.subfamily ?? '-'}`)
  console.log(`字形数：${result.glyphs}`)
  console.log(`Unicode 数量：${result.unicodeCount}`)
  console.log(`体积：${result.sizeLabel}`)

  if (options.unicodes) {
    console.log(`Unicode 列表：${result.unicodeLabels.join(', ')}`)
  }
}
