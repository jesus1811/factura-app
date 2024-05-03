import { ICategory } from "@/services";

export interface IModalCreateCategory {
  refetch: () => void;
  isModal: boolean;
  closeModal: () => void;
  category: ICategory;
}
