import type { UnwrapNestedRefs } from 'vue'
import ProfileLink from '@/models/Profile/ProfileLink'

export function useProfileLinkMapper() {
  function mapResponseToProfileLink(profileLinkResponse: ProfileLinkResponse, profileLink: UnwrapNestedRefs<ProfileLink>) {
    profileLink.name = profileLinkResponse.name
    profileLink.link = profileLinkResponse.link
    profileLink.position = profileLinkResponse.position
  }

  function mapResponseToProfileLinks(profileLinksResponse: ProfileLinksResponse | null, profileLinks: UnwrapNestedRefs<ProfileLink[]>) {
    if (!profileLinksResponse) {
      return
    }

    profileLinksResponse.forEach((profileLinkResponse: ProfileLinkResponse) => {
      profileLinks.push(new ProfileLink())
      mapResponseToProfileLink(profileLinkResponse, profileLinks[profileLinks.length - 1])
    })
  }

  return {
    mapResponseToProfileLinks
  }
}
