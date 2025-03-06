import { adminBasePath } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'
import type { AdminReleaseLinkNameData, AdminReleaseLinkNames } from '@/types/ReleaseLinkName.ts'

export function useReleaseLinkNameService() {
  const releaseLinkNameBasePath = '/release-link-names'
  const adminReleaseLinkNameBasePath = adminBasePath + releaseLinkNameBasePath
  const request = useRequest()

  async function getAllForAdmin(): Promise<AdminReleaseLinkNames | null> {
    try {
      return (await request.getRequest(adminReleaseLinkNameBasePath)).data
    } catch (error) {
      return null
    }
  }

  async function getForAdmin(releaseLinkName: string): Promise<AdminReleaseLinkNameData | null> {
    try {
      return (await request.getRequest(adminReleaseLinkNameBasePath + '/' + releaseLinkName)).data
    } catch (error) {
      return null
    }
  }

  async function addReleaseLinkName(releaseLinkNameData: AdminReleaseLinkNameData): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminReleaseLinkNameBasePath,
        content: releaseLinkNameData,
        successMessage: 'Release link name has been added',
        errorMessage: 'Unable to add release link name'
      }
    ))
  }

  async function editReleaseLinkName(releaseLinkName: string, releaseLinkNameData: AdminReleaseLinkNameData): Promise<boolean | null> {
    return (await request.putRequest(
      {
        uri: adminReleaseLinkNameBasePath + '/' + releaseLinkName,
        content: releaseLinkNameData,
        successMessage: 'Release link name has been updated',
        errorMessage: 'Unable to update release link name'
      }
    ))
  }

  async function deleteReleaseLinkName(releaseLinkName: string): Promise<boolean> {
    return (await request.deleteRequest(
      {
        uri: adminReleaseLinkNameBasePath + '/' + releaseLinkName,
        successMessage: 'Release link name has been deleted',
        errorMessage: 'Unable to delete release link name'
      }
    ))
  }

  return {
    getAllForAdmin,
    getForAdmin,
    addReleaseLinkName,
    editReleaseLinkName,
    deleteReleaseLinkName
  }
}
