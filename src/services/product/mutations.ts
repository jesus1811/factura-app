import { getAxiosConfig } from "../axiosIntance";
import { DTOCreateProduct, DTODeleteProduct, DTOEditProduct } from "./types";

export const addProduct = async ({ name, price, stock, category_id }: DTOCreateProduct) => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.post("/product", {
      name,
      price,
      stock,
      category_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async ({ id }: DTODeleteProduct) => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.delete("/product", { params: { id } });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateProduct = async ({ id, name, price, stock }: DTOEditProduct) => {
  const axiosInstance = getAxiosConfig();
  try {
    if (stock < 0) {
      throw new Error("Error");
    }
    if (price < 0) {
      throw new Error("Error");
    }
    const response = await axiosInstance.patch("/product", { name, price, stock }, { params: { id } });
    return response.data;
  } catch (error) {
    throw error;
  }
};
