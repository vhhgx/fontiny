const fs = require('fs').promises;
const path = require('path');
// 字体压缩工具
const Fontmin = require('fontmin');

const {
  logToFile
} = require('../utils/log')

const {
  formatterPath
} = require('../utils/correctPath')

const {
  comporessionFont
} = require('../utils/compression')

// const projectAPath = path.join(__dirname, '..', '..', 'fonts');
const whitelist = ['cn', 'en'];

const processFile = async (filePath) => {
  // 存放字体的fonts目录
  let fontsPath = formatterPath('font')

  // 截取子串，记录子目录
  let processedFilePath = filePath.slice(fontsPath.length + 1).replaceAll('\\', '/')


  await logToFile(`【开始压缩】 ${processedFilePath}`);

  // 处理函数接受一个字体所在的绝对路径
  await comporessionFont(filePath)

  await logToFile(`【压缩成功】 ${processedFilePath}`);
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
        continue;
      }
      await processDir(fullPath);
    } else {
      await processFile(fullPath);
    }
  }
};


// 这里有几个问题，中文字体
// otf转ttf，ttf压缩之后，转ttf，woff，woff2和css
// 后缀拼一个.min

// 英文字体
// oft转ttf，然后转woff等

// 开始处理
processDir(formatterPath('font'), true).then(() => {
  logToFile('全部文件处理完毕！');
}).catch(error => {
  console.log('处理过程中发生错误：', error.message)
  logToFile(`处理过程中发生错误：${error.message}`);
});