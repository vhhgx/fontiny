import path from 'node:path'
import fs from 'fs-extra'
import fg from 'fast-glob'

type CollectCommandOptions = {
  out?: string
  exclude?: string[]
  json?: boolean
}

const collectChars = (contents: string) => {
  return Array.from(contents)
    .filter((char) => {
      const codePoint = char.codePointAt(0)!
      return codePoint > 31 && codePoint !== 127
    })
}

export async function runCollectCommand(input: string, options: CollectCommandOptions) {
  const files = await fg(input, {
    cwd: process.cwd(),
    absolute: true,
    onlyFiles: true,
    ignore: options.exclude ?? ['node_modules/**', 'dist/**', '.git/**'],
  })

  const chars = new Set<string>()
  for (const file of files) {
    const contents = await fs.readFile(file, 'utf8')
    collectChars(contents).forEach((char) => chars.add(char))
  }

  const text = [...chars].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!).join('')

  if (options.json) {
    console.log(JSON.stringify({ files: files.length, characters: text.length, text }, null, 2))
    return
  }

  if (options.out) {
    const outPath = path.resolve(process.cwd(), options.out)
    await fs.ensureDir(path.dirname(outPath))
    await fs.writeFile(outPath, text, 'utf8')
    console.log(`已从 ${files.length} 个文件收集 ${text.length} 个字符，并写入 ${options.out}。`)
    return
  }

  console.log(text)
}
