import { getAxiosConfig } from "../axiosIntance";
import { DTOCreateCategory, DTODeleteCategory, DTOEditCategory } from "./types";

export const addCategory = async ({ name }: DTOCreateCategory) => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.post("/category", { name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async ({ id }: DTODeleteCategory) => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.delete("/category", { params: { id } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async ({ id, name }: DTOEditCategory) => {
  const axiosInstance = getAxiosConfig();

  try {
    const response = await axiosInstance.patch(
      `/category`,
      {
        name,
      },
      { params: { id } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
