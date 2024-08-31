import { Button, Error, Icon, Loader, TextField } from "@/components/atoms";
import { DataTable, IRows, Icolumns, ModalCreateCategory, ModalEditCategory, Pagination } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { ICategory, IFilterCategory, getAllCategories, getAllCategoriesMinimal } from "@/services";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function Categorias() {
  const { replace, pathname, query } = useRouter();
  const searchParams = useSearchParams();
  const filter: IFilterCategory = { name: query?.name?.toString(), id: query?.id?.toString(), currentPage: Number(query?.currentPage || 1), totalPerPage: 8 };
  const [isModalCreate, setIsModalCreate] = useState<boolean>(false);

  const {
    data: categories = [],
    isLoading,
    isSuccess,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["getAllCategories", filter],
    queryFn: () => getAllCategories(filter),
    placeholderData: keepPreviousData,
  });

  const { data: categoriesMinimal = [] } = useQuery({
    queryKey: ["getAllCategoriesMinimal"],
    queryFn: () => getAllCategoriesMinimal(),
  });

  const deleteFilterOnSeachId = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("name");
    params.delete("currentPage");
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

  const columns: Icolumns[] = [
    { nameKey: "id", value: "Codigo" },
    { nameKey: "name", value: "Nombre" },
    { nameKey: "settings", value: "" },
  ];

  const rows: IRows[] = categories?.map((category) => ({
    ...category,
    settings: <RowCategory category={category} refetchCategories={refetchCategories} />,
  }));

  return (
    <>
      <Layout>
        <Head>
          <title>Categorias</title>
        </Head>
        <div className="w-full flex flex-wrap gap-2">
          <Button onClick={() => setIsModalCreate(true)}>
            Agregar
            <Icon variant="add" />
          </Button>
        </div>
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <div className="flex gap-2 items-end mt-6 w-[26.375rem]">
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
              <div>
                <p>Nombre</p>
                <TextField
                  name="name"
                  type="text"
                  defaultValue={filter?.name}
                  list="products"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <datalist id="products">
                  {categoriesMinimal.map((product) => (
                    <option key={product?.id} value={product?.name}>
                      {product?.id}
                    </option>
                  ))}
                </datalist>
              </div>
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
              totalForPage={categories?.length}
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
        {isModalCreate && <ModalCreateCategory isModal={isModalCreate} closeModal={() => setIsModalCreate(false)} refetch={refetchCategories} />}
      </Layout>
    </>
  );
}

export function RowCategory(props: { category: ICategory; refetchCategories: () => void }) {
  const { category, refetchCategories } = props;
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
      <ModalEditCategory category={category} isModal={isModalEdit} closeModal={() => setIsModalEdit(false)} refetch={refetchCategories} />
    </>
  );
}

export default Categorias;
