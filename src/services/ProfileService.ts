import { useImage } from '@/composables/image'
import { useRequest } from '@/composables/request'
import { adminBasePath } from '@/types/admin/Commons'
import { toast } from 'vue3-toastify'

export function useProfileService() {
  const profileBasePath = '/profile'
  const adminProfileBasePath = adminBasePath + profileBasePath
  const request = useRequest()

  const { getImageUri } = useImage()

  async function get(): Promise<ProfileResponse | null> {
    try {
      return (await request.getRequest(profileBasePath)).data
    } catch (error) {
      return null
    }
  }

  async function getForAdmin(): Promise<AdminProfileData | null> {
    try {
      return (await request.getRequest(adminProfileBasePath)).data
    } catch (error) {
      toast('Unable to get profile data', {
        type: toast.TYPE.ERROR
      })

      return null
    }
  }

  function getProfilePictureUri(): string {
    return getImageUri('/image' + profileBasePath)
  }

  async function updateProfile(profileData: AdminProfileData): Promise<boolean | null> {
    return (await request.putRequest(
      {
        uri: adminProfileBasePath,
        content: profileData,
        successMessage: 'Profile has been updated',
        errorMessage: 'Unable to update profile'
      }
    ))
  }

  return {
    get,
    getForAdmin,
    getProfilePictureUri,
    updateProfile
  }
}
