import path from 'path'
import { resolve } from 'path'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  alias: {
    '@': resolve(__dirname, '/'),
    components: resolve(__dirname, 'utils/components'),
  },
  serverMiddleware: [
    { path: '/ws', handler: path.resolve(__dirname, 'websocketServer.js') }, // 修改为你的 WebSocket 服务器文件路径
  ],
  css: ['~/assets/styles/main.sass'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@element-plus/nuxt'],
})
