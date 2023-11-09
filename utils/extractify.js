import Fontmin from 'fontmin'
import { standardPath, sender } from './helper'
import path from 'path'
import dayjs from 'dayjs'

export const extractify = async (_path, conf, opts) => {
  /**
   * 白名单允许的文件后缀
   * @type {string[]}
   */
  const allow = ['ttf', 'otf']

  /**
   * 输入目录的标准路径
   * @type {string}
   */
  const base = standardPath('input')

  /**
   * 输出目录的标准路径
   * @type {string}
   */
  const outs = standardPath('output')

  /**
   * 相对路径（相对于输入目录）
   * @type {string}
   */
  const relative = path.relative(base, _path)

  /**
   * 除文件名外的其他相对路径
   * @type {string}
   */
  const dirName = path.dirname(relative)

  /**
   * 文件后缀
   * @type {string}
   */
  const ext = path.extname(_path).slice(1)

  /**
   * 完整文件名
   * @type {string}
   */
  const fullFileName = path.basename(relative)

  /**
   * 不带后缀的文件名
   * @type {string}
   */
  const fileName = path.basename(relative, path.extname(relative))

  /**
   * 输出目录的相对路径
   * @type {string}
   */
  const dest = path.join(outs, dirName)

  /**
   * 字重（一般是其他路径的最后一个目录）
   * @type {string}
   */
  const fontWeight = dirName.split(path.sep).reverse()[0]

  if (!allow.includes(ext)) {
    console.log(`❎ 不支持的后缀: ${relative}`)
    await new files(conf.logsFilePath).append(
      `${dayjs().format('HH:mm:ss')} ❎ 不支持的文件后缀: ${relative}\n`
    )
    return
  }

  const isCN = relative.split(path.sep).includes('cn') // 是否为中文目录
  let fontmin = new Fontmin().src(_path) // fontmin实例

  const fontFamily =
    fontWeight === 'regular' ? fileName : `${fileName}-${fontWeight}`

  // NOTE css处理
  const cssConf = Fontmin.css({
    fontFamily,
    base64: conf.toCssBase64,
    local: conf.toCssLocal,
    // 这里有问题 因为还有一个是否本地的变量 需要考虑那个地方
    // fontPath: `${conf.toCssLoaclPath}${dirName.join('/')}/`,
  })

  // NOTE 字型处理
  const glyphConf = Fontmin.glyph({
    // 这里要考虑中文字体的全量压缩问题
    text: conf.cn,
    hinting: conf.hinting,
  })

  const woffConf = Fontmin.ttf2woff({ deflate: conf.deflate }) // woff处理
  const woff2Conf = Fontmin.ttf2woff2() // woff2处理
  const ttfConf = Fontmin.otf2ttf() // ttf转换

  // 拼接转换任务
  if (ext === 'otf') {
    fontmin.use(ttfConf) // 转换otf
  }

  if (isCN) {
    fontmin.use(glyphConf) // 提取字型
  }

  if (conf.convertWoff) {
    fontmin.use(woffConf) // 转换woff
  }

  if (conf.convertSvg) {
    fontmin.use(Fontmin.ttf2svg()).use(svgo()) // 转换svg
  }

  fontmin.use(woff2Conf).use(cssConf).dest(dest) // 通用转换
  await new files(conf.logsFilePath).append(
    `${dayjs().format('HH:mm:ss')} 正在压缩 ${relative} 共${opts.count} 当前 ${
      opts.idx + 1
    }\n`
  )

  const senderMsg = {
    path: relative,
    name: fileName,
    count: opts.count,
    curIdx: opts.idx + 1,
  }

  sender({ code: 200, msg: senderMsg })

  return new Promise((resolve, reject) => {
    fontmin.run((err) => {
      if (err) {
        reject({ code: 500, msg: `${relative} 发生错误` })
      }
      resolve({ code: 201, msg: `${relative} 转换完成` })
    })
  })
}
