export interface User {
  accessToken: string | null,
  accessTokenExpirationDate: Date | null
  refreshToken: string | null,
  refreshTokenExpirationDate: Date | null
}
