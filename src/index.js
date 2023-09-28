const {
  fs,
  path,
  standardPath,
  writeLogs
} = require('../utils')


const {
  comporessionFont
} = require('../utils/compression')


// 处理文件
const processFile = async (filePath) => {
  // 正在处理的字体，即字体所在路径的相对路径
  let processing = filePath.slice(standardPath('input').length + 1).replaceAll(path.sep, '/')

  await writeLogs(`【开始压缩】 ${processing}`);

  // 处理函数接受一个字体所在的绝对路径
  await comporessionFont(filePath)

  await writeLogs(`【压缩成功】 ${processing}`);
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

processDir(standardPath('input'), true).then(() => {
  writeLogs('全部文件处理完毕！');
}).catch(error => {
  console.log('处理过程中发生错误：', error.message)
  writeLogs(`处理过程中发生错误：${error.message}`);
});