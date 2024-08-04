interface NewsResponseCommons {
  slug: string,
  preview_image: string,
  title: string
}

interface NewsResponse extends NewsResponseCommons {
  date: string
}

interface NewsDetailsResponse extends NewsResponse {
  content: string
}

type NewsListResponse = NewsResponse[]

interface PaginatedNewsListResponse {
  previous_offset: number|null,
  next_offset: number|null,
  items: NewsListResponse
}
