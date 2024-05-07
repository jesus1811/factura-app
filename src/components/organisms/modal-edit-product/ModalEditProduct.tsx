import { Button, Modal, TextField, Title } from "@/components/atoms";
import { DTOEditProduct, deleteProduct, updateProduct } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IModalCreateCategory } from "./types";
import { toast } from "sonner";

export function ModalEditProduct(props: IModalCreateCategory) {
  const { refetch, closeModal, isModal, product } = props;
  const [formData, setFormData] = useState<DTOEditProduct>({ id: product?.id, stock: Number(product?.stock), price: Number(product?.price), name: product?.name });
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false);
  const [aument, setAument] = useState<number>();

  const { mutate: deleteProductMutate } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      refetch();
      closeModal();
      setIsModalDelete(false);
      toast("Producto eliminado correctamente", { className: "!bg-primary-500" });
    },
  });

  const renderValidate = () => {
    if (formData?.name && formData?.price && formData?.stock) return true;
    return false;
  };

  const { mutate: updateProductMutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      refetch();
      closeModal();
      toast("Producto actualizado correctamente", { className: "!bg-primary-500" });
    },
    onError: (error) => {
      console.error("Error updateCategoryMutate", error);
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
    setFormData({ id: product?.id, stock: Number(product?.stock), price: Number(product?.price), name: product?.name });
  }, [product, isModal]);

  return (
    <>
      {!isModalDelete && (
        <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5">
          <Title>Editar Producto</Title>
          <TextField value={formData?.name} onChange={handleChange} placeholder="nombre" isFull name="name" />
          <TextField value={formData?.price} onChange={handleChange} placeholder="cantidad" isFull type="number" name="price" />
          <TextField value={formData?.stock} onChange={handleChange} placeholder="precio" isFull type="number" name="stock" />
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => {
                if (!renderValidate()) return;
                updateProductMutate({ ...formData });
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
          <div className="flex gap-2 items-center">
            <TextField value={aument} onChange={(e) => setAument(Number(e?.target?.value))} placeholder="aumentar/disminuir" isFull type="number" name="stock" />
            <Button
              onClick={() => {
                if (!renderValidate()) return;
                updateProductMutate({ ...formData, stock: formData?.stock + (aument || 0) });
              }}
            >
              Aumentar + {aument}
            </Button>
            <Button
              onClick={() => {
                if (!renderValidate()) return;
                updateProductMutate({ ...formData, stock: formData?.stock - (aument || 0) });
              }}
            >
              Disminuir - {aument}
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
        <p>No podra recuperar el dato despues de ser eliminado</p>

        <div className="flex gap-2 items-center">
          <Button
            variant="Alert"
            onClick={() => {
              deleteProductMutate({ id: product?.id });
            }}
          >
            Aceptar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ModalEditProduct;
