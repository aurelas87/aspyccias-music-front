interface ProfileLinkData {
  name: string,
  link: string
}

interface ProfileLinkResponse extends ProfileLinkData {
  position: number
}

type ProfileLinksResponse = ProfileLinkResponse[]
