import { axiosInstance } from "../axiosIntance";
import { DTOCreateInvoiceDetail, DTOCreateInvoice } from "./types";

export const addInvoice = async ({ invoiceDetails, invoice }: { invoiceDetails: DTOCreateInvoiceDetail[]; invoice: DTOCreateInvoice }) => {
  try {
    await axiosInstance.post("/invoice", invoice);
    await axiosInstance.post("/invoice_detail", invoiceDetails);
    // return responseInvoiceDetail.data;
  } catch (error) {
    console.error(error);
  }
};
