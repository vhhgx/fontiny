const path = require('path');
const dayjs = require('dayjs')

const fos = require('../utils/fos')
const config = require('../compress.config')

/**
 * @function 标准路径拼接
 * 
 * @param {String} key 主目录名称
 * @param {Array} options 主目录内的子路径
 * @returns {String} 拼接后的绝对路径
 */
const standardPath = (key, options = []) => {
  const standardEnum = {
    base: '.',
    input: `../${config.input}`,
    output: `../${config.output}`,
  }

  return path.resolve(process.cwd(), standardEnum[key], ...options)
}

/**
 * @function 将文本记入日志
 * @param {String} message 写入的消息
 */

const writeLogs = async function (message) {
  const logMessage = `${dayjs().format('YYYY-MM-DD HH:mm:ss')} - ${message}\n`;

  // log 路径
  const logsDir = path.join(process.cwd(), 'logs')
  // logs 文件路径
  const logsFile = path.join(logsDir, `${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.log`);

  // 创建log目录
  new fos(logsDir).create()
  // 创建log文件
  new fos(logsFile).create('file')
  // 写入日志
  new fos(logsFile).append(logMessage)
}


module.exports = {
  standardPath,
  writeLogs
}