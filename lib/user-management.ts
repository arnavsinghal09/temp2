export interface User {
  id: number
  name: string
  email: string
  avatar: string
  bio: string
  location: string
  isOnline: boolean
  lastSeen: string
  status: string
  currentShow?: string
}

export interface UserCredentials {
  email: string
  password: string
  userId: number
}

// Hardcoded dummy users - these match the existing frontend data
export const DUMMY_USERS: User[] = [
  {
    id: 1,
    name: "Arnav Kumar",
    email: "arnav@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Movie enthusiast and binge-watcher",
    location: "Mumbai, India",
    isOnline: true,
    lastSeen: "Online",
    status: "Watching Netflix",
    currentShow: "Stranger Things",
  },
  {
    id: 2,
    name: "Divya Sharma",
    email: "divya@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "TV series addict and film critic",
    location: "Delhi, India",
    isOnline: true,
    lastSeen: "Online",
    status: "Watching Prime Video",
    currentShow: "The Boys",
  },
  {
    id: 3,
    name: "Rahul Patel",
    email: "rahul@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Comedy lover and weekend warrior",
    location: "Bangalore, India",
    isOnline: true,
    lastSeen: "Online",
    status: "Available",
  },
  {
    id: 4,
    name: "Priya Singh",
    email: "priya@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Horror movie fan and thriller enthusiast",
    location: "Chennai, India",
    isOnline: false,
    lastSeen: "2 hours ago",
    status: "Offline",
  },
  {
    id: 5,
    name: "Karan Mehta",
    email: "karan@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Documentary lover and sci-fi geek",
    location: "Pune, India",
    isOnline: false,
    lastSeen: "1 day ago",
    status: "Offline",
  },
  {
    id: 6,
    name: "Sanya Gupta",
    email: "sanya@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Anime enthusiast and K-drama fan",
    location: "Hyderabad, India",
    isOnline: false,
    lastSeen: "3 hours ago",
    status: "Away",
  },
  {
    id: 7,
    name: "Vikram Joshi",
    email: "vikram@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Action movie buff and sports fan",
    location: "Kolkata, India",
    isOnline: true,
    lastSeen: "Online",
    status: "Watching Disney+",
    currentShow: "Marvel Movies",
  },
  {
    id: 8,
    name: "Neha Agarwal",
    email: "neha@example.com",
    avatar: "/placeholder.svg?height=50&width=50",
    bio: "Romance drama lover and music enthusiast",
    location: "Jaipur, India",
    isOnline: true,
    lastSeen: "Online",
    status: "Listening to music",
  },
]

// Dummy credentials for login
export const DUMMY_CREDENTIALS: UserCredentials[] = [
  { email: "arnav@example.com", password: "password123", userId: 1 },
  { email: "divya@example.com", password: "password123", userId: 2 },
  { email: "rahul@example.com", password: "password123", userId: 3 },
  { email: "priya@example.com", password: "password123", userId: 4 },
  { email: "karan@example.com", password: "password123", userId: 5 },
  { email: "sanya@example.com", password: "password123", userId: 6 },
  { email: "vikram@example.com", password: "password123", userId: 7 },
  { email: "neha@example.com", password: "password123", userId: 8 },
]

const CURRENT_USER_KEY = "firetv_current_user"
const USERS_KEY = "firetv_users"

export class UserManager {
  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY)
      if (stored) {
        const userId = JSON.parse(stored)
        return this.getUserById(userId)
      }
      return null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  static setCurrentUser(userId: number): void {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userId))
      // Update user's online status
      this.updateUserStatus(userId, { isOnline: true, lastSeen: "Online" })
    } catch (error) {
      console.error("Error setting current user:", error)
    }
  }

  static logout(): void {
    try {
      const currentUser = this.getCurrentUser()
      if (currentUser) {
        // Set user offline
        this.updateUserStatus(currentUser.id, { isOnline: false, lastSeen: new Date().toLocaleString() })
      }
      localStorage.removeItem(CURRENT_USER_KEY)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  static getAllUsers(): User[] {
    try {
      const stored = localStorage.getItem(USERS_KEY)
      if (stored) {
        return JSON.parse(stored)
      } else {
        // Initialize with dummy users
        this.saveAllUsers(DUMMY_USERS)
        return DUMMY_USERS
      }
    } catch (error) {
      console.error("Error getting all users:", error)
      return DUMMY_USERS
    }
  }

  static saveAllUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users:", error)
    }
  }

  static getUserById(userId: number): User | null {
    const users = this.getAllUsers()
    return users.find((user) => user.id === userId) || null
  }

  static updateUserStatus(userId: number, updates: Partial<User>): void {
    const users = this.getAllUsers()
    const userIndex = users.findIndex((user) => user.id === userId)
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...updates }
      this.saveAllUsers(users)
    }
  }

  static authenticateUser(email: string, password: string): User | null {
    const credentials = DUMMY_CREDENTIALS.find((cred) => cred.email === email && cred.password === password)
    if (credentials) {
      const user = this.getUserById(credentials.userId)
      if (user) {
        this.setCurrentUser(user.id)
        return user
      }
    }
    return null
  }

  static getFriendsForUser(userId: number): User[] {
    // For demo purposes, return all other users as friends
    const allUsers = this.getAllUsers()
    return allUsers.filter((user) => user.id !== userId)
  }

  static getOnlineFriendsForUser(userId: number): User[] {
    return this.getFriendsForUser(userId).filter((user) => user.isOnline)
  }
}
