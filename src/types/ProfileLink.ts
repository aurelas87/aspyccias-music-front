interface NewProfileLinkData {
  name: string,
  link: string
}

interface ProfileLinkResponse extends NewProfileLinkData {
  position: number
}

interface AdminProfileLinkResponse extends ProfileLinkResponse {
  id: number
}

type ProfileLinksResponse = ProfileLinkResponse[]

type AdminProfileLinksResponse = AdminProfileLinkResponse[]
