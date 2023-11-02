const fs = require('fs').promises
const path = require('path')
const fos = require('../utils/fos')

const { standardPath } = require('../utils')
const config = require('../compress.config')

// input 路径
const inputRoute = path.resolve(
  process.cwd(),
  '..',
  config.input,
  'cn/youshe/biaotihei/regular'
)

// 创建目录

// 源文件路径
const sourceFilePath = 'assets/fonts/ysbth.ttf'
// 目标文件路径
const targetFilePath = path.join(inputRoute, 'ysbth.ttf')

async function copyFile() {
  await new fos(inputRoute).create('dir', {
    recursive: true,
  })

  try {
    await fs.copyFile(sourceFilePath, targetFilePath)
  } catch (error) {
    console.error('拷贝文件时出错：', error)
  }
}

copyFile()
