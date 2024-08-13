export default class ReleaseTrack {
  public static EMPTY_TITLE = null
  public static EMPTY_POSITION = null
  public static EMPTY_DURATION = null

  private _title: string | null = ReleaseTrack.EMPTY_TITLE
  private _position: number | null = ReleaseTrack.EMPTY_POSITION
  private _duration: number | null = ReleaseTrack.EMPTY_DURATION

  get title(): string | null {
    return this._title
  }

  set title(value: string | null) {
    this._title = value
  }

  get position(): number | null {
    return this._position
  }

  set position(value: number | null) {
    this._position = value
  }

  get duration(): number | null {
    return this._duration
  }

  set duration(value: number | null) {
    this._duration = value
  }
}
