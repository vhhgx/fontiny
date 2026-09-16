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
  css: ['~/assets/styles/main.sass'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@element-plus/nuxt'],
})
