import { Server } from 'ws'
import { initializeWSS } from '../utils/init.socket'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.server) {
    return
  }

  const server = nuxtApp.server
  initializeWSS(server)
})
