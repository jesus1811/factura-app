import { Button, Error, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateProduct } from "@/components/organisms";
import ModalEditProduct from "@/components/organisms/modal-edit-product/ModalEditProduct";
import { Layout } from "@/components/templates";
import { IFilter, IProduct, getAllCategories, getAllProducts } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import classNames from "classnames";

import { ChangeEvent, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
export function Productos() {
  const [filter, setFilter] = useState<IFilter>({} as IFilter);
  const {
    data: products = [],
    isLoading,
    isSuccess,
    refetch: refetchProducts,
  } = useQuery({ queryKey: ["getAllProducts"], queryFn: () => getAllProducts({ category_id: filter?.category_id, name: filter?.name, id: filter?.id }), placeholderData: keepPreviousData });

  const { data: categories = [] } = useQuery({ queryKey: ["getAllCategories"], queryFn: getAllCategories });

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

  const debounce = useDebouncedCallback(refetchProducts, 500);

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
      <div className="w-full flex flex-wrap gap-2 items-end">
        <Button onClick={() => setIsModalCreate(true)}>
          Agregar
          <Icon variant="add" />
        </Button>
        <Button variant="outline" onClick={() => setisFilter((prev) => !prev)}>
          {isFilter ? "Cerrar filtros" : "Mostrar filtros"}
        </Button>
      </div>
      {isLoading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}
      {isFilter && (
        <div className="flex gap-2 items-end mt-6">
          <div>
            <p>Codigo</p>
            <TextField
              value={filter?.id}
              name="id"
              onChange={(event) => {
                handleChange(event);
                debounce();
              }}
            />
          </div>
          <div>
            <p>Nombre</p>
            <TextField
              value={filter?.name}
              name="name"
              onChange={(event) => {
                handleChange(event);
                debounce();
              }}
            />
          </div>
          <div>
            <select
              value={filter?.category_id}
              onChange={(event) => {
                handleChange(event);
                debounce();
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
      {!isSuccess && <Error />}
      {!isLoading && isSuccess && <DataTable columns={columns} rows={rows} className="mt-6" />}
      <ModalCreateProduct refetch={refetchProducts} closeModal={() => setIsModalCreate(false)} isModal={isModalCreate} />
      {product && <ModalEditProduct closeModal={() => setIsModalEdit(false)} isModal={isModalEdit} product={product} refetch={refetchProducts} />}
    </Layout>
  );
}

export default Productos;
