import { create } from "zustand";
import { createAnalyticsStore } from "./analyticsStore";

const useAnalyticsStore = create(createAnalyticsStore);

export { useAnalyticsStore };
