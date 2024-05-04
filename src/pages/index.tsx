import { Layout } from "@/components/templates";
import { getAllInvoices } from "@/services";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

export default function Home() {
  const { data: invoices = [] } = useQuery({ queryKey: ["getAllInvoices"], queryFn: getAllInvoices });

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
  return (
    <Layout>
      <div className="w-full grid md:grid-cols-3 text-white gap-5">
        <div className={`bg-[#328651] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">$ {profitsDay}</h2>
            <p>Ganancias del día </p>
          </div>
        </div>
        <div className={`bg-[#2d788b] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">$ {profitsMount}</h2>
            <p>Ganancias del mes</p>
          </div>
        </div>
        <div className={`bg-[#2a1314] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">$ {profitsMountPased}</h2>
            <p>Ganancias mes pasado</p>
          </div>
        </div>
      </div>

      <h1></h1>
    </Layout>
  );
}
