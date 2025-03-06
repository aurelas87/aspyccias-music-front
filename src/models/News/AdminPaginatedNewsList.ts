import AdminNews from '@/models/News/AdminNews'
import PaginatedList from '@/models/PaginatedList.ts'

export default class AdminPaginatedNewsList extends PaginatedList {
  private _items: AdminNews[] = []

  get items(): AdminNews[] {
    return this._items
  }

  set items(value: AdminNews[]) {
    this._items = value
  }
}
