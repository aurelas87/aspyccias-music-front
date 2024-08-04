import News from '@/models/News/News'

export default class NewsDetails extends News {
  public static EMPTY_CONTENT = ''

  private _content: string = NewsDetails.EMPTY_CONTENT

  get content(): string {
    return this._content
  }

  set content(value: string) {
    this._content = value
  }
}
