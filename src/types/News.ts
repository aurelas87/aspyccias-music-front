interface CommonNewsResponse {
  slug: string,
  date: string
}

interface CommonPaginatedNewsListResponse {
  previous_offset: number | null,
  next_offset: number | null,
}

interface NewsResponse extends CommonNewsResponse {
  preview_image: string,
  title: string,
}

interface NewsDetailsResponse extends NewsResponse {
  content: string
}

type NewsListResponse = NewsResponse[]

interface PaginatedNewsListResponse extends CommonPaginatedNewsListResponse {
  items: NewsListResponse
}

interface AdminNewsResponse extends CommonNewsResponse {
  title_fr: string,
  title_en: string
}

interface AdminNewsDetailsResponse extends AdminNewsResponse {
  preview_image: string
  content_fr: string
  content_en: string
}

type AdminNewsListResponse = AdminNewsResponse[]

interface AdminPaginatedNewsListResponse extends CommonPaginatedNewsListResponse {
  items: AdminNewsListResponse
}
