import { axiosInstance } from "../axiosIntance";
import { IInvoice } from "./types";

export const getAllInvoices = async (): Promise<IInvoice[] | undefined> => {
  try {
    const response = await axiosInstance.get("/invoice", { params: { select: "*" } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};
