import { Button, Icon, Loader, Modal, TextField, Title } from "@/components/atoms";
import { DTOEditCategory, deleteCategory, updateCategory } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IModalCreateCategory } from "./types";
import { toast } from "sonner";

export function ModalEditCategory(props: IModalCreateCategory) {
  const { refetch, closeModal, isModal, category } = props;
  const [formData, setFormData] = useState<DTOEditCategory>();
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

  const validate = (() => {
    if (!formData?.name) return false;
    return true;
  })();

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
    if (!formData) return;
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setFormData({ id: category?.id, name: category?.name });

    return () => {
      setFormData(undefined);
    };
  }, [category]);

  return (
    <>
      {!isModalDelete && (
        <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5">
          <Title>Editar categoria</Title>
          <div>
            <p>Nombre</p>
            <TextField error={!formData?.name ? "requerido" : undefined} value={formData?.name} onChange={handleChange} placeholder="nombre" isFull name="name" />
          </div>
          <div className="flex gap-2 items-center">
            <Button
              isDisabled={!validate}
              onClick={() => {
                if (!formData) return;
                updateCategoryMutate({ ...formData });
              }}
            >
              Editar
              <Icon variant="edit" />
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
