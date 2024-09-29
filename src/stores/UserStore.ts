import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const userDefault: User = {
    accessToken: null,
    accessTokenExpirationDate: null
  }

  const user = useStorage('user', userDefault)

  function getUser(): User {
    return user.value;
  }

  function setUserToken(userToken: UserTokenResponse) {
    user.value.accessToken = userToken.access_token
    user.value.accessTokenExpirationDate = userToken.access_token_expiration_date
  }

  function isConnected() {
    if (user.value !== null
      && user.value.accessTokenExpirationDate !== null
      && new Date(user.value.accessTokenExpirationDate).valueOf() > (new Date()).valueOf()
    ) {
      return true
    }

    setUserToken({
      access_token: null,
      access_token_expiration_date: null
    })

    return false
  }

  return { getUser, setUserToken, isConnected }
})
