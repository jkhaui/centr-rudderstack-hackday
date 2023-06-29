import {StateCreator} from "zustand";

export const createAnalyticsStore: StateCreator<any> = (set)=> ({
    events: [],
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
})