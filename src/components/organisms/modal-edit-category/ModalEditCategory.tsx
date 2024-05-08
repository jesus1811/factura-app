import { Button, Modal, TextField, Title } from "@/components/atoms";
import { DTOEditCategory, deleteCategory, updateCategory } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IModalCreateCategory } from "./types";
import { toast } from "sonner";

export function ModalEditCategory(props: IModalCreateCategory) {
  const { refetch, closeModal, isModal, category } = props;
  const [formData, setFormData] = useState<DTOEditCategory>(category);
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false);

  const { mutate: deleteCategoryMutate } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      refetch();
      closeModal();
      setIsModalDelete(false);
      toast("Categoria eliminada correctamente", { className: "!bg-primary-500" });
    },
    onError: () => {
      toast("Error al eliminar categoria", { className: "!bg-alertError" });
    },
  });

  const renderValidate = () => {
    if (formData?.name) return true;
    return false;
  };

  const { mutate: updateCategoryMutate } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      refetch();
      closeModal();
      toast("Categoria actualizada correctamente", { className: "!bg-primary-500" });
    },
    onError: () => {
      toast("Error al editar categoria", { className: "!bg-alertError" });
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setFormData({ id: category?.id, name: category?.name });
  }, [category, isModal]);

  return (
    <>
      {!isModalDelete && (
        <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5">
          <Title>Editar categoria</Title>
          <TextField value={formData?.name} onChange={handleChange} placeholder="nombre" isFull name="name" />
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => {
                if (!renderValidate()) return;
                updateCategoryMutate({ ...formData });
              }}
            >
              Editar
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 aspect-square">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
            <Button variant="Alert" onClick={() => setIsModalDelete(true)}>
              Eliminar
            </Button>
          </div>
        </Modal>
      )}
      <Modal
        closeModal={() => setIsModalDelete(false)}
        isModal={isModalDelete}
        className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5"
      >
        <Title>Eliminar?</Title>
        <p>No podra recurperar el dato despues de ser eliminado</p>

        <div className="flex gap-2 items-center">
          <Button
            variant="Alert"
            onClick={() => {
              deleteCategoryMutate({ id: category?.id });
            }}
          >
            Aceptar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ModalEditCategory;
