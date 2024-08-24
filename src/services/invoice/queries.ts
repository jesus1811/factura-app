import moment from "moment";
import { getAxiosConfig } from "../axiosIntance";
import { IFilterInvoice, IInvoice, IInvoiceDetail, IInvoiceMethod } from "./types";

export const getAllInvoices = async (filter: IFilterInvoice): Promise<IInvoice[] | undefined> => {
  const axiosInstance = getAxiosConfig();

  try {
    const { id, invoice_method_id, type, currentPage = 1, totalPerPage = 999, order = "desc", created_at } = filter;

    const todayLocal = moment(created_at).local().startOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");

    const todayMidnight = moment.utc(todayLocal).local().endOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");
    const response = await axiosInstance.get("/invoice", { params: { id, invoice_method_id, currentPage, order, type, totalPerPage, todayLocal, todayMidnight, created_at } });
    if (response.status === 200 && response) return response?.data;
  } catch (error) {
    console.error(error);
  }
};

export const getInvoiceDetails = async ({ invoiceId }: { invoiceId: string }): Promise<IInvoiceDetail[] | undefined> => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.get("/invoiceDetail", { params: { invoiceId } });
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getInvoiceMethods = async (): Promise<IInvoiceMethod[] | undefined> => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.get("/invoiceMethod");
    if (response.status === 200 && response) return response.data;
  } catch (error) {
    console.error(error);
  }
};
