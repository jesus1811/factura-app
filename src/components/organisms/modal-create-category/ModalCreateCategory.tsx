import { Button, Modal, TextField, Title } from "@/components/atoms";
import { DTOCreateCategory, addCategory } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IModalCreateCategory } from "./types";
import { toast } from "sonner";

export function ModalCreateCategory(props: IModalCreateCategory) {
  const { refetch, closeModal, isModal } = props;
  const [formData, setFormData] = useState<DTOCreateCategory>({} as DTOCreateCategory);

  const { mutate: addCategoryMutate } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      refetch();
      closeModal();
      toast("Categoria creada correctamente", { className: "!bg-primary-500" });
    },
    onError: () => {
      toast("Error al crear categoria", { className: "!bg-alertError" });
    },
  });

  const renderValidate = () => {
    if (!formData?.name) {
      toast("faltan datos al crear la Categoria", { className: "!bg-alertError" });
      return false;
    }
    return true;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setFormData({} as DTOCreateCategory);
  }, [isModal]);

  return (
    <>
      <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5">
        <Title>Agregar categoria</Title>
        <TextField value={formData?.name} onChange={handleChange} placeholder="nombre" isFull name="name" />
        <Button
          onClick={() => {
            if (!renderValidate()) return;
            addCategoryMutate({ name: formData?.name });
          }}
        >
          Agregar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 aspect-square">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </Modal>
    </>
  );
}

export default ModalCreateCategory;
