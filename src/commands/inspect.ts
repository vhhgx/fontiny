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

  console.log(`file: ${path.relative(process.cwd(), result.file) || result.file}`)
  console.log(`format: ${result.format}`)
  console.log(`family: ${result.family ?? '-'}`)
  console.log(`subfamily: ${result.subfamily ?? '-'}`)
  console.log(`glyphs: ${result.glyphs}`)
  console.log(`unicodes: ${result.unicodeCount}`)
  console.log(`size: ${result.sizeLabel}`)

  if (options.unicodes) {
    console.log(`unicode-list: ${result.unicodeLabels.join(', ')}`)
  }
}
