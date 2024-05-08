import { axiosInstance } from "../axiosIntance";
import { getUser } from "../user/queries";
import { DTOCreateProduct, DTODeleteProduct, DTOEditProduct } from "./types";

const token = typeof window !== "undefined" ? (localStorage.getItem("access_token") as string) : "";

export const addProduct = async ({ name, price, stock, category_id }: DTOCreateProduct) => {
  try {
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
