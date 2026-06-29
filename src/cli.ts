import { Command } from 'commander'
import pc from 'picocolors'
import { loadConfig } from './config/loadConfig.js'
import { runCheckCommand } from './commands/check.js'
import { runCollectCommand } from './commands/collect.js'
import { runConvertCommand } from './commands/convert.js'
import { runIconfontCommand } from './commands/iconfont.js'
import { runInitCommand } from './commands/init.js'
import { runInspectCommand } from './commands/inspect.js'
import { runPreviewCommand } from './commands/preview.js'
import { runSubsetCommand } from './commands/subset.js'
import { runWithWatch } from './commands/watch.js'

const program = new Command()

program
  .name('fontiny')
  .description('Font subsetting, conversion, and iconfont generation CLI.')
  .version('0.2.0')
  .option('-c, --config <path>', 'config file path')

program
  .command('subset')
  .argument('[input]', 'input glob', 'input/**/*.{ttf,otf,woff,woff2}')
  .option('--text <text>', 'subset text')
  .option('--text-file <path>', 'subset text file')
  .option('--unicodes <list>', 'unicode list, e.g. U+4E00,U+4E01 or U+4E00-9FFF')
  .option('--formats <list>', 'output formats, comma separated', 'woff2')
  .option('--out <dir>', 'output directory', 'output')
  .option('--css', 'generate fontiny.css')
  .option('--manifest', 'generate fontiny.manifest.json')
  .option('--no-report', 'disable size report')
  .option('--watch', 'watch input and rerun')
  .option('--engine <engine>', 'font engine: builtin or fonttools', 'builtin')
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runWithWatch([input, options.textFile, program.opts().config].filter(Boolean), () =>
      runSubsetCommand(input, options, config), { enabled: options.watch ?? config.watch })
  })

program
  .command('convert')
  .argument('[input]', 'input glob', 'input/**/*.{ttf,otf,woff,woff2}')
  .option('--formats <list>', 'output formats, comma separated', 'woff2')
  .option('--out <dir>', 'output directory', 'output')
  .option('--no-report', 'disable size report')
  .option('--watch', 'watch input and rerun')
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runWithWatch([input, program.opts().config].filter(Boolean), () =>
      runConvertCommand(input, options, config), { enabled: options.watch ?? config.watch })
  })

program
  .command('iconfont')
  .argument('[input]', 'icons directory', 'icons')
  .option('--name <name>', 'font family name', 'fontiny-icons')
  .option('--formats <list>', 'output formats, comma separated', 'ttf,woff,woff2,svg')
  .option('--out <dir>', 'output directory', 'output/icons')
  .option('--css', 'generate css')
  .option('--types', 'generate TypeScript declarations')
  .option('--start-codepoint <value>', 'start unicode codepoint, e.g. E001 or 0xE001')
  .option('--codepoints <path>', 'fixed icon codepoint mapping JSON')
  .option('--watch', 'watch icon directory and rerun')
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runWithWatch([input, options.codepoints, program.opts().config].filter(Boolean), () =>
      runIconfontCommand(input, options, config), { enabled: options.watch ?? config.watch })
  })

program
  .command('inspect')
  .argument('<input>', 'font file path')
  .option('--json', 'print JSON')
  .option('--unicodes', 'print unicode list')
  .action(async (input, options) => {
    await runInspectCommand(input, options)
  })

program
  .command('check')
  .argument('<input>', 'font file path')
  .option('--text <text>', 'required text')
  .option('--text-file <path>', 'required text file')
  .option('--json', 'print JSON')
  .action(async (input, options) => {
    await runCheckCommand(input, options)
  })

program
  .command('collect')
  .argument('[input]', 'source glob', 'src/**/*.{vue,ts,tsx,js,jsx,html,md,css}')
  .option('--out <path>', 'output text file')
  .option('--exclude <glob...>', 'exclude glob')
  .option('--json', 'print JSON')
  .action(async (input, options) => {
    await runCollectCommand(input, options)
  })

program
  .command('init')
  .description('create fontiny.config.js and working directories')
  .action(async () => {
    await runInitCommand()
  })

program
  .command('preview')
  .argument('[input]', 'output directory', 'output')
  .option('--text <text>', 'preview text')
  .option('--port <port>', 'preview server port', '4173')
  .option('--no-open', 'do not open browser')
  .action(async (input, options) => {
    await runPreviewCommand(input, options)
  })

program.parseAsync().catch((error) => {
  console.error(pc.red(error instanceof Error ? error.message : String(error)))
  process.exitCode = 1
})
