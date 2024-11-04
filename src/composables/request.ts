import { useAxios } from '@/plugins/axios'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/UserStore'
import { adminBasePath } from '@/types/admin/Commons'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export function useRequest() {
  const axios = useAxios()
  const i18n = useI18n()
  const userStore = useUserStore()

  async function handleAdminConnection(uri: string): Promise<AxiosRequestConfig> {
    let requestConfig = {}

    if (uri.startsWith(adminBasePath)) {
      await userStore.tryAndKeepUserConnectionAlive(uri).then(r => r)

      const token = (uri.endsWith('token/refresh'))
        ? userStore.getUser().refreshToken
        : userStore.getUser().accessToken

      requestConfig = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
    }

    return requestConfig
  }

  function handleThen(data: AxiosResponse, successMessage?: string): any {
    if (successMessage) {
      toast(i18n.t(successMessage), {
        type: toast.TYPE.SUCCESS
      })
    }

    if ([204, 201].includes(data.status)) {
      return true
    }

    return data.data
  }

  function handleCatch(uri: string, reason: any, errorMessage?: string): null {
    errorMessage = errorMessage ? i18n.t(errorMessage) : '';

    if (uri.startsWith(adminBasePath) && reason.response.data.message) {
      if (errorMessage !== '') {
        errorMessage += ":\n";
      }
      errorMessage += reason.response.data.message;
    }

    if (errorMessage) {
      toast(errorMessage, {
        type: toast.TYPE.ERROR
      })
    }

    return null
  }

  async function getRequest(uri: string, params?: any): Promise<any> {
    let requestConfig = await handleAdminConnection(uri)

    if (params) {
      requestConfig.params = params
    }

    return await axios.get(uri, requestConfig);
  }

  async function postRequest(
    options: PostAndPutOptions
  ): Promise<any> {
    let requestConfig = await handleAdminConnection(options.uri)

    if (options.contentType) {
      if (!requestConfig.headers) {
        requestConfig.headers = {}
      }

      requestConfig.headers['Content-Type'] = options.contentType
    }

    let postData: any = options.content || undefined
    if (options.content) {
      if (requestConfig.headers && requestConfig.headers['Content-Type'] === 'multipart/form-data') {
        postData = new FormData()

        for (const [key, value] of Object.entries(options.content)) {
          postData.append(key, value)
        }
      } else {
        postData = JSON.stringify(options.content)
      }
    }

    return await axios.post(options.uri, postData, requestConfig)
      .then((data) => {
        return handleThen(data, options.successMessage)
      })
      .catch((reason) => {
        return handleCatch(options.uri, reason, options.errorMessage)
      })
  }

  async function putRequest(
    options: PostAndPutOptions
  ): Promise<any> {
    const requestConfig = await handleAdminConnection(options.uri)

    return await axios.put(options.uri, options.content ? JSON.stringify(options.content) : undefined, requestConfig)
      .then((data) => {
        return handleThen(data, options.successMessage)
      })
      .catch((reason) => {
        return handleCatch(options.uri, reason, options.errorMessage)
      })
  }

  async function deleteRequest(
    options: BaseOptions
  ): Promise<any> {
    const requestConfig = await handleAdminConnection(options.uri)

    return await axios.delete(options.uri, requestConfig)
      .then((data) => {
        return handleThen(data, options.successMessage)
      })
      .catch((reason) => {
        return handleCatch(options.uri, reason, options.errorMessage)
      })
  }

  return {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
  }
}
