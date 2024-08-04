import { defineStore } from 'pinia'
import { reactive, type UnwrapRef } from 'vue'
import { useProfileLinkService } from '@/services/ProfileLinkService'
import { useProfileLinkMapper } from '@/mappers/Profile/ProfileLinkMapper'
import ProfileLink from '@/models/Profile/ProfileLink'

export const useProfileLinksStore = defineStore('profileLinks', () => {
  const profileLinks = reactive<ProfileLink[]>([])
  const profileLinkService = useProfileLinkService()
  const profileLinkMapper = useProfileLinkMapper()

  async function fetchProfileLinks() {
    const profileLinksResponse = await profileLinkService.getAll()
    profileLinkMapper.mapResponseToProfileLinks(profileLinksResponse, profileLinks)
  }

  function getProfileLinksInPositionRange(positionStart: number, positionEnd: number): UnwrapRef<ProfileLink>[] {
    return profileLinks.filter((profileLink: UnwrapRef<ProfileLink>) => {
      if (!profileLink.position) {
        return null
      }

      if (profileLink.position >= positionStart && profileLink.position <= positionEnd) {
        return profileLink
      }
    })
  }

  function $reset() {
    profileLinks.splice(0)
  }

  return { fetchProfileLinks, getProfileLinksInPositionRange, profileLinks, $reset }
})
