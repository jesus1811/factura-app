import { getAxiosConfig } from "../axiosIntance";
import { IFilterProduct, IProduct } from "./types";

export const getAllProducts = async (filter: IFilterProduct): Promise<IProduct[] | undefined> => {
  const axiosInstance = getAxiosConfig();
  try {
    const { category_id, name, id, currentPage = 1, totalPerPage = 999 } = filter;
    const response = await axiosInstance.get("/product", {
      params: {
        category_id,
        name,
        id,
        currentPage,
        totalPerPage,
      },
    });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProductsMinimal = async (): Promise<{ name: string; id: string }[] | undefined> => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.get("/productMinimal");
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    throw error;
  }
};
