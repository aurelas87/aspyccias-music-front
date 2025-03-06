import type { PostResponse } from '@/types/Response.ts'

export interface PostLoginData {
  username: string,
  password: string
}

export interface UserTokenResponse {
  access_token: string | null,
  access_token_expiration_date: Date | null
  refresh_token: string | null,
  refresh_token_expiration_date: Date | null
}

export interface LoginResponse extends PostResponse {
  user: string,
  token: UserTokenResponse
}
