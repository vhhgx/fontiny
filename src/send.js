import { getWSS } from '../utils/init.socket'

const wss = getWSS()

// 开始压缩
export const startCom = () => {
  // setInterval(() => {
  //   if (wss) {
  //     let date = new Date()
  //     wss.clients.forEach((client) => {
  //       if (client.readyState === 1) {
  //         client.send(String(date))
  //       }
  //     })
  //   }
  // }, 1500)
}
