import { Command } from 'commander'
import pc from 'picocolors'
import { loadConfig } from './config/loadConfig.js'
import { runConvertCommand } from './commands/convert.js'
import { runIconfontCommand } from './commands/iconfont.js'
import { runSubsetCommand } from './commands/subset.js'

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
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runSubsetCommand(input, options, config)
  })

program
  .command('convert')
  .argument('[input]', 'input glob', 'input/**/*.{ttf,otf,woff,woff2}')
  .option('--formats <list>', 'output formats, comma separated', 'woff2')
  .option('--out <dir>', 'output directory', 'output')
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runConvertCommand(input, options, config)
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
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runIconfontCommand(input, options, config)
  })

program.parseAsync().catch((error) => {
  console.error(pc.red(error instanceof Error ? error.message : String(error)))
  process.exitCode = 1
})
