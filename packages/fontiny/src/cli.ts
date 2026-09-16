import { Command, type Help } from 'commander'
import pc from 'picocolors'
import { loadConfig } from './config/loadConfig.js'
import { runCheckCommand } from './commands/check.js'
import { runCollectCommand } from './commands/collect.js'
import { runConvertCommand } from './commands/convert.js'
import { runDoctorCommand } from './commands/doctor.js'
import { runIconfontCommand } from './commands/iconfont.js'
import { runInitCommand } from './commands/init.js'
import { runInspectCommand } from './commands/inspect.js'
import { runPreviewCommand } from './commands/preview.js'
import { runSubsetCommand } from './commands/subset.js'
import { runWithWatch } from './commands/watch.js'

const program = new Command()

function formatChineseHelp(cmd: Command, helper: Help) {
  const termWidth = helper.padWidth(cmd, helper)
  const localizeDescription = (description: string) => {
    return description
      .replace(/\(default: "([^"]*)"\)/g, '（默认："$1"）')
      .replace(/\(default: ([^)]+)\)/g, '（默认：$1）')
  }
  const formatItem = (term: string, description: string) =>
    helper.formatItem(term, termWidth, localizeDescription(description), helper)
  const formatList = (heading: string, items: string[]) =>
    items.length ? helper.formatItemList(heading, items, helper) : []

  let output = [
    `${helper.styleTitle('用法：')} ${helper.styleUsage(helper.commandUsage(cmd))}`,
    '',
  ]

  const description = helper.commandDescription(cmd)
  if (description) {
    output.push(helper.styleCommandDescription(description), '')
  }

  output = output.concat(formatList('参数：', helper.visibleArguments(cmd).map((argument) => {
    return formatItem(
      helper.styleArgumentTerm(helper.argumentTerm(argument)),
      helper.styleArgumentDescription(helper.argumentDescription(argument))
    )
  })))

  output = output.concat(formatList('选项：', helper.visibleOptions(cmd).map((option) => {
    return formatItem(
      helper.styleOptionTerm(helper.optionTerm(option)),
      helper.styleOptionDescription(helper.optionDescription(option))
    )
  })))

  output = output.concat(formatList('命令：', helper.visibleCommands(cmd).map((command) => {
    return formatItem(
      helper.styleSubcommandTerm(helper.subcommandTerm(command)),
      helper.styleSubcommandDescription(helper.subcommandDescription(command))
    )
  })))

  return output.join('\n')
}

function localizeCommanderOutput(message: string) {
  return message
    .replace(/^error:/, '错误：')
    .replace(/unknown command '([^']+)'/, '未知命令 "$1"')
    .replace(/unknown option '([^']+)'/, '未知选项 "$1"')
    .replace(/missing required argument '([^']+)'/, '缺少必填参数 "$1"')
    .replace(/option '([^']+)' argument missing/, '选项 "$1" 缺少参数')
    .replace(/too many arguments/, '参数过多')
}

program
  .name('fontiny')
  .description('字体子集化、格式转换和 iconfont 生成工具。')
  .version('0.2.0', '-V, --version', '输出版本号')
  .configureHelp({ formatHelp: formatChineseHelp })
  .configureOutput({
    writeErr: (message) => process.stderr.write(localizeCommanderOutput(message)),
  })
  .helpOption('-h, --help', '显示帮助信息')
  .addHelpCommand('help [command]', '显示指定命令的帮助信息')
  .option('-c, --config <path>', '配置文件路径')

program
  .command('subset')
  .description('按文本或 Unicode 抽取字体子集')
  .argument('[input]', '输入 glob（默认：input/**/*.{ttf,otf,woff,woff2}，可被配置文件覆盖）')
  .option('--text <text>', '需要保留的文本')
  .option('--text-file <path>', '从文本文件读取需要保留的字符')
  .option('--unicodes <list>', 'Unicode 列表，例如 U+4E00,U+4E01 或 U+4E00-9FFF')
  .option('--formats <list>', '输出格式，使用逗号分隔（默认：woff2，可被配置文件覆盖）')
  .option('--out <dir>', '输出目录（默认：output，可被配置文件覆盖）')
  .option('--css', '生成 fontiny.css')
  .option('--manifest', '生成 fontiny.manifest.json')
  .option('--no-report', '关闭体积报告')
  .option('--watch', '监听输入变化并重新处理')
  .option('--engine <engine>', '字体处理引擎：builtin 或 fonttools（默认：builtin，可被配置文件覆盖）')
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runWithWatch([input, options.textFile, program.opts().config].filter(Boolean), () =>
      runSubsetCommand(input, options, config), { enabled: options.watch ?? config.watch })
  })

program
  .command('convert')
  .description('转换字体格式')
  .argument('[input]', '输入 glob（默认：input/**/*.{ttf,otf,woff,woff2}，可被配置文件覆盖）')
  .option('--formats <list>', '输出格式，使用逗号分隔（默认：woff2，可被配置文件覆盖）')
  .option('--out <dir>', '输出目录（默认：output，可被配置文件覆盖）')
  .option('--no-report', '关闭体积报告')
  .option('--watch', '监听输入变化并重新处理')
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runWithWatch([input, program.opts().config].filter(Boolean), () =>
      runConvertCommand(input, options, config), { enabled: options.watch ?? config.watch })
  })

program
  .command('iconfont')
  .description('将 SVG 图标目录生成 iconfont')
  .argument('[input]', 'SVG 图标目录（默认：icons，可被配置文件覆盖）')
  .option('--name <name>', '字体族名称（默认：fontiny-icons，可被配置文件覆盖）')
  .option('--formats <list>', '输出格式，使用逗号分隔（默认：ttf,woff,woff2,svg，可被配置文件覆盖）')
  .option('--out <dir>', '输出目录（默认：output/icons，可被配置文件覆盖）')
  .option('--css', '生成 CSS')
  .option('--types', '生成 TypeScript 类型声明')
  .option('--start-codepoint <value>', '起始 Unicode 码位，例如 E001 或 0xE001')
  .option('--codepoints <path>', '固定图标 codepoint 的 JSON 映射文件')
  .option('--watch', '监听图标目录并重新生成')
  .action(async (input, options) => {
    const config = await loadConfig(program.opts().config)
    await runWithWatch([input, options.codepoints, program.opts().config].filter(Boolean), () =>
      runIconfontCommand(input, options, config), { enabled: options.watch ?? config.watch })
  })

program
  .command('inspect')
  .description('查看字体信息')
  .argument('<input>', '字体文件路径')
  .option('--json', '输出 JSON')
  .option('--unicodes', '输出 Unicode 列表')
  .action(async (input, options) => {
    await runInspectCommand(input, options)
  })

program
  .command('check')
  .description('检查字体是否包含指定文本')
  .argument('<input>', '字体文件路径')
  .option('--text <text>', '需要检查的文本')
  .option('--text-file <path>', '从文本文件读取需要检查的字符')
  .option('--json', '输出 JSON')
  .action(async (input, options) => {
    await runCheckCommand(input, options)
  })

program
  .command('collect')
  .description('从源码文件收集可见字符')
  .argument('[input]', '源码 glob', 'src/**/*.{vue,ts,tsx,js,jsx,html,md,css}')
  .option('--out <path>', '输出文本文件')
  .option('--exclude <glob...>', '排除 glob')
  .option('--json', '输出 JSON')
  .action(async (input, options) => {
    await runCollectCommand(input, options)
  })

program
  .command('init')
  .description('创建 fontiny.config.js 和工作目录')
  .action(async () => {
    await runInitCommand()
  })

program
  .command('preview')
  .description('启动本地字体预览页')
  .argument('[input]', '输出目录', 'output')
  .option('--text <text>', '预览文本')
  .option('--port <port>', '预览服务端口', '4173')
  .option('--no-open', '不自动打开浏览器')
  .action(async (input, options) => {
    await runPreviewCommand(input, options)
  })

program
  .command('doctor')
  .description('检查本机 Fontiny 运行环境和可选 fontTools 引擎')
  .action(async () => {
    await runDoctorCommand()
  })

program.parseAsync().catch((error) => {
  console.error(pc.red(error instanceof Error ? error.message : String(error)))
  process.exitCode = 1
})
