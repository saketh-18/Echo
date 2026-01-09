import { create } from "zustand"

interface connectionState {
    connection_id : string,
    username : string
}

interface connectionsList {
    connections : connectionState[],
    setConnections : (arg : connectionState[]) => void
}

export const connectionStore = create<connectionsList>()((set) => ({
    connections : [],
    setConnections : (connections) => set({connections})
}));