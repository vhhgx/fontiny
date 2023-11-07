/** 所有的文件操作 */
import fs from 'fs/promises'

export const files = class {
  constructor(uri) {
    this.uri = uri
  }

  // 创建文件
  async create(type = 'dir', options) {
    try {
      await fs.access(this.uri)
    } catch {
      type === 'file'
        ? await fs.writeFile(this.uri, '', 'utf8')
        : await fs.mkdir(this.uri, options)
    }
  }

  // 删除文件
  async delete() {
    try {
      await fs.unlink(this.uri)
    } catch (error) {
      console.log('发生错误')
    }
  }

  // 往文件写入内容
  async append(message) {
    await fs.appendFile(this.uri, message, 'utf8')
  }
}
