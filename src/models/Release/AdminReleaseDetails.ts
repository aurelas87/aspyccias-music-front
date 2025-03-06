import AdminRelease from '@/models/Release/AdminRelease.ts'

export default class AdminReleaseDetails extends AdminRelease {
  private _descriptionFr: string | null = null
  private _descriptionEn: string | null = null
  private _artworkBackImage: boolean | null = null

  get descriptionFr(): string | null {
    return this._descriptionFr
  }

  set descriptionFr(value: string | null) {
    this._descriptionFr = value
  }

  get descriptionEn(): string | null {
    return this._descriptionEn
  }

  set descriptionEn(value: string | null) {
    this._descriptionEn = value
  }

  get artworkBackImage(): boolean | null {
    return this._artworkBackImage
  }

  set artworkBackImage(value: boolean | null) {
    this._artworkBackImage = value
  }
}
