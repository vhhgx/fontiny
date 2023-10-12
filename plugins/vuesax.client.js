import Vuesax from 'vuesax-alpha'
import 'vuesax-alpha/dist/vuesax.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vuesax)
})
