import { useAxios } from '@/plugins/axios'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

export function useRequest() {
  const axios = useAxios()
  const i18n = useI18n()

  async function postRequest(
    uri: string,
    postData: any,
    successMessage: string,
    errorMessage: string
  ): Promise<boolean> {
    return await axios.post(uri, JSON.stringify(postData))
      .then(() => {
        toast(i18n.t(successMessage), {
          type: toast.TYPE.SUCCESS
        })

        return true
      })
      .catch(() => {
        toast(i18n.t(errorMessage), {
          type: toast.TYPE.ERROR
        })

        return false
      })
  }

  return {
    postRequest
  }
}
