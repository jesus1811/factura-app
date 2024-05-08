import { axiosInstance } from "../axiosIntance";
import { getUser } from "../user/queries";
import { DTOCreateCategory, DTODeleteCategory, DTOEditCategory } from "./types";

const token = typeof window !== "undefined" ? (localStorage.getItem("access_token") as string) : "";

export const addCategory = async ({ name }: DTOCreateCategory) => {
  try {
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }
    const response = await axiosInstance.post("/category", {
      name,
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const deleteCategory = async ({ id }: DTODeleteCategory) => {
  try {
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }

    const response = await axiosInstance.delete("/category", {
      params: {
        id: `eq.${id}`,
        token: `eq.${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const updateCategory = async ({ id, name }: DTOEditCategory) => {
  try {
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }
    const response = await axiosInstance.patch(`/category?id=eq.${id}&token=eq.${token}`, {
      name,
    });
    return response.data;
  } catch (error) {
    throw new Error(error as string);
  }
};
