import Release from '@/models/Release/Release'
import ReleaseLink from '@/models/Release/ReleaseLink'

export default class ReleaseDetails extends Release {
  public static EMPTY_ARTWORK_BACK_IMAGE = null
  public static EMPTY_DESCRIPTION = null
  public static EMPTY_LINKS = []

  private _artworkBackImage: string | null = ReleaseDetails.EMPTY_ARTWORK_BACK_IMAGE
  private _description: string | null = ReleaseDetails.EMPTY_DESCRIPTION
  private _links: ReleaseLink[] = ReleaseDetails.EMPTY_LINKS

  get artworkBackImage(): string | null {
    return this._artworkBackImage
  }

  set artworkBackImage(value: string | null) {
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
}
