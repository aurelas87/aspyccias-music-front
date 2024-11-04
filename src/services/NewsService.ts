import { useImage } from '@/composables/image'
import News from '@/models/News/News'
import NewsDetails from '@/models/News/NewsDetails'
import type { UnwrapNestedRefs } from 'vue'
import { adminBasePath } from '@/types/admin/Commons'
import { useRequest } from '@/composables/request'

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

  function getNewsImageUri(news: UnwrapNestedRefs<News>): string {
    if (news.date === null) {
      return '#'
    }

    let imageBasePath = '/uploads' + newsBasePath + '/' + news.date.getUTCFullYear() + '/' + news.slug

    if (!(news instanceof NewsDetails)) {
      imageBasePath += '.thumbnail'
    }

    return getImageUri(imageBasePath + '.jpg')
  }

  return {
    getLatest,
    getPaginated,
    get,

    getPaginatedForAdmin,
    getForAdmin,

    getNewsImageUri
  }
}
