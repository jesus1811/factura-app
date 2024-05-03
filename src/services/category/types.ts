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
