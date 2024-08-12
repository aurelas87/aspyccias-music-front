import type { ReleaseLinkCategory } from '@/types/ReleaseLinkCategory'

export default class ReleaseLink {
  public static EMPTY_CATEGORY = null
  public static EMPTY_NAME = null
  public static EMPTY_LINK = null
  public static EMPTY_EMBEDDED = null

  private _category: ReleaseLinkCategory | null = ReleaseLink.EMPTY_CATEGORY
  private _name: string | null = ReleaseLink.EMPTY_NAME
  private _link: string | null = ReleaseLink.EMPTY_LINK
  private _embedded: string | null = ReleaseLink.EMPTY_EMBEDDED

  get category(): ReleaseLinkCategory | null {
    return this._category
  }

  set category(value: ReleaseLinkCategory | null) {
    this._category = value
  }

  get name(): string | null {
    return this._name
  }

  set name(value: string | null) {
    this._name = value
  }

  get link(): string | null {
    return this._link
  }

  set link(value: string | null) {
    this._link = value
  }

  get embedded(): string | null {
    return this._embedded
  }

  set embedded(value: string | null) {
    this._embedded = value
  }
}
