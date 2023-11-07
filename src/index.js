const { fs, path, standardPath, writeLogs } = require('../utils')
const { exec } = require('child_process')
const fos = require('../utils/fos')
const { comporessionFont } = require('../utils/compression')

const config = require('../compress.config')

// 处理文件
const processFile = async (filePath) => {
  // 处理函数接受一个字体所在的绝对路径
  await comporessionFont(filePath)
}

const processDir = async (dirPath, isRoot = false) => {
  const items = await fs.readdir(dirPath, {
    withFileTypes: true,
  })

  for (let item of items) {
    const fullPath = path.join(dirPath, item.name)
    if (item.isDirectory()) {
      // 如果是根目录并且该目录不在白名单中，则跳过
      if (isRoot && !config.langs.includes(item.name)) {
        continue
      }
      await processDir(fullPath)
    } else {
      await processFile(fullPath)
    }
  }
}

// 增量更新，这里的增量只完成了新增（或许有修改）暂时没有删除，需要精细化调整
// 是否删除旧内容使用配置文件来控制
if (config.increment) {
  // 调用下面的exec逻辑
  const inputPath = 'cd ../input && git diff --name-only HEAD'

  // 执行git命令来获取改动的文件列表
  // exec(inputPath, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`exec error: ${error}`)
  //     return
  //   }

  //   // 获取改动的文件列表
  //   const changedFiles = stdout.split('\n').filter((file) => !!file)

  //   changedFiles.forEach(async (file) => {
  //     // 对新增的的文件进行处理
  //     await processFile(path.join(standardPath('input'), file))
  //   })
  // })
} else {
  const mainFile = path.join(standardPath('output'), `main.css`)
  // 先删除main.css
  new fos(mainFile).delete()
  // 重新创建main.css文件
  new fos(mainFile).create('file')
  // 调用最下面的全量更新逻辑
  processDir(standardPath('input'), true)
    .then(() => {
      writeLogs('全部文件处理完毕！')
    })
    .catch((error) => {
      writeLogs(`处理过程中发生错误：${error.message}`)
    })
}
