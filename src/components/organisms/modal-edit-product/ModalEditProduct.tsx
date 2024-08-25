import { Button, Icon, Modal, TextField, Title } from "@/components/atoms";
import { DTOEditProduct, deleteProduct, updateProduct } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IModalCreateCategory } from "./types";
import { toast } from "sonner";

export function ModalEditProduct(props: IModalCreateCategory) {
  const { refetch, closeModal, isModal, product } = props;
  const [formData, setFormData] = useState<DTOEditProduct>();
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
    onError: (error: any) => {
      console.log("debug-error", error.response.status);
      if (error.response.status === 409) return toast("este recurso esta en uso prohibido eliminar", { className: "!bg-alertError" });
      toast("Error al eliminar producto", { className: "!bg-alertError" });
    },
  });

  const validate = (() => {
    if (!formData?.name || !formData?.price?.toString() || !formData?.stock?.toString()) return false;
    if (formData?.stock < 0 || formData?.price < 0) return false;
    return true;
  })();

  const { mutate: updateProductMutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      refetch();
      closeModal();
      toast("Producto actualizado correctamente", { className: "!bg-primary-500" });
    },
    onError: () => {
      toast("Error al editar producto", { className: "!bg-alertError" });
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    } as DTOEditProduct);
  };

  useEffect(() => {
    setFormData({ id: product?.id, stock: Number(product?.stock), price: Number(product?.price), name: product?.name });
    return () => {
      setFormData(undefined);
    };
  }, [product]);

  return (
    <>
      {!isModalDelete && (
        <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5">
          <Title>Editar Producto</Title>
          <div>
            <p>Nombre</p>
            <TextField error={formData?.name ? undefined : "Requerido"} value={formData?.name} onChange={handleChange} placeholder="Nombre" isFull name="name" />
          </div>
          <div>
            <p>Precio</p>
            <TextField
              error={formData?.price.toString() ? undefined : "Requerido"}
              value={formData?.price?.toString()}
              onChange={handleChange}
              placeholder="Precio"
              isFull
              type="number"
              name="price"
            />
          </div>
          <div>
            <p>Cantidad</p>
            <TextField
              error={formData?.stock.toString() ? undefined : "Requerido"}
              value={formData?.stock?.toString()}
              onChange={handleChange}
              placeholder="Cantidad"
              isFull
              type="number"
              name="stock"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Button
              isDisabled={!validate}
              onClick={() => {
                if (!formData) return;
                updateProductMutate({ ...formData });
              }}
            >
              Editar
              <Icon variant="edit" />
            </Button>
            <Button variant="Alert" onClick={() => setIsModalDelete(true)}>
              Eliminar
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <TextField value={aument?.toString()} onChange={(e) => setAument(Number(e?.target?.value))} placeholder="aumentar/disminuir" isFull type="number" name="stock" />
            <Button
              isDisabled={!aument || aument < 0}
              onClick={() => {
                if (!formData) return;
                updateProductMutate({ ...formData, stock: formData?.stock + (aument || 0) });
              }}
            >
              Aumentar + {aument}
            </Button>
            <Button
              isDisabled={!aument || aument < 0}
              onClick={() => {
                if (!formData) return;
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
