import { useAxios } from '@/plugins/axios'
import { useImage } from '@/composables/image'
import type { UnwrapNestedRefs } from 'vue'
import Release from '@/models/Release/Release'
import ReleaseDetails from '@/models/Release/ReleaseDetails'

export function useReleaseService() {
  const releasesBasePath = '/releases'
  const axios = useAxios()

  const { getImageUri } = useImage()

  async function getByType(releaseType: string): Promise<ReleasesResponse | null> {
    try {
      return (await axios.get(releasesBasePath + '/' + releaseType)).data
    } catch (error) {
      return null
    }
  }

  function getReleaseImageUri(release: UnwrapNestedRefs<Release>): string {
    let imageBasePath = '/uploads' + releasesBasePath + '/' + release.slug

    if (!(release instanceof ReleaseDetails)) {
      imageBasePath += '.thumbnail'
    }

    return getImageUri(imageBasePath + '.jpg')
  }

  function getReleaseUri(slug: string): string {
    return releasesBasePath + '/' + slug
  }

  return {
    getByType,

    getReleaseImageUri,
    getReleaseUri
  }
}
