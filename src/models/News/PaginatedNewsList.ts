import News from '@/models/News/News'
import PaginatedList from '@/models/PaginatedList.ts'

export default class PaginatedNewsList extends PaginatedList {
  private _items: News[] = []

  get items(): News[] {
    return this._items
  }

  set items(value: News[]) {
    this._items = value
  }
}
