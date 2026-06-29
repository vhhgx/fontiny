import pc from 'picocolors'
import path from 'node:path'
import fs from 'fs-extra'
import Fontiny from '../index.js'
import { css, manifest } from '../plugins/index.js'
import type { FontinyConfig } from '../config/schema.js'
import { parseFormats, parseUnicodes, printSizeReport } from './common.js'
import { runFonttoolsSubset } from '../engines/fonttools.js'

type SubsetCommandOptions = {
  text?: string
  textFile?: string
  unicodes?: string
  formats?: string
  out?: string
  css?: boolean
  manifest?: boolean
  report?: boolean
  watch?: boolean
  engine?: 'builtin' | 'fonttools'
}

export async function runSubsetCommand(input: string, options: SubsetCommandOptions, config: FontinyConfig) {
  const engine = options.engine ?? config.engine ?? 'builtin'
  const formats = parseFormats(options.formats).length ? parseFormats(options.formats) : config.formats ?? ['woff2']
  const output = options.out ?? config.output ?? 'output'

  if (engine === 'fonttools') {
    const result = await runFonttoolsSubset({
      input: input ?? config.input ?? 'input/**/*.{ttf,otf,woff,woff2}',
      output,
      text: options.text ?? config.text,
      textFile: options.textFile ?? config.textFile,
      unicodes: parseUnicodes(options.unicodes) ?? config.unicodes,
      formats,
    })

    if (options.css || config.css) {
      await writeFonttoolsCss(result, output)
    }

    if (options.manifest || config.manifest) {
      await writeFonttoolsManifest(result, output)
    }

    console.log(pc.green(`Processed ${result.files.length} font file(s).`))
    if (options.report !== false) {
      printSizeReport(result)
    }
    if (result.errors.length > 0) {
      console.log(pc.yellow(`${result.errors.length} file(s) failed.`))
    }
    return
  }

  const pipeline = Fontiny()
    .src(input ?? config.input ?? 'input/**/*.{ttf,otf,woff,woff2}')
    .subset({
      text: options.text ?? config.text,
      textFile: options.textFile ?? config.textFile,
      unicodes: parseUnicodes(options.unicodes) ?? config.unicodes,
    })
    .formats(formats)
    .dest(output)

  if (options.css || config.css) {
    pipeline.use(css(typeof config.css === 'object' ? config.css : {}))
  }

  if (options.manifest || config.manifest) {
    pipeline.use(manifest(typeof config.manifest === 'object' ? config.manifest : {}))
  }

  const result = await pipeline.run()
  console.log(pc.green(`Processed ${result.files.length} font file(s).`))
  if (options.report !== false) {
    printSizeReport(result)
  }
  if (result.errors.length > 0) {
    console.log(pc.yellow(`${result.errors.length} file(s) failed.`))
  }
}

async function writeFonttoolsCss(result: Awaited<ReturnType<typeof runFonttoolsSubset>>, outputDir: string) {
  const rules = result.files.map((file) => {
    const family = path.basename(file.input, path.extname(file.input))
    const sources = file.outputDetails
      .map((output) => {
        const relative = path.relative(path.resolve(process.cwd(), outputDir), output.path).split(path.sep).join('/')
        const format = output.format === 'ttf' || output.format === 'otf' ? 'truetype' : output.format
        return `url("./${relative}") format("${format}")`
      })
      .join(',\n       ')

    return `@font-face {
  font-family: "${family}";
  src: ${sources};
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`
  })

  await fs.ensureDir(outputDir)
  await fs.writeFile(path.join(outputDir, 'fontiny.css'), `${rules.join('\n\n')}\n`, 'utf8')
}

async function writeFonttoolsManifest(result: Awaited<ReturnType<typeof runFonttoolsSubset>>, outputDir: string) {
  await fs.ensureDir(outputDir)
  await fs.writeJson(
    path.join(outputDir, 'fontiny.manifest.json'),
    {
      files: result.files.map((file) => ({
        input: file.input,
        originalSize: file.originalSize,
        outputs: file.outputDetails,
      })),
    },
    { spaces: 2 }
  )
}
