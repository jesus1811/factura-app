import { Button, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateProduct } from "@/components/organisms";
import ModalEditProduct from "@/components/organisms/modal-edit-product/ModalEditProduct";
import { Layout } from "@/components/templates";
import { IProduct, getAllProducts } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function Productos() {
  const { data: products = [], isError, isLoading, isSuccess, refetch: refetchProducts } = useQuery({ queryKey: ["getAllProducts"], queryFn: getAllProducts });
  const [search, setSearch] = useState<string>("");
  const [product, setProduct] = useState<IProduct>();
  const [isModalCreate, setIsModalCreate] = useState<boolean>(false);
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const columns: Icolumns[] = [
    { value: "Codigo", nameKey: "id" },
    { value: "Nombre", nameKey: "name" },
    { value: "Precio", nameKey: "price" },
    { value: "Cantidad", nameKey: "stock" },
    { value: "Categoria", nameKey: "category" },
    { nameKey: "settings", value: "" },
  ];

  const productsSearh = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.id.toLowerCase().includes(search.toLowerCase()));

  const rows: IRows[] = productsSearh?.map((product) => ({
    ...product,
    category: product?.category?.name,
    settings: (
      <button
        onClick={() => {
          setProduct(product);
          setIsModalEdit(true);
        }}
        className="ml-5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    ),
  }));

  useEffect(() => {
    if (isModalEdit) return;
    setProduct({} as IProduct);
  }, [isModalEdit]);

  return (
    <Layout>
      <div className="w-full flex flex-wrap gap-2">
        <TextField value={search} placeholder="Buscar" onChange={(event) => setSearch(event.currentTarget.value)} />
        <Button onClick={() => setIsModalCreate(true)}>
          Agregar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 aspect-square">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </div>
      {isError && <h1>error</h1>}
      {isLoading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}
      {!isLoading && isSuccess && <DataTable columns={columns} rows={rows} className="mt-6" />}
      <ModalCreateProduct refetch={refetchProducts} closeModal={() => setIsModalCreate(false)} isModal={isModalCreate} />
      {product && <ModalEditProduct closeModal={() => setIsModalEdit(false)} isModal={isModalEdit} product={product} refetch={refetchProducts} />}
    </Layout>
  );
}

export default Productos;
