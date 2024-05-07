import { Button, Loader, TextField, Title } from "@/components/atoms";
import { DataTable, IRows, Icolumns } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { IInvoiceMethod, TypeShop, addInvoice, getAllProducts, getInvoiceMethods } from "@/services";
import { useCartStore } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
export function Venta() {
  const { cart, addCart, loadStore, clearStorage, changeProduct, deleteProduct } = useCartStore();
  const { data: products = [] } = useQuery({ queryKey: ["getAllProducts"], queryFn: getAllProducts });
  const { data: methods, isLoading } = useQuery({ queryKey: ["getInvoiceMethods"], queryFn: getInvoiceMethods });
  const queryClient = useQueryClient();
  const { mutate: addInvoiceMutate } = useMutation({
    mutationFn: addInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInvoices"] });
      toast("Compra realizada correctamente");
      clearStorage();
    },
  });
  const [search, setSearch] = useState<string>("");
  const total = cart.reduce((sum, product) => {
    return sum + Number(product.price) * (product?.count || 1);
  }, 0);
  const UUID = uuidv4();
  const igv = total * (0.18 / (1 + 0.18));
  const subTotal = total - igv;

  const productFind = products.find((product) => product?.name === search || product?.id === search);
  const [productCount, setProducCount] = useState<number>(1);
  const [productPrice, setProductPrice] = useState<number>(Number(productFind?.price || 0));
  const [method, setMethod] = useState<IInvoiceMethod>({} as IInvoiceMethod);
  const [typeShop, setTypeShop] = useState(TypeShop.Receipt);

  const [client, setClient] = useState<{ client_RUC_DNI: string; client_name: string; client_surname: string }>({} as { client_RUC_DNI: string; client_name: string; client_surname: string });

  const renderValidateaddInvoice = () => {
    if (!cart || !total) {
      toast("No hay productos para vender", { className: "!bg-alertError" });
      return false;
    }
    if (typeShop === TypeShop?.Receipt) {
      return true;
    }
    if (!client?.client_name || !client?.client_surname || !client?.client_RUC_DNI) {
      toast("Faltan datos del cliente", { className: "!bg-alertError" });
      return false;
    }
    return true;
  };

  const columns: Icolumns[] = [
    { value: "Descripcion", nameKey: "name" },
    { value: "Precio U.", nameKey: "price" },
    { value: "Cantidad", nameKey: "count" },
    { value: "Total", nameKey: "Total" },
    { nameKey: "settings", value: "" },
  ];

  const rows: IRows[] = cart?.map((product) => ({
    ...product,
    category: product?.category?.name,
    count: <TextField value={product?.count} onChange={(e) => changeProduct({ ...product, count: Number(e.currentTarget.value) })} placeholder="cantidad" />,
    Total: Number(product?.price) * product?.count,
    settings: (
      <button className="ml-5" onClick={() => deleteProduct(product)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
          />
        </svg>
      </button>
    ),
  }));

  useEffect(() => {
    loadStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProductPrice(Number(productFind?.price || 0));
  }, [productFind]);

  useEffect(() => {
    if (!methods) return;
    setMethod(methods?.[0]);
  }, [methods]);
  return (
    <Layout>
      <div className="flex gap-5 w-full h-full">
        <div className="w-full  h-full">
          <div className="flex gap-4 items-end w-full">
            <TextField className="w-[400px]" list="products" value={search} placeholder="Buscar producto" onChange={(event) => setSearch(event.currentTarget.value)} />
            <datalist id="products">
              {products?.map((product) => (
                <option key={product?.id} value={product?.name}>
                  {product?.id}
                </option>
              ))}
            </datalist>
            <div>
              <label htmlFor="">Precio</label>
              <TextField value={productFind ? productPrice : ""} onChange={(e) => setProductPrice(Number(e.currentTarget?.value))} />
            </div>
            <div>
              <label htmlFor="">Cantidad</label>
              <TextField value={productFind ? productCount : ""} onChange={(e) => setProducCount(Number(e.currentTarget?.value))} />
            </div>

            {productFind && (
              <Button
                onClick={() => {
                  addCart({ ...productFind, count: productCount || 0, price: productPrice?.toString() });
                  setSearch("");
                  setProducCount(1);
                }}
              >
                Agregar
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 aspect-square">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Button>
            )}
          </div>
          <DataTable columns={columns} rows={rows} className="mt-6" />

          <div className="w-full flex  flex-col items-end mt-5">
            <p>subtotal: {subTotal?.toFixed(2)}</p>
            <p>igv(18%): {igv?.toFixed(2)}</p>
            <Title>Total a pagar</Title>
            <Title>{total}</Title>
            <div className="flex gap-2 mt-5">
              <Button
                onClick={() => {
                  if (!renderValidateaddInvoice()) return;
                  addInvoiceMutate({
                    invoiceDetails: cart?.map((product) => {
                      return {
                        invoice_id: UUID,
                        price: Number(product?.price),
                        stock: Number(product?.count),
                        product_id: product?.id,
                      };
                    }),
                    invoice: {
                      ...client,
                      desc: 0,
                      subTotal: subTotal,
                      total: total,
                      id: UUID,
                      type: typeShop,
                      invoice_method_id: method?.id,
                    },
                  });
                }}
              >
                Realizar venta
              </Button>
              <Button variant="Alert" onClick={() => clearStorage()}>
                Limpiar tabla
              </Button>
            </div>
          </div>
        </div>
        <div className="h-full w-[1px]  bg-gray-500" />
        <div className="w-full max-w-[18.75rem] h-full">
          <Title>{typeShop}</Title>
          <div className="w-full my-5 flex flex-col items-start">
            <label>Tipo de venta</label>
            <select
              value={typeShop}
              onChange={(e) => setTypeShop(e.target.value as TypeShop)}
              name="category_id"
              id=""
              className={classNames(
                "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[300px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
              )}
            >
              {Object.values(TypeShop)?.map((typeShop) => (
                <option key={typeShop} value={typeShop}>
                  {typeShop}
                </option>
              ))}
            </select>
            {isLoading && <Loader />}
            {!isLoading && (
              <>
                <label>Metodo de pago</label>
                <select
                  value={method?.id}
                  onChange={(e) => {
                    const selectedIndex = e.target.selectedIndex;
                    const selectedName = e.target.options[selectedIndex].text;
                    setMethod((prev) => ({
                      ...prev,
                      id: e.target.value,
                      name: selectedName,
                    }));
                  }}
                  name="category_id"
                  id=""
                  className={classNames(
                    "bg-dark-50 px-3 h-[2.5rem] w-full max-w-[300px]  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none"
                  )}
                >
                  {methods?.map((method) => (
                    <option key={method?.id} value={method?.id}>
                      {method?.name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
          {typeShop === TypeShop?.Invoice && (
            <>
              <Title>Cliente {client ? "si hay" : "no hay"}</Title>
              <div className="w-full mt-5">
                <div>
                  <label htmlFor="">Nombre</label>
                  <TextField value={client?.client_name} onChange={(e) => setClient((prev) => ({ ...prev, client_name: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="">Apellido</label>
                  <TextField value={client?.client_surname} onChange={(e) => setClient((prev) => ({ ...prev, client_surname: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="">RUC</label>
                  <TextField value={client?.client_RUC_DNI} onChange={(e) => setClient((prev) => ({ ...prev, client_RUC_DNI: e.target.value }))} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Venta;
