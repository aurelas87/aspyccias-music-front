export default class PaginatedList {
  public static EMPTY_PREVIOUS_OFFSET = null
  public static EMPTY_NEXT_OFFSET = null

  private _previousOffset: number | null = PaginatedList.EMPTY_PREVIOUS_OFFSET
  private _nextOffset: number | null = PaginatedList.EMPTY_NEXT_OFFSET

  get previousOffset(): number | null {
    return this._previousOffset
  }

  set previousOffset(value: number | null) {
    this._previousOffset = value
  }

  get nextOffset(): number | null {
    return this._nextOffset
  }

  set nextOffset(value: number | null) {
    this._nextOffset = value
  }
}
