import type { User } from "@/lib/user-management";

// Interface for Prime Video User (matches the FireStories structure)
export interface PrimeUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  isOnline: boolean;
  status: string;
  friends: PrimeFriend[];
  campfires: PrimeCampfire[];
}

export interface PrimeFriend {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  status: string;
}

export interface PrimeCampfire {
  id: number;
  name: string;
  avatar: string;
  members: string[];
  memberCount: number;
}

export class PrimeUserDataService {
  // Get all users from FireStories localStorage
  private static getFireStoriesUsers(): User[] {
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

  // Fallback users if localStorage fails
  private static getFallbackUsers(): User[] {
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
        status: "Watching Prime Video",
        currentShow: "The Boys",
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
        currentShow: "The Marvelous Mrs. Maisel",
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
  static getUserFriends(userId: number): PrimeFriend[] {
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
  static getUserCampfires(userId: number): PrimeCampfire[] {
    const user = this.getFireStoriesUsers().find((u) => u.id === userId);
    if (!user || !user.campfires) return [];

    const campfireNames: { [key: number]: string } = {
      1: "Movie Night Squad",
      2: "Binge Busters", 
      3: "Weekend Warriors",
    };

    const campfireMembers: { [key: number]: string[] } = {
      1: ["Ashu Sharma", "Aryav Gupta", "Divya Sharma"],
      2: ["Ashu Sharma", "Arnav Nigam"],
      3: ["Aryav Gupta", "Arnav Nigam"],
    };

    return user.campfires.map((campfireId) => ({
      id: campfireId,
      name: campfireNames[campfireId] || `Campfire ${campfireId}`,
      avatar: "/placeholder.svg?height=60&width=60",
      members: campfireMembers[campfireId] || [],
      memberCount: campfireMembers[campfireId]?.length || 0,
    }));
  }

  // Get complete user data for Prime Video
  static getPrimeUserData(userId: number): PrimeUser | null {
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
      bio: user.bio,
      location: user.location,
      isOnline: user.isOnline,
      status: user.status,
      friends,
      campfires,
    };
  }

  // Initialize user data from FireStories localStorage
  static initializeFromFireStories(): PrimeUser | null {
    try {
      const primeUserData = localStorage.getItem("prime-user");
      if (!primeUserData) return null;

      const basicUserData = JSON.parse(primeUserData);
      const completeUserData = this.getPrimeUserData(basicUserData.id);

      console.log("Prime user data initialized:", completeUserData);
      return completeUserData;
    } catch (error) {
      console.error("Error initializing Prime user data:", error);
      return null;
    }
  }
}
