import { axiosInstance } from "../axiosIntance";
import { IProduct } from "./types";

export const getAllProducts = async (): Promise<IProduct[] | undefined> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const response = await axiosInstance.get("/product", { params: { select: "*,category:category_id(*)", token: `eq.${token}` } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    throw new Error("Error");
  }
};

export const getProductDetail = async ({ id }: { id: string }): Promise<IProduct[] | undefined> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const response = await axiosInstance.get("/product", { params: { select: "*,category:category_id(*)", id: `eq.${id}`, token: `eq.${token}` } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    throw new Error("Error");
  }
};
