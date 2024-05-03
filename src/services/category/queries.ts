import { axiosInstance } from "../axiosIntance";
import { ICategory } from "./types";

export const getAllCategories = async (): Promise<ICategory[] | undefined> => {
  try {
    const response = await axiosInstance.get("/category", { params: { select: "*" } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};
