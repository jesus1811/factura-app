import moment from "moment";
import { axiosInstance } from "../axiosIntance";
import { IFilterInvoice, IInvoice, IInvoiceDetail, IInvoiceMethod } from "./types";

export const getAllInvoices = async (filter: IFilterInvoice): Promise<IInvoice[] | undefined> => {
  try {
    const { id, invoice_method_id, type, currentPage = 1, totalPerPage = 999, order = "desc" } = filter;
    // const todayLocal = moment.utc().local().startOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
    // const todayMidnight = moment.utc(todayLocal).local().endOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const startIndex = (currentPage - 1) * totalPerPage;
    const endIndex = startIndex + totalPerPage - 1;
    // const response = await axiosInstance.get(`/invoice?created_at=gte.${todayLocal}&created_at=lt.${todayMidnight}`,
    const response = await axiosInstance.get(`/invoice`, {
      params: {
        select: "*,invoice_method:invoice_method_id(*)",
        token: `eq.${token}`,
        invoice_method_id: invoice_method_id ? `eq.${invoice_method_id}` : undefined,
        type: type ? `ilike.%${type}%` : undefined,
        id: id ? `eq.${id}` : undefined,
        order: `created_at.${order}`,
      },
      headers: {
        range: `${startIndex}-${endIndex}`,
      },
    });
    if (response.status === 200 && response) return response?.data;
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
