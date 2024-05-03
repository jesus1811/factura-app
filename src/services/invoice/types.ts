export interface IInvoice {
  id: string;
  created_at: string;
  client_name: string;
  client_surname: string;
  client_RUC_DNI: string;
  subTotal: number;
  total: number;
}

export interface DTOCreateInvoiceDetail {
  product_id: string;
  invoice_id: string;
  stock: number;
  price: number;
}

export interface DTOCreateInvoice {
  id: string;
  client_name: string;
  client_surname: string;
  client_RUC_DNI: string;
  desc: number;
  subTotal: number;
  total: number;
}
