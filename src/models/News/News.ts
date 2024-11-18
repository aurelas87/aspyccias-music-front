export default class News {
  public static EMPTY_SLUG = null
  public static EMPTY_DATE = null
  public static EMPTY_TITLE = null

  private _slug: string | null = News.EMPTY_SLUG
  private _date: Date | null = News.EMPTY_DATE
  private _title: string | null = News.EMPTY_TITLE

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

  get title(): string | null {
    return this._title
  }

  set title(value: string | null) {
    this._title = value
  }
}
