import { Button, Error, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateProduct, Pagination } from "@/components/organisms";
import ModalEditProduct from "@/components/organisms/modal-edit-product/ModalEditProduct";
import { Layout } from "@/components/templates";
import { IFilterProduct, IProduct, getAllCategories, getAllProducts, getAllProductsMinimal } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
export function Productos() {
  const { replace, pathname, query } = useRouter();
  const searchParams = useSearchParams();

  const filter: IFilterProduct = {
    category_id: query?.category_id?.toString(),
    currentPage: Number(query?.currentPage || 1),
    id: query?.id?.toString(),
    name: query?.name?.toString(),
    totalPerPage: 8,
  };
  const {
    data: products = [],
    isLoading,
    isSuccess,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["getAllProducts", filter],
    queryFn: () => getAllProducts(filter),
    placeholderData: keepPreviousData,
  });

  const { data: productsMinimal = [] } = useQuery({
    queryKey: ["getAllProductsMinimal"],
    queryFn: () => getAllProductsMinimal(),
  });

  const { data: categories = [] } = useQuery({ queryKey: ["getAllCategories"], queryFn: () => getAllCategories({}) });

  const [isModalCreate, setIsModalCreate] = useState<boolean>(false);
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
    settings: <RowStock product={product} refetchProducts={refetchProducts} />,
  }));

  const deleteFilterOnSeachId = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("name");
    params.delete("currentPage");
    params.delete("category_id");
    replace(`${pathname}?${params?.toString()}`);
  };

  const handleChange = useDebouncedCallback((event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const params = new URLSearchParams(searchParams);
    if (value === "") {
      params.delete(name);
      return replace(`${pathname}?${params.toString()}`);
    }
    params.set(name, value);
    params.set("currentPage", "1");
    replace(`${pathname}?${params.toString()}`);
  }, 500);

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
      </div>

      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div className="flex gap-2 items-end mt-6 w-[40.875rem]">
          <div>
            <p>Codigo</p>
            <TextField
              name="id"
              type="text"
              defaultValue={filter?.id}
              onChange={(e) => {
                handleChange(e);
                deleteFilterOnSeachId();
              }}
            />
          </div>
          {!filter.id && (
            <>
              <div>
                <p>Nombre</p>
                <TextField
                  name="name"
                  defaultValue={filter?.name}
                  list="products"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <datalist id="products">
                  {productsMinimal?.map((product) => (
                    <option key={product?.id} value={product?.name}>
                      {product?.id}
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <select
                  defaultValue={filter?.category_id}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  name="category_id"
                  id=""
                  className={classNames(
                    "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[400px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
                  )}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories?.map((category) => (
                    <option selected={filter?.category_id === category?.id} key={category?.id} value={category?.id}>
                      {category?.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}
      {!isLoading && !isSuccess && <Error />}
      {!isLoading && isSuccess && (
        <>
          <DataTable columns={columns} rows={rows} className="mt-6" />
          <Pagination
            currentPage={filter?.currentPage || 1}
            totalForPage={products?.length}
            onClickPrev={() => {
              const params = new URLSearchParams(searchParams);
              params.set("currentPage", ((filter?.currentPage || 1) - 1)?.toString());
              replace(`${pathname}?${params?.toString()}`);
            }}
            onClickNext={() => {
              const params = new URLSearchParams(searchParams);
              params.set("currentPage", ((filter?.currentPage || 1) + 1)?.toString());
              replace(`${pathname}?${params?.toString()}`);
            }}
          />
        </>
      )}
      {isModalCreate && <ModalCreateProduct refetch={refetchProducts} closeModal={() => setIsModalCreate(false)} isModal={isModalCreate} />}
    </Layout>
  );
}

export function RowStock(props: { product: IProduct; refetchProducts: () => void }) {
  const { product, refetchProducts } = props;
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => {
          setIsModalEdit(true);
        }}
        className="ml-5"
      >
        <Icon variant="edit" className="!w-7" />
      </button>
      <ModalEditProduct closeModal={() => setIsModalEdit(false)} isModal={isModalEdit} product={product} refetch={refetchProducts} />
    </>
  );
}

export default Productos;
