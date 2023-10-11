const fs = require('fs').promises

/**
 * 文件操作类，包括增删改查
 */
class fileOperation {
  constructor(uri) {
    this.uri = uri
  }

  async create(type = 'dir', options) {
    try {
      await fs.access(this.uri)
    } catch {
      type === 'file' ? await fs.writeFile(this.uri, '', 'utf8') : await fs.mkdir(this.uri, options)
    }
  }

  async delete() {
    try {
      await fs.unlink(this.uri);
      // console.log(`File ${filePath} deleted successfully.`);
    } catch (error) {
      console.log('发生错误')
      // console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  async append(message) {
    await fs.appendFile(this.uri, message, 'utf8');
  }
}

module.exports = fileOperation