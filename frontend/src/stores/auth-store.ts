import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  username: string;
  isLoggedIn: boolean;
  setUsername: (u: string) => void;
  setIsLoggedIn: (v: boolean) => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      username: "",
      isLoggedIn: false,
      setUsername: (username) => set({ username }),
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    }),
    {
      name: "auth-storage",
      // Only run on client
      skipHydration: typeof window === "undefined",
    }
  )
);
