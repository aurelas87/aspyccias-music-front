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

export interface ReleaseLinkData {
  category: ReleaseLinkCategory | string,
  name: string,
  link: string | null,
  embedded: string | null
}

export interface CommonReleaseTrackData {
  title: string,
  position: number
}

export interface ReleaseTrackData extends CommonReleaseTrackData {
  duration: number
}

export interface ReleaseCreditData {
  full_name: string,
  link: string|null,
  type: string
}

export interface ReleaseDetailsResponse extends ReleaseResponse {
  artwork_back_image: boolean,
  description: string,
  links: ReleaseLinkData[],
  tracks: ReleaseTrackData[],
  credits: ReleaseCreditData[]
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

export interface AdminReleaseTrackFormData extends CommonReleaseTrackData {
  duration: string
}

export interface AdminReleaseTracksResponse {
  title: string,
  tracks: ReleaseTrackData[]
}

export interface AdminReleaseTracksPostData {
  tracks: ReleaseTrackData[]
}

export interface AdminReleaseCreditsData {
  credits: ReleaseCreditData[]
}

export interface AdminReleaseCreditsResponse extends AdminReleaseCreditsData {
  title: string
}

export interface AdminReleaseLinksData {
  links: ReleaseLinkData[]
}

export interface AdminReleaseLinksResponse extends AdminReleaseLinksData {
  title: string
}
