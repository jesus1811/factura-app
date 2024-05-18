import { Button, Error, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalInvoiceDetail } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { IFilterInvoice, TypeShop, getAllInvoices, getInvoiceMethods } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import moment from "moment";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function Facturas() {
  const [filter, setFilter] = useState<IFilterInvoice>({} as IFilterInvoice);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedText] = useDebounce(filter, 500);
  const [isFilter, setisFilter] = useState<boolean>(false);
  const { data: methods } = useQuery({ queryKey: ["getInvoiceMethods"], queryFn: getInvoiceMethods });
  const {
    data: invoices = [],
    isLoading,
    isSuccess,
  } = useQuery({ queryKey: ["getAllInvoices", currentPage, debouncedText], queryFn: () => getAllInvoices({ currentPage, totalPerPage: 8, ...filter }), placeholderData: keepPreviousData });

  const [invoiceId, setInvoiceId] = useState<string>();
  const router = useRouter();
  const [isModalDetail, setisModalDetail] = useState<boolean>(false);
  const columns: Icolumns[] = [
    { value: "Nº Factura", nameKey: "id" },
    { value: "Subtotal", nameKey: "subTotal" },
    { value: "Descuento", nameKey: "desc" },
    { value: "Total", nameKey: "total" },
    { value: "Fecha", nameKey: "created_at" },
    { value: "Metodo", nameKey: "invoice_method" },
    { value: "Tipo  ", nameKey: "type" },
    { nameKey: "settings", value: "" },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const rows: IRows[] = invoices?.map((invoice) => ({
    ...invoice,
    invoice_method: invoice?.invoice_method?.name,
    created_at: moment.utc(invoice?.created_at).local().format("D [de] MMMM [del] YYYY [a las] h:mm a"),
    settings: (
      <button
        onClick={() => {
          setInvoiceId(invoice?.id);
          setisModalDetail(true);
        }}
        className="ml-5"
      >
        <Icon variant="view" className="!w-7" />
      </button>
    ),
  }));

  useEffect(() => {
    if (isModalDetail) return;
    setInvoiceId("");
  }, [isModalDetail]);
  return (
    <Layout>
      <div className="w-full flex flex-wrap gap-2">
        <Button onClick={() => router.push("/venta")}>
          Nueva venta
          <Icon variant="add" />
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setisFilter((prev) => {
              if (prev) {
                setFilter({});
              }
              return !prev;
            })
          }
        >
          {isFilter ? "Cerrar filtros" : "Mostrar filtros"}
        </Button>
      </div>
      {isFilter && (
        <div className="flex gap-2 items-end mt-6">
          <div>
            <p>Codigo</p>
            <TextField
              value={filter?.id}
              name="id"
              onChange={(e) => {
                handleChange(e);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <select
              value={filter?.type}
              onChange={(e) => {
                handleChange(e);
                setCurrentPage(1);
              }}
              name="type"
              id=""
              className={classNames(
                "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[400px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
              )}
            >
              <option value="">Selecciona un tipo</option>

              {Object.values(TypeShop)?.map((typeShop) => (
                <option key={typeShop} value={typeShop}>
                  {typeShop}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filter?.invoice_method_id}
              onChange={(e) => {
                handleChange(e);
                setCurrentPage(1);
              }}
              name="invoice_method_id"
              id=""
              className={classNames(
                "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[400px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
              )}
            >
              <option value="">Selecciona un metodo</option>
              {methods?.map((method) => (
                <option key={method?.id} value={method?.id}>
                  {method?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <div date-rangepicker className="flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  name="created_at"
                  onChange={(e) => handleChange(e)}
                  type="date"
                  className="outline-none bg-dark-50 px-3 border-gray-500 focus:border-[#8F8F8F] border-[1px] rounded-md h-[2.5rem]  text-sm  w-full ps-10  text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}
      {!isLoading && !isSuccess && <Error />}

      {!isLoading && isSuccess && (
        <>
          <DataTable columns={columns} rows={rows} className="mt-6" />
          <div className="flex gap-2 items-center w-full justify-end mt-5">
            <Button isDisabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              <Icon variant="prev" />
            </Button>
            <p>Pagina {currentPage}</p>
            <Button isDisabled={invoices?.length === 0} onClick={() => setCurrentPage((prev) => prev + 1)}>
              <Icon variant="next" />
            </Button>
          </div>
        </>
      )}
      {invoiceId && <ModalInvoiceDetail invoiceId={invoiceId} closeModal={() => setisModalDetail(false)} isModal={isModalDetail} />}
    </Layout>
  );
}

export default Facturas;
