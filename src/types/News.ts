interface News {
  slug: string,
  preview_image: string,
  title: string
  date: string|Date
}

interface NewsListItem extends News {
  date: Date
}

type NewsList = NewsListItem[]

interface PaginatedNewsList {
  previous_offset: number|null,
  next_offset: number|null,
  items: NewsList
}
