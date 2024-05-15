import { IFilterProduct, getUser } from "@/services";
import { axiosInstance } from "@/services/axiosIntance";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handleProduct(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) return res.status(400).json({ message: "invalidate token" });
  if (req.method === "POST") {
    const { name, price, stock, category_id } = req.body;
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      await axiosInstance.post("/product", {
        name,
        price,
        stock,
        category_id,
        token,
      });
      return res.status(201).json({ message: "created product" });
    } catch {
      return res.status(500).json({ message: "server error" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      await axiosInstance.delete("/product", {
        params: {
          id: `eq.${id}`,
          token: `eq.${token}`,
        },
      });
      return res.status(201).json({ message: "deleted product" });
    } catch (error: any) {
      if (error.response.status === 409) return res.status(409).json({ message: "category used on product and/or shops" });
      return res.status(500).json({ message: "server error" });
    }
  } else if (req.method === "PATCH") {
    const { id } = req.query;
    const { price, name, stock } = req.body;

    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      if (stock < 0) {
        return res.status(400).json({ message: "stock not equal negative" });
      }
      if (price < 0) {
        return res.status(500).json({ message: "price not equal negative" });
      }
      await axiosInstance.patch(
        `/product`,
        {
          name,
          price,
          stock,
        },
        { params: { id: `eq.${id}`, token: `eq.${token}` } }
      );
      return res.status(201).json({ message: "update product" });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  } else {
    const { category_id, name, id, currentPage = 1, totalPerPage = 999 } = req.query as IFilterProduct;
    const startIndex = (Number(currentPage) - 1) * totalPerPage;
    const endIndex = startIndex + Number(totalPerPage) - 1;
    try {
      const user = await getUser({ token });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const response = await axiosInstance.get("/product", {
        params: {
          select: "*,category:category_id(*)",
          token: `eq.${token}`,
          category_id: category_id ? `eq.${category_id}` : undefined,
          name: name ? `ilike.%${name}%` : undefined,
          id: id ? `eq.${id}` : undefined,
          order: "create_at.desc",
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
