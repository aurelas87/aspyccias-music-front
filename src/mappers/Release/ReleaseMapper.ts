import type { UnwrapNestedRefs, UnwrapRef } from 'vue'
import Release from '@/models/Release/Release'
import ReleaseDetails from '@/models/Release/ReleaseDetails'
import ReleaseLink from '@/models/Release/ReleaseLink'
import type { ReleaseDetailsResponse, ReleaseLinkResponse, ReleaseResponse, ReleasesResponse } from '@/types/Release'

export function useReleaseMapper() {
  function resetReleaseDetails(releaseDetails: UnwrapNestedRefs<ReleaseDetails>) {
    releaseDetails.slug = ReleaseDetails.EMPTY_SLUG
    releaseDetails.releaseDate = ReleaseDetails.EMPTY_RELEASE_DATE
    releaseDetails.title = ReleaseDetails.EMPTY_TITLE
    releaseDetails.artworkFrontImage = ReleaseDetails.EMPTY_ARTWORK_FRONT_IMAGE
    releaseDetails.artworkBackImage = ReleaseDetails.EMPTY_ARTWORK_BACK_IMAGE
  }

  function mapResponseToRelease(releaseResponse: ReleaseResponse, release: UnwrapRef<Release>) {
    release.slug = releaseResponse.slug
    release.releaseDate = new Date(releaseResponse.release_date)
    release.title = releaseResponse.title
    release.artworkFrontImage = releaseResponse.artwork_front_image
  }

  function mapResponseToReleaseLink(releaseLinkResponse: ReleaseLinkResponse, releaseLink: UnwrapRef<ReleaseLink>) {
    releaseLink.category = releaseLinkResponse.category
    releaseLink.name = releaseLinkResponse.name
    releaseLink.link = releaseLinkResponse.link
    releaseLink.embedded = releaseLinkResponse.embedded
  }

  function mapResponseToReleaseDetails(releaseDetailsResponse: ReleaseDetailsResponse | null, releaseDetails: UnwrapRef<ReleaseDetails>) {
    if (!releaseDetailsResponse) {
      return
    }

    mapResponseToRelease(releaseDetailsResponse, releaseDetails)
    releaseDetails.artworkBackImage = releaseDetailsResponse.artwork_back_image
    releaseDetails.description = releaseDetailsResponse.description

    releaseDetails.links.splice(0)
    releaseDetailsResponse.links.forEach((releaseLinkResponse: ReleaseLinkResponse) => {
      releaseDetails.links.push(new ReleaseLink())
      mapResponseToReleaseLink(releaseLinkResponse, releaseDetails.links[releaseDetails.links.length - 1])
    })
  }

  function mapResponseToReleases(releasesResponse: ReleasesResponse | null, releases: Array<UnwrapRef<Release>>) {
    releasesResponse?.forEach((releaseResponse: ReleaseResponse) => {
      releases.push(new Release())
      mapResponseToRelease(releaseResponse, releases[releases.length - 1])
    })
  }

  return {
    resetReleaseDetails,
    mapResponseToReleaseDetails,

    mapResponseToReleases
  }
}