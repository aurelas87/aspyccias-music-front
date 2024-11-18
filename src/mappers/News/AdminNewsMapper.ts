import type { UnwrapNestedRefs, UnwrapRef } from 'vue'
import AdminNews from '@/models/News/AdminNews'
import AdminNewsDetails from '@/models/News/AdminNewsDetails'
import AdminPaginatedNewsList from '@/models/News/AdminPaginatedNewsList'
import type {
  AdminNewsResponse,
  AdminNewsDetailsResponse,
  AdminPaginatedNewsListResponse,
} from '@/types/News.ts'

export function useAdminNewsMapper() {
  function mapAdminResponseToNews(
    adminNewsResponse: AdminNewsResponse,
    adminNews: UnwrapRef<AdminNews>
  ) {
    adminNews.slug = adminNewsResponse.slug
    adminNews.date = new Date(adminNewsResponse.date)
    adminNews.titleFr = adminNewsResponse.title_fr
    adminNews.titleEn = adminNewsResponse.title_en
  }

  function mapAdminResponseToNewsDetails(
    adminNewsDetailsResponse: AdminNewsDetailsResponse | null,
    adminNewsDetails: UnwrapRef<AdminNewsDetails>
  ) {
    if (!adminNewsDetailsResponse) {
      return
    }

    mapAdminResponseToNews(adminNewsDetailsResponse, adminNewsDetails)
    adminNewsDetails.contentFr = adminNewsDetailsResponse.content_fr
    adminNewsDetails.contentEn = adminNewsDetailsResponse.content_en
  }

  function resetAdminPaginatedNewsList(adminPaginatedNewsList: UnwrapNestedRefs<AdminPaginatedNewsList>) {
    adminPaginatedNewsList.previousOffset = AdminPaginatedNewsList.EMPTY_PREVIOUS_OFFSET
    adminPaginatedNewsList.nextOffset = AdminPaginatedNewsList.EMPTY_NEXT_OFFSET
    adminPaginatedNewsList.items.splice(0)
  }

  function mapAdminResponseToPaginatedNewsList(
    adminPaginatedNewsListResponse: AdminPaginatedNewsListResponse | null,
    adminPaginatedNewsList: UnwrapNestedRefs<AdminPaginatedNewsList>
  ) {
    if (!adminPaginatedNewsListResponse) {
      return
    }

    adminPaginatedNewsList.previousOffset = adminPaginatedNewsListResponse.previous_offset
    adminPaginatedNewsList.nextOffset = adminPaginatedNewsListResponse.next_offset

    adminPaginatedNewsListResponse.items.forEach((newsResponse: AdminNewsResponse) => {
      adminPaginatedNewsList.items.push(new AdminNews())
      mapAdminResponseToNews(newsResponse, adminPaginatedNewsList.items[adminPaginatedNewsList.items.length - 1])
    })
  }

  return {
    mapAdminResponseToNewsDetails: mapAdminResponseToNewsDetails,

    resetAdminPaginatedNewsList: resetAdminPaginatedNewsList,
    mapAdminResponseToPaginatedNewsList: mapAdminResponseToPaginatedNewsList
  }
}
