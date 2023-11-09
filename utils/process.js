import { files } from './files'
import path from 'path'
import dayjs from 'dayjs'

import { standardPath, getAllFiles, getChangedFiles, sender } from './helper'
import { extractify } from './extractify'

// 文件处理
export const processFiles = async (configs) => {
  console.log('开始压缩')
  sender('即将开始')

  /** 日志目录 */
  const logsDir = path.join(process.cwd(), 'logs')
  /** 日志文件名 */
  const logsName = `${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.log`
  /** 日志路径 */
  const logsFilePath = path.join(logsDir, logsName)
  /** 日志标头 */
  const startmsg = `${dayjs().format('HH:mm:ss')} 开始压缩\n`

  // 创建文件及写入日志
  await new files(logsDir).create()
  await new files(logsFilePath).create('file')
  await new files(logsFilePath).append(startmsg)

  const inputs = standardPath('input') // 标准路径

  // 获取需要处理的文件
  const getFilesArray = async (conf, _input) => {
    try {
      return conf.increment
        ? await getChangedFiles(_input)
        : await getAllFiles(_input, true, conf)
    } catch (err) {
      console.error('获取文件列表出错', err)
    }
  }

  // 执行获取文件函数
  sender({ code: 200, msg: '正在查找需要压缩的文件' })
  await new files(logsFilePath).append(
    `${dayjs().format('HH:mm:ss')} 查找需要压缩的文件\n`
  )
  let allFiles = await getFilesArray(configs, inputs)
  await new files(logsFilePath).append(
    `${dayjs().format('HH:mm:ss')} 查找完成，共 ${
      allFiles.length
    } 个字体，准备压缩\n`
  )
  sender({ code: 200, msg: `查找完成，共 ${allFiles.length} 个字体，准备压缩` })

  configs['logsFilePath'] = logsFilePath

  for (let i = 0; i < allFiles.length; i++) {
    const item = allFiles[i]
    await extractify(item, configs, { idx: i, count: allFiles.length }).then(
      async (res) => {
        if (res.code !== 201) {
          sender(res)
        }

        await new files(logsFilePath).append(
          `${dayjs().format('HH:mm:ss')} ${res.msg}\n`
        )
      }
    )
  }

  sender({ code: 210, msg: { count: allFiles.length } })
  await new files(logsFilePath).append(
    `${dayjs().format('HH:mm:ss')} 全部压缩完成\n`
  )
}
