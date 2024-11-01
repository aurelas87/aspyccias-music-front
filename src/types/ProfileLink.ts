interface ProfileLinkResponse {
  name: string,
  link: string,
  position: number
}

interface AdminProfileLinkResponse extends ProfileLinkResponse {
  id: number
}

type ProfileLinksResponse = ProfileLinkResponse[]

type AdminProfileLinksResponse = AdminProfileLinkResponse[]
