import { useAxios } from '@/plugins/axios'
import { useImage } from '@/composables/image'

export function useProfileService() {
  const profileBasePath = '/profile'
  const axios = useAxios()

  const { getImageUri } = useImage()

  async function get(): Promise<ProfileResponse|null> {
    try {
      return (await axios.get(profileBasePath)).data
    } catch (error) {
      return null
    }
  }

  function getProfilePictureUri(): string {
    return getImageUri('/uploads' + profileBasePath + '/profile-picture.jpg')
  }

  return {
    get,
    getProfilePictureUri
  }
}
