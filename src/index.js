const {
  fs,
  path,
  standardPath,
  writeLogs
} = require('../utils')

const fos = require('../utils/fos')

const {
  comporessionFont
} = require('../utils/compression')


// 处理文件
const processFile = async (filePath) => {
  // 处理函数接受一个字体所在的绝对路径
  await comporessionFont(filePath)
};

const processDir = async (dirPath, isRoot = false) => {
  const items = await fs.readdir(dirPath, {
    withFileTypes: true
  });

  for (let item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      // 如果是根目录并且该目录不在白名单中，则跳过
      if (isRoot && (item.name !== "cn" && item.name !== "en")) {
        continue
      }
      await processDir(fullPath);
    } else {
      await processFile(fullPath);
    }
  }
};


// 这里有个问题 如果是全量更新，则需要删掉该文件，重新生成
// 创建main.css文件
const mainFile = path.join(standardPath('output'), `main.css`)
new fos(mainFile).create('file')


processDir(standardPath('input'), true).then(() => {
  writeLogs('全部文件处理完毕！');
}).catch(error => {
  writeLogs(`处理过程中发生错误：${error.message}`);
});