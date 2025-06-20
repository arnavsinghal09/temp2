export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  backdropImage: string;
  videoUrl: string;
  duration: number; // in seconds
  genre: string[];
  year: number;
  rating: "G" | "PG" | "PG-13" | "R" | "TV-MA" | "TV-14" | "17+";
  cast: string[];
  director: string;
  type: "movie" | "series";
  featured?: boolean;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  seasonNumber: number;
  episodeNumber: number;
}

// Demo content with free video URLs (Big Buck Bunny, Sintel, etc.)
export const DEMO_CONTENT: Content[] = [
  // Featured Game Content for Hero Banner
  {
    id: "gta-san-andreas",
    title: "GTA: San Andreas - The Definitive Edition",
    description:
      "Take control of the streets. Return to your hometown to save your family and clear your name in this '90s West Coast adventure.",
    thumbnail:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.gtaall.com%2Fgta-san-andreas%2Fmods%2F174286-gta-sa-style-loadscreens-169.html&psig=AOvVaw3XN_WNrD7xq3UN5G32F9Q4&ust=1750358052484000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCSy4XO-40DFQAAAAAdAAAAABAE.jpg",
    backdropImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 7200,
    genre: ["Action", "Adventure", "Open World"],
    year: 2021,
    rating: "17+",
    cast: ["Game Characters", "Voice Actors"],
    director: "Rockstar Games",
    type: "movie",
    featured: true,
  },
  {
    id: "1",
    title: "Breaking Bad",
    description:
      "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/breaking+bad.jpg",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/breaking+bad.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 596,
    genre: ["Animation", "Comedy", "Family"],
    year: 2008,
    rating: "G",
    cast: ["Sacha Goedegebure", "Frank Ekkebus", "Jan Morgenstern"],
    director: "Sacha Goedegebure",
    type: "movie",
  },
  {
    id: "2",
    title: "Hit: The Third Case",
    description:
      "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend Scales.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/hit+the+third+case.avif",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/hit+the+third+case.avif",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: 888,
    genre: ["Animation", "Fantasy", "Drama"],
    year: 2010,
    rating: "PG",
    cast: ["Halina Reijn", "Thom Hoffman"],
    director: "Colin Levy",
    type: "movie",
  },
  {
    id: "3",
    title: "Kabir Singh",
    description:
      "In an apocalyptic future, a group of soldiers and scientists takes refuge in Amsterdam to try to stop an army of robots that threatens to destroy the world.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/kabir+singh.webp",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/kabir+singh.webp",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: 734,
    genre: ["Sci-Fi", "Action", "Drama"],
    year: 2012,
    rating: "PG-13",
    cast: ["Derek de Lint", "Berenice Bejo", "Casper Crump"],
    director: "Ian Hubert",
    type: "movie",
  },
  {
    id: "4",
    title: "Laapatta Ladies",
    description:
      "The story of two strange characters exploring a capricious and seemingly infinite machine. The elder, Proog, acts as a tour-guide and protector, happily showing off the sights and dangers of the machine to his initially curious but increasingly skeptical protege Emo.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/lapatta+ladies.avif",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/lapatta+ladies.avif",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 654,
    genre: ["Animation", "Fantasy", "Sci-Fi"],
    year: 2006,
    rating: "G",
    cast: ["Tygo Gernandt", "Cas Jansen"],
    director: "Bassam Kurdali",
    type: "movie",
  },
  {
    id: "5",
    title: "Mission Impossible: The Final Reckoning",
    description:
      "A thrilling adventure featuring amazing fire scenes and spectacular action sequences.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/Mission-Immposible.jpg",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/Mission-Immposible.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 15,
    genre: ["Action", "Adventure"],
    year: 2023,
    rating: "PG-13",
    cast: ["Demo Actor 1", "Demo Actor 2"],
    director: "Demo Director",
    type: "movie",
  },
  {
    id: "6",
    title: "Money Heist",
    description:
      "An intense escape thriller that will keep you on the edge of your seat.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/money+heist.png",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/money+heist.png",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 15,
    genre: ["Thriller", "Action"],
    year: 2023,
    rating: "R",
    cast: ["Demo Actor 3", "Demo Actor 4"],
    director: "Demo Director 2",
    type: "movie",
  },
  {
    id: "7",
    title: "Salaar",
    description:
      "An intense escape thriller that will keep you on the edge of your seat.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/salaar.jpeg",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/salaar.jpeg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 15,
    genre: ["Thriller", "Action"],
    year: 2023,
    rating: "R",
    cast: ["Demo Actor 3", "Demo Actor 4"],
    director: "Demo Director 2",
    type: "movie",
  },
  {
    id: "8",
    title: "Shaitaan",
    description:
      "An intense escape thriller that will keep you on the edge of your seat.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/shaitaan.webp",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/shaitaan.webp",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 15,
    genre: ["Thriller", "Action"],
    year: 2023,
    rating: "R",
    cast: ["Demo Actor 3", "Demo Actor 4"],
    director: "Demo Director 2",
    type: "movie",
  },
  {
    id: "9",
    title: "The Rookie",
    description:
      "An intense escape thriller that will keep you on the edge of your seat.",
    thumbnail:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/the+rookie.jpg",
    backdropImage:
      "https://firestories.s3.ap-south-1.amazonaws.com/netflix-images/the+rookie.jpg",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 15,
    genre: ["Thriller", "Action"],
    year: 2023,
    rating: "R",
    cast: ["Demo Actor 3", "Demo Actor 4"],
    director: "Demo Director 2",
    type: "movie",
  },
];

export const CONTENT_ROWS = [
  {
    title: "Popular mobile games for you",
    items: [DEMO_CONTENT[0], DEMO_CONTENT[1], DEMO_CONTENT[2], DEMO_CONTENT[3]],
  },
  {
    title: "Trending Now",
    items: [DEMO_CONTENT[4], DEMO_CONTENT[5], DEMO_CONTENT[6], DEMO_CONTENT[7]],
  },
  {
    title: "Action & Adventure",
    items: [DEMO_CONTENT[8], DEMO_CONTENT[3], DEMO_CONTENT[5], DEMO_CONTENT[2]],
  },
  {
    title: "Animation",
    items: [DEMO_CONTENT[6], DEMO_CONTENT[7], DEMO_CONTENT[8], DEMO_CONTENT[9]],
  },
  {
    title: "Sci-Fi Movies",
    items: [DEMO_CONTENT[1], DEMO_CONTENT[3], DEMO_CONTENT[5], DEMO_CONTENT[7]],
  },
  {
    title: "Recently Added",
    items: [DEMO_CONTENT[4], DEMO_CONTENT[6], DEMO_CONTENT[8], DEMO_CONTENT[2]],
  },
];

export const getFeaturedContent = (): Content => {
  return DEMO_CONTENT.find((c) => c.featured) || DEMO_CONTENT[0];
};

export const getContentById = (id: string): Content | null => {
  return DEMO_CONTENT.find((c) => c.id === id) || null;
};
