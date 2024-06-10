import { Button } from "@/components/atoms";
import { DataTable, IRows, Icolumns } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { hasContrast } from "@/utilities";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Configuraciones() {
  const [color, setColor] = useState(() => {
    if (typeof window !== "undefined") {
      const storedColor = localStorage.getItem("color-primary") || "#5a57ee";
      if (hasContrast("#020202", storedColor)) return storedColor;
      return "#5a57ee";
    }
    return "#5a57ee";
  });
  const columns: Icolumns[] = [
    { nameKey: "description", value: "descripcion" },
    { nameKey: "value", value: "valor" },
  ];

  const handleChangeColor = (newColor: string) => {
    if (!hasContrast("#020202", newColor)) {
      return toast("denegado por mal contraste");
    }
    setColor(newColor);
    document.documentElement.style.setProperty("--color-primary-500", newColor);
    localStorage.setItem("color-primary", newColor);
  };

  const rows: IRows[] = [
    {
      description: "Color",
      value: (
        <div>
          <input
            value={color}
            id="colorPicker"
            type="color"
            className="bg-dark-50  border-gray-500 focus:border-[#8F8F8F] border-[1px] p-1 rounded-md w-11 h-11"
            onChange={(e) => {
              const color = e.target.value;
              handleChangeColor(color);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Configuraciones</title>
      </Head>
      <DataTable columns={columns} rows={rows} className="mt-6" />
      <p>* en desarrollo </p>
    </Layout>
  );
}

export default Configuraciones;
