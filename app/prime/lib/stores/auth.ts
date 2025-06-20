import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PrimeUser {
  id: number;
  name: string;
  avatar: string;
  email?: string;
  bio?: string;
  location?: string;
  isOnline?: boolean;
  status?: string;
  friends?: PrimeFriend[];
  campfires?: PrimeCampfire[];
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

interface AuthState {
  user: PrimeUser | null;
  isLoggedIn: boolean;
  setUser: (user: PrimeUser | null) => void;
  updateUserData: (userData: Partial<PrimeUser>) => void;
  logout: () => void;
}

export const usePrimeAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user: PrimeUser | null) => {
        set({
          user,
          isLoggedIn: !!user,
        });
      },

      updateUserData: (userData: Partial<PrimeUser>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
        });
        // Clear localStorage
        localStorage.removeItem("prime-user");
      },
    }),
    {
      name: "prime-auth",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
