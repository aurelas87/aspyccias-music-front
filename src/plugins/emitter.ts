import type { App } from 'vue'
import { getCurrentInstance } from 'vue'
import mitt from 'mitt'

export function useEmitter() {
  const currentInstance = getCurrentInstance()
  return currentInstance?.appContext.config.globalProperties.emitter
}

export default {
  install: (app: App) => {
    app.config.globalProperties.emitter = mitt()
  }
}
