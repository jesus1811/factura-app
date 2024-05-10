import { axiosInstance } from "../axiosIntance";
import { IFilter, IProduct } from "./types";

export const getAllProducts = async (filter: IFilter): Promise<IProduct[] | undefined> => {
  try {
    const { category_id, name, id } = filter;
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const response = await axiosInstance.get("/product", {
      params: {
        select: "*,category:category_id(*)",
        token: `eq.${token}`,
        category_id: category_id ? `eq.${category_id}` : undefined,
        name: name ? `ilike.%${name}%` : undefined,
        id: id ? `eq.${id}` : undefined,
      },
    });
    if (response.status === 200 && response) return response.data as IProduct[];
  } catch (error: any) {
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
