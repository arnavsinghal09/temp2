import type {
  NetflixUser,
  NetflixFriend,
  NetflixCampfire,
} from "../stores/auth";

// Interface for FireStories User (matches the main app structure)
interface FireStoriesUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  isOnline: boolean;
  lastSeen: string;
  status: string;
  currentShow?: string;
  campfires: number[];
}

// Interface for FireStories Campfire
interface FireStoriesCampfire {
  id: number;
  name: string;
  members: string[];
  memberIds: number[];
  avatar: string;
  lastActivity: string;
  messageCount: number;
  clipCount: number;
  isActive: boolean;
}

export class NetflixUserDataService {
  // Get all users from FireStories localStorage
  private static getFireStoriesUsers(): FireStoriesUser[] {
    try {
      const users = localStorage.getItem("firetv_users");
      if (users) {
        return JSON.parse(users);
      }
      // Fallback to hardcoded users if localStorage is empty
      return this.getFallbackUsers();
    } catch (error) {
      console.error("Error reading FireStories users:", error);
      return this.getFallbackUsers();
    }
  }

  // Get all campfires from FireStories
  private static getFireStoriesCampfires(): FireStoriesCampfire[] {
    // Since campfires are not stored in localStorage, use the hardcoded ones
    return [
      {
        id: 1,
        name: "Movie Night Squad",
        members: ["Ashu Sharma", "Aryav Gupta", "Divya Sharma"],
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
        members: ["Ashu Sharma", "Arnav Nigam"],
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
        members: ["Aryav Gupta", "Arnav Nigam"],
        memberIds: [2, 3],
        avatar: "/placeholder.svg?height=60&width=60",
        lastActivity: "3 hours ago",
        messageCount: 31,
        clipCount: 15,
        isActive: false,
      },
    ];
  }

  // Fallback users if localStorage fails
  private static getFallbackUsers(): FireStoriesUser[] {
    return [
      {
        id: 1,
        name: "Ashu Sharma",
        email: "ashu@example.com",
        avatar: "/placeholder.svg?height=50&width=50",
        bio: "Horror movie enthusiast and thriller lover",
        location: "Mumbai, India",
        isOnline: true,
        lastSeen: "Online",
        status: "Watching Netflix",
        currentShow: "Stranger Things",
        campfires: [1, 2],
      },
      {
        id: 2,
        name: "Aryav Gupta",
        email: "aryav@example.com",
        avatar: "/placeholder.svg?height=50&width=50",
        bio: "Comedy series addict and documentary lover",
        location: "Delhi, India",
        isOnline: true,
        lastSeen: "Online",
        status: "Watching Prime Video",
        currentShow: "The Boys",
        campfires: [1, 3],
      },
      {
        id: 3,
        name: "Arnav Nigam",
        email: "arnav@example.com",
        avatar: "/placeholder.svg?height=50&width=50",
        bio: "Sci-fi geek and action movie buff",
        location: "Bangalore, India",
        isOnline: true,
        lastSeen: "Online",
        status: "Available",
        campfires: [2, 3],
      },
      {
        id: 4,
        name: "Divya Sharma",
        email: "divya@example.com",
        avatar: "/placeholder.svg?height=50&width=50",
        bio: "Romance drama fan and K-drama enthusiast",
        location: "Chennai, India",
        isOnline: false,
        lastSeen: "2 hours ago",
        status: "Offline",
        campfires: [1],
      },
    ];
  }

  // Get friends for a specific user (all other users)
  static getUserFriends(userId: number): NetflixFriend[] {
    const allUsers = this.getFireStoriesUsers();
    return allUsers
      .filter((user) => user.id !== userId)
      .map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isOnline: user.isOnline,
        status: user.status,
      }));
  }

  // Get campfires for a specific user
  static getUserCampfires(userId: number): NetflixCampfire[] {
    const user = this.getFireStoriesUsers().find((u) => u.id === userId);
    if (!user || !user.campfires) return [];

    const allCampfires = this.getFireStoriesCampfires();
    return allCampfires
      .filter((campfire) => user.campfires.includes(campfire.id))
      .map((campfire) => ({
        id: campfire.id,
        name: campfire.name,
        avatar: campfire.avatar,
        members: campfire.members,
        memberCount: campfire.members.length,
      }));
  }

  // Get complete user data for Netflix
  static getNetflixUserData(userId: number): NetflixUser | null {
    const users = this.getFireStoriesUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) return null;

    const friends = this.getUserFriends(userId);
    const campfires = this.getUserCampfires(userId);

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      friends,
      campfires,
    };
  }

  // Initialize user data from FireStories localStorage
  static initializeFromFireStories(): NetflixUser | null {
    try {
      const netflixUserData = localStorage.getItem("netflix-user");
      if (!netflixUserData) return null;

      const basicUserData = JSON.parse(netflixUserData);
      const completeUserData = this.getNetflixUserData(basicUserData.id);

      console.log("Netflix user data initialized:", completeUserData);
      return completeUserData;
    } catch (error) {
      console.error("Error initializing Netflix user data:", error);
      return null;
    }
  }
}
