import * as pkg from 'ws'

const wsServer = pkg.Server
// 创建一个 WebSocket 服务器，监听指定的端口
const wss = new wsServer({ port: 8080 }) // 选择你希望使用的端口号

// 监听连接
wss.on('connection', function connection(ws) {
  console.log('Client connected')

  // 监听消息
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)
    ws.send(`你刚刚说：${message}`)
  })

  // 发送消息
  ws.send('Hello, Client! This is the WebSocket server.')
})
