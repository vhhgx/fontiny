import pc from 'picocolors'
import fs from 'fs-extra'
import { hasText, inspectFont } from '../core/inspect.js'

type CheckCommandOptions = {
  text?: string
  textFile?: string
  json?: boolean
}

export async function runCheckCommand(input: string, options: CheckCommandOptions) {
  const text = options.textFile
    ? await fs.readFile(options.textFile, 'utf8')
    : options.text

  if (!text) {
    throw new Error('Missing --text or --text-file.')
  }

  const font = await inspectFont(input)
  const result = hasText(font, text)

  if (options.json) {
    console.log(JSON.stringify({ ...result, file: font.file }, null, 2))
    return
  }

  if (result.ok) {
    console.log(pc.green(`OK: all ${result.total} characters included`))
    return
  }

  console.log(pc.red(`Missing: ${result.missing.join(' ')}`))
  process.exitCode = 1
}
