import { axiosInstance } from "../axiosIntance";
import { DTOCreateCategory, DTODeleteCategory, DTOEditCategory } from "./types";

export const addCategory = async ({ name }: DTOCreateCategory) => {
  try {
    const response = await axiosInstance.post("/category", {
      name,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteCategory = async ({ id }: DTODeleteCategory) => {
  try {
    const response = await axiosInstance.delete("/category", {
      params: {
        id: `eq.${id}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateCategory = async ({ id, name }: DTOEditCategory) => {
  try {
    const response = await axiosInstance.patch(`/category?id=eq.${id}`, {
      name,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
