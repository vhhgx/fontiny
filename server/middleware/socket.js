import { WebSocketServer } from 'ws'

export default defineEventHandler((event) => {
  try {
  } catch (error) {}
  // if (!global.wss) {
  const wss = new WebSocketServer({ port: 8080 })

  wss.on('connection', function (socket) {
    socket.send('connected')

    socket.on('message', function (message) {
      console.log('received message:', message)
      socket.send(`你刚才发送了${message}`)
      // wss.clients.forEach(function (client) {
      //   if (client == socket && client.readyState === WebSocket.OPEN) {
      //     clients.push({
      //       id: message.toString(),
      //       send: (data) => client.send(data),
      //       readyState: client.readyState,
      //     })
      //     global.clients = clients
      //   }
      // })
    })
    socket.on('close', function () {
      console.log('Client disconnected')
    })
    // global.wss = wss
  })
  // }
})
