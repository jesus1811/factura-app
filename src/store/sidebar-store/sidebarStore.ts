import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSidebarStore = create(
  persist<State>(
    (set) => ({
      isSidebar: true,
      changeSidebar: () => {
        set(({ isSidebar }) => {
          localStorage.setItem("isSidebar", JSON.stringify(!isSidebar));
          return { isSidebar: !isSidebar };
        });
      },
    }),
    { name: "sidebar-store" }
  )
);

interface State {
  isSidebar: boolean;
  changeSidebar: () => void;
}
