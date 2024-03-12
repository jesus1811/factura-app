import { Inter } from "next/font/google";
import { Layout } from "@/components/templates";

export default function Home() {
  return (
    <Layout>
      <div className="w-full grid md:grid-cols-3 text-white gap-5">
        <div className={`bg-[#328651] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">$ 6</h2>
            <p>Ganancias del día</p>
          </div>
        </div>
        <div className={`bg-[#2d788b] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">$ 9</h2>
            <p>Ganancias del mes</p>
          </div>
        </div>
        <div className={`bg-[#2a1314] rounded-md h-fit`}>
          <div className={`icon_money p-5`}>
            <h2 className="font-bold mb-5 text-2xl">$ 15</h2>
            <p>Ganancias mes pasado</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
