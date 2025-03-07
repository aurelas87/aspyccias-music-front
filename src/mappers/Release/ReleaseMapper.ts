import type { UnwrapNestedRefs, UnwrapRef } from 'vue'
import Release from '@/models/Release/Release'
import ReleaseDetails from '@/models/Release/ReleaseDetails'
import ReleaseLink from '@/models/Release/ReleaseLink'
import ReleaseTrack from '@/models/Release/ReleaseTrack'
import ReleaseCredit from '@/models/Release/ReleaseCredit'
import type {
  ReleaseCreditData,
  ReleaseDetailsResponse,
  ReleaseLinkData,
  ReleaseResponse,
  ReleasesResponse,
  ReleaseTrackData
} from '@/types/Release'
import { ReleaseLinkCategory } from '@/types/ReleaseLinkCategory.ts'

export function useReleaseMapper() {
  function resetReleaseDetails(releaseDetails: UnwrapNestedRefs<ReleaseDetails>) {
    releaseDetails.slug = ReleaseDetails.EMPTY_SLUG
    releaseDetails.releaseDate = ReleaseDetails.EMPTY_RELEASE_DATE
    releaseDetails.title = ReleaseDetails.EMPTY_TITLE
    releaseDetails.artworkBackImage = ReleaseDetails.EMPTY_ARTWORK_BACK_IMAGE
  }

  function mapResponseToRelease(releaseResponse: ReleaseResponse, release: UnwrapRef<Release>) {
    release.slug = releaseResponse.slug
    release.releaseDate = new Date(releaseResponse.release_date)
    release.title = releaseResponse.title
  }

  function mapResponseToReleaseLink(releaseLinkResponse: ReleaseLinkData, releaseLink: UnwrapRef<ReleaseLink>) {
    releaseLink.category = <ReleaseLinkCategory>releaseLinkResponse.category
    releaseLink.name = releaseLinkResponse.name
    releaseLink.link = releaseLinkResponse.link
    releaseLink.embedded = releaseLinkResponse.embedded
  }

  function mapResponseToReleaseTrack(releaseTrackResponse: ReleaseTrackData, releaseTrack: UnwrapRef<ReleaseTrack>) {
    releaseTrack.title = releaseTrackResponse.title
    releaseTrack.position = releaseTrackResponse.position
    releaseTrack.duration = releaseTrackResponse.duration
  }

  function mapResponseToReleaseCredit(releaseCreditResponse: ReleaseCreditData, releaseCredit: UnwrapRef<ReleaseCredit>) {
    releaseCredit.fullName = releaseCreditResponse.full_name
    releaseCredit.link = releaseCreditResponse.link
    releaseCredit.type = releaseCreditResponse.type
  }

  function mapResponseToReleaseDetails(releaseDetailsResponse: ReleaseDetailsResponse | null, releaseDetails: UnwrapRef<ReleaseDetails>) {
    if (!releaseDetailsResponse) {
      return
    }

    mapResponseToRelease(releaseDetailsResponse, releaseDetails)
    releaseDetails.artworkBackImage = releaseDetailsResponse.artwork_back_image
    releaseDetails.description = releaseDetailsResponse.description

    releaseDetails.links.splice(0)
    releaseDetailsResponse.links.forEach((releaseLinkResponse: ReleaseLinkData) => {
      releaseDetails.links.push(new ReleaseLink())
      mapResponseToReleaseLink(releaseLinkResponse, releaseDetails.links[releaseDetails.links.length - 1])
    })

    releaseDetails.tracks.splice(0)
    releaseDetailsResponse.tracks.forEach((releaseTrackResponse: ReleaseTrackData) => {
      releaseDetails.tracks.push(new ReleaseTrack())
      mapResponseToReleaseTrack(releaseTrackResponse, releaseDetails.tracks[releaseDetails.tracks.length - 1])
    })

    for (let creditType in releaseDetails.credits) {
      delete releaseDetails.credits[creditType]
    }
    releaseDetailsResponse.credits.forEach((releaseCreditResponse: ReleaseCreditData) => {
      if (!releaseDetails.credits.hasOwnProperty(releaseCreditResponse.type)) {
        releaseDetails.credits[releaseCreditResponse.type] = []
      }

      releaseDetails.credits[releaseCreditResponse.type].push(new ReleaseCredit())
      mapResponseToReleaseCredit(
        releaseCreditResponse,
        releaseDetails.credits[releaseCreditResponse.type][releaseDetails.credits[releaseCreditResponse.type].length - 1]
      )
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
