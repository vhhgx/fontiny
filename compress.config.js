module.exports = {
  // NOTE 路径相关
  input: 'input', // 字体存放路径
  output: 'output', // 压缩后字体存放路径

  // NOTE 主进程相关
  increment: false, // 是否为增量压缩
  langs: ['cn', 'en'], // 需要压缩的字体语言

  // NOTE 转换内容
  convertWoff: false, // 是否转换为woff
  convertSvg: false, // 是否转换为svg

  // NOTE 字形压缩
  cn: '小楼昨夜听春雨 深巷明朝卖杏花', // 中文内容，仅中文需要
  hinting: false, // 是否保留ttf提示信息。默认为true

  // NOTE woff相关
  deflate: true, // 是否缩小woff，默认为false

  // NOTE CSS生成
  toCssBase64: false, // 是否开启base64压缩
  toCssLocal: true, // 是否使用本地字体
  toCssLoaclPath: 'https://cdn.jsdelivr.net/gh/vhhgx/minimized_fonts/', // 本地字体路径，一般为可访问的公网路径
}
