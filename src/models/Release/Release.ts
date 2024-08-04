export default class Release {
  public static EMPTY_SLUG = null
  public static EMPTY_RELEASE_DATE = null
  public static EMPTY_TITLE = null
  public static EMPTY_ARTWORK_FRONT_IMAGE = null

  private _slug: string | null = Release.EMPTY_SLUG
  private _releaseDate: Date | null = Release.EMPTY_RELEASE_DATE
  private _title: string | null = Release.EMPTY_TITLE
  private _artworkFrontImage: string | null = Release.EMPTY_ARTWORK_FRONT_IMAGE

  get slug(): string | null {
    return this._slug
  }

  set slug(value: string | null) {
    this._slug = value
  }

  get releaseDate(): Date | null {
    return this._releaseDate
  }

  set releaseDate(value: Date | null) {
    this._releaseDate = value
  }

  get title(): string | null {
    return this._title
  }

  set title(value: string | null) {
    this._title = value
  }

  get artworkFrontImage(): string | null {
    return this._artworkFrontImage
  }

  set artworkFrontImage(value: string | null) {
    this._artworkFrontImage = value
  }
}
