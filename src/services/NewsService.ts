import { useAxios } from '@/plugins/axios'
import { useImage } from '@/composables/image'
import router from '@/router'
import News from '@/models/News/News'
import NewsDetails from '@/models/News/NewsDetails'
import type { UnwrapNestedRefs } from 'vue'

export function useNewsService() {
  const newsBasePath = '/news'
  const axios = useAxios()

  const { getImageUri } = useImage()

  async function getLatest(): Promise<NewsListResponse> {
    try {
      return (await axios.get(newsBasePath + '/latest')).data
    } catch (error) {
      return []
    }
  }

  async function getPaginated(offset: number|null = null): Promise<PaginatedNewsListResponse|null> {
    try {
      return (await axios.get(newsBasePath, {
        params: {
          offset: offset
        }
      })).data
    } catch (error) {
      return null
    }
  }

  async function get(slug: string): Promise<NewsDetailsResponse|null> {
    try {
      return (await axios.get(newsBasePath + '/' + slug)).data
    } catch (error) {
      await router.push('/not-found')
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

  function getNewsItemUri(slug: string): string {
    return newsBasePath + '/' + slug
  }

  return {
    getLatest,
    getPaginated,
    get,

    getNewsImageUri,
    getNewsItemUri
  }
}
