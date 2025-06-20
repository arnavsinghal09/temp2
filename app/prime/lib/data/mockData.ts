import type {FeaturedContent, ContentItem} from "../types/index"

export const featuredContent: FeaturedContent = {
  id: "featured-1",
  title: "THE TRAITORS",
  description:
    "Season 1 · Welcome to The Traitors — a ruthless reality show hosted by Karan Johar, where 20 celebrities betray and deceive each other for a chance to win a massive cash prize. Trust no one.",
  backgroundImage: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+traitors.jpg",
  episodeInfo: "NEW EPISODES THURSDAY 8 PM",
  newEpisodeInfo: "New episode Thursday",
  imdbRating: "8.2",
  year: 2024,
  rating: "TV-MA",
  duration: "8 episodes",
}

export const featuredContentCarousel: FeaturedContent[] = [
  {
    id: "featured-1",
    title: "THE TRAITORS",
    description:
      "Season 1 · Welcome to The Traitors — a ruthless reality show hosted by Karan Johar, where 20 celebrities betray and deceive each other for a chance to win a massive cash prize. Trust no one.",
    backgroundImage: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+traitors.jpg",
    episodeInfo: "NEW EPISODES THURSDAY 8 PM",
    newEpisodeInfo: "New episode Thursday",
    imdbRating: "8.2",
    year: 2024,
    rating: "TV-MA",
    duration: "8 episodes",
  },
  {
    id: "featured-2",
    title: "FALLOUT",
    description:
      "Based on one of the greatest video game series of all time, Fallout is the story of haves and have-nots in a world in which there’s almost nothing left to have.",
    backgroundImage: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/fallout.webp",
    episodeInfo: "Now Streaming",
    newEpisodeInfo: undefined,
    imdbRating: "8.6",
    year: 2024,
    rating: "TV-MA",
    duration: "1 Season",
  },
  {
    id: "featured-3",
    title: "MR. & MRS. SMITH",
    description:
      "Two strangers give up their identities to become spies in an arranged marriage. But keeping their cover proves more difficult than their dangerous missions.",
    backgroundImage: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/mr+ans+mrs+smith.jpg",
    episodeInfo: "Now Streaming",
    newEpisodeInfo: undefined,
    imdbRating: "7.2",
    year: 2024,
    rating: "TV-MA",
    duration: "1 Season",
  },
]

export const featuredOriginals: ContentItem[] = [
  {
    id: "original-1",
    title: "THE TRAITORS",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+traitors.jpg",
    badge: "TOP 10",
    isPrime: true,
    year: 2024,
    duration: "45m",
    rating: "8.2",
    genre: "Reality TV",
  },
  {
    id: "original-2",
    title: "Citadel",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/citadel.jpeg",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2024,
    duration: "42m",
    rating: "7.8",
    genre: "Comedy",
  },
  {
    id: "original-3",
    title: "The Wheel of Time",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+wheelc+of+time.jpeg",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2024,
    duration: "38m",
    rating: "8.5",
    genre: "Drama",
  },
  {
    id: "original-4",
    title: "Mission Impossible 4",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/MI+4.jpg",
    badge: "NEW SEASON",
    isPrime: true,
    year: 2024,
    duration: "52m",
    rating: "9.1",
    genre: "Documentary",
  },
  {
    id: "original-5",
    title: "Reacher",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/reacher.jpg",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2024,
    duration: "44m",
    rating: "7.9",
    genre: "Action",
  },
]

export const recentlyAdded: ContentItem[] = [
  {
    id: "recent-1",
    title: "The Bear",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+bear.jpeg",
    isPrime: true,
    year: 2024,
    duration: "30m",
    rating: "8.7",
    genre: "Comedy-Drama",
  },
  {
    id: "recent-2",
    title: "Fallout",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/fallout.webp",
    isPrime: true,
    year: 2024,
    duration: "1h 5m",
    rating: "8.4",
    genre: "Sci-Fi",
  },
  {
    id: "recent-3",
    title: "Mr. & Mrs. Smith",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/mr+ans+mrs+smith.jpg",
    isPrime: true,
    year: 2024,
    duration: "55m",
    rating: "8.1",
    genre: "Action",
  },
  {
    id: "recent-4",
    title: "The Power",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+power.webp",
    isPrime: true,
    year: 2024,
    duration: "58m",
    rating: "7.6",
    genre: "Drama",
  },
  {
    id: "recent-5",
    title: "Mission Impossible 6",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/MI+6.jpg",
    isPrime: true,
    year: 2023,
    duration: "1h 51m",
    rating: "7.4",
    genre: "Biography",
  },
]

export const popularMovies: ContentItem[] = [
  {
    id: "movie-1",
    title: "The Tomorrow War",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/The+tomorrow+war.png",
    badge: "TOP 10",
    isPrime: true,
    year: 2021,
    duration: "2h 18m",
    rating: "6.5",
    genre: "Action",
  },
  {
    id: "movie-2",
    title: "Sound of Metal",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/sound+of+metal.jpg",
    isPrime: true,
    year: 2020,
    duration: "2h 0m",
    rating: "7.7",
    genre: "Drama",
  },
  {
    id: "movie-3",
    title: "Coming 2 America",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/coming+2+america.jpeg",
    isPrime: true,
    year: 2021,
    duration: "1h 50m",
    rating: "5.3",
    genre: "Comedy",
  },
  {
    id: "movie-4",
    title: "The Power",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+power.webp",
    isPrime: true,
    year: 2021,
    duration: "2h 8m",
    rating: "6.8",
    genre: "Drama",
  },
  {
    id: "movie-5",
    title: "Citadel",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/citadel.jpeg",
    isPrime: true,
    year: 2021,
    duration: "2h 11m",
    rating: "6.5",
    genre: "Biography",
  },
]

export const topTVShows: ContentItem[] = [
  {
    id: "tv-1",
    title: "The Boys",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+boys.avif",
    badge: "TOP 10",
    isPrime: true,
    year: 2024,
    duration: "1h 2m",
    rating: "8.7",
    genre: "Superhero",
  },
  {
    id: "tv-2",
    title: "The Marvelous Mrs. Maisel",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+marvelous+show.jpeg",
    isPrime: true,
    year: 2023,
    duration: "52m",
    rating: "8.7",
    genre: "Comedy-Drama",
  },
  {
    id: "tv-3",
    title: "Jack Ryan",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/Jack+Ryan.png",
    isPrime: true,
    year: 2023,
    duration: "1h 8m",
    rating: "8.0",
    genre: "Action",
  },
  {
    id: "tv-4",
    title: "The Wheel of Time",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+wheelc+of+time.jpeg",
    isPrime: true,
    year: 2023,
    duration: "1h 5m",
    rating: "7.1",
    genre: "Fantasy",
  },
  {
    id: "tv-5",
    title: "Citadel",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/citadel.jpeg",
    isPrime: true,
    year: 2023,
    duration: "58m",
    rating: "6.5",
    genre: "Spy",
  },
]

export const getContentById = (id: string): ContentItem | FeaturedContent => {
  // Create a comprehensive content list
  const allContent = [
    ...recentlyAdded,
    ...popularMovies,
    ...topTVShows,
    ...featuredOriginals,
    // Add the featured content to the searchable list
    {
      id: "featured-1",
      title: "THE TRAITORS",
      thumbnail:
        "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+traitors.jpg",
      image:
        "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+traitors.jpg",
      year: 2024,
      duration: "45m",
      genre: "Reality TV",
      isPrime: true,
      rating: "8.2",
    },
  ];

  const foundContent = allContent.find((item) => item.id === id);

  if (foundContent) {
    return foundContent;
  }

  // Return a default content item if not found
  return {
    id,
    title: "Sample Content",
    description:
      "This is a sample description for the content. In a real application, this would be fetched from a database or API with detailed plot information and cast details.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+traitors.jpg",
    image:
      "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+traitors.jpg",
    year: 2024,
    duration: "1h 30m",
    genre: "Drama, Thriller",
    rating: "TV-MA",
  };
  
};


export const recommendedContent: ContentItem[] = [
  {
    id: "rec-1",
    title: "Similar Show 1",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/MI+5.jpg",
    isPrime: true,
    year: 2024,
    duration: "45m",
    rating: "8.3",
    genre: "Drama",
  },
  {
    id: "rec-2",
    title: "Similar Show 2",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/reacher.jpg",
    isPrime: true,
    year: 2023,
    duration: "1h 2m",
    rating: "7.9",
    genre: "Thriller",
  },
  {
    id: "rec-3",
    title: "Similar Show 3",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/the+boys.avif",
    isPrime: true,
    year: 2024,
    duration: "38m",
    rating: "8.1",
    genre: "Comedy",
  },
  {
    id: "rec-4",
    title: "Similar Show 4",
    thumbnail: "https://firestories.s3.ap-south-1.amazonaws.com/prime-images/MI+6.jpg",
    isPrime: true,
    year: 2024,
    duration: "52m",
    rating: "8.5",
    genre: "Action",
  },
]
