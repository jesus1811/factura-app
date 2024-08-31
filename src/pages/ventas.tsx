import { Button, Error, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalInvoiceDetail, Pagination } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { IFilterInvoice, TypeShop, getAllInvoices, getInvoiceMethods } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import moment from "moment";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function Facturas() {
  const { replace, pathname, query } = useRouter();
  const searchParams = useSearchParams();

  const filter: IFilterInvoice = {
    currentPage: Number(query?.currentPage || 1),
    id: query?.id?.toString(),
    invoice_method_id: query?.invoice_method_id?.toString(),
    created_at: query?.created_at?.toString(),
    order: "desc",
    totalPerPage: 8,
    type: query?.type?.toString() as TypeShop,
  };
  const { data: methods } = useQuery({ queryKey: ["getInvoiceMethods"], queryFn: getInvoiceMethods });
  const { data: invoices = [], isLoading, isSuccess } = useQuery({ queryKey: ["getAllInvoices", filter], queryFn: () => getAllInvoices(filter), placeholderData: keepPreviousData });
  const router = useRouter();
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

  const deleteFilterOnSeachId = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("type");
    params.delete("currentPage");
    params.delete("invoice_method_id");
    params.delete("created_at");
    replace(`${pathname}?${params?.toString()}`);
  };

  const handleChange = useDebouncedCallback((event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const params = new URLSearchParams(searchParams);

    if (value === "") {
      params.delete(name);
      return replace(`${pathname}?${params.toString()}`);
    }
    params.set(name, value);
    params.set("currentPage", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  const rows: IRows[] = invoices?.map((invoice) => ({
    ...invoice,
    invoice_method: invoice?.invoice_method?.name,
    created_at: moment.utc(invoice?.created_at).local().format("D [de] MMMM [del] YYYY [a las] h:mm a"),
    settings: <RowInvoiceDetail invoiceId={invoice?.id} />,
  }));

  return (
    <Layout>
      <Head>
        <title>Ventas</title>
      </Head>
      <div className="w-full flex flex-wrap gap-2">
        <Button onClick={() => router.push("/venta")}>
          Nueva venta
          <Icon variant="add" />
        </Button>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div className="flex gap-2 items-end mt-6 w-[48.1875rem]">
          <div>
            <p>Codigo</p>
            <TextField
              defaultValue={filter?.id}
              name="id"
              onChange={(e) => {
                handleChange(e);
                deleteFilterOnSeachId();
              }}
            />
          </div>
          {!filter?.id && (
            <>
              <div>
                <select
                  defaultValue={filter?.type}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  name="type"
                  id=""
                  className={classNames(
                    "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[400px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
                  )}
                >
                  <option value="">Selecciona un tipo</option>

                  {Object.values(TypeShop)?.map((typeShop) => (
                    <option selected={filter?.type === typeShop} key={typeShop} value={typeShop}>
                      {typeShop}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  defaultValue={filter?.invoice_method_id}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  name="invoice_method_id"
                  id=""
                  className={classNames(
                    "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[400px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
                  )}
                >
                  <option value="">Selecciona un metodo</option>
                  {methods?.map((method) => (
                    <option selected={filter?.invoice_method_id === method?.id} key={method?.id} value={method?.id}>
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
            </>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}
      {!isLoading && !isSuccess && <Error />}

      {!isLoading && isSuccess && (
        <>
          <DataTable columns={columns} rows={rows} className="mt-6" />
          <Pagination
            currentPage={filter?.currentPage || 1}
            totalForPage={invoices?.length}
            onClickPrev={() => {
              const params = new URLSearchParams(searchParams);
              params.set("currentPage", ((filter?.currentPage || 1) - 1)?.toString());
              replace(`${pathname}?${params?.toString()}`);
            }}
            onClickNext={() => {
              const params = new URLSearchParams(searchParams);
              params.set("currentPage", ((filter?.currentPage || 1) + 1)?.toString());
              replace(`${pathname}?${params?.toString()}`);
            }}
          />
        </>
      )}
    </Layout>
  );
}

export function RowInvoiceDetail(props: { invoiceId: string }) {
  const { invoiceId } = props;
  const [isModalDetail, setisModalDetail] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => {
          setisModalDetail(true);
        }}
        className="ml-5"
      >
        <Icon variant="view" className="!w-7" />
      </button>
      <ModalInvoiceDetail invoiceId={invoiceId} closeModal={() => setisModalDetail(false)} isModal={isModalDetail} />
    </>
  );
}

export default Facturas;
