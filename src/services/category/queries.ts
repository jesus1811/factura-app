import { axiosInstance } from "../axiosIntance";
import { ICategory } from "./types";

const token = typeof window !== "undefined" ? (localStorage.getItem("access_token") as string) : "";

export const getAllCategories = async (): Promise<ICategory[] | undefined> => {
  try {
    const response = await axiosInstance.get("/category", { params: { select: "*", token: `eq.${token}` } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};
