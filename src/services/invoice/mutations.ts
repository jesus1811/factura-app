import { axiosInstance } from "../axiosIntance";
import { updateProduct } from "../product/mutations";
import { getProductDetail } from "../product/queries";
import { DTOCreateInvoiceDetail, DTOCreateInvoice } from "./types";

export const addInvoice = async ({ invoiceDetails, invoice }: { invoiceDetails: DTOCreateInvoiceDetail[]; invoice: DTOCreateInvoice }) => {
  try {
    await axiosInstance.post("/invoice", invoice);
    await axiosInstance.post("/invoice_detail", invoiceDetails);
    for (const detail of invoiceDetails) {
      const products = await getProductDetail({ id: detail?.product_id });
      const product = products?.[0];
      if (!product) return;
      const updatedStock = Number(product?.stock || 0) - (detail?.stock || 0);
      await updateProduct({ id: product?.id, name: product?.name, price: Number(product?.price), stock: updatedStock });
    }
  } catch (error) {
    console.error(error);
  }
};
