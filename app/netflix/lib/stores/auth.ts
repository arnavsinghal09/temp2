import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  avatar: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user: User | null) => {
        set({
          user,
          isLoggedIn: !!user,
        });
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
