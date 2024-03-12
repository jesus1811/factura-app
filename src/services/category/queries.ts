import { axiosInstance } from "../axiosIntance";
import { ICategories } from "./types";

export const getAllCategories = async (): Promise<ICategories[] | undefined> => {
  try {
    const response = await axiosInstance.get("/category", { params: { select: "*" } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};
