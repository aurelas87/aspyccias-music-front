export interface BaseOptions {
  uri: string,
  successMessage?: string,
  errorMessage?: string,
}

export interface PostAndPutOptions extends BaseOptions {
  content?: Object,
  contentType?: string
}
