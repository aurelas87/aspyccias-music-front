import News from '@/models/News/News'
import NewsDetails from '@/models/News/NewsDetails'
import PaginatedNewsList from '@/models/News/PaginatedNewsList'
import type { UnwrapNestedRefs, UnwrapRef } from 'vue'
import type { NewsDetailsResponse, NewsListResponse, NewsResponse, PaginatedNewsListResponse } from '@/types/News.ts'

export function useNewsMapper() {
  function resetNewsDetails(news: UnwrapNestedRefs<NewsDetails>) {
    news.slug = NewsDetails.EMPTY_SLUG
    news.date = NewsDetails.EMPTY_DATE
    news.title = NewsDetails.EMPTY_TITLE
    news.content = NewsDetails.EMPTY_CONTENT
  }

  function mapResponseToNews(newsResponse: NewsResponse, news: UnwrapRef<News>) {
    news.slug = newsResponse.slug
    news.date = new Date(newsResponse.date)
    news.title = newsResponse.title
  }

  function mapResponseToNewsDetails(
    newsDetailsResponse: NewsDetailsResponse | null,
    newsDetails: UnwrapRef<NewsDetails>
  ) {
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

  function mapResponseToPaginatedNewsList(
    paginatedNewsListResponse: PaginatedNewsListResponse | null,
    paginatedNewsList: UnwrapNestedRefs<PaginatedNewsList>
  ) {
    if (!paginatedNewsListResponse) {
      return
    }

    paginatedNewsList.previousOffset = paginatedNewsListResponse.previous_offset
    paginatedNewsList.nextOffset = paginatedNewsListResponse.next_offset

    paginatedNewsListResponse.items.forEach((newsResponse: NewsResponse) => {
      paginatedNewsList.items.push(new News())
      mapResponseToNews(newsResponse, paginatedNewsList.items[paginatedNewsList.items.length - 1])
    })
  }

  function mapResponseToNewsList(
    newsListResponse: NewsListResponse | null,
    newsList: Array<UnwrapRef<News>>
  ) {
    if (!newsListResponse) {
      return
    }

    newsListResponse.forEach((newsResponse: NewsResponse) => {
      newsList.push(new News())
      mapResponseToNews(newsResponse, newsList[newsList.length - 1])
    })
  }

  return {
    resetNewsDetails,
    mapResponseToNewsDetails,

    resetPaginatedNewsList,
    mapResponseToPaginatedNewsList,

    mapResponseToNewsList
  }
}
