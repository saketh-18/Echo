import { create } from "zustand";

interface connectionState {
  connection_id: string;
  username: string;
}

interface connectionsList {
  connections: connectionState[];
  setConnections: (arg: connectionState[]) => void;
  onlineUsers: Set<string>; // Set of usernames that are online
  setUserOnline: (username: string) => void;
  setUserOffline: (username: string) => void;
}

export const connectionStore = create<connectionsList>()((set) => ({
  connections: [],
  onlineUsers: new Set(),
  setConnections: (connections) => set({ connections }),
  setUserOnline: (userId: string) =>
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
    })),
  setUserOffline: (userId: string) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.delete(userId);
      return { onlineUsers: newSet };
    }),
}));
