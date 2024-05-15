import { getUser } from "@/services";
import { axiosInstance } from "@/services/axiosIntance";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleInvoiceMethod(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) return res.status(400).json({ message: "invalidate token" });
  try {
    const user = await getUser({ token });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const response = await axiosInstance.get("/invoice_method", { params: { select: "*" } });
    return res.status(200).json(response?.data);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
}
