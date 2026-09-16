import pc from 'picocolors'
import { checkFonttoolsAvailability } from '../engines/fonttools.js'

export async function runDoctorCommand() {
  const fonttools = await checkFonttoolsAvailability()

  console.log('Fontiny 环境检查')
  console.log(`Node.js：${process.version}`)
  console.log(pc.green('内置引擎：可用'))

  if (fonttools.available) {
    const version = fonttools.version ? `（${fonttools.version}）` : ''
    console.log(pc.green(`fontTools 引擎：可用${version}`))
    return
  }

  console.log(pc.yellow('fontTools 引擎：未安装或当前 PATH 中找不到 pyftsubset'))
  console.log('安装命令：pip install fonttools brotli')
  console.log('使用示例：fontiny subset input/font.ttf --engine fonttools --text "你好" --formats woff2')
  console.log('不需要 fontTools 时，可以继续使用默认内置引擎：--engine builtin')
}
