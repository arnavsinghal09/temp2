export interface FeaturedContent {
  id: string
  title: string
  description: string
  backgroundImage: string
  year?: number
  rating?: string
  duration?: string
  episodeInfo?: string
  newEpisodeInfo?: string
  imdbRating?: string
}

export interface ContentItem {
  id: string
  title: string
  thumbnail: string
  year?: number
  duration?: string
  badge?: string
  isPrime?: boolean
  rating?: string
  genre?: string
}

export interface ContentRowProps {
  title: string
  items: ContentItem[]
  seeMoreLink?: string
}
