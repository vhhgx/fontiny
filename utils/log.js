const fs = require('fs').promises;
const path = require('path');

const logToFile = async function (message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;

  const logsDir = path.join(__dirname, '..', 'logs');
  const now = new Date();
  const logFileName = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}.log`;
  const logFilePath = path.join(__dirname, '..', 'logs', logFileName);

  // 检查 logs 目录是否存在，如果不存在则创建
  try {
    await fs.access(logsDir);
  } catch (err) {
    await fs.mkdir(logsDir);
  }

  // 如果日志文件不存在，则创建
  try {
    await fs.access(logFilePath);
  } catch (err) {
    await fs.writeFile(logFilePath, '', 'utf8');
  }

  await fs.appendFile(logFilePath, logMessage, 'utf8');
}


module.exports = {
  logToFile
}