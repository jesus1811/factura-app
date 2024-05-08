import { create } from "zustand";
import { State } from "./types";

export const useTokenStore = create<State>((set) => ({
  token: { value: "", isLoading: true },
  addToken: (newToken) => {
    set(({ token }) => {
      localStorage.setItem("access_token", newToken);
      return { ...token, token: { isLoading: false, value: newToken } };
    });
  },
  loadStore: () => {
    set(() => {
      return { token: { isLoading: false, value: localStorage.getItem("access_token") as string } };
    });
  },
  deleteToken: () => {
    set(() => {
      localStorage.removeItem("access_token");
      return { token: { isLoading: false, value: "" } };
    });
  },
}));
