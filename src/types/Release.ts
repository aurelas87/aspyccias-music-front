interface ReleaseResponse {
  slug: string,
  release_date: string,
  title: string,
  artwork_front_image: string
}

type ReleasesResponse = ReleaseResponse[]
