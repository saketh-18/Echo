import { create } from "zustand"

interface partner {
    pairedTo : string,
    setPairedTo : (arg : string) => void
} 

export const pairedStore = create<partner>()((set) => ({
    pairedTo : "",
    setPairedTo : (pairedTo) => set({pairedTo})
}));

