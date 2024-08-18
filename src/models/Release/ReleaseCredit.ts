export default class ReleaseCredit {
  public static EMPTY_FULL_NAME = null
  public static EMPTY_LINK = null
  public static EMPTY_TYPE = null

  private _fullName: string | null = ReleaseCredit.EMPTY_FULL_NAME
  private _link: string | null = ReleaseCredit.EMPTY_LINK
  private _type: string | null = ReleaseCredit.EMPTY_TYPE

  get fullName(): string | null {
    return this._fullName
  }

  set fullName(value: string | null) {
    this._fullName = value
  }

  get link(): string | null {
    return this._link
  }

  set link(value: string | null) {
    this._link = value
  }

  get type(): string | null {
    return this._type
  }

  set type(value: string | null) {
    this._type = value
  }
}
