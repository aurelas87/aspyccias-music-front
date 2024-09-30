import { useAxios } from '@/plugins/axios'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/UserStore'
import { adminBasePath } from '@/types/admin/Commons'
import type { AxiosRequestConfig } from 'axios'

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

  async function getRequest(uri: string): Promise<any> {
    let requestConfig = await handleAdminConnection(uri)
    return await axios.get(uri, requestConfig);
  }

  async function postRequest(
    uri: string,
    postData: any | null = null,
    successMessage: string | null = null,
    errorMessage: string | null = null
  ): Promise<any> {
    const requestConfig = await handleAdminConnection(uri)

    return await axios.post(
      uri, postData ? JSON.stringify(postData) : null,
      requestConfig ?? await handleAdminConnection(uri)
    )
      .then((data) => {
        if (successMessage) {
          toast(i18n.t(successMessage), {
            type: toast.TYPE.SUCCESS
          })
        }

        if (data.status === 205) {
          return true
        }

        return data.data
      })
      .catch(() => {
        if (errorMessage) {
          toast(i18n.t(errorMessage), {
            type: toast.TYPE.ERROR
          })
        }

        return null
      })
  }

  return {
    getRequest,
    postRequest
  }
}
