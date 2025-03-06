export default class AdminNews {
  private _slug: string | null = null
  private _date: Date | null = null
  private _titleFr: string | null = null
  private _titleEn: string | null = null

  get slug(): string | null {
    return this._slug
  }

  set slug(value: string | null) {
    this._slug = value
  }

  get date(): Date | null {
    return this._date
  }

  set date(value: Date | null) {
    this._date = value
  }

  get titleFr(): string | null {
    return this._titleFr
  }

  set titleFr(value: string | null) {
    this._titleFr = value
  }

  get titleEn(): string | null {
    return this._titleEn
  }

  set titleEn(value: string | null) {
    this._titleEn = value
  }
}
