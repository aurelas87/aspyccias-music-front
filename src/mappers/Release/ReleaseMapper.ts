import type { UnwrapRef } from 'vue'
import Release from '@/models/Release/Release'

export function useReleaseMapper() {
  function mapResponseToRelease(releaseResponse: ReleaseResponse, release: UnwrapRef<Release>) {
    release.slug = releaseResponse.slug
    release.releaseDate = new Date(releaseResponse.release_date)
    release.title = releaseResponse.title
    release.artworkFrontImage = releaseResponse.artwork_front_image
  }

  function mapResponseToReleases(releasesResponse: ReleasesResponse | null, releases: Array<UnwrapRef<Release>>) {
    releasesResponse?.forEach((releaseResponse: ReleaseResponse) => {
      releases.push(new Release())
      mapResponseToRelease(releaseResponse, releases[releases.length - 1])
    })
  }

  return {
    mapResponseToReleases
  }
}
