interface BaseOptions {
  uri: string,
  successMessage?: string,
  errorMessage?: string,
}

interface PostAndPutOptions extends BaseOptions {
  content?: Object,
  contentType?: string
}
