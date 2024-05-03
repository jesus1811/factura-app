import { Button, TextField, Title } from "@/components/atoms";
import { DataTable, Icolumns } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { getAllProducts } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function Venta() {
  const { data: products = [] } = useQuery({ queryKey: ["getAllProducts"], queryFn: getAllProducts });

  const [search, setSearch] = useState<string>("");

  const columns: Icolumns[] = [
    { value: "Descripcion", nameKey: "name" },
    { value: "Precio U.", nameKey: "price" },
    { value: "Cantidad", nameKey: "stock" },
    { value: "Total", nameKey: "stock" },
    { nameKey: "settings", value: "" },
  ];

  const productFind = products.find((product) => product?.name === search || product?.id === search);
  return (
    <Layout>
      <div className="w-full flex flex-wrap gap-2 mb-5">
        <TextField list="products" value={search} placeholder="Buscar producto" onChange={(event) => setSearch(event.currentTarget.value)} />
        <datalist id="products">
          {products?.map((product) => (
            <option key={product?.id} value={product?.name}>
              {product?.id}
            </option>
          ))}
        </datalist>
        <Button>
          Agregar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 aspect-square">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </div>
      <Title>Detalle producto</Title>
      <div className="flex gap-4 items-center mt-6">
        <div>
          <label htmlFor="">Codigo producto</label>
          <TextField value={productFind?.id || ""} disabled placeholder="id" />
        </div>
        <div>
          <label htmlFor="">Nombre producto</label>
          <TextField value={productFind?.name || ""} placeholder="id" />
        </div>
        <div>
          <label htmlFor="">Precio producto</label>
          <TextField value={productFind?.price || ""} placeholder="id" />
        </div>
        <div>
          <label htmlFor="">Stock actual</label>
          <TextField value={productFind?.stock || ""} placeholder="id" />
        </div>
      </div>
      <DataTable columns={columns} rows={[]} className="mt-6" />
    </Layout>
  );
}

export default Venta;
