import { axiosInstance } from "../axiosIntance";
import { updateProduct } from "../product/mutations";
import { getProductDetail } from "../product/queries";
import { getUser } from "../user/queries";
import { DTOCreateInvoiceDetail, DTOCreateInvoice, IInvoiceDetail } from "./types";

export const addInvoice = async ({ invoiceDetails, invoice }: { invoiceDetails: DTOCreateInvoiceDetail[]; invoice: DTOCreateInvoice }) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }
    await axiosInstance.post("/invoice", { ...invoice, token });
    await axiosInstance.post(
      "/invoice_detail",
      invoiceDetails?.map((detail) => ({
        ...detail,
        token: token,
      }))
    );
    for (const detail of invoiceDetails) {
      const products = await getProductDetail({ id: detail?.product_id });
      const product = products?.[0];
      if (!product) return;
      const updatedStock = Number(product?.stock || 0) - (detail?.stock || 0);
      await updateProduct({ id: product?.id, name: product?.name, price: Number(product?.price), stock: updatedStock });
    }
  } catch (error) {
    console.error(error);
    console.error("Error al agregar la factura y/o sus detalles de factura:", error);
    throw new Error(error as string);
  }
};

export const deleteInvoice = async ({ invoiceDetails, invoiceId }: { invoiceId: string; invoiceDetails: IInvoiceDetail[] }) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    const user = await getUser({ token });
    if (!user) {
      throw new Error("Error");
    }
    for (const detail of invoiceDetails) {
      await axiosInstance.delete(`/invoice_detail`, {
        params: {
          id: `eq.${detail?.id}`,
          token: `eq.${token}`,
        },
      });
    }
    await axiosInstance.delete(`/invoice`, {
      params: {
        id: `eq.${invoiceId}`,
        token: `eq.${token}`,
      },
    });
  } catch (error) {
    throw new Error(error as string);
  }
};
