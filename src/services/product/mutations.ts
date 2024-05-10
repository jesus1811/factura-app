import { axiosInstance } from "../axiosIntance";
import { getUser } from "../user/queries";
import { DTOCreateProduct, DTODeleteProduct, DTOEditProduct } from "./types";

export const addProduct = async ({ name, price, stock, category_id }: DTOCreateProduct) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }
    const response = await axiosInstance.post("/product", {
      name,
      price,
      stock,
      category_id,
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error");
  }
};

export const deleteProduct = async ({ id }: DTODeleteProduct) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }
    const response = await axiosInstance.delete("/product", {
      params: {
        id: `eq.${id}`,
        token: `eq.${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error");
  }
};

export const updateProduct = async ({ id, name, price, stock }: DTOEditProduct) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    if (stock < 0) {
      throw new Error("Error");
    }
    if (price < 0) {
      throw new Error("Error");
    }
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }
    const response = await axiosInstance.patch(`/product?id=eq.${id}&token=eq.${token}`, {
      name,
      price,
      stock,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error");
  }
};
