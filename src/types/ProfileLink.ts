export interface ProfileLinkData {
  name: string,
  link: string
}

export interface ProfileLinkResponse extends ProfileLinkData {
  position: number
}

export type ProfileLinksResponse = ProfileLinkResponse[]
