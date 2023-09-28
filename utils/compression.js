const {
  formatterPath
} = require('./correctPath');

const fs = require('fs').promises;
const path = require('path');
const Fontmin = require('fontmin');

const {
  logToFile
} = require('../utils/log')

/** 
 * 这里的path 是 index传进来的字体文件绝对路径
 * index 是 源文件 路径
 */
const comporessionFont = async function (dir) {
  // 如果这里是true，说明在汉字目录下
  let isCn = dir.split('\\').includes('cn')

  // 字体的相对路径 cn/xxx/xxx/xxx.ttf
  const fontsRelative = dir.slice(formatterPath('font').length + 1)
  // 通过windows端分隔符进行分割，获取目录相对路径 cn/xxx/xxx
  let dirRelative = fontsRelative.split('\\')
  let fontName = dirRelative.pop()
  // 处理后的文件夹路径
  const destPath = formatterPath('mini', dirRelative)

  // 下面进行压缩
  let ext = path.extname(dir)


  // fontmin.src(dir)
  if (ext == '.ttf') {

    console.log('dir', dir)
    let fontmin = new Fontmin()
      .src(dir)
      .dest(destPath)
      .use(Fontmin.glyph({
        text: '小楼昨夜听春雨深巷明朝卖杏花',
        hinting: false
      }))
      .use(
        Fontmin.ttf2woff2({
          deflate: true
        })
      ).use(Fontmin.css({
        fontFamily: fontName.slice(0, -4),
        base64: true
      }))


    fontmin.run((err) => {
      if (err) {
        logToFile(err)
        throw err;
      }
    });
  }



}

module.exports = {
  comporessionFont
}