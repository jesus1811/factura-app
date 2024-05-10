import { Button, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalInvoiceDetail } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { getAllInvoices } from "@/services";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function Facturas() {
  const { data: invoices = [], isError, isLoading, isSuccess, refetch: refetchInvoices, isFetching } = useQuery({ queryKey: ["getAllInvoices"], queryFn: getAllInvoices });
  const [search, setSearch] = useState<string>("");
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

  const invoicesSearh = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(search.toLowerCase()) || invoice.type.toLowerCase().includes(search.toLowerCase()) || invoice.invoice_method?.name.toLowerCase().includes(search.toLowerCase())
  );

  const rows: IRows[] = invoicesSearh?.map((invoice) => ({
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
        <TextField value={search} placeholder="Buscar" onChange={(event) => setSearch(event.currentTarget.value)} />
        <Button onClick={() => router.push("/venta")}>
          Nueva venta
          <Icon variant="add" />
        </Button>
        <Button isDisabled={isFetching} variant="outline" onClick={refetchInvoices}>
          Refrescar
        </Button>
      </div>

      {isError && <h1>error</h1>}
      {isLoading && <Loader />}
      <p>
        *nota: el sistema tendra un filtrado por fecha guiado por un calendario para que de esa manera pueda ver las venta de un dia especifico, por lo pronto soloe sta viendo las ventas del dia de
        hoy- en desarrollo*
      </p>
      {!isLoading && isSuccess && <DataTable columns={columns} rows={rows} className="mt-6" />}
      {invoiceId && <ModalInvoiceDetail invoiceId={invoiceId} closeModal={() => setisModalDetail(false)} isModal={isModalDetail} />}
    </Layout>
  );
}

export default Facturas;
