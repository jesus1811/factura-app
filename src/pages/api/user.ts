import { axiosInstance } from "@/services/axiosIntance";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleUser(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) return res.status(400).json({ message: "invalidate token" });
  const { user, password } = req.query as { user: string; password: string };
  try {
    const response = await axiosInstance.get("/user", { params: { select: "*,owner:owner_id(token)", user: `eq.${user}`, password: `eq.${password}` } });
    return res.status(200).json(response?.data);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
}
