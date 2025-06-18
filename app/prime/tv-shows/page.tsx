import ContentRow from "../components/ContentRow";
import FeaturedBanner from "../components/FeaturedBanner";
import { topTVShows, featuredOriginals } from "../lib/mockData";

// TV Show-specific content
const featuredTVShow = {
  id: "featured-tv-1",
  title: "THE BOYS",
  description:
    "Season 4 · A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers. This dark, satirical take on the superhero genre pushes boundaries with its brutal action and sharp social commentary.",
  backgroundImage:
    "/placeholder.svg?height=800&width=1400&text=THE+BOYS+Season+4",
  episodeInfo: "NEW SEASON AVAILABLE",
  newEpisodeInfo: "Season 4 Now Streaming",
  imdbRating: "8.7",
  year: 2024,
  rating: "TV-MA",
  duration: "8 episodes",
};

const crimeShows = [
  {
    id: "crime-1",
    title: "Reacher",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Reacher+Series",
    badge: "TOP 10",
    isPrime: true,
    year: 2024,
    duration: "1h 5m",
    rating: "8.1",
    genre: "Crime",
  },
  {
    id: "crime-2",
    title: "Bosch",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Bosch+Detective",
    isPrime: true,
    year: 2023,
    duration: "45m",
    rating: "8.5",
    genre: "Crime",
  },
  {
    id: "crime-3",
    title: "The Terminal List",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Terminal+List",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2022,
    duration: "1h 0m",
    rating: "7.9",
    genre: "Crime",
  },
  {
    id: "crime-4",
    title: "Goliath",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Goliath+Legal",
    isPrime: true,
    year: 2021,
    duration: "55m",
    rating: "8.2",
    genre: "Crime",
  },
  {
    id: "crime-5",
    title: "Sneaky Pete",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Sneaky+Pete",
    isPrime: true,
    year: 2019,
    duration: "50m",
    rating: "8.2",
    genre: "Crime",
  },
];

const sciFiShows = [
  {
    id: "scifi-1",
    title: "Fallout",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Fallout+Series",
    badge: "NEW SERIES",
    isPrime: true,
    year: 2024,
    duration: "1h 5m",
    rating: "8.4",
    genre: "Sci-Fi",
  },
  {
    id: "scifi-2",
    title: "The Expanse",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Expanse",
    badge: "AWARD WINNER",
    isPrime: true,
    year: 2021,
    duration: "1h 0m",
    rating: "8.5",
    genre: "Sci-Fi",
  },
  {
    id: "scifi-3",
    title: "Tales from the Loop",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Tales+Loop",
    isPrime: true,
    year: 2020,
    duration: "55m",
    rating: "7.4",
    genre: "Sci-Fi",
  },
  {
    id: "scifi-4",
    title: "Upload",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Upload+Comedy",
    badge: "TOP 10",
    isPrime: true,
    year: 2022,
    duration: "30m",
    rating: "7.8",
    genre: "Sci-Fi",
  },
  {
    id: "scifi-5",
    title: "Undone",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Undone+Series",
    isPrime: true,
    year: 2021,
    duration: "25m",
    rating: "7.6",
    genre: "Sci-Fi",
  },
];

const comedyShows = [
  {
    id: "comedy-tv-1",
    title: "The Marvelous Mrs. Maisel",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Mrs+Maisel",
    badge: "AWARD WINNER",
    isPrime: true,
    year: 2023,
    duration: "52m",
    rating: "8.7",
    genre: "Comedy",
  },
  {
    id: "comedy-tv-2",
    title: "Fleabag",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Fleabag+Comedy",
    badge: "AWARD WINNER",
    isPrime: true,
    year: 2019,
    duration: "30m",
    rating: "8.7",
    genre: "Comedy",
  },
  {
    id: "comedy-tv-3",
    title: "The Tick",
    thumbnail: "/placeholder.svg?height=315&width=560&text=The+Tick",
    isPrime: true,
    year: 2019,
    duration: "30m",
    rating: "7.4",
    genre: "Comedy",
  },
  {
    id: "comedy-tv-4",
    title: "Red Oaks",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Red+Oaks",
    isPrime: true,
    year: 2017,
    duration: "30m",
    rating: "7.9",
    genre: "Comedy",
  },
  {
    id: "comedy-tv-5",
    title: "Catastrophe",
    thumbnail: "/placeholder.svg?height=315&width=560&text=Catastrophe",
    isPrime: true,
    year: 2019,
    duration: "25m",
    rating: "8.2",
    genre: "Comedy",
  },
];

export default function TVShowsPage() {
  return (
    <main className="min-h-screen bg-[#0F171E] pt-20 page-transition">
      <FeaturedBanner content={featuredTVShow} />

      <div className="py-12 space-y-12">
        <ContentRow
          title="Prime Originals"
          items={featuredOriginals}
          seeMoreLink="/tv-shows/originals"
        />
        <ContentRow
          title="Popular TV Shows"
          items={topTVShows}
          seeMoreLink="/tv-shows/popular"
        />
        <ContentRow
          title="Crime & Thriller"
          items={crimeShows}
          seeMoreLink="/tv-shows/crime"
        />
        <ContentRow
          title="Sci-Fi & Fantasy"
          items={sciFiShows}
          seeMoreLink="/tv-shows/scifi"
        />
        <ContentRow
          title="Comedy Series"
          items={comedyShows}
          seeMoreLink="/tv-shows/comedy"
        />
      </div>
    </main>
  );
}
