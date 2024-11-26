import Release from '@/models/Release/Release'
import ReleaseLink from '@/models/Release/ReleaseLink'
import ReleaseTrack from '@/models/Release/ReleaseTrack'
import type { ReleaseCreditsMappedByType } from '@/types/Release'

export default class ReleaseDetails extends Release {
  public static EMPTY_ARTWORK_BACK_IMAGE = false
  public static EMPTY_DESCRIPTION = null
  public static EMPTY_LINKS = []
  public static EMPTY_TRACKS = []
  public static EMPTY_CREDITS = {}

  private _artworkBackImage: boolean = ReleaseDetails.EMPTY_ARTWORK_BACK_IMAGE
  private _description: string | null = ReleaseDetails.EMPTY_DESCRIPTION
  private _links: ReleaseLink[] = ReleaseDetails.EMPTY_LINKS
  private _tracks: ReleaseTrack[] = ReleaseDetails.EMPTY_TRACKS
  private _credits: ReleaseCreditsMappedByType = ReleaseDetails.EMPTY_CREDITS

  get artworkBackImage(): boolean {
    return this._artworkBackImage
  }

  set artworkBackImage(value: boolean) {
    this._artworkBackImage = value
  }

  get description(): string | null {
    return this._description
  }

  set description(value: string | null) {
    this._description = value
  }

  get links(): ReleaseLink[] {
    return this._links
  }

  set links(value: ReleaseLink[]) {
    this._links = value
  }

  get tracks(): ReleaseTrack[] {
    return this._tracks
  }

  set tracks(value: ReleaseTrack[]) {
    this._tracks = value
  }

  get credits(): ReleaseCreditsMappedByType {
    return this._credits
  }

  set credits(value: ReleaseCreditsMappedByType) {
    this._credits = value
  }
}
