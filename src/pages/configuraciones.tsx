import { DataTable, IRows, Icolumns } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { useThemeStore } from "@/store";
import Head from "next/head";

export function Configuraciones() {
  const { theme, changeTheme } = useThemeStore();

  const columns: Icolumns[] = [
    { nameKey: "description", value: "descripcion" },
    { nameKey: "value", value: "valor" },
  ];

  const rows: IRows[] = [
    {
      description: "Color",
      value: (
        <div>
          <input
            value={theme?.primaryColor}
            id="colorPicker"
            type="color"
            className="bg-dark-50  border-gray-500 focus:border-[#8F8F8F] border-[1px] p-1 rounded-md w-11 h-11"
            onChange={(e) => {
              const newColor = e.target.value;
              changeTheme(newColor);
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
