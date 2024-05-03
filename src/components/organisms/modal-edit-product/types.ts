import { ICategory, IProduct } from "@/services";

export interface IModalCreateCategory {
  refetch: () => void;
  isModal: boolean;
  closeModal: () => void;
  product: IProduct;
}
