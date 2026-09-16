import Vuesax from 'vuesax-alpha'
import 'vuesax-alpha/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vuesax)
})
