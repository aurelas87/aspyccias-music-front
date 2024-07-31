import { useAxios } from '@/plugins/axios'
import { useImage } from '@/composables/image'

export function useNewsService() {
  const newsBasePath = '/news'
  const axios = useAxios()

  const { getImageUri } = useImage()

  async function getLatest(): Promise<NewsResponseList> {
    try {
      return (await axios.get(newsBasePath + '/latest')).data
    } catch (error) {
      return []
    }
  }

  function getNewsThumbnailUri(news: NewsListItem): string {
    return getImageUri('/uploads' + newsBasePath + '/' + news.date.getUTCFullYear() + '/' + news.slug + '.thumbnail.jpg')
  }

  function getNewsItemUri(slug: string): string {
    return newsBasePath + '/' + slug
  }

  return {
    getLatest,
    getNewsThumbnailUri,
    getNewsItemUri
  }
}
