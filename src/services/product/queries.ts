import { axiosInstance } from "../axiosIntance";
import { IProduct } from "./types";

export const getAllProducts = async (): Promise<IProduct[] | undefined> => {
  try {
    const response = await axiosInstance.get("/product", { params: { select: "*,category:category_id(*)" } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};
