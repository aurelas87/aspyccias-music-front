import { adminBasePath } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'

export function useProfileLinkService() {
  const profileLinkBasePath = '/profile/links'
  const adminProfileLinkBasePath = adminBasePath + profileLinkBasePath
  const request = useRequest()

  async function getAll(): Promise<ProfileLinksResponse|null> {
    try {
      return (await request.getRequest(profileLinkBasePath)).data
    } catch (error) {
      return null
    }
  }

  async function getAllForAdmin(): Promise<ProfileLinksResponse|null> {
    try {
      return (await request.getRequest(adminProfileLinkBasePath)).data
    } catch (error) {
      return null
    }
  }

  async function addProfileLink(newProfileLinkData: NewProfileLinkData): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminProfileLinkBasePath,
        content: newProfileLinkData,
        successMessage: 'Profile link has been added',
        errorMessage: 'Unable to add profile link'
      }
    ))
  }

  return {
    getAll,
    getAllForAdmin,
    addProfileLink
  }
}
