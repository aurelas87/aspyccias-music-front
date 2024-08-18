import News from '@/models/News/News'

export default class PaginatedNewsList {
  public static EMPTY_PREVIOUS_OFFSET = null
  public static EMPTY_NEXT_OFFSET = null

  private _previousOffset: number | null = PaginatedNewsList.EMPTY_PREVIOUS_OFFSET
  private _nextOffset: number | null = PaginatedNewsList.EMPTY_NEXT_OFFSET
  private _items: News[] = []

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

  get items(): News[] {
    return this._items
  }

  set items(value: News[]) {
    this._items = value
  }
}
