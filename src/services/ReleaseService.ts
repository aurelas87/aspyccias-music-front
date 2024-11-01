import { useAxios } from '@/plugins/axios'
import { useImage } from '@/composables/image'
import type { ReleaseDetailsResponse, ReleasesResponse } from '@/types/Release'

export function useReleaseService() {
  const releasesBaseAPIPath = '/releases'
  const musicBasePath = '/music'

  const axios = useAxios()

  const { getImageUri } = useImage()

  async function getByType(releaseType: string): Promise<ReleasesResponse | null> {
    try {
      return (await axios.get(releasesBaseAPIPath + '/' + releaseType)).data
    } catch (error) {
      return null
    }
  }

  async function get(slug: string): Promise<ReleaseDetailsResponse | null> {
    try {
      return (await axios.get(releasesBaseAPIPath + '/' + slug)).data
    } catch (error) {
      return null
    }
  }

  function getReleaseImageUri(imageName: string | null, isThumbnail: boolean): string {
    if (!imageName) {
      return ''
    }

    let imageBasePath = '/uploads' + releasesBaseAPIPath + '/' + imageName

    if (isThumbnail) {
      imageBasePath += '.thumbnail'
    }

    return getImageUri(imageBasePath + '.jpg')
  }

  return {
    getByType,
    get,

    getReleaseImageUri
  }
}
