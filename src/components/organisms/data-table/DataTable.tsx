import classNames from "classnames";
import DataTableRow from "./DataTableRow";
import { IDataTableProps } from "./types";

export function DataTable(props: IDataTableProps) {
  const { columns, rows, className } = props;
  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <table className={classNames("xl:w-full w-[56.25rem]  border-[1px]  border-gray-500", className)}>
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
    </div>
  );
}

export default DataTable;
