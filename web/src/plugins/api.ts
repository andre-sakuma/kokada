import { App, inject } from 'vue'
import API from '../services/api'

export default {
  install(app: App) {
    app.config.globalProperties.$api = new API()

    app.provide('api', app.config.globalProperties.$api)
  },

  useAPI() {
    const api = inject<API>('api')
    if (!api) {
      throw new Error('No API provided')
    }
    return api
  },
}
