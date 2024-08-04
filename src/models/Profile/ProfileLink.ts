export default class ProfileLink {
  private _name: string | null = null
  private _link: string | null = null
  private _position: number | null = null

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

  get position(): number | null {
    return this._position
  }

  set position(value: number | null) {
    this._position = value
  }
}
