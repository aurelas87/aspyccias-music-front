import { useAxios } from '@/plugins/axios'

export function useProfileLinkService() {
  const profileLinkBasePath = '/profile/links'
  const axios = useAxios()

  async function getAll(): Promise<ProfileLinksResponse|null> {
    try {
      return (await axios.get(profileLinkBasePath)).data
    } catch (error) {
      return null
    }
  }

  return {
    getAll
  }
}
