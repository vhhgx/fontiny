import { WebSocketServer } from 'ws'
import { processFiles } from './process'

// 这儿问题在于wss 无法确保只被创建了一次

let wss = null

export function initializeWSS() {
  if (!wss) {
    wss = new WebSocketServer({ port: 8080 })

    // 监听 WebSocket 连接事件
    wss.on('connection', (ws, request) => {
      ws.send('已经连接')
      console.log('Client connected')

      // 监听消息事件
      ws.on('message', (buffer) => {
        let data = JSON.parse(buffer.toString())
        if (data.task) {
          processFiles(data.msg)
        }
      })

      // 监听关闭事件
      ws.on('close', () => {
        console.log('Client disconnected')
      })
    })
    // // 这里有个server, 主函数的参数
    // server.on('upgrade', (request, socket, head) => {
    //   // 这里可以添加身份验证逻辑
    //   wss.handleUpgrade(request, socket, head, (ws) => {
    //     wss.emit('connection', ws, request)
    //   })
    // })
    console.log('WebSocket 服务端初始化成功')
  }

  return wss
}

export function getWSS() {
  return initializeWSS()
}
