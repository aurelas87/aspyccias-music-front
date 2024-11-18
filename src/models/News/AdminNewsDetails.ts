import AdminNews from '@/models/News/AdminNews'

export default class AdminNewsDetails extends AdminNews {
  private _contentFr: string = ''
  private _contentEn: string = ''

  get contentFr(): string {
    return this._contentFr
  }

  set contentFr(value: string) {
    this._contentFr = value
  }

  get contentEn(): string {
    return this._contentEn
  }

  set contentEn(value: string) {
    this._contentEn = value
  }
}
