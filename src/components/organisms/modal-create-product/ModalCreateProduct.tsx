import { Button, Loader, Modal, TextField, Title } from "@/components/atoms";
import { DTOCreateProduct, addProduct, getAllCategories } from "@/services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { IModalCreateProduct } from "./types";
import classNames from "classnames";
import { toast } from "sonner";

export function ModalCreateProduct(props: IModalCreateProduct) {
  const { refetch, closeModal, isModal } = props;
  const [formData, setFormData] = useState<DTOCreateProduct>({} as DTOCreateProduct);
  const { data: categories = [], isLoading } = useQuery({ queryKey: ["getAllCategories"], queryFn: getAllCategories, enabled: isModal });
  const { mutate: addProductMutate } = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      refetch();
      closeModal();
      toast("Producto creado correctamente", { className: "!bg-primary-500" });
    },
    onError: () => {
      toast("Error al crear producto", { className: "!bg-alertError" });
    },
  });

  const renderValidate = () => {
    if (!formData?.name || !formData?.price?.toString() || !formData?.stock?.toString()) {
      return false;
    }
    if (!formData?.category_id) {
      return false;
    }

    return true;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setFormData({} as DTOCreateProduct);
  }, [isModal]);

  return (
    <>
      <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[31.25rem] flex flex-col px-6 py-9 gap-5">
        <Title>Agregar producto</Title>
        <div>
          <p>Nombre</p>
          <TextField error={formData?.name ? undefined : "Requerido"} value={formData?.name} onChange={handleChange} placeholder="nombre" isFull name="name" />
        </div>
        <div>
          <p>Precio</p>
          <TextField error={formData?.price?.toString() ? undefined : "Requerido"} value={formData?.price} onChange={handleChange} placeholder="precio" isFull type="number" name="price" />
        </div>
        <div>
          <p>Cantidad</p>
          <TextField error={formData?.stock?.toString() ? undefined : "Requerido"} value={formData?.stock} onChange={handleChange} placeholder="cantidad" isFull type="number" name="stock" />
        </div>

        {isLoading && <Loader />}
        {!isLoading && (
          <>
            <select
              value={formData?.category_id}
              onChange={handleChange}
              name="category_id"
              id=""
              className={classNames("bg-dark-50 px-3 h-[2.5rem] w-full  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none")}
            >
              <option value="">Selecciona una categoría</option>
              {categories?.map((category) => (
                <option key={category?.id} value={category?.id}>
                  {category?.name}
                </option>
              ))}
            </select>
            {!formData?.category_id?.toString() && <span className="text-sm text-[#ff6166] leading-5 block text-start">Requerido</span>}
          </>
        )}
        <Button
          isDisabled={!renderValidate()}
          onClick={() => {
            addProductMutate({ ...formData });
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

export default ModalCreateProduct;
