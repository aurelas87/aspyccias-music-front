export default class Profile {
  private _welcome: string | null = null
  private _description: string | null = null

  get welcome(): string | null {
    return this._welcome
  }

  set welcome(value: string | null) {
    this._welcome = value
  }

  get description(): string | null {
    return this._description
  }

  set description(value: string | null) {
    this._description = value
  }
}
