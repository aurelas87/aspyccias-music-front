import { useRequest } from '@/composables/request.ts'
import { useImage } from '@/composables/image'
import type {
  AdminPaginatedReleaseListResponse,
  AdminReleaseCreditsData,
  AdminReleaseCreditsResponse,
  AdminReleaseDetailsResponse, AdminReleaseLinksData, AdminReleaseLinksResponse,
  AdminReleaseTracksPostData,
  AdminReleaseTracksResponse,
  ReleaseData,
  ReleaseDetailsResponse,
  ReleasesResponse
} from '@/types/Release'
import { adminBasePath } from '@/types/admin/Commons.ts'
import type { UnwrapNestedRefs } from 'vue'
import type Release from '@/models/Release/Release.ts'
import type AdminRelease from '@/models/Release/AdminRelease.ts'
import { ReleaseImageType } from '@/types/Release'

export function useReleaseService() {
  const releasesBasePath = '/releases'
  const adminReleasesBasePath = adminBasePath + releasesBasePath

  const request = useRequest()

  const { getImageUri } = useImage()

  async function getByType(releaseType: string): Promise<ReleasesResponse | null> {
    try {
      return (await request.getRequest(releasesBasePath + '/' + releaseType)).data
    } catch (error) {
      return null
    }
  }

  async function get(slug: string): Promise<ReleaseDetailsResponse | null> {
    try {
      return (await request.getRequest(releasesBasePath + '/' + slug)).data
    } catch (error) {
      return null
    }
  }

  async function getAllForAdmin(offset: number | null = null): Promise<AdminPaginatedReleaseListResponse | null> {
    try {
      return (await request.getRequest(adminReleasesBasePath, {
        offset: offset
      })).data
    } catch (error) {
      return null
    }
  }

  async function getForAdmin(slug: string): Promise<AdminReleaseDetailsResponse | null> {
    try {
      return (await request.getRequest(adminReleasesBasePath + '/' + slug)).data
    } catch (error) {
      return null
    }
  }

  async function addRelease(data: ReleaseData): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminReleasesBasePath,
        content: data,
        successMessage: 'Release "' + data.title + '" has been added',
        errorMessage: 'Unable to add release "' + data.title + '"'
      }
    ))
  }

  async function editRelease(slug: string, data: ReleaseData): Promise<boolean | null> {
    return (await request.putRequest(
      {
        uri: adminReleasesBasePath + '/' + slug,
        content: data,
        successMessage: 'Release "' + data.title + '" has been updated',
        errorMessage: 'Unable to update release "' + data.title + '"'
      }
    ))
  }

  async function getTracksForAdmin(slug: string): Promise<AdminReleaseTracksResponse | null> {
    try {
      return (await request.getRequest(adminReleasesBasePath + '/' + slug + '/tracks')).data
    } catch (error) {
      return null
    }
  }

  async function editTracks(
    releaseSlug: string,
    releaseTitle: string,
    data: AdminReleaseTracksPostData
  ): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminReleasesBasePath + '/' + releaseSlug + '/tracks',
        content: data,
        successMessage: '"' + releaseTitle + '" tracks have been updated',
        errorMessage: 'Unable to update "' + releaseTitle + '" tracks'
      }
    ))
  }

  async function getCreditsForAdmin(slug: string): Promise<AdminReleaseCreditsResponse | null> {
    try {
      return (await request.getRequest(adminReleasesBasePath + '/' + slug + '/credits')).data
    } catch (error) {
      return null
    }
  }

  async function editCredits(
    releaseSlug: string,
    releaseTitle: string,
    data: AdminReleaseCreditsData
  ): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminReleasesBasePath + '/' + releaseSlug + '/credits',
        content: data,
        successMessage: '"' + releaseTitle + '" credits have been updated',
        errorMessage: 'Unable to update "' + releaseTitle + '" credits'
      }
    ))
  }

  async function getLinksForAdmin(slug: string): Promise<AdminReleaseLinksResponse | null> {
    try {
      return (await request.getRequest(adminReleasesBasePath + '/' + slug + '/links')).data
    } catch (error) {
      return null
    }
  }

  async function editLinks(
    releaseSlug: string,
    releaseTitle: string,
    data: AdminReleaseLinksData
  ): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminReleasesBasePath + '/' + releaseSlug + '/links',
        content: data,
        successMessage: '"' + releaseTitle + '" links have been updated',
        errorMessage: 'Unable to update "' + releaseTitle + '" links'
      }
    ))
  }

  async function deleteRelease(slug: string): Promise<boolean | null> {
    return await request.deleteRequest({
      uri: adminReleasesBasePath + '/' + slug,
      successMessage: 'Release has been deleted',
      errorMessage: 'Unable to delete release'
    })
  }

  function getReleaseImageUri(
    release: UnwrapNestedRefs<Release | AdminRelease>,
    prefix: ReleaseImageType
  ): string {
    if (release.releaseDate === null) {
      return '#'
    }

    let imageBasePath = releasesBasePath + '/' + release.slug + '/' + prefix

    return getImageUri(imageBasePath)
  }

  return {
    getByType,
    get,

    getAllForAdmin,
    getForAdmin,
    addRelease,
    editRelease,
    deleteRelease,

    getTracksForAdmin,
    editTracks,

    getCreditsForAdmin,
    editCredits,

    getLinksForAdmin,
    editLinks,

    getReleaseImageUri
  }
}
