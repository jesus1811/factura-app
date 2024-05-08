import { axiosInstance } from "../axiosIntance";
import { IInvoice, IInvoiceDetail, IInvoiceMethod } from "./types";

export const getAllInvoices = async (): Promise<IInvoice[] | undefined> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const response = await axiosInstance.get("/invoice", { params: { select: "*,invoice_method:invoice_method_id(*)", token: `eq.${token}` } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getInvoiceDetails = async ({ invoiceId }: { invoiceId: string }): Promise<IInvoiceDetail[] | undefined> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const response = await axiosInstance.get("/invoice_detail", {
      params: { select: "*,invoice:invoice_id(*,invoice_method:invoice_method_id(*)),product:product_id(*)", invoice_id: `eq.${invoiceId}`, token: `eq.${token}` },
    });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getInvoiceMethods = async (): Promise<IInvoiceMethod[] | undefined> => {
  try {
    const response = await axiosInstance.get("/invoice_method", { params: { select: "*" } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};
