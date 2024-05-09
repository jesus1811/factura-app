import { Button, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateProduct } from "@/components/organisms";
import ModalEditProduct from "@/components/organisms/modal-edit-product/ModalEditProduct";
import { Layout } from "@/components/templates";
import { IProduct, getAllProducts } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function Productos() {
  const { data: products = [], isError, isLoading, isSuccess, refetch: refetchProducts, isFetching } = useQuery({ queryKey: ["getAllProducts"], queryFn: getAllProducts });
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

  const productsSearh = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) || product.id.toLowerCase().includes(search.toLowerCase()) || product.category?.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <Icon variant="edit" className="!w-7" />
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
          <Icon variant="add" />
        </Button>
        <Button isDisabled={isFetching} variant="outline" onClick={refetchProducts}>
          Refrescar
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
