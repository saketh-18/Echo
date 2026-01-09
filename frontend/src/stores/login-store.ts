import { create } from "zustand";
import { persist } from "zustand/middleware";

interface loginState {
  isLoggedIn: boolean;
  setIsLoggedIn: (arg: boolean) => void;
}

export const LoginStore = create<loginState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    }),
    {
      name: "login-store",
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    }
  )
);
