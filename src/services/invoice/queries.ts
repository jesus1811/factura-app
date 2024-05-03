import { axiosInstance } from "../axiosIntance";
import { IInvoice, IInvoiceDetail } from "./types";

export const getAllInvoices = async (): Promise<IInvoice[] | undefined> => {
  try {
    const response = await axiosInstance.get("/invoice", { params: { select: "*" } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getInvoiceDetails = async ({ invoiceId }: { invoiceId: string }): Promise<IInvoiceDetail[] | undefined> => {
  try {
    const response = await axiosInstance.get("/invoice_detail", { params: { select: "*,invoice:invoice_id(*),product:product_id(*)", invoice_id: `eq.${invoiceId}` } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};
