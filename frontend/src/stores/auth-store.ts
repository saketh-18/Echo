import { create } from "zustand";

interface AuthState {
  username: string;
  isLoggedIn: boolean;
  setUsername: (u: string) => void;
  setIsLoggedIn: (v: boolean) => void;
}

export const authStore = create<AuthState>((set) => ({
  username: "",
  isLoggedIn: false,
  setUsername: (username) => set({ username }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));

