import { afterEach, beforeAll, describe, expect, it, Mock, vi } from 'vitest'
import { useProfileLinkService } from '../../src/services/ProfileLinkService'
import { useAxios } from '../../src/plugins/axios'
import { AxiosError } from 'axios'

describe('ProfileLinkService', () => {
  beforeAll(() => {
    vi.mock('@/plugins/axios', () => {
      let _cache = null
      const useAxios = () => {
        if (!_cache) {
          _cache = {
            get: vi.fn(),
          }
        }
        // now every time that useAxios() is called it will
        // return the same object reference
        return _cache
      }
      return { useAxios }
    })

    const mockedGet = useAxios().get as Mock
    mockedGet.mockReset()
    mockedGet.mockResolvedValue({
      data:[
        { name: 'link1', link: 'https://www.example.com', position: 1 },
        { name: 'link2', link: 'https://www.example.com', position: 2 },
        { name: 'link3', link: 'https://www.example.com', position: 3 }
      ]
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('getAll profile links', async () => {
    const profileLinkService = useProfileLinkService()

    const profileLinks = await profileLinkService.getAll()
    expect(useAxios().get).toHaveBeenCalledTimes(1)
    expect(profileLinks.length).toStrictEqual(3)
    expect(profileLinks[0].name).toStrictEqual('link1')
    expect(profileLinks[1].name).toStrictEqual('link2')
    expect(profileLinks[2].name).toStrictEqual('link3')
  })

  it('getAll if error', async () => {
    const axios = useAxios()
    const mockedGet = axios.get as Mock
    mockedGet.mockRejectedValue(() => {
      new AxiosError('an error')
    })

    const profileLinkService = useProfileLinkService()

    const profileLinks = await profileLinkService.getAll()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(profileLinks.length).toStrictEqual(0)
  })
})
