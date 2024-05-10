import { supabase } from "../axiosIntance";
import { ICategory } from "./types";

export const getAllCategories = async (): Promise<ICategory[] | undefined> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const response = await supabase.from("category").select("*").eq("token", token);
    if (response.status === 200 && response) return response.data as ICategory[];
  } catch (error) {
    throw new Error(error as string);
  }
};
