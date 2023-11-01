// 定义一个客户端的client插件,去应用这个应该是  这里是一开始就链接了,所以网络中一直有一个localhost
// const { $socket } = useNuxtApp()
// 在这里注入了之后,就可以在index中使用上面的方式引用,通过$socket去调用

export default defineNuxtPlugin(() => {
  // const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  // let socket = new WebSocket(`${wsProtocol}//${window.location.host}`)
  // return {
  //   provide: {
  //     socket,
  //   },
  // }
})
