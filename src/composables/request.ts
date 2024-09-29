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

    if (uri.startsWith(adminBasePath) && userStore.isConnected()) {
      requestConfig = {
        headers: {
          'Authorization': 'Bearer ' + userStore.getUser().accessToken
        }
      }
    }

    return requestConfig
  }

  async function postRequest(
    uri: string,
    postData: any,
    successMessage: string,
    errorMessage: string
  ): Promise<any> {
    const requestConfig = await handleAdminConnection(uri)

    return await axios.post(uri, JSON.stringify(postData) || null, requestConfig)
      .then((data) => {
        toast(i18n.t(successMessage), {
          type: toast.TYPE.SUCCESS
        })

        if (data.status === 205) {
          return true
        }

        return data.data
      })
      .catch(() => {
        toast(i18n.t(errorMessage), {
          type: toast.TYPE.ERROR
        })

        return null
      })
  }

  return {
    postRequest
  }
}
