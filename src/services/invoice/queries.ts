import moment from "moment";
import { axiosInstance } from "../axiosIntance";
import { IInvoice, IInvoiceDetail, IInvoiceMethod } from "./types";

export const getAllInvoicesToday = async (): Promise<IInvoice[] | undefined> => {
  try {
    const todayLocal = moment.utc().local().startOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
    const todayMidnight = moment.utc(todayLocal).local().endOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const response = await axiosInstance.get(`/invoice?created_at=gte.${todayLocal}&created_at=lt.${todayMidnight}`, {
      params: { select: "*,invoice_method:invoice_method_id(*)", token: `eq.${token}` },
    });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllInvoices = async (): Promise<IInvoice[] | undefined> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const response = await axiosInstance.get(`/invoice`, {
      params: { select: "*,invoice_method:invoice_method_id(*)", token: `eq.${token}` },
    });
    if (response.status === 200 && response) return response.data as IInvoice[];
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
