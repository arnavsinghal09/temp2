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

export const mostContactedCampfires: Campfire[] = [
  {
    id: 1,
    name: "Movie Night Squad",
    members: ["Arnav", "Divya", "Rahul", "Priya"],
    avatar: "/placeholder.svg?height=60&width=60",
    lastActivity: "2 min ago",
    messageCount: 47,
    clipCount: 12,
    isActive: true,
  },
  {
    id: 2,
    name: "Binge Watchers",
    members: ["Arnav", "Divya", "Karan"],
    avatar: "/placeholder.svg?height=60&width=60",
    lastActivity: "1 hour ago",
    messageCount: 23,
    clipCount: 8,
    isActive: true,
  },
  {
    id: 3,
    name: "Weekend Warriors",
    members: ["Arnav", "Divya", "Sanya", "Vikram", "Neha"],
    avatar: "/placeholder.svg?height=60&width=60",
    lastActivity: "3 hours ago",
    messageCount: 31,
    clipCount: 15,
    isActive: false,
  },
];

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
    sharedBy: "Arnav",
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
    sharedBy: "Divya",
    timestamp: "5 hours ago",
    campfire: "Binge Watchers",
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
    sharedBy: "Rahul",
    timestamp: "1 day ago",
    campfire: "Weekend Warriors",
  },
];

export const topSharers: TopSharer[] = [
  {
    id: 1,
    name: "Arnav",
    clips: 47,
    badge: "Clip Champ",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 1,
  },
  {
    id: 2,
    name: "Divya",
    clips: 32,
    badge: "Trendsetter",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 2,
  },
  {
    id: 3,
    name: "Rahul",
    clips: 28,
    badge: "ClipMaster",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 3,
  },
  {
    id: 4,
    name: "Priya",
    clips: 19,
    badge: "Rising Star",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 4,
  },
];

export const weeklyDigest: WeeklyDigestUser[] = [
  {
    id: 1,
    name: "Sanya",
    views: 2847,
    engagement: "94%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Vikram",
    views: 2103,
    engagement: "87%",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Neha",
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

export const notifications: Notification[] = [
  {
    id: 1,
    type: "clip",
    sender: "Arnav",
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

export const onlineFriends: Friend[] = [
  {
    id: 1,
    name: "Arnav",
    status: "Watching Netflix",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: true,
    currentShow: "Stranger Things",
  },
  {
    id: 2,
    name: "Divya",
    status: "Watching Prime Video",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: true,
    currentShow: "The Boys",
  },
  {
    id: 3,
    name: "Rahul",
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
    name: "Priya",
    status: "Offline",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: false,
    currentShow: null,
  },
  {
    id: 5,
    name: "Karan",
    status: "Offline",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: false,
    currentShow: null,
  },
  {
    id: 6,
    name: "Sanya",
    status: "Away",
    avatar: "/placeholder.svg?height=50&width=50",
    isOnline: false,
    currentShow: null,
  },
];

export const friendRequests: FriendRequest[] = [
  {
    id: 1,
    name: "Vikram",
    mutualFriends: 3,
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Neha",
    mutualFriends: 1,
    avatar: "/placeholder.svg?height=50&width=50",
  },
];

export const campfireChats: CampfireChat[] = [
  {
    campfireId: 1,
    messages: [
      {
        id: 1,
        type: "system",
        sender: "System",
        content: 'Arnav created the campfire "Movie Night Squad"',
        timestamp: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "Arnav",
        content: "Hey everyone! Ready for tonight's movie marathon? 🍿",
        timestamp: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "clip",
        sender: "Divya",
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
        type: "voice",
        sender: "Rahul",
        content: "Voice message",
        timestamp: "18 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
        voiceData: {
          duration: "0:23",
          waveform: [
            0.2, 0.5, 0.8, 0.3, 0.7, 0.4, 0.9, 0.1, 0.6, 0.8, 0.2, 0.5,
          ],
        },
      },
      {
        id: 5,
        type: "text",
        sender: "Priya",
        content:
          "That Breaking Bad scene gave me chills! Walter White is such a complex character 😱",
        timestamp: "16 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 6,
        type: "image",
        sender: "Arnav",
        content: "Movie night setup ready! 🎬",
        timestamp: "12 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
        imageData: {
          url: "/placeholder.svg?height=300&width=400",
          caption: "Cozy movie night setup with popcorn and drinks",
        },
      },
      {
        id: 7,
        type: "clip",
        sender: "Divya",
        content: "This Stranger Things scene is so intense!",
        timestamp: "8 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
        clipData: {
          title: "Stranger Things - Upside Down",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "0:32",
          platform: "Netflix",
        },
      },
      {
        id: 8,
        type: "text",
        sender: "Rahul",
        content:
          "Can we watch The Office next? I need some comedy after all this drama 😂",
        timestamp: "6 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 9,
        type: "voice",
        sender: "Priya",
        content: "Voice message",
        timestamp: "4 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
        voiceData: {
          duration: "0:15",
          waveform: [0.3, 0.6, 0.4, 0.8, 0.2, 0.7, 0.5, 0.9, 0.1, 0.6],
        },
      },
      {
        id: 10,
        type: "text",
        sender: "Arnav",
        content: "Great idea! The Office it is. Jim's pranks never get old 🤣",
        timestamp: "2 hours ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    campfireId: 2,
    messages: [
      {
        id: 1,
        type: "system",
        sender: "System",
        content: 'Divya created the campfire "Binge Watchers"',
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "Divya",
        content: "Welcome to the ultimate binge-watching crew! 📺",
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "clip",
        sender: "Karan",
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
      {
        id: 4,
        type: "text",
        sender: "Arnav",
        content: "Homelander is terrifying but such a well-written villain!",
        timestamp: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 5,
        type: "voice",
        sender: "Divya",
        content: "Voice message",
        timestamp: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
        voiceData: {
          duration: "0:28",
          waveform: [
            0.4, 0.7, 0.3, 0.8, 0.5, 0.9, 0.2, 0.6, 0.4, 0.8, 0.3, 0.7,
          ],
        },
      },
    ],
  },
  {
    campfireId: 3,
    messages: [
      {
        id: 1,
        type: "system",
        sender: "System",
        content: 'Sanya created the campfire "Weekend Warriors"',
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "Sanya",
        content: "Weekend movie marathons start here! Who's ready? 🎉",
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "text",
        sender: "Vikram",
        content: "Count me in! What are we watching first?",
        timestamp: "6 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 4,
        type: "clip",
        sender: "Neha",
        content: "This Marvel scene is everything!",
        timestamp: "5 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        clipData: {
          title: "Avengers - Epic Battle",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "2:15",
          platform: "Disney+",
        },
      },
    ],
  },
];

export const friendChats: FriendChat[] = [
  {
    friendId: 1,
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Arnav",
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
      {
        id: 3,
        type: "voice",
        sender: "Arnav",
        content: "Voice message",
        timestamp: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
        voiceData: {
          duration: "0:18",
          waveform: [
            0.3, 0.5, 0.7, 0.4, 0.6, 0.8, 0.3, 0.9, 0.5, 0.2, 0.7, 0.4,
          ],
        },
      },
      {
        id: 4,
        type: "text",
        sender: "You",
        content: "I'll watch it tonight and let you know what I think!",
        timestamp: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    friendId: 2,
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Divya",
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
      {
        id: 3,
        type: "clip",
        sender: "Divya",
        content: "This scene had me on the edge of my seat!",
        timestamp: "2 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        clipData: {
          title: "The Boys - Shocking Moment",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "0:42",
          platform: "Prime Video",
        },
      },
      {
        id: 4,
        type: "image",
        sender: "You",
        content: "Check out my watch party setup!",
        timestamp: "1 day ago",
        avatar: "/placeholder.svg?height=40&width=40",
        imageData: {
          url: "/placeholder.svg?height=300&width=400",
          caption: "Ready for The Boys marathon",
        },
      },
    ],
  },
  {
    friendId: 3,
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Rahul",
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
      {
        id: 3,
        type: "clip",
        sender: "Rahul",
        content: "Here you go, looks amazing!",
        timestamp: "6 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        clipData: {
          title: "Sci-Fi Movie Trailer",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "1:45",
          platform: "YouTube",
        },
      },
      {
        id: 4,
        type: "voice",
        sender: "You",
        content: "Voice message",
        timestamp: "5 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        voiceData: {
          duration: "0:12",
          waveform: [0.2, 0.6, 0.3, 0.8, 0.4, 0.7, 0.5, 0.9, 0.3, 0.6],
        },
      },
    ],
  },
  {
    friendId: 4,
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Priya",
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
      {
        id: 3,
        type: "text",
        sender: "Priya",
        content:
          "We're thinking of a horror movie marathon - The Conjuring series!",
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 4,
        type: "text",
        sender: "You",
        content: "Sounds great! I'll bring snacks 🍿",
        timestamp: "3 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    friendId: 5,
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Karan",
        content: "Have you started watching that new documentary series?",
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "You",
        content: "Not yet, is it good?",
        timestamp: "1 week ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "text",
        sender: "Karan",
        content:
          "It's amazing! Very eye-opening. Let me know when you start it.",
        timestamp: "6 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    friendId: 6,
    messages: [
      {
        id: 1,
        type: "text",
        sender: "Sanya",
        content: "Did you finish Stranger Things yet?",
        timestamp: "5 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        type: "text",
        sender: "You",
        content: "Almost done with the latest season! It's so good!",
        timestamp: "5 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        type: "image",
        sender: "Sanya",
        content: "Look what I got!",
        timestamp: "4 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
        imageData: {
          url: "/placeholder.svg?height=300&width=400",
          caption: "Stranger Things merchandise",
        },
      },
      {
        id: 4,
        type: "text",
        sender: "You",
        content: "That's awesome! Where did you get it?",
        timestamp: "4 days ago",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
];
