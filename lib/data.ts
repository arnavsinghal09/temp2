import { Trophy, Crown, Flame, TrendingUp } from "lucide-react";
import type {
  HeroContent,
  StreamingService,
  ContentRow,
  Campfire,
  Clip,
  TopSharer,
  WeeklyDigestUser,
  Achievement,
  Notification,
  Friend,
  FriendRequest,
  CampfireChat,
  FriendChat,
} from "./types";

export const heroContent: HeroContent[] = [
  {
    id: 1,
    title: "Outer Range",
    subtitle: "WATCH NOW | prime video",
    background: "/placeholder.svg?height=400&width=800",
    description:
      "A rancher fighting for his land and family discovers an unfathomable mystery at the edge of Wyoming's wilderness.",
    platform: "Prime Video",
    type: "Amazon Original",
  },
  {
    id: 2,
    title: "The Boys",
    subtitle: "WATCH NOW | prime video",
    background: "/placeholder.svg?height=400&width=800",
    description:
      "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
    platform: "Prime Video",
    type: "Amazon Original",
  },
  {
    id: 3,
    title: "Stranger Things",
    subtitle: "WATCH NOW | netflix",
    background: "/placeholder.svg?height=400&width=800",
    description:
      "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    platform: "Netflix",
    type: "Netflix Original",
  },
];

export const streamingServices: StreamingService[] = [
  {
    id: 1,
    name: "Netflix",
    shortName: "Netflix",
    image: "hello",
    redirectUrl: "/netflix",
  },
  {
    id: 2,
    name: "Prime Video",
    shortName: "Prime",
    image: "temp",
    redirectUrl: "/prime",
  },
  { id: 3, name: "Freevee", shortName: "Freevee" },
  { id: 4, name: "YouTube", shortName: "YouTube" },
  { id: 5, name: "Disney+", shortName: "Disney+" },
  { id: 6, name: "Hulu", shortName: "Hulu" },
];

export const contentRows: ContentRow[] = [
  {
    id: 1,
    title: "Amazon Originals",
    items: [
      {
        id: 1,
        title: "The Wilds",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Prime Video",
      },
      {
        id: 2,
        title: "Outlander",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Starz",
      },
      {
        id: 3,
        title: "Horror Movie",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Prime Video",
      },
      {
        id: 4,
        title: "Yellowjackets",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Showtime",
      },
      {
        id: 5,
        title: "Baywatch",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Pluto TV",
      },
      {
        id: 6,
        title: "Reacher",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Prime Video",
      },
      {
        id: 7,
        title: "The Marvelous Mrs. Maisel",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Prime Video",
      },
      {
        id: 8,
        title: "Bosch",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Prime Video",
      },
    ],
  },
  {
    id: 2,
    title: "Continue Watching",
    items: [
      {
        id: 7,
        title: "Bel Air",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Peacock",
        progress: 65,
      },
      {
        id: 8,
        title: "10 Truths About Love",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Tubi",
        progress: 23,
      },
      {
        id: 9,
        title: "Friday Night SmackDown",
        image: "/placeholder.svg?height=200&width=140",
        platform: "FOX",
        progress: 89,
      },
      {
        id: 10,
        title: "Girls5eva",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Peacock",
        progress: 45,
      },
      {
        id: 11,
        title: "Star Trek Discovery",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Paramount+",
        progress: 78,
      },
      {
        id: 12,
        title: "The Office",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Peacock",
        progress: 34,
      },
    ],
  },
  {
    id: 3,
    title: "Trending Now",
    items: [
      {
        id: 12,
        title: "Wednesday",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Netflix",
      },
      {
        id: 13,
        title: "House of the Dragon",
        image: "/placeholder.svg?height=200&width=140",
        platform: "HBO Max",
      },
      {
        id: 14,
        title: "The Bear",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Hulu",
      },
      {
        id: 15,
        title: "Andor",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Disney+",
      },
      {
        id: 16,
        title: "The Crown",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Netflix",
      },
      {
        id: 17,
        title: "Euphoria",
        image: "/placeholder.svg?height=200&width=140",
        platform: "HBO Max",
      },
      {
        id: 18,
        title: "Ozark",
        image: "/placeholder.svg?height=200&width=140",
        platform: "Netflix",
      },
    ],
  },
];

// Updated campfires with specific member associations
export const ALL_CAMPFIRES: Campfire[] = [
  {
    id: 1,
    name: "Movie Night Squad",
    members: ["Ashu Sharma", "Aryav Gupta", "Divya Sharma"], // Users 1, 2, 4
    memberIds: [1, 2, 4],
    avatar: "/placeholder.svg?height=60&width=60",
    lastActivity: "2 min ago",
    messageCount: 47,
    clipCount: 12,
    isActive: true,
  },
  {
    id: 2,
    name: "Binge Busters",
    members: ["Ashu Sharma", "Arnav Nigam"], // Users 1, 3
    memberIds: [1, 3],
    avatar: "/placeholder.svg?height=60&width=60",
    lastActivity: "1 hour ago",
    messageCount: 23,
    clipCount: 8,
    isActive: true,
  },
  {
    id: 3,
    name: "Weekend Warriors",
    members: ["Aryav Gupta", "Arnav Nigam"], // Users 2, 3
    memberIds: [2, 3],
    avatar: "/placeholder.svg?height=60&width=60",
    lastActivity: "3 hours ago",
    messageCount: 31,
    clipCount: 15,
    isActive: false,
  },
];

// Function to get campfires for a specific user
export const getCampfiresForUser = (userId: number): Campfire[] => {
  return ALL_CAMPFIRES.filter((campfire) =>
    campfire.memberIds.includes(userId)
  );
};

// Updated clips to reflect new user names
export const mostSharedClips: Clip[] = [
  {
    id: 1,
    title: "Breaking Bad - Final Scene",
    platform: "Netflix",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "0:45",
    views: 1247,
    likes: 89,
    shares: 23,
    sharedBy: "Ashu Sharma",
    timestamp: "2 hours ago",
    campfire: "Movie Night Squad",
  },
  {
    id: 2,
    title: "Stranger Things - Upside Down",
    platform: "Netflix",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "0:32",
    views: 892,
    likes: 67,
    shares: 18,
    sharedBy: "Aryav Gupta",
    timestamp: "5 hours ago",
    campfire: "Binge Busters",
  },
  {
    id: 3,
    title: "The Office - Jim's Pranks",
    platform: "Prime Video",
    thumbnail: "/placeholder.svg?height=120&width=200",
    duration: "0:28",
    views: 654,
    likes: 45,
    shares: 12,
    sharedBy: "Arnav Nigam",
    timestamp: "1 day ago",
    campfire: "Weekend Warriors",
  },
];

// Updated top sharers with new user names
export const topSharers: TopSharer[] = [
  {
    id: 1,
    name: "Ashu Sharma",
    clips: 47,
    badge: "Clip Champ",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 1,
  },
  {
    id: 2,
    name: "Aryav Gupta",
    clips: 32,
    badge: "Trendsetter",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 2,
  },
  {
    id: 3,
    name: "Arnav Nigam",
    clips: 28,
    badge: "ClipMaster",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 3,
  },
  {
    id: 4,
    name: "Divya Sharma",
    clips: 19,
    badge: "Rising Star",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 4,
  },
];

// Updated weekly digest with new user names
export const weeklyDigest: WeeklyDigestUser[] = [
  {
    id: 1,
    name: "Ashu Sharma",
    views: 2847,
    engagement: "94%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Aryav Gupta",
    views: 2103,
    engagement: "87%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Arnav Nigam",
    views: 1756,
    engagement: "82%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export const achievements: Achievement[] = [
  {
    id: 1,
    name: "ClipMaster",
    description: "Share 10+ clips",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    id: 2,
    name: "Trendsetter",
    description: "80%+ clan views",
    icon: TrendingUp,
    color: "text-[#ff6404]",
  },
  {
    id: 3,
    name: "Clip Champ",
    description: "Weekly top sharer",
    icon: Crown,
    color: "text-purple-400",
  },
  {
    id: 4,
    name: "Viral Creator",
    description: "1000+ views on clip",
    icon: Flame,
    color: "text-red-400",
  },
];

// Updated notifications with new user names
export const notifications: Notification[] = [
  {
    id: 1,
    type: "clip",
    sender: "Ashu Sharma",
    message: "shared a clip with you!",
    timestamp: "2 min ago",
    campfire: "Movie Night Squad",
    isNew: true,
  },
  {
    id: 2,
    type: "achievement",
    sender: "System",
    message: "You earned the 'ClipMaster' badge!",
    timestamp: "1 hour ago",
    campfire: "",
    isNew: true,
  },
];

// Updated friends data - now returns all other users as friends
export const onlineFriends: Friend[] = [
  {
    id: 1,
    name: "Ashu Sharma",
    status: "Watching Netflix",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: true,
    currentShow: "Stranger Things",
  },
  {
    id: 2,
    name: "Aryav Gupta",
    status: "Watching Prime Video",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: true,
    currentShow: "The Boys",
  },
  {
    id: 3,
    name: "Arnav Nigam",
    status: "Available",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: true,
    currentShow: null,
  },
];

export const allFriends: Friend[] = [
  ...onlineFriends,
  {
    id: 4,
    name: "Divya Sharma",
    status: "Offline",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: false,
    currentShow: null,
  },
];

export const friendRequests: FriendRequest[] = [
  {
    id: 1,
    name: "New User 1",
    mutualFriends: 2,
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "New User 2",
    mutualFriends: 1,
    avatar: "/placeholder.svg?height=50&width=50",
  },
];

// Updated campfire chats with new user names and campfire associations
export const campfireChats: CampfireChat[] = [
  {
    campfireId: 1, // Movie Night Squad - Ashu, Aryav, Divya
    messages: [
      {
        id: 1,
        type: "system",
        sender: "System",
        content: 'Ashu Sharma created the campfire "Movie Night Squad"',
        timestamp: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "Ashu Sharma",
        content: "Hey everyone! Ready for tonight's movie marathon? 🍿",
        timestamp: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "clip",
        sender: "Aryav Gupta",
        content: "Check out this epic scene from Breaking Bad!",
        timestamp: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
        clipData: {
          title: "Breaking Bad - Final Scene",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "0:45",
          platform: "Netflix",
        },
      },
      {
        id: 4,
        type: "text",
        sender: "Divya Sharma",
        content:
          "That Breaking Bad scene gave me chills! Walter White is such a complex character 😱",
        timestamp: "16 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    campfireId: 2, // Binge Busters - Ashu, Arnav
    messages: [
      {
        id: 1,
        type: "system",
        sender: "System",
        content: 'Ashu Sharma created the campfire "Binge Busters"',
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "Ashu Sharma",
        content: "Welcome to the ultimate binge-watching crew! 📺",
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "clip",
        sender: "Arnav Nigam",
        content: "The Boys season finale was insane!",
        timestamp: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        clipData: {
          title: "The Boys - Epic Fight Scene",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "1:12",
          platform: "Prime Video",
        },
      },
    ],
  },
  {
    campfireId: 3, // Weekend Warriors - Aryav, Arnav
    messages: [
      {
        id: 1,
        type: "system",
        sender: "System",
        content: 'Aryav Gupta created the campfire "Weekend Warriors"',
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "Aryav Gupta",
        content: "Weekend movie marathons start here! Who's ready? 🎉",
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "text",
        sender: "Arnav Nigam",
        content: "Count me in! What are we watching first?",
        timestamp: "6 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
];

// Updated friend chats with new user names
export const friendChats: FriendChat[] = [
  {
    friendId: 1, // Ashu Sharma
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Ashu Sharma",
        content: "Hey! Did you watch the new episode of Stranger Things?",
        timestamp: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "You",
        content: "Not yet! No spoilers please 🙈",
        timestamp: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    friendId: 2, // Aryav Gupta
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Aryav Gupta",
        content: "Have you seen The Boys yet? It's amazing!",
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "You",
        content: "Yes! I'm halfway through season 2. Homelander is terrifying!",
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    friendId: 3, // Arnav Nigam
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Arnav Nigam",
        content: "Did you see the new trailer for that sci-fi movie?",
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "You",
        content: "Not yet, send it over!",
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    friendId: 4, // Divya Sharma
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Divya Sharma",
        content: "Hey! Want to join our movie night this weekend?",
        timestamp: "4 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "You",
        content: "What are you watching?",
        timestamp: "4 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
];
