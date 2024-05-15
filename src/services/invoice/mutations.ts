import { axiosInstance, getAxiosConfig } from "../axiosIntance";
import { getUser } from "../user/queries";
import { DTOCreateInvoiceDetail, DTOCreateInvoice, IInvoiceDetail } from "./types";

export const addInvoice = async ({ invoiceDetails, invoice }: { invoiceDetails: DTOCreateInvoiceDetail[]; invoice: DTOCreateInvoice }) => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.post("/invoice", { invoice, invoiceDetails });
    if (response.status === 201) return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteInvoice = async ({ invoiceDetails, invoiceId }: { invoiceId: string; invoiceDetails: IInvoiceDetail[] }) => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.delete("/invoice", { params: { invoiceDetails: JSON.stringify(invoiceDetails), invoiceId } });
    if (response.status === 201) return response.data;
  } catch (error) {
    throw error;
  }
};
