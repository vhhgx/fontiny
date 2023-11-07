import { config } from '../compress.config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:created', async () => {
    let data = config
    let keys = Object.keys(data)

    keys.forEach(async (item) => {
      useState(item, () => config[item])
    })
  })
})
