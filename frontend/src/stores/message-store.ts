import { AnyMessage } from "@/types/chat";
import { create } from "zustand";

const initialMsg = {
  type: "test",
  context: "test",
  data: {
    message: "test",
  },
};

type MessageType = AnyMessage;

interface messageTypes {
  random: MessageType[];
  global: MessageType[];
  saved: {
    [connectionId: string]: MessageType[];
  };
  setRandom: (arg: MessageType | MessageType[]) => void;
  setGlobal: (arg: MessageType | MessageType[]) => void;
  setSaved: (arg: MessageType | MessageType[], connectionId: string) => void;
}

export const messageStateStore = create<messageTypes>()((set) => ({
  random: [],
  global: [],
  saved: {},
  setRandom: (arg: MessageType | MessageType[]) =>
    set((state) => {
      if (Array.isArray(arg)) {
        return { random: arg.length === 0 ? [] : arg };
      }
      return { random: [...state.random, arg] };
    }),
  setGlobal: (arg: MessageType | MessageType[]) =>
    set((state) => {
      if (Array.isArray(arg)) {
        return { global: arg.length === 0 ? [] : arg };
      }
      return { global: [...state.global, arg] };
    }),
  setSaved: (arg: MessageType | MessageType[], connectionId: string) =>
    set((state) => {
      if (!connectionId) {
        return {} as Partial<typeof state>;
      }
      // If arg is an array, replace all messages for this connection
      if (Array.isArray(arg)) {
        return {
          saved: {
            ...state.saved,
            [connectionId]: arg,
          },
        };
      }
      // If arg is a single message, append it
      const prev = state.saved[connectionId] ?? [];
      return {
        saved: {
          ...state.saved,
          [connectionId]: [...prev, arg],
        },
      };
    }),
}));
