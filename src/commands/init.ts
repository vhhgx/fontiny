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

export async function runInitCommand() {
  await fs.ensureDir('input')
  await fs.ensureDir('icons')
  await fs.ensureDir('output')

  if (!(await fs.pathExists('fontiny.config.js'))) {
    await fs.writeFile('fontiny.config.js', defaultConfig, 'utf8')
  }

  console.log('Created fontiny.config.js, input/, icons/, and output/.')
}
