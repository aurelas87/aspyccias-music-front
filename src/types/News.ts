export interface NewsData {
  date: string,
  slug: string,
  fr: {
    title: string,
    content: string
  },
  en: {
    title: string,
    content: string
  }
}

interface CommonNewsResponse {
  slug: string,
  date: string
}

interface CommonPaginatedNewsListResponse {
  previous_offset: number | null,
  next_offset: number | null,
}

export interface NewsResponse extends CommonNewsResponse {
  preview_image: string,
  title: string,
}

export interface NewsDetailsResponse extends NewsResponse {
  content: string
}

export type NewsListResponse = NewsResponse[]

export interface PaginatedNewsListResponse extends CommonPaginatedNewsListResponse {
  items: NewsListResponse
}

export interface AdminNewsResponse extends CommonNewsResponse {
  title_fr: string,
  title_en: string
}

export interface AdminNewsDetailsResponse extends AdminNewsResponse {
  preview_image: string
  content_fr: string
  content_en: string
}

export interface AdminPaginatedNewsListResponse extends CommonPaginatedNewsListResponse {
  items: AdminNewsResponse[]
}
