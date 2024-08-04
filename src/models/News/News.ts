export default class News {
  public static EMPTY_SLUG = ''
  public static EMPTY_PREVIEW_IMAGE = ''
  public static EMPTY_DATE = null
  public static EMPTY_TITLE = ''

  private _slug: string = News.EMPTY_SLUG
  private _previewImage: string = News.EMPTY_PREVIEW_IMAGE
  private _date: Date | null = News.EMPTY_DATE
  private _title: string = News.EMPTY_TITLE

  get slug(): string {
    return this._slug
  }

  set slug(value: string) {
    this._slug = value
  }

  get previewImage(): string {
    return this._previewImage
  }

  set previewImage(value: string) {
    this._previewImage = value
  }

  get date(): Date | null {
    return this._date
  }

  set date(value: Date | null) {
    this._date = value
  }

  get title(): string {
    return this._title
  }

  set title(value: string) {
    this._title = value
  }
}
