import { create } from "zustand";

export const useSidebarStore = create<State>((set) => ({
  isSidebar: true,
  loadStore: () => {
    set(() => {
      return { isSidebar: JSON.parse(localStorage.getItem("isSidebar") || "false") };
    });
  },
  changeSidebar: () => {
    set(({ isSidebar }) => {
      localStorage.setItem("isSidebar", JSON.stringify(!isSidebar));
      return { isSidebar: !isSidebar };
    });
  },
}));

interface State {
  isSidebar: boolean;
  loadStore: () => void;
  changeSidebar: () => void;
}
