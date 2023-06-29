import { StateCreator } from "zustand";

export const createAnalyticsStore: StateCreator<any> = (set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [event,...state.events] })),
});
