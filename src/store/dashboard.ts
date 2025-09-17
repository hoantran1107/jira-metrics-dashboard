import { DashboardLayout, FilterOptions } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardState {
  layout: DashboardLayout[];
  filters: FilterOptions;
  refreshInterval: number;
  setLayout: (layout: DashboardLayout[]) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  setRefreshInterval: (interval: number) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  projects: [],
  assignees: [],
  issueTypes: [],
  statuses: [],
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
  sprints: [],
};

const defaultLayout: DashboardLayout[] = [
  { i: "overview", x: 0, y: 0, w: 12, h: 2 },
  { i: "velocity", x: 0, y: 2, w: 6, h: 4 },
  { i: "burndown", x: 6, y: 2, w: 6, h: 4 },
  { i: "cycle-time", x: 0, y: 6, w: 8, h: 3 },
  { i: "throughput", x: 8, y: 6, w: 4, h: 3 },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      layout: defaultLayout,
      filters: defaultFilters,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      setLayout: (layout: DashboardLayout[]) => set({ layout }),
      updateFilters: (newFilters: Partial<FilterOptions>) => {
        const currentFilters = get().filters;
        set({
          filters: {
            ...currentFilters,
            ...newFilters,
          },
        });
      },
      setRefreshInterval: (refreshInterval: number) => set({ refreshInterval }),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: "dashboard-storage",
      partialize: (state) => ({
        layout: state.layout,
        filters: state.filters,
        refreshInterval: state.refreshInterval,
      }),
    }
  )
);
