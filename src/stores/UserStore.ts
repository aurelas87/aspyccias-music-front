import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useAxios } from '@/plugins/axios'
import { useRouter } from 'vue-router'
import { adminBasePath } from '@/types/admin/Commons'
import type { AxiosResponse } from 'axios'

export const useUserStore = defineStore('user', () => {
  const axios = useAxios()
  const router = useRouter()

  const userDefault: User = {
    accessToken: null,
    accessTokenExpirationDate: null,
    refreshToken: null,
    refreshTokenExpirationDate: null
  }

  const user = useStorage('user', userDefault)

  function getUser(): User {
    return user.value;
  }

  function setUserToken(userToken: UserTokenResponse) {
    user.value.accessToken = userToken.access_token
    user.value.accessTokenExpirationDate = userToken.access_token_expiration_date
    user.value.refreshToken = userToken.refresh_token
    user.value.refreshTokenExpirationDate = userToken.refresh_token_expiration_date
  }

  function isConnected(): boolean {
    return user.value !== null
      && user.value.accessToken !== null
      && user.value.accessTokenExpirationDate !== null
      && new Date(user.value.accessTokenExpirationDate).valueOf() > (new Date()).valueOf();
  }

  function canRefreshToken() {
    return user.value !== null
      && user.value.refreshToken !== null
      && user.value.refreshTokenExpirationDate !== null
      && new Date(user.value.refreshTokenExpirationDate).valueOf() > (new Date()).valueOf();
  }

  async function tryAndKeepUserConnectionAlive(uri: string) {
    if (isConnected() || uri.endsWith('login') || uri.endsWith('logout')) {
      return
    }

    if (canRefreshToken()) {
      const loginResponse = await (async function (): Promise<LoginResponse|null> {
        return axios.post(
          adminBasePath + '/token/refresh', null, {
            headers: {
              'Authorization': 'Bearer ' + user.value.refreshToken
            }
          })
          .then((response: AxiosResponse<any, any> | null) => {
            return response ? response.data : null
          })
          .catch(() => {
            return null
          })
      })()

      if (!loginResponse) {
        setUserToken({
          access_token: null,
          access_token_expiration_date: null,
          refresh_token: null,
          refresh_token_expiration_date: null
        });

        await router.push({ name: 'admin.login' })
      } else {
        setUserToken(loginResponse.token)
      }
    }
  }

  return {
    getUser,
    setUserToken,
    isConnected,
    tryAndKeepUserConnectionAlive,
  }
})
