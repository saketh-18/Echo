import { create } from "zustand";

interface currentConnection {
  isActive: boolean;
  activeConnectionId: string;
  setActiveConnection: (arg: string) => void;
  clearActiveConnection: () => void;
  frndName: string;
  setFrndName: (name: string) => void;
}

export const activeConnectionStore = create<currentConnection>()((set) => ({
  isActive: false,
  activeConnectionId: "",
  setActiveConnection: (arg: string) =>
    set(() => ({ activeConnectionId: arg, isActive: true })),
  clearActiveConnection: () =>
    set(() => ({ activeConnectionId: "", isActive: false, frndName: "" })),
  frndName: "",
  setFrndName: (name: string) => set(() => ({ frndName: name })),
}));
