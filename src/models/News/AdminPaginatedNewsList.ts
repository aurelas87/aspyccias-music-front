import AdminNews from '@/models/News/AdminNews'

export default class AdminPaginatedNewsList {
  public static EMPTY_PREVIOUS_OFFSET = null
  public static EMPTY_NEXT_OFFSET = null

  private _previousOffset: number | null = AdminPaginatedNewsList.EMPTY_PREVIOUS_OFFSET
  private _nextOffset: number | null = AdminPaginatedNewsList.EMPTY_NEXT_OFFSET
  private _items: AdminNews[] = []

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

  get items(): AdminNews[] {
    return this._items
  }

  set items(value: AdminNews[]) {
    this._items = value
  }
}
