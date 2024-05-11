import { axiosInstance } from "../axiosIntance";
import { ICategory, IFilterCategory } from "./types";

export const getAllCategories = async (filter: IFilterCategory): Promise<ICategory[] | undefined> => {
  try {
    const { id, name, currentPage = 1, totalPerPage = 999 } = filter;
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const startIndex = (currentPage - 1) * totalPerPage;
    const endIndex = startIndex + totalPerPage - 1;
    const response = await axiosInstance.get("/category", {
      params: { select: "*", token: `eq.${token}`, name: name ? `ilike.%${name}%` : undefined, id: id ? `eq.${id}` : undefined },
      headers: {
        range: `${startIndex}-${endIndex}`,
      },
    });
    if (response.status === 200 && response) return response.data as ICategory[];
  } catch (error) {
    throw new Error(error as string);
  }
};
