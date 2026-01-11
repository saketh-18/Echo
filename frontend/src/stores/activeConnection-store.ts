import { create } from "zustand";

interface currentConnection {
  status : "online" | "offline"
  setStatus : (arg : "online" | "offline") => void
  isActive: boolean;
  activeConnectionId: string;
  setActiveConnection: (arg: string) => void;
  clearActiveConnection: () => void;
  frndName: string;
  setFrndName: (name: string) => void;
}

export const activeConnectionStore = create<currentConnection>()((set) => ({
  status : "offline",
  setStatus : (status) => set({status}),
  isActive: false,
  activeConnectionId: "",
  setActiveConnection: (arg: string) =>
    set(() => ({ activeConnectionId: arg, isActive: true })),
  clearActiveConnection: () =>
    set(() => ({ activeConnectionId: "", isActive: false, frndName: "" })),
  frndName: "",
  setFrndName: (name: string) => set(() => ({ frndName: name })),
}));
