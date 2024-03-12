export interface IInvoice {
  id: string;
  created_at: string;
  client_name: string;
  client_surname: string;
  client_RUC_DNI: string;
  subTotal: number;
  total: number;
}
