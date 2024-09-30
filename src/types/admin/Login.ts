interface PostLoginData {
  username: string,
  password: string
}

interface UserTokenResponse {
  access_token: string | null,
  access_token_expiration_date: Date | null
  refresh_token: string | null,
  refresh_token_expiration_date: Date | null
}

interface LoginResponse extends PostResponse {
  user: string,
  token: UserTokenResponse
}
