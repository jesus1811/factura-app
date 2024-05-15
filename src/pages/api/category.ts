import { DTOCreateCategory, DTODeleteCategory, IFilterCategory, getUser } from "@/services";
import { axiosInstance } from "@/services/axiosIntance";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handleCategory(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) return res.status(400).json({ message: "invalidate token" });
  if (req.method === "POST") {
    const { name } = req.body as DTOCreateCategory;
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      await axiosInstance.post("/category", {
        name,
        token,
      });
      res.status(201).json({ message: "created category" });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query as Partial<DTODeleteCategory>;
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      await axiosInstance.delete("/category", {
        params: {
          id: `eq.${id}`,
          token: `eq.${token}`,
        },
      });
      res.status(201).json({ message: "deleted category" });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  } else if (req.method === "PATCH") {
    const { id } = req.query;
    const { name } = req.body;
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      await axiosInstance.patch(
        `/category`,
        {
          name,
        },
        { params: { id: `eq.${id}`, token: `eq.${token}` } }
      );
      res.status(201).json({ message: "updated category" });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  } else {
    const { id, name, currentPage = 1, totalPerPage = 999 } = req.query as IFilterCategory;

    const startIndex = (Number(currentPage) - 1) * 8;
    const endIndex = startIndex + Number(totalPerPage) - 1;

    if (!token) return res.status(400).json({ message: "invalidate token" });
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const response = await axiosInstance.get("/category", {
        params: { select: "*", token: `eq.${token}`, name: name ? `ilike.%${name}%` : undefined, id: id ? `eq.${id}` : undefined, order: "created_at.desc" },
        headers: {
          range: `${startIndex}-${endIndex}`,
          "Content-Type": "application/json",
        },
      });
      return res.status(200).json(response?.data);
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
}
