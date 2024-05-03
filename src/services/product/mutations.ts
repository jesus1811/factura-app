import { axiosInstance } from "../axiosIntance";
import { DTOCreateProduct, DTODeleteProduct, DTOEditProduct } from "./types";

export const addProduct = async ({ name, price, stock }: DTOCreateProduct) => {
  try {
    const response = await axiosInstance.post("/product", {
      name,
      price,
      stock,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteProduct = async ({ id }: DTODeleteProduct) => {
  try {
    const response = await axiosInstance.delete("/product", {
      params: {
        id: `eq.${id}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateProduct = async ({ id, name, price, stock }: DTOEditProduct) => {
  try {
    const response = await axiosInstance.patch(`/product?id=eq.${id}`, {
      name,
      price,
      stock,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
