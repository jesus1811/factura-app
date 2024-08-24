import { hasContrast } from "@/utilities";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist<State>(
    (set) => ({
      theme: { primaryColor: "#5a57ee" },

      changeTheme: (newColor) => {
        set((state) => {
          if (!hasContrast("#000000", newColor)) {
            toast("denegado por mal contraste");
            return state;
          }
          return { theme: { primaryColor: newColor } };
        });
      },
    }),
    { name: "theme-store" }
  )
);

interface State {
  theme: { primaryColor: string };
  changeTheme: (newColor: string) => void;
}
