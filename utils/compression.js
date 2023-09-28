const Fontmin = require('fontmin');
const config = require('../compress.config')

const {
  fs,
  path,
  standardPath,
  writeLogs
} = require('../utils')

// 参数 dir 为绝对路径
const comporessionFont = async function (dir) {
  // 如果这里是true，说明在汉字目录下
  let isCn = dir.split(path.sep).includes('cn')

  // 字体的相对路径 cn/xxx/xxx/xxx.ttf
  const route = dir.slice(standardPath('input').length + 1)
  // 翻转后 从相对路径取文件名和剩余名
  let [file, ...rest] = route.split(path.sep).reverse()

  // 父目录
  const routeWithoutFile = rest.reverse()
  // dest 目录
  const dest = standardPath('output', routeWithoutFile)

  // 字体文件的后缀
  let ext = path.extname(dir).slice(1)

  if (ext == 'ttf') {
    let fontmin = new Fontmin()
      .src(dir)
      .dest(dest)
      .use(Fontmin.glyph({
        text: config.cn,
        hinting: false
      }))
      .use(
        Fontmin.ttf2woff2({
          deflate: true
        })
      ).use(Fontmin.css({
        fontFamily: file.slice(0, -4),
        base64: true
      }))


    fontmin.run((err) => {
      if (err) {
        writeLogs(err)
        throw err;
      }
    });
  }
}

module.exports = {
  comporessionFont
}