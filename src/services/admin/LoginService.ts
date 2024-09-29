import { useRequest } from '@/composables/request'
import { adminBasePath } from '@/types/admin/Commons'

export function useLoginService() {
  const request = useRequest()

  async function login(postLoginData: PostLoginData): Promise<LoginResponse|null> {
    return (await request.postRequest(
      adminBasePath + '/login',
      postLoginData,
      'Login successful',
      'Login error'
    ))
  }

  async function logout(): Promise<boolean> {
    return (await request.postRequest(
      adminBasePath + '/logout',
      null,
      'Logout successful',
      'Logout error'
    ))
  }

  return {
    login,
    logout
  }
}
