import fs from 'fs-extra'

const defaultConfig = `export default {
  input: 'input/**/*.{ttf,otf}',
  output: 'output',
  text: '小楼一夜听春雨 深巷明朝卖杏花',
  formats: ['woff2'],
  css: true,
  manifest: true,
  iconfont: {
    input: 'icons',
    output: 'output/icons',
    name: 'fontiny-icons',
    formats: ['ttf', 'woff', 'woff2', 'svg'],
    css: true,
    types: true,
    startCodepoint: 0xe001
  }
}
`

// 配置文件使用 ESM 语法；CommonJS 项目需要用 .mjs 后缀才能被 Node 加载。
async function resolveConfigFileName() {
  try {
    const pkg = await fs.readJson('package.json')
    return pkg.type === 'module' ? 'fontiny.config.js' : 'fontiny.config.mjs'
  } catch {
    return 'fontiny.config.mjs'
  }
}

export async function runInitCommand() {
  await fs.ensureDir('input')
  await fs.ensureDir('icons')
  await fs.ensureDir('output')

  const existing = ['fontiny.config.js', 'fontiny.config.mjs'].find((file) => fs.existsSync(file))
  if (existing) {
    console.log(`${existing} 已存在，未覆盖。input/、icons/ 和 output/ 目录已就绪。`)
    return
  }

  const configFile = await resolveConfigFileName()
  await fs.writeFile(configFile, defaultConfig, 'utf8')
  console.log(`已创建 ${configFile}、input/、icons/ 和 output/。`)
}
