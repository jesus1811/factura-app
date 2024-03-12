import classNames from "classnames";
import DataTableRow from "./DataTableRow";
import { IDataTableProps } from "./types";

export function DataTable(props: IDataTableProps) {
  const { columns, rows, className } = props;
  return (
    <table className={classNames("w-full  border-[1px]  border-gray-500", className)}>
      <thead className="bg-dark-100 text-white ">
        <tr className="border-b  border-gray-500 ">
          {columns?.map((column) => (
            <th key={column?.nameKey} className="text-start p-2 lg:px-7 lg:py-5 ">
              {column.value}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className=" text-white ">
        {rows?.map((row, index) => (
          <DataTableRow key={index} row={row} columns={columns} />
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
