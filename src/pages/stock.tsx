import { Button, Error, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateProduct } from "@/components/organisms";
import ModalEditProduct from "@/components/organisms/modal-edit-product/ModalEditProduct";
import { Layout } from "@/components/templates";
import { IFilterProduct, IProduct, getAllCategories, getAllProducts } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Head from "next/head";

import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
export function Productos() {
  const [filter, setFilter] = useState<IFilterProduct>({} as IFilterProduct);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedText] = useDebounce(filter, 500);
  const {
    data: products = [],
    isLoading,
    isSuccess,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["getAllProducts", currentPage, debouncedText],
    queryFn: () => getAllProducts({ category_id: filter?.category_id, name: filter?.name, id: filter?.id, currentPage, totalPerPage: 8 }),
    placeholderData: keepPreviousData,
  });

  const { data: categories = [] } = useQuery({ queryKey: ["getAllCategories"], queryFn: () => getAllCategories({}) });

  const [isFilter, setisFilter] = useState<boolean>(false);

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

  const rows: IRows[] = products?.map((product) => ({
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

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isModalEdit) return;
    setProduct({} as IProduct);
  }, [isModalEdit]);

  return (
    <Layout>
      <Head>
        <title>Stock</title>
      </Head>
      <div className="w-full flex flex-wrap gap-2 items-end">
        <Button onClick={() => setIsModalCreate(true)}>
          Agregar
          <Icon variant="add" />
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setisFilter((prev) => {
              if (prev) {
                setFilter({});
              }
              return !prev;
            })
          }
        >
          {isFilter ? "Cerrar filtros" : "Mostrar filtros"}
        </Button>
      </div>

      {isFilter && (
        <div className="flex gap-2 items-end mt-6">
          <div>
            <p>Codigo</p>
            <TextField
              value={filter?.id}
              name="id"
              onChange={(e) => {
                handleChange(e);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <p>Nombre</p>
            <TextField
              value={filter?.name}
              name="name"
              list="products"
              onChange={(e) => {
                handleChange(e);
                setCurrentPage(1);
              }}
            />
            <datalist id="products">
              {products?.map((product) => (
                <option key={product?.id} value={product?.name}>
                  {product?.id}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <select
              value={filter?.category_id}
              onChange={(e) => {
                handleChange(e);
                setCurrentPage(1);
              }}
              name="category_id"
              id=""
              className={classNames(
                "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[400px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
              )}
            >
              <option value="">Selecciona una categoría</option>
              {categories?.map((category) => (
                <option key={category?.id} value={category?.id}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}
      {!isLoading && !isSuccess && <Error />}
      {!isLoading && isSuccess && (
        <>
          <DataTable columns={columns} rows={rows} className="mt-6" />
          <div className="flex gap-2 items-center w-full justify-end mt-5">
            <Button isDisabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              <Icon variant="prev" />
            </Button>
            <p>Pagina {currentPage}</p>
            <Button isDisabled={products?.length === 0} onClick={() => setCurrentPage((prev) => prev + 1)}>
              <Icon variant="next" />
            </Button>
          </div>
        </>
      )}
      <ModalCreateProduct refetch={refetchProducts} closeModal={() => setIsModalCreate(false)} isModal={isModalCreate} />
      {product && <ModalEditProduct closeModal={() => setIsModalEdit(false)} isModal={isModalEdit} product={product} refetch={refetchProducts} />}
    </Layout>
  );
}

export default Productos;
