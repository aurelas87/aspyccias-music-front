import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useProfileLinkService } from '@/services/ProfileLinkService'

export const useProfileLinksStore = defineStore('profileLinks', () => {
  const profileLinks = reactive<ProfileLinks>([])
  const profileLinkService = useProfileLinkService()

  function setProfileLinks(fetchedProfileLinks: ProfileLinks) {
    fetchedProfileLinks.forEach((profileLink: ProfileLink) => {
      profileLinks.push(profileLink)
    })
  }

  async function fetchProfileLinks() {
    const profileLinks = await profileLinkService.getAll()
    setProfileLinks(profileLinks)
  }

  function getProfileLinksInPositionRange(positionStart: number, positionEnd: number): ProfileLink[] {
    return profileLinks.filter((profileLink: ProfileLink) => {
      if (profileLink.position >= positionStart && profileLink.position <= positionEnd) {
        return profileLink;
      }
    })
  }

  function $reset() {
    profileLinks.splice(0)
  }

  return { fetchProfileLinks, getProfileLinksInPositionRange, profileLinks, $reset }
})
