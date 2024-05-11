export interface ICategory {
  id: string;
  created_at: string;
  name: string;
}

export interface DTOCreateCategory {
  name: string;
}

export interface DTODeleteCategory {
  id: string;
}

export interface DTOEditCategory {
  id: string;
  name: string;
}

export interface IFilterCategory {
  name?: string;
  id?: string;
  currentPage?: number;
  totalPerPage?: number;
}
