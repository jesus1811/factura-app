import { ICategory, IFilterCategory } from "./types";
import { getAxiosConfig } from "../axiosIntance";

export const getAllCategories = async (filter: IFilterCategory): Promise<ICategory[] | undefined> => {
  const axiosInstance = getAxiosConfig();
  try {
    const { id, name, currentPage = 1, totalPerPage = 999 } = filter;
    const response = await axiosInstance.get("/category", {
      params: { id, name, currentPage, totalPerPage },
    });
    if (response.status === 200 && response) return response.data as ICategory[];
  } catch (error) {
    throw error;
  }
};
