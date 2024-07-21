import { useAxios } from '@/plugins/axios'

export function useProfileLinkService() {
  const profileLinkBasePath = '/profile/links'
  const axios = useAxios()

  async function getAll(): Promise<ProfileLinks> {
    try {
      return (await axios.get(profileLinkBasePath)).data
    } catch (error) {
      return []
    }
  }

  return {
    getAll
  }
}
