import { Button, Icon, Modal, TextField, Title } from "@/components/atoms";
import { DTOCreateCategory, addCategory } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IModalCreateCategory } from "./types";
import { toast } from "sonner";

export function ModalCreateCategory(props: IModalCreateCategory) {
  const { refetch, closeModal, isModal } = props;
  const [formData, setFormData] = useState<DTOCreateCategory>();

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

  const validate = (() => {
    if (!formData?.name) return false;
    return true;
  })();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    return () => {
      setFormData(undefined);
    };
  }, []);

  return (
    <>
      <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5">
        <Title>Agregar categoria</Title>
        <div>
          <p>Nombre</p>
          <TextField error={formData?.name ? undefined : "Requerido"} value={formData?.name} onChange={handleChange} placeholder="nombre" isFull name="name" />
        </div>
        <Button
          isDisabled={!validate}
          onClick={() => {
            if (!formData) return;
            addCategoryMutate({ name: formData?.name });
          }}
        >
          Agregar
          <Icon variant="add" />
        </Button>
      </Modal>
    </>
  );
}

export default ModalCreateCategory;
