const Fontmin = require('fontmin')
const config = require('../compress.config')
const dayjs = require('dayjs')
const fos = require('../utils/fos')

const { fs, path, standardPath, writeLogs } = require('../utils')

// 参数 dir 为绝对路径
const comporessionFont = async function (dir) {
  // 字体文件的后缀名
  let ext = path.extname(dir).slice(1)
  let allowType = ['ttf', 'otf']
  // 字体文件的相对路径 cn/xxx/xxx/xxx.ttf
  const route = dir.slice(standardPath('input').length + 1)

  if (!allowType.includes(ext)) {
    writeLogs(`❎ ${route} 文件后缀 ${ext} 不在允许列表内`)
    return
  }

  let isCn = dir.split(path.sep).includes('cn')

  // 翻转后 从相对路径取文件名和剩余路径
  let [file, ...rest] = route.split(path.sep).reverse()
  const lastItem = rest[0]

  // 父目录
  const routeWithoutFile = rest.reverse()
  // dest 目录
  const dest = standardPath('output', routeWithoutFile)

  let fontmin = new Fontmin().src(dir)

  // TODO fontPath字符串处理需要抹掉配置中url的/

  const fontFamily =
    lastItem === 'regular'
      ? file.slice(0, -4)
      : `${file.slice(0, -4)}-${lastItem}`

  // NOTE CSS处理方法
  const toCss = Fontmin.css({
    fontFamily,
    base64: config.toCssBase64,
    local: config.toCssLocal,
    fontPath: `${config.toCssLoaclPath}${routeWithoutFile.join('/')}/`,
  })

  // NOTE 字形处理方法
  const glyph = Fontmin.glyph({
    text: config.cn,
    hinting: config.hinting,
  })

  // NOTE 转换为woff
  const toWoff = Fontmin.ttf2woff({
    deflate: config.deflate,
  })

  // NOTE 转换为woff2
  const toWoff2 = Fontmin.ttf2woff2()

  // NOTE 转换为ttf
  const toTtf = Fontmin.otf2ttf()

  // 转换otf
  if (ext === 'otf') {
    fontmin.use(toTtf)
  }

  // 提取字型
  if (isCn) {
    fontmin.use(glyph)
  }

  // 转换woff
  if (config.convertWoff) {
    fontmin.use(toWoff)
  }

  // 转换svg
  if (config.convertSvg) {
    fontmin.use(Fontmin.ttf2svg()).use(svgo())
  }

  // 通用转换
  fontmin.use(toWoff2).use(toCss).dest(dest)

  const startmsg = `${dayjs().format(
    'YYYY-MM-DD HH:mm:ss'
  )} - 🪄 开始压缩 ${route}\n`

  writeLogs(startmsg)

  await fontmin.run((err) => {
    if (err) {
      writeLogs(`❎ 错误：\n ${err} \n`)
      throw err
    }
  })

  const endmsg = `${dayjs().format(
    'YYYY-MM-DD HH:mm:ss'
  )} - ✅ 压缩成功 ${route}\n`

  // main.css 绝对路径
  const mainFile = path.join(standardPath('output'), `main.css`)

  // 引入内容
  const message = `@import url('${routeWithoutFile.join('/')}/${file.slice(
    0,
    -4
  )}.css');\n`
  // 写入css
  new fos(mainFile).append(message)

  writeLogs(endmsg)
}

module.exports = {
  comporessionFont,
}
