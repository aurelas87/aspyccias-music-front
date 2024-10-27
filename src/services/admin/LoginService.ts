import { useRequest } from '@/composables/request'
import { adminBasePath } from '@/types/admin/Commons'

export function useLoginService() {
  const request = useRequest()

  async function login(postLoginData: PostLoginData): Promise<LoginResponse|null> {
    return (await request.postRequest(
      {
        uri: adminBasePath + '/login',
        content: postLoginData,
        successMessage: 'Login successful',
        errorMessage: 'Login error'
      }
    ))
  }

  async function logout(): Promise<boolean> {
    return (await request.postRequest(
      {
        uri: adminBasePath + '/logout',
        successMessage: 'Logout successful',
        errorMessage: 'Logout error'
      }
    ))
  }

  return {
    login,
    logout
  }
}
