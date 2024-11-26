import type { UnwrapNestedRefs, UnwrapRef } from 'vue'
import AdminRelease from '@/models/Release/AdminRelease.ts'
import AdminPaginatedReleaseList from '@/models/Release/AdminPaginatedReleaseList.ts'
import {
  type AdminPaginatedReleaseListResponse,
  type AdminReleaseDetailsResponse,
  type AdminReleaseResponse
} from '@/types/Release'
import type AdminReleaseDetails from '@/models/Release/AdminReleaseDetails.ts'

export function useAdminReleaseMapper() {
  function mapAdminResponseToRelease(
    adminReleaseResponse: AdminReleaseResponse,
    release: UnwrapRef<AdminRelease>
  ) {
    release.slug = adminReleaseResponse.slug
    release.type = adminReleaseResponse.type
    release.releaseDate = new Date(adminReleaseResponse.release_date)
    release.title = adminReleaseResponse.title
  }

  function mapAdminResponseToReleaseDetails(
    adminReleaseDetailsResponse: AdminReleaseDetailsResponse | null,
    adminReleaseDetails: UnwrapRef<AdminReleaseDetails>
  ) {
    if (!adminReleaseDetailsResponse) {
      return
    }

    mapAdminResponseToRelease(adminReleaseDetailsResponse, adminReleaseDetails)
    adminReleaseDetails.descriptionFr = adminReleaseDetailsResponse.description_fr
    adminReleaseDetails.descriptionEn = adminReleaseDetailsResponse.description_en
    adminReleaseDetails.artworkBackImage = adminReleaseDetailsResponse.artwork_back_image
  }

  function resetAdminPaginatedReleaseList(
    adminPaginatedReleaseList: UnwrapNestedRefs<AdminPaginatedReleaseList>
  ) {
    adminPaginatedReleaseList.previousOffset = AdminPaginatedReleaseList.EMPTY_PREVIOUS_OFFSET
    adminPaginatedReleaseList.nextOffset = AdminPaginatedReleaseList.EMPTY_NEXT_OFFSET
    adminPaginatedReleaseList.items.splice(0)
  }

  function mapAdminResponseToPaginatedNewsList(
    adminPaginatedReleaseListResponse: AdminPaginatedReleaseListResponse | null,
    adminPaginatedReleaseList: UnwrapNestedRefs<AdminPaginatedReleaseList>
  ) {
    if (!adminPaginatedReleaseListResponse) {
      return
    }

    adminPaginatedReleaseList.previousOffset = adminPaginatedReleaseListResponse.previous_offset
    adminPaginatedReleaseList.nextOffset = adminPaginatedReleaseListResponse.next_offset

    adminPaginatedReleaseListResponse.items.forEach((releaseResponse: AdminReleaseResponse) => {
      adminPaginatedReleaseList.items.push(new AdminRelease())
      mapAdminResponseToRelease(
        releaseResponse,
        adminPaginatedReleaseList.items[adminPaginatedReleaseList.items.length - 1]
      )
    })
  }

  return {
    mapAdminResponseToReleaseDetails,

    resetAdminPaginatedReleaseList,
    mapAdminResponseToPaginatedNewsList
  }
}
