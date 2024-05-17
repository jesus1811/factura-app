import { DTOCreateInvoice, DTOCreateInvoiceDetail, IFilterInvoice, IInvoiceDetail, IProduct, getUser } from "@/services";
import { axiosInstance } from "@/services/axiosIntance";
import moment from "moment";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handleInvoice(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) return res.status(400).json({ message: "invalidate token" });

  if (req.method === "POST") {
    const { invoiceDetails, invoice } = req.body as { invoiceDetails: DTOCreateInvoiceDetail[]; invoice: DTOCreateInvoice };
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      await axiosInstance.post("/invoice", { ...invoice, token });
      await axiosInstance.post(
        "/invoice_detail",
        invoiceDetails?.map((detail) => ({
          ...detail,
          token: token,
        }))
      );
      for (const detail of invoiceDetails) {
        const { data: products } = await axiosInstance.get("/product", { params: { select: "*,category:category_id(*)", id: `eq.${detail?.product_id}`, token: `eq.${token}` } });
        const product: IProduct = products?.[0];
        if (!product) return res.status(404).json({ message: "not found" });
        const updatedStock = Number(product?.stock || 0) - (detail?.stock || 0);
        await axiosInstance.patch(
          `/product`,
          {
            name: product?.name,
            price: product?.price,
            stock: Number(updatedStock),
          },
          { params: { token: `eq.${token}`, id: `eq.${product?.id}` } }
        );
      }
      return res.status(201).json({ message: "created invoice" });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
  if (req.method === "DELETE") {
    const { invoiceDetails, invoiceId } = req.query as Partial<{ invoiceDetails: string; invoiceId: string }>;

    if (!invoiceDetails) return res.status(401).json({ message: "invoiceDetails required" });
    const parseInvoiceDetails = JSON.parse(invoiceDetails);
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      for (const detail of parseInvoiceDetails) {
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
      return res.status(201).json({ message: "deleted invoice" });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  } else {
    const { id, invoice_method_id, currentPage = 1, order, type, totalPerPage = 999, created_at } = req.query as IFilterInvoice;
    const todayLocal = moment(created_at).local().startOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");

    const todayMidnight = moment.utc(todayLocal).local().endOf("day").format("YYYY-MM-DD HH:mm:ss.SSSSSSZ");

    const startIndex = (Number(currentPage) - 1) * totalPerPage;
    const endIndex = startIndex + Number(totalPerPage) - 1;

    const params = created_at ? `?created_at=gte.${todayLocal}&created_at=lt.${todayMidnight}` : "";
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const response = await axiosInstance.get(`/invoice${params}`, {
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
      return res.status(200).json(response?.data);
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
}
