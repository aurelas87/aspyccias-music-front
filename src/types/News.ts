interface News {
  slug: string,
  preview_image: string,
  title: string
}

interface NewsResponseItem extends News {
  date: string
}

interface NewsListItem extends News {
  date: Date
}

type NewsResponseList = NewsResponseItem[]
type NewsList = NewsListItem[]
