import { adminBasePath } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'
import type {
  AdminReleaseCreditTypes,
  AdminReleaseCreditTypeData
} from '@/types/ReleaseCreditType.ts'

export function useReleaseCreditTypeService() {
  const releaseCreditTypeBasePath = '/credit-types'
  const adminReleaseCreditTypeBasePath = adminBasePath + releaseCreditTypeBasePath
  const request = useRequest()

  async function getAllForAdmin(): Promise<AdminReleaseCreditTypes | null> {
    try {
      return (await request.getRequest(adminReleaseCreditTypeBasePath)).data
    } catch (error) {
      return null
    }
  }

  async function getForAdmin(releaseCreditTypeNameKey: string): Promise<AdminReleaseCreditTypeData | null> {
    try {
      return (await request.getRequest(adminReleaseCreditTypeBasePath + '/' + releaseCreditTypeNameKey)).data
    } catch (error) {
      return null
    }
  }

  async function addReleaseCreditType(releaseCreditTypeData: AdminReleaseCreditTypeData): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminReleaseCreditTypeBasePath,
        content: releaseCreditTypeData,
        successMessage: 'Credit type has been added',
        errorMessage: 'Unable to add credit type'
      }
    ))
  }

  async function editReleaseCreditType(releaseCreditTypeNameKey: string, profileLinkData: AdminReleaseCreditTypeData): Promise<boolean | null> {
    return (await request.putRequest(
      {
        uri: adminReleaseCreditTypeBasePath + '/' + releaseCreditTypeNameKey,
        content: profileLinkData,
        successMessage: 'Credit type has been updated',
        errorMessage: 'Unable to update credit type'
      }
    ))
  }

  async function deleteReleaseCreditType(releaseCreditTypeNameKey: string): Promise<boolean> {
    return (await request.deleteRequest(
      {
        uri: adminReleaseCreditTypeBasePath + '/' + releaseCreditTypeNameKey,
        successMessage: 'Credit type has been deleted',
        errorMessage: 'Unable to delete credit type'
      }
    ))
  }

  return {
    getAllForAdmin,
    getForAdmin,
    addReleaseCreditType,
    editReleaseCreditType,
    deleteReleaseCreditType
  }
}
