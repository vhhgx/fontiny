import path from 'path'
import fs from 'fs/promises'
import { exec } from 'child_process'

import { getWSS } from '../utils/init.socket'

/**
 * @function 标准路径拼接
 * @param {String} key 主目录名称
 * @param {String[]} options 主目录内的子路径
 * @returns {String} 拼接后的绝对路径
 */
export const standardPath = (key, options = []) => {
  // 这里有问题 应该取config
  const standardEnum = {
    base: '.',
    input: `../input`,
    output: `../outputs`,
  }

  return path.resolve(process.cwd(), standardEnum[key], ...options)
}

/**
 * @function 获取符合规则的全部文件
 * @param {String} _input input根目录所在路径
 * @param {String} isRoot 是否为根目录 用于过滤.git目录中的内容
 * @param {String} conf 全局的配置文件
 * @returns {Array} 符合规则的文件数组
 */
export const getAllFiles = async (_input, isRoot = false, conf) => {
  let filesList = []
  const items = await fs.readdir(_input, {
    withFileTypes: true,
  })

  for (let item of items) {
    const fullPath = path.join(_input, item.name)
    if (item.isDirectory()) {
      // 如果是根目录并且该目录不在白名单中，则跳过
      if (isRoot && !conf.langs.includes(item.name)) {
        continue
      }
      const subDirFiles = await getAllFiles(fullPath)
      filesList = filesList.concat(subDirFiles)
    } else {
      filesList.push(fullPath)
    }
  }

  return filesList
}

/**
 * @function 获取符合规则的改动文件
 * @param {String} _input input根目录所在路径
 * @returns {Array} 符合规则的文件数组
 */
export const getChangedFiles = async (_input) => {
  return new Promise((resolve, reject) => {
    const execPath = `cd ${_input} && git diff --name-only HEAD`
    exec(execPath, (error, stdout, stderr) => {
      if (error) {
        console.error(`脚本执行错误：${error}`)
        return reject(error)
      }

      if (stderr) {
        console.error(`标准错误：${stderr}`)
        return reject(error)
      }

      const files = stdout
        .split('\n')
        .filter((file) => !!file)
        .map((item) => {
          return path.join(_input, item)
        })
      resolve(files)
    })
  })
}

export const sender = (msg) => {
  const wss = getWSS()

  let sender = Array.from(wss.clients).find((client) => {
    return client.readyState === 1
  })

  sender.send(msg)
}
