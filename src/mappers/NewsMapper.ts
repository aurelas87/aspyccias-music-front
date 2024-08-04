import News from '@/models/News/News'
import NewsDetails from '@/models/News/NewsDetails'
import PaginatedNewsList from '@/models/News/PaginatedNewsList'
import type { UnwrapNestedRefs, UnwrapRef } from 'vue'

export function useNewsMapper() {
  const emptyPaginatedNewsListResponse = <PaginatedNewsListResponse>{
    previous_offset: null,
    next_offset: null,
    items: []
  }

  function resetNewsDetails(news: UnwrapNestedRefs<NewsDetails>) {
    news.slug = NewsDetails.EMPTY_SLUG
    news.previewImage = NewsDetails.EMPTY_PREVIEW_IMAGE
    news.date = NewsDetails.EMPTY_DATE
    news.title = NewsDetails.EMPTY_TITLE
    news.content = NewsDetails.EMPTY_CONTENT
  }

  function mapResponseToNews(newsResponse: NewsResponse, news: UnwrapRef<News>) {
    news.slug = newsResponse.slug
    news.previewImage = newsResponse.preview_image
    news.date = new Date(newsResponse.date)
    news.title = newsResponse.title
  }

  function mapResponseToNewsDetails(newsDetailsResponse: NewsDetailsResponse | null, newsDetails: UnwrapNestedRefs<NewsDetails>) {
    if (!newsDetailsResponse) {
      return
    }

    mapResponseToNews(newsDetailsResponse, newsDetails)
    newsDetails.content = newsDetailsResponse.content
  }

  function resetPaginatedNewsList(paginatedNewsList: UnwrapNestedRefs<PaginatedNewsList>) {
    paginatedNewsList.previousOffset = PaginatedNewsList.EMPTY_PREVIOUS_OFFSET
    paginatedNewsList.nextOffset = PaginatedNewsList.EMPTY_NEXT_OFFSET
    paginatedNewsList.items.splice(0)
  }

  function mapResponseToPaginatedNewsList(paginatedNewsListResponse: PaginatedNewsListResponse | null, paginatedNewsList: UnwrapNestedRefs<PaginatedNewsList>) {
    if (!paginatedNewsListResponse) {
      return
    }

    paginatedNewsList.previousOffset = paginatedNewsListResponse.previous_offset
    paginatedNewsList.nextOffset = paginatedNewsListResponse.next_offset

    paginatedNewsListResponse.items.forEach((newsResponse) => {
      paginatedNewsList.items.push(new News())
      mapResponseToNews(newsResponse, paginatedNewsList.items[paginatedNewsList.items.length - 1])
    })
  }

  function mapResponseToNewsList(newsListResponse: NewsListResponse, newsList: Array<UnwrapRef<News>>) {
    newsListResponse.forEach((newsResponse) => {
      newsList.push(new News())
      mapResponseToNews(newsResponse, newsList[newsList.length - 1])
    })
  }

  return {
    resetNewsDetails,
    mapResponseToNewsDetails,

    emptyPaginatedNewsListResponse,
    resetPaginatedNewsList,
    mapResponseToPaginatedNewsList,

    mapResponseToNewsList
  }
}
