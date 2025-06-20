export interface User {
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
  campfires: number[]; // Array of campfire IDs the user belongs to
}

export interface UserCredentials {
  email: string;
  password: string;
  userId: number;
}

// Updated dummy users - exactly 4 users as requested
export const DUMMY_USERS: User[] = [
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
    campfires: [1, 2], // Member of Movie Night Squad and Binge Busters
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
    campfires: [1, 3], // Member of Movie Night Squad and Weekend Warriors
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
    campfires: [2, 3], // Member of Binge Busters and Weekend Warriors
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
    campfires: [1], // Member of only Movie Night Squad
  },
];

// Updated credentials for the 4 users
export const DUMMY_CREDENTIALS: UserCredentials[] = [
  { email: "ashu@example.com", password: "password123", userId: 1 },
  { email: "aryav@example.com", password: "password123", userId: 2 },
  { email: "arnav@example.com", password: "password123", userId: 3 },
  { email: "divya@example.com", password: "password123", userId: 4 },
];

const CURRENT_USER_KEY = "firetv_current_user";
const USERS_KEY = "firetv_users";

export class UserManager {
  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const userId = JSON.parse(stored);
        return this.getUserById(userId);
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static setCurrentUser(userId: number): void {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userId));
      // Update user's online status
      this.updateUserStatus(userId, { isOnline: true, lastSeen: "Online" });
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  }

  static logout(): void {
    try {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        // Set user offline
        this.updateUserStatus(currentUser.id, {
          isOnline: false,
          lastSeen: new Date().toLocaleString(),
        });
      }
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  static getAllUsers(): User[] {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      } else {
        // Initialize with dummy users
        this.saveAllUsers(DUMMY_USERS);
        return DUMMY_USERS;
      }
    } catch (error) {
      console.error("Error getting all users:", error);
      return DUMMY_USERS;
    }
  }

  static saveAllUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  }

  static getUserById(userId: number): User | null {
    const users = this.getAllUsers();
    return users.find((user) => user.id === userId) || null;
  }

  static updateUserStatus(userId: number, updates: Partial<User>): void {
    const users = this.getAllUsers();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveAllUsers(users);
    }
  }

  static authenticateUser(email: string, password: string): User | null {
    const credentials = DUMMY_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === password
    );
    if (credentials) {
      const user = this.getUserById(credentials.userId);
      if (user) {
        this.setCurrentUser(user.id);
        return user;
      }
    }
    return null;
  }

  static getFriendsForUser(userId: number): User[] {
    // Get all users except the current user as friends
    const allUsers = this.getAllUsers();
    return allUsers.filter((user) => user.id !== userId);
  }

  static getOnlineFriendsForUser(userId: number): User[] {
    return this.getFriendsForUser(userId).filter((user) => user.isOnline);
  }

  // Get campfires that the user is a member of
  static getCampfiresForUser(userId: number): number[] {
    const user = this.getUserById(userId);
    return user?.campfires || [];
  }

  // Check if user is member of a specific campfire
  static isUserMemberOfCampfire(userId: number, campfireId: number): boolean {
    const user = this.getUserById(userId);
    return user?.campfires.includes(campfireId) || false;
  }
}
