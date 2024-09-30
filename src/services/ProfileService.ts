import { useImage } from '@/composables/image'
import { useRequest } from '@/composables/request'

export function useProfileService() {
  const profileBasePath = '/profile'
  const request = useRequest()

  const { getImageUri } = useImage()

  async function get(): Promise<ProfileResponse|null> {
    try {
      return (await request.getRequest(profileBasePath)).data
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
