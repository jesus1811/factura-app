import { Loader, Title } from "@/components/atoms";
import { Chart } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { TypeShop, getAllInvoices } from "@/services";
import { useThemeStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Head from "next/head";

export default function Home() {
  const { data: invoices = [], isLoading } = useQuery({ queryKey: ["getAllInvoices"], queryFn: () => getAllInvoices({ order: "asc" }) });
  const { theme } = useThemeStore();

  const profitsDay = invoices
    ?.map((invoice) => ({ ...invoice, created_at: moment.utc(invoice.created_at).format() }))
    ?.filter((invoice) => moment(invoice?.created_at).isSame(moment(), "day"))
    .reduce((total, invoice) => total + invoice?.total, 0);

  const profitsMount = invoices
    ?.map((invoice) => ({ ...invoice, created_at: moment.utc(invoice.created_at).format() }))
    ?.filter((invoice) => moment(invoice?.created_at).isSame(moment(), "month"))
    .reduce((total, invoice) => total + invoice?.total, 0);

  const firstDayPased = moment().subtract(1, "months").startOf("month");
  const lastDayPased = moment().subtract(1, "months").endOf("month");
  const voincesPased = invoices
    ?.map((invoice) => ({ ...invoice, created_at: moment.utc(invoice.created_at).format() }))
    ?.filter((invoice) => moment(invoice?.created_at).isBetween(firstDayPased, lastDayPased, "day", "[]"));
  const profitsMountPased = voincesPased.reduce((total, invoice) => total + invoice.total, 0);

  const shopsList = invoices?.map((invoice) => ({ time: moment.utc(invoice?.created_at).local().format("YYYY-MM-DD"), value: invoice?.total }));
  const shopsListTotal = shopsList.reduce((total, invoice) => total + invoice.value, 0);

  const invoicesList = invoices
    ?.filter((invoice) => invoice.type === TypeShop.Invoice)
    ?.map((invoice) => ({ time: moment.utc(invoice?.created_at).local().format("YYYY-MM-DD"), value: invoice?.total }));
  const invoicesListTotal = invoicesList.reduce((total, invoice) => total + invoice.value, 0);

  const receiptList = invoices
    ?.filter((invoice) => invoice.type === TypeShop.Receipt)
    ?.map((invoice) => ({ time: moment.utc(invoice?.created_at).local().format("YYYY-MM-DD"), value: invoice?.total }));
  const receiptListTotal = receiptList.reduce((total, invoice) => total + invoice.value, 0);

  return (
    <Layout>
      <Head>
        <title>Factura Pro</title>
      </Head>
      <div className="w-full grid md:grid-cols-3 text-white gap-5">
        <div className={`bg-[#328651] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">S/{profitsDay}</h2>
            <p>Ganancias del día</p>
          </div>
        </div>
        <div className={`bg-[#2d788b] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">S/{profitsMount}</h2>
            <p>Ganancias del mes</p>
          </div>
        </div>
        <div className={`bg-[#2a1314] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">S/{profitsMountPased}</h2>
            <p>Ganancias mes pasado</p>
          </div>
        </div>
      </div>
      <div className=" w-full mt-6 flex gap-6 items-start flex-col xl:flex-row">
        <article className="w-full xl:flex-1 rounded-lg border border-gray-500 py-2.5 px-5 gap-5 flex flex-col">
          <Title>Ventas</Title>
          <div className="flex w-full justify-between">
            <p>Total</p>
            <p>S/{shopsListTotal}</p>
          </div>
        </article>
        <div className="xl:flex-[3] w-full xl:w-auto overflow-auto">
          <div className="xl:w-full w-[56.25rem]">
            {isLoading && <Loader />}
            {!isLoading && <Chart data={shopsList} title="Ventas" color={theme?.primaryColor} />}
          </div>
        </div>
      </div>
      <div className=" w-full mt-6 flex gap-6 items-start flex-col xl:flex-row">
        <article className="w-full xl:flex-1 rounded-lg border border-gray-500 py-2.5 px-5 gap-5 flex flex-col">
          <Title>Facturas</Title>
          <div className="flex w-full justify-between">
            <p>Total</p>
            <p>S/{invoicesListTotal}</p>
          </div>
        </article>
        <div className="xl:flex-[3] w-full xl:w-auto overflow-auto">
          <div className="xl:w-full w-[56.25rem]">
            {isLoading && <Loader />}
            {!isLoading && <Chart data={invoicesList} title="Facturas" color={theme?.primaryColor} />}
          </div>
        </div>
      </div>

      <div className=" w-full mt-6 flex gap-6 items-start flex-col xl:flex-row">
        <article className="w-full xl:flex-1 rounded-lg border border-gray-500 py-2.5 px-5 gap-5 flex flex-col">
          <Title>Boletas</Title>
          <div className="flex w-full justify-between">
            <p>Total</p>
            <p>S/{receiptListTotal}</p>
          </div>
        </article>
        <div className="xl:flex-[3] w-full xl:w-auto overflow-auto">
          <div className="xl:w-full w-[56.25rem]">
            {isLoading && <Loader />}
            {!isLoading && <Chart data={receiptList} title="Boletas" color={theme?.primaryColor} />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
