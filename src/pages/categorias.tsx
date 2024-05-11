import { Button, Error, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateCategory, ModalEditCategory } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { ICategory, IFilterCategory, getAllCategories } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function Categorias() {
  const [isFilter, setisFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<IFilterCategory>({} as IFilterCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedText] = useDebounce(filter, 500);
  const [isModalCreate, setIsModalCreate] = useState<boolean>(false);
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const [category, setCategory] = useState<ICategory>();
  const {
    data: categories = [],
    isError,
    isLoading,
    isSuccess,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["getAllCategories", currentPage, debouncedText],
    queryFn: () => getAllCategories({ id: filter?.id, name: filter?.name, currentPage, totalPerPage: 8 }),
    placeholderData: keepPreviousData,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const columns: Icolumns[] = [
    { nameKey: "id", value: "Codigo" },
    { nameKey: "name", value: "Nombre" },
    { nameKey: "settings", value: "" },
  ];

  const rows: IRows[] = categories?.map((category) => ({
    ...category,
    settings: (
      <button
        onClick={() => {
          setCategory(category);
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
    setCategory({} as ICategory);
  }, [isModalEdit]);
  return (
    <>
      <Layout>
        <div className="w-full flex flex-wrap gap-2">
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
          <div className="flex gap-2 items-end mt-6 #060606">
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
                {categories.map((product) => (
                  <option key={product?.id} value={product?.name}>
                    {product?.id}
                  </option>
                ))}
              </datalist>
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
                Atras
              </Button>
              <p>Pagina {currentPage}</p>
              <Button isDisabled={categories?.length === 0} onClick={() => setCurrentPage((prev) => prev + 1)}>
                Siguiente
              </Button>
            </div>
          </>
        )}
        <ModalCreateCategory isModal={isModalCreate} closeModal={() => setIsModalCreate(false)} refetch={refetchCategories} />
        {category && <ModalEditCategory category={category} isModal={isModalEdit} closeModal={() => setIsModalEdit(false)} refetch={refetchCategories} />}
      </Layout>
    </>
  );
}

export default Categorias;
