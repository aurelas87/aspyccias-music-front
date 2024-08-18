import type { ReleaseLinkCategory } from '@/types/ReleaseLinkCategory'
import ReleaseCredit from '@/models/Release/ReleaseCredit'

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

export interface ReleaseTrackResponse {
  title: string,
  position: number,
  duration: number
}

export interface ReleaseCreditResponse {
  full_name: string,
  link: string|null,
  type: string
}

export interface ReleaseDetailsResponse extends ReleaseResponse {
  artwork_back_image: string,
  description: string,
  links: ReleaseLinkResponse[],
  tracks: ReleaseTrackResponse[],
  credits: ReleaseCreditResponse[]
}

export type ReleasesResponse = ReleaseResponse[]

export interface ReleaseCreditsMappedByType {
  [key: string]: ReleaseCredit[]
}
