import type { ReleaseLinkCategory } from '@/types/ReleaseLinkCategory'

export interface ReleaseResponse {
  slug: string,
  release_date: string,
  title: string,
  artwork_front_image: string
}

export interface ReleaseLinkResponse {
  category: ReleaseLinkCategory,
  name: string,
  link: string | null,
  embedded: string | null
}

export interface ReleaseDetailsResponse extends ReleaseResponse {
  artwork_back_image: string,
  description: string,
  links: ReleaseLinkResponse[]
}

export type ReleasesResponse = ReleaseResponse[]
