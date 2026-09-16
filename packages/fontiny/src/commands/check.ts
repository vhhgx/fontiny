import pc from 'picocolors'
import fs from 'fs-extra'
import { hasText, inspectFont } from '../core/inspect.js'
import { toUnicodeLabel } from '../core/format.js'
import { filterVisibleChars } from '../core/text.js'

type CheckCommandOptions = {
  text?: string
  textFile?: string
  json?: boolean
}

// 缺失字符中的不可见字符（如空格、换行）用 Unicode 标签展示，避免输出一片空白。
function formatMissing(chars: string[]) {
  return chars
    .map((char) => {
      const codePoint = char.codePointAt(0)!
      return codePoint > 32 && codePoint !== 127 ? char : toUnicodeLabel(codePoint)
    })
    .join(' ')
}

export async function runCheckCommand(input: string, options: CheckCommandOptions) {
  const text = options.textFile
    ? filterVisibleChars(await fs.readFile(options.textFile, 'utf8'))
    : options.text

  if (!text) {
    throw new Error('缺少 --text 或 --text-file。')
  }

  const font = await inspectFont(input)
  const result = hasText(font, text)

  if (options.json) {
    console.log(JSON.stringify({ ...result, file: font.file }, null, 2))
    return
  }

  if (result.ok) {
    console.log(pc.green(`检查通过：全部 ${result.total} 个字符均已包含。`))
    return
  }

  console.log(pc.red(`缺失字符：${formatMissing(result.missing)}`))
  process.exitCode = 1
}
