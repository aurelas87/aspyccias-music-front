import { useAxios } from '@/plugins/axios'

export function useProfileService() {
  const profileBasePath = '/profile'
  const axios = useAxios()

  async function get(): Promise<Profile|null> {
    try {
      return (await axios.get(profileBasePath)).data
    } catch (error) {
      return null
    }
  }

  return {
    get
  }
}
