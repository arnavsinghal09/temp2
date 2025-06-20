import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NetflixUser {
  id: number;
  name: string;
  avatar: string;
  email?: string;
  friends?: NetflixFriend[];
  campfires?: NetflixCampfire[];
}

export interface NetflixFriend {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  status: string;
}

export interface NetflixCampfire {
  id: number;
  name: string;
  avatar: string;
  members: string[];
  memberCount: number;
}

interface AuthState {
  user: NetflixUser | null;
  isLoggedIn: boolean;
  setUser: (user: NetflixUser | null) => void;
  updateUserData: (userData: Partial<NetflixUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user: NetflixUser | null) => {
        set({
          user,
          isLoggedIn: !!user,
        });
      },

      updateUserData: (userData: Partial<NetflixUser>) => {
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
      },
    }),
    {
      name: "netflix-auth",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
