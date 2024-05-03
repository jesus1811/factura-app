import React from "react";
import { IDataTableRowsProps } from "./types";

export function DataTableRow(props: IDataTableRowsProps) {
  const { row, columns } = props;
  console.log("debug-", row);
  return (
    <tr className="even:bg-dark-100 odd:bg-dark-50   border-b border-gray-500 last-of-type:border-none">
      {columns?.map((column) => (
        <td key={column?.nameKey} className="text-start p-2 lg:px-7 lg:py-5">
          {row?.[column?.nameKey]}
        </td>
      ))}
    </tr>
  );
}

export default DataTableRow;
