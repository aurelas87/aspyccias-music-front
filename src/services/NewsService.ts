import { useAxios } from '@/plugins/axios'
import { useImage } from '@/composables/image'

export function useNewsService() {
  const newsBasePath = '/news'
  const axios = useAxios()

  const { getImageUri } = useImage()

  const emptyPaginatedNewsList = <PaginatedNewsList>{
    previous_offset: null,
    next_offset: null,
    items: [],
  }

  async function getLatest(): Promise<NewsList> {
    try {
      return (await axios.get(newsBasePath + '/latest')).data
    } catch (error) {
      return []
    }
  }

  async function getPaginated(offset: number|null = null): Promise<PaginatedNewsList> {
    try {
      return (await axios.get(newsBasePath, {
        params: {
          offset: offset
        }
      })).data
    } catch (error) {
      return emptyPaginatedNewsList
    }
  }

  function getNewsThumbnailUri(news: NewsListItem): string {
    return getImageUri('/uploads' + newsBasePath + '/' + news.date.getUTCFullYear() + '/' + news.slug + '.thumbnail.jpg')
  }

  function getNewsItemUri(slug: string): string {
    return newsBasePath + '/' + slug
  }

  return {
    emptyPaginatedNewsList,

    getLatest,
    getPaginated,

    getNewsThumbnailUri,
    getNewsItemUri
  }
}
