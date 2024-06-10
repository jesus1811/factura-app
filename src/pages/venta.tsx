import { Button, Icon, Loader, TextField, Title } from "@/components/atoms";
import { DataTable, IRows, Icolumns } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { IInvoiceMethod, TypeShop, addInvoice, getAllProducts, getInvoiceMethods } from "@/services";
import { useCartStore } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
export function Venta() {
  const { cart, addCart, loadStore, clearStorage, changeProduct, deleteProduct } = useCartStore();
  const { data: products = [] } = useQuery({ queryKey: ["getAllProducts"], queryFn: () => getAllProducts({}) });
  const { data: methods, isLoading } = useQuery({ queryKey: ["getInvoiceMethods"], queryFn: getInvoiceMethods });
  const queryClient = useQueryClient();
  const { mutate: addInvoiceMutate, isPending } = useMutation({
    mutationFn: addInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInvoices"] });
      queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });
      toast("Venta realizada correctamente", { className: "!bg-primary-500" });
      clearStorage();
    },
    onError: () => {
      toast("Error al realizar venta", { className: "!bg-alertError" });
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
      return false;
    }
    if (isPending) return false;
    if (typeShop === TypeShop?.Receipt) {
      return true;
    }
    if (!client?.client_name || !client?.client_surname || !client?.client_RUC_DNI) {
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
    count: <TextField className="border-transparent" value={product?.count?.toString()} onChange={(e) => changeProduct({ ...product, count: Number(e.currentTarget.value) })} placeholder="Cantidad" />,
    price: <TextField className="border-transparent" value={product?.price} onChange={(e) => changeProduct({ ...product, price: e.currentTarget.value })} placeholder="Precio" />,
    Total: Number(product?.price) * product?.count,
    settings: (
      <button className="ml-5" onClick={() => deleteProduct(product)}>
        <Icon variant="delete" />
      </button>
    ),
  }));

  useEffect(() => {
    loadStore();
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
      <Head>
        <title>Venta</title>
      </Head>
      <div className="flex gap-5 w-full h-full">
        <div className="w-full  h-full">
          <div className="flex gap-4 items-end w-full">
            <TextField className="w-[400px]" list="products" value={search} placeholder="Buscar producto" onChange={(event) => setSearch(event.currentTarget.value)} />
            <datalist id="products">
              {products
                ?.filter((product) => Number(product?.stock || 0) !== 0)
                .map((product) => (
                  <option key={product?.id} value={product?.name}>
                    {product?.id}
                  </option>
                ))}
            </datalist>
            <div>
              <label htmlFor="">Precio</label>
              <TextField type="number" value={productFind ? productPrice?.toString() : ""} onChange={(e) => setProductPrice(Number(e.currentTarget?.value))} />
            </div>
            <div>
              <label htmlFor="">Cantidad</label>
              <TextField
                type="number"
                error={productFind && Number(productFind?.stock || 0) < productCount ? "No hay stock en el inventario" : undefined}
                value={productFind ? productCount?.toString() : ""}
                onChange={(e) => setProducCount(Number(e.currentTarget?.value))}
              />
            </div>

            {productFind && (
              <Button
                isDisabled={Number(productFind?.stock || 0) < productCount}
                onClick={() => {
                  addCart({ ...productFind, count: productCount || 0, price: productPrice?.toString() });
                  setSearch("");
                  setProducCount(1);
                }}
              >
                Agregar
                <Icon variant="add" />
              </Button>
            )}
          </div>
          <DataTable columns={columns} rows={rows} className="mt-6" />

          <div className="w-full flex  flex-col items-end mt-5">
            <p>subtotal: S/{subTotal?.toFixed(2)}</p>
            <p>igv(18%): S/{igv?.toFixed(2)}</p>
            <Title>Total a pagar</Title>
            <Title>S/{total}</Title>
            <div className="flex gap-2 mt-5">
              <Button
                isDisabled={!renderValidateaddInvoice()}
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
                  <label>Nombre</label>
                  <TextField error={client?.client_name ? undefined : "Requerido"} value={client?.client_name} onChange={(e) => setClient((prev) => ({ ...prev, client_name: e.target.value }))} />
                </div>
                <div>
                  <label>Apellido</label>
                  <TextField
                    error={client?.client_surname ? undefined : "Requerido"}
                    value={client?.client_surname}
                    onChange={(e) => setClient((prev) => ({ ...prev, client_surname: e.target.value }))}
                  />
                </div>
                <div>
                  <label>RUC</label>
                  <TextField
                    error={client?.client_RUC_DNI ? undefined : "Requerido"}
                    value={client?.client_RUC_DNI}
                    onChange={(e) => setClient((prev) => ({ ...prev, client_RUC_DNI: e.target.value }))}
                  />
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
