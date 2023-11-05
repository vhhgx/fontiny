// 通过这种方式注入全局之后，客户端就可以通过 const { $socket } = useNuxtApp() 方式引入后调用

export default defineNuxtPlugin(() => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  let socket = new WebSocket(`${wsProtocol}//${window.location.hostname}:8080`)
  return {
    provide: {
      socket,
    },
  }
})
