import { generateUsername } from "unique-username-generator";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface usernameState {
  username: string;
  setUsername: (arg: string) => void;
}

export const usernameStore = create<usernameState>()(
  persist(
    (set) => ({
      username: generateUsername(),
      setUsername: (username: string) => set({ username }),
    }),
    {
      name: "username-store",
      partialize: (state) => ({ username: state.username }),
    }
  )
);
