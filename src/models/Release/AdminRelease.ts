import { type ReleaseType } from '@/types/Release.ts'

export default class AdminRelease {
  private _slug: string | null = null
  private _releaseDate: Date | null = null
  private _type: ReleaseType | null = null
  private _title: string | null = null

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

  get type(): ReleaseType | null {
    return this._type
  }

  set type(value: ReleaseType | null) {
    this._type = value
  }

  get title(): string | null {
    return this._title
  }

  set title(value: string | null) {
    this._title = value
  }
}
