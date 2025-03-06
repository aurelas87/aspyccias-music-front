import { useImage } from '@/composables/image'
import News from '@/models/News/News'
import type { UnwrapNestedRefs } from 'vue'
import { adminBasePath } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'
import type {
  AdminNewsDetailsResponse,
  AdminPaginatedNewsListResponse, NewsData,
  NewsDetailsResponse,
  NewsListResponse,
  PaginatedNewsListResponse
} from '@/types/News.ts'
import type AdminNews from '@/models/News/AdminNews.ts'

export function useNewsService() {
  const newsBasePath = '/news'
  const adminNewsBasePath = adminBasePath + newsBasePath
  const request = useRequest()

  const { getImageUri } = useImage()

  async function getLatest(): Promise<NewsListResponse | null> {
    try {
      return (await request.getRequest(newsBasePath + '/latest')).data
    } catch (error) {
      return null
    }
  }

  async function getPaginated(offset: number | null = null): Promise<PaginatedNewsListResponse | null> {
    try {
      return (await request.getRequest(newsBasePath, {
        offset: offset
      })).data
    } catch (error) {
      return null
    }
  }

  async function get(slug: string): Promise<NewsDetailsResponse | null> {
    try {
      return (await request.getRequest(newsBasePath + '/' + slug)).data
    } catch (error) {
      return null
    }
  }

  async function getPaginatedForAdmin(offset: number | null = null): Promise<AdminPaginatedNewsListResponse | null> {
    try {
      return (await request.getRequest(adminNewsBasePath, {
        offset: offset
      })).data
    } catch (error) {
      return null
    }
  }

  async function getForAdmin(slug: string): Promise<AdminNewsDetailsResponse | null> {
    try {
      return (await request.getRequest(adminNewsBasePath + '/' + slug)).data
    } catch (error) {
      return null
    }
  }

  function getNewsImageUri(news: UnwrapNestedRefs<News | AdminNews>): string {
    if (news.date === null) {
      return '#'
    }

    let imageBasePath = newsBasePath + '/' + news.slug

    return getImageUri(imageBasePath)
  }

  async function addNews(data: NewsData): Promise<boolean | null> {
    return (await request.postRequest(
      {
        uri: adminNewsBasePath,
        content: data,
        successMessage: 'News "' + data.slug + '" has been added',
        errorMessage: 'Unable to add news "' + data.slug + '"'
      }
    ))
  }

  async function editNews(slug: string, data: NewsData): Promise<boolean | null> {
    return (await request.putRequest(
      {
        uri: adminNewsBasePath + '/' + slug,
        content: data,
        successMessage: 'News "' + data.slug + '" has been updated',
        errorMessage: 'Unable to update news "' + data.slug + '"'
      }
    ))
  }

  async function deleteNews(slug: string): Promise<boolean> {
    return (await request.deleteRequest(
      {
        uri: adminNewsBasePath + '/' + slug,
        successMessage: 'News "' + slug + '" has been deleted',
        errorMessage: 'Unable to delete news "' + slug + '" '
      }
    ))
  }

  return {
    getLatest,
    getPaginated,
    get,

    getPaginatedForAdmin,
    getForAdmin,

    getNewsImageUri,

    addNews,
    editNews,
    deleteNews
  }
}
