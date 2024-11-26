import AdminRelease from '@/models/Release/AdminRelease.ts'
import PaginatedList from '@/models/PaginatedList.ts'

export default class AdminPaginatedReleaseList extends PaginatedList {
  private _items: AdminRelease[] = []

  get items(): AdminRelease[] {
    return this._items
  }

  set items(value: AdminRelease[]) {
    this._items = value
  }
}
