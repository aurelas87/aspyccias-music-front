import type { ReleaseLinkCategory } from '@/types/ReleaseLinkCategory'
import ReleaseCredit from '@/models/Release/ReleaseCredit'
import type { CommonPaginatedListResponse } from '@/types/PaginatedList.ts'

export enum ReleaseType {
  ALBUM = 'album',
  SINGLE = 'single',
  EP = 'ep'
}

export enum ReleaseImageType {
  FRONT = 'front',
  BACK = 'back'
}

export interface ReleaseCreditsMappedByType {
  [key: string]: ReleaseCredit[]
}

export interface ReleaseResponse {
  slug: string,
  release_date: string,
  title: string
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
  artwork_back_image: boolean,
  description: string,
  links: ReleaseLinkResponse[],
  tracks: ReleaseTrackResponse[],
  credits: ReleaseCreditResponse[]
}

export type ReleasesResponse = ReleaseResponse[]

export interface AdminReleaseResponse extends ReleaseResponse {
  type: ReleaseType
}

export interface AdminReleaseDetailsResponse extends AdminReleaseResponse {
  description_fr: string,
  description_en: string,
  artwork_back_image: boolean
}

export interface AdminPaginatedReleaseListResponse extends CommonPaginatedListResponse {
  items: AdminReleaseResponse[]
}

export interface ReleaseData extends ReleaseResponse {
  type: string,
  fr: {
    description: string
  },
  en: {
    description: string
  },
  artwork_back_image: boolean
}
