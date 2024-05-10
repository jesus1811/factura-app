import { ICategory } from "../category/types";

export interface IProduct {
  id: string;
  created_at: string;
  name: string;
  stock: string;
  price: string;
  category: ICategory;
}

export interface DTOCreateProduct {
  name: string;
  stock: number;
  price: number;
  category_id: number;
}

export interface DTODeleteProduct {
  id: string;
}

export interface DTOEditProduct {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export interface IFilter {
  category_id?: string;
  name?: string;
  id?: string;
}
