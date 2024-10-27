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

  function putAndPostThen(data: AxiosResponse, successMessage?: string): any {
    if (successMessage) {
      toast(i18n.t(successMessage), {
        type: toast.TYPE.SUCCESS
      })
    }

    if (data.status in [204, 301]) {
      return true
    }

    return data.data
  }

  function putAndPostCatch(errorMessage?: string): null {
    if (errorMessage) {
      toast(i18n.t(errorMessage), {
        type: toast.TYPE.ERROR
      })
    }

    return null
  }

  async function getRequest(uri: string): Promise<any> {
    let requestConfig = await handleAdminConnection(uri)
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

    let postData = options.content || null
    if (options.content) {
      if (requestConfig.headers && requestConfig.headers['Content-Type'] === 'multipart/form-data') {
        postData = new FormData()

        for (let contentKey in options.content) {
          postData.append(contentKey, options.content[contentKey])
        }
      } else {
        postData = JSON.stringify(options.content)
      }
    }

    return await axios.post(options.uri, postData, requestConfig)
      .then((data) => {
        return putAndPostThen(data, options.successMessage)
      })
      .catch(() => {
        return putAndPostCatch(options.errorMessage)
      })
  }

  async function putRequest(
    options: PostAndPutOptions
  ): Promise<any> {
    const requestConfig = await handleAdminConnection(options.uri)

    return await axios.put(options.uri, options.content ? JSON.stringify(options.content) : null, requestConfig)
      .then((data) => {
        return putAndPostThen(data, options.successMessage)
      })
      .catch(() => {
        return putAndPostCatch(options.errorMessage)
      })
  }

  return {
    getRequest,
    postRequest,
    putRequest
  }
}
