const fs = require('fs').promises

/**
 * 文件操作类，包括增删改查
 */
class fileOperation {
  constructor(uri) {
    this.uri = uri
  }

  async create(type = 'dir') {
    try {
      await fs.access(this.uri)
    } catch {
      type === 'file' ? await fs.writeFile(this.uri, '', 'utf8') : await fs.mkdir(this.uri)
    }
  }

  async append(message) {
    await fs.appendFile(this.uri, message, 'utf8');
  }
}

module.exports = fileOperation