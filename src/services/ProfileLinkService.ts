import { adminBasePath, DirectionEnum } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'
import type { ProfileLinkData, ProfileLinkResponse, ProfileLinksResponse } from '@/types/ProfileLink.ts'

export function useProfileLinkService() {
  const profileLinkBasePath = '/profile/links'
  const adminProfileLinkBasePath = adminBasePath + profileLinkBasePath
  const request = useRequest()

  async function getAll(): Promise<ProfileLinksResponse | null> {
    try {
      return (await request.getRequest(profileLinkBasePath)).data
    } catch (error) {
      return null
    }
  }

  async function getAllForAdmin(): Promise<ProfileLinksResponse | null> {
    try {
      return (await request.getRequest(adminProfileLinkBasePath)).data
    } catch (error) {
      return null
    }
  }

  async function getForAdmin(name: string): Promise<ProfileLinkResponse | null> {
    try {
      return (await request.getRequest(adminProfileLinkBasePath + '/' + name)).data
    } catch (error) {
      return null
    }
  }

  async function addProfileLink(newProfileLinkData: ProfileLinkData): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminProfileLinkBasePath,
        content: newProfileLinkData,
        successMessage: 'Profile link has been added',
        errorMessage: 'Unable to add profile link'
      }
    ))
  }

  async function editProfileLink(name: string, profileLinkData: ProfileLinkData): Promise<boolean | null> {
    return (await request.putRequest(
      {
        uri: adminProfileLinkBasePath + '/' + name,
        content: profileLinkData,
        successMessage: 'Profile link has been updated',
        errorMessage: 'Unable to update profile link'
      }
    ))
  }

  async function deleteProfileLink(name: string): Promise<boolean> {
    return (await request.deleteRequest(
      {
        uri: adminProfileLinkBasePath + '/' + name,
        successMessage: 'Profile link has been deleted',
        errorMessage: 'Unable to delete profile link'
      }
    ))
  }

  async function moveProfileLink(name: string, direction: DirectionEnum): Promise<boolean> {
    return (await request.putRequest(
      {
        uri: adminProfileLinkBasePath + '/' + name + '/move/' + direction,
        successMessage: 'Profile link has been moved ' + direction,
        errorMessage: 'Unable to move profile link'
      }
    ))
  }

  return {
    getAll,
    getAllForAdmin,
    getForAdmin,
    addProfileLink,
    editProfileLink,
    deleteProfileLink,
    moveProfileLink
  }
}
