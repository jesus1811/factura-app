import { ReactNode } from "react";

export type Icolumns = { nameKey: string; value: ReactNode };

export type IRows = { [key: string]: ReactNode };

export interface IDataTableProps {
  columns: { nameKey: string; value: ReactNode }[];
  rows: { [key: string]: ReactNode }[];
  className?: string;
}

export interface IDataTableRowsProps {
  row: { [key: string]: ReactNode };
  columns: { nameKey: string; value: ReactNode }[];
}
