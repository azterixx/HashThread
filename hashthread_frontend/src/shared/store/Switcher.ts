import { create } from "zustand";

export type SortType = "popular" | "new" | "old";

type State = {
  sort: SortType;
  setSort: (sort: SortType) => void;
};

export const useSwitcher = create<State>()((set) => ({
  sort: "popular",
  setSort: (sort: SortType) => set({ sort }),
}));
