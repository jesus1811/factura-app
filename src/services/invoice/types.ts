import { IProduct } from "../product/types";

export interface IInvoice {
  id: string;
  created_at: string;
  client_name: string;
  client_surname: string;
  client_RUC_DNI: string;
  subTotal: number;
  total: number;
  desc: number;
  type: string;
  invoice_method: IInvoiceMethod;
}

export interface IInvoiceDetail {
  id: number;
  created_at: string;
  product_id: string;
  invoice_id: string;
  stock: number;
  price: number;
  invoice: IInvoice;
  product: IProduct;
}

export interface DTOCreateInvoiceDetail {
  product_id: string;
  invoice_id: string;
  stock: number;
  price: number;
}

export enum TypeShop {
  Receipt = "Boleta",
  Invoice = "Factura",
}
export interface DTOCreateInvoice {
  id: string;
  client_name: string;
  client_surname: string;
  client_RUC_DNI: string;
  desc: number;
  subTotal: number;
  total: number;
  invoice_method_id: string;
  type: TypeShop;
}

export interface IInvoiceMethod {
  id: string;
  created_at: string;
  name: string;
}
