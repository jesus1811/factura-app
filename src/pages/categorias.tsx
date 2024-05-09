import { Button, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateCategory, ModalEditCategory } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { ICategory, getAllCategories } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function Categorias() {
  const [search, setSearch] = useState<string>("");
  const [isModalCreate, setIsModalCreate] = useState<boolean>(false);
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const [category, setCategory] = useState<ICategory>();
  const { data: categories = [], isError, isLoading, isSuccess, refetch: refetchCategories, isFetching } = useQuery({ queryKey: ["getAllCategories"], queryFn: getAllCategories });

  const columns: Icolumns[] = [
    { nameKey: "id", value: "Codigo" },
    { nameKey: "name", value: "Nombre" },
    { nameKey: "settings", value: "" },
  ];

  const categoriesSearh = categories.filter((category) => category.name.toLowerCase().includes(search.toLowerCase()) || category.id.toLowerCase().includes(search.toLowerCase()));

  const rows: IRows[] = categoriesSearh?.map((category) => ({
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
          <TextField value={search} placeholder="Buscar" onChange={(event) => setSearch(event.currentTarget.value)} />
          <Button onClick={() => setIsModalCreate(true)}>
            Agregar
            <Icon variant="add" />
          </Button>
          <Button isDisabled={isFetching} variant="outline" onClick={refetchCategories}>
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
        <ModalCreateCategory isModal={isModalCreate} closeModal={() => setIsModalCreate(false)} refetch={refetchCategories} />
        {category && <ModalEditCategory category={category} isModal={isModalEdit} closeModal={() => setIsModalEdit(false)} refetch={refetchCategories} />}
      </Layout>
    </>
  );
}

export default Categorias;
