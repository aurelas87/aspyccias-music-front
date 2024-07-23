import type { App } from 'vue'
import { getCurrentInstance } from 'vue'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

export function useAxios(): AxiosInstance {
  const currentInstance = getCurrentInstance()
  return currentInstance?.appContext.config.globalProperties.$axios
}

export function updateAxiosLocale(axiosInstance: AxiosInstance, locale: string) {
  axiosInstance.defaults.headers['Accept-Language'] = locale
}

export default {
  install: (app: App, options: AxiosOptions) => {
    app.config.globalProperties.$axios = axios.create({
      baseURL: options.baseUrl
    })
  }
}
