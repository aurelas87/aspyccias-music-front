import { describe, it, expect, vi, Mock } from 'vitest'
import { useProfileLinksStore } from '../../src/stores/ProfileLinksStore'
import { useProfileLinkService } from '../../src/services/ProfileLinkService'
import { addProfileLinks } from '../fixtures/ProfileLinkFixtures'

describe('ProfileLinksStore', () => {
  it('calls ProfileLinksService on fetch', async () => {
    vi.mock('../../src/services/ProfileLinkService', async () => {
      let _cache = null
      const useProfileLinkService = () => {
        if (!_cache) {
          _cache = {
            getAll: vi.fn(),
          }
        }
        // now every time that useProfileLinkService() is called it will
        // return the same object reference
        return _cache
      }
      return { useProfileLinkService }
    })

    const profileLinkService = useProfileLinkService()
    const mockedGetCall = profileLinkService.getAll as Mock
    mockedGetCall.mockResolvedValue([{ name: 'link1', link: 'https://www.example.com', position: 1 }])

    const profileLinksStores = useProfileLinksStore()
    expect(profileLinksStores.profileLinks.length).toStrictEqual(0)

    await profileLinksStores.fetchProfileLinks()
    expect(profileLinkService.getAll).toHaveBeenCalledTimes(1)
    expect(profileLinksStores.profileLinks.length).toStrictEqual(1)
  })

  it('returns profile links in position range', () => {
    addProfileLinks()
    const profileLinksStore = useProfileLinksStore()

    const result = profileLinksStore.getProfileLinksInPositionRange(2, 4)
    expect(result.length).toStrictEqual(3)
    expect(result[0].name).toStrictEqual('instagram')
    expect(result[1].name).toStrictEqual('youtube')
    expect(result[2].name).toStrictEqual('spotify')
  })
})
