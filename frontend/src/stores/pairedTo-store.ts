import { create } from "zustand"

interface pairedToState {
    pairedTo : string,
    setPairedTo : (arg : string) => void
}
export const pairedToStore = create<pairedToState>()((set) => ({
    pairedTo : "",
    setPairedTo : (pairedTo) => set({pairedTo})
}))