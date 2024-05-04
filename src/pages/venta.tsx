import { Button, TextField, Title } from "@/components/atoms";
import { DataTable, IRows, Icolumns } from "@/components/organisms";
import { Layout } from "@/components/templates";
import { addInvoice, getAllProducts } from "@/services";
import { useCartStore } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
export function Venta() {
  const { cart, addCart, loadStore, clearStorage, changeCountProduct } = useCartStore();
  const { data: products = [] } = useQuery({ queryKey: ["getAllProducts"], queryFn: getAllProducts });

  const { mutate: addInvoiceMutate } = useMutation({
    mutationFn: addInvoice,
    onSuccess: () => {
      toast("Compra realizada correctamente");
      clearStorage();
    },
  });

  const [countProductFind, setCountProductFind] = useState<number>();

  const [search, setSearch] = useState<string>("");

  const [client, setClient] = useState<{ client_name: string; client_surname: string; client_RUC_DNI: string }>({} as { client_name: string; client_surname: string; client_RUC_DNI: string });

  const total = cart.reduce((sum, product) => {
    return sum + Number(product.price) * (product?.count || 1);
  }, 0);

  const renderValidateaddInvoice = () => {
    if (!cart || !total) {
      toast("no hay productos para vender");
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

  const handleChangeClient = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClient({
      ...client,
      [name]: value,
    });
  };

  const rows: IRows[] = cart?.map((product) => ({
    ...product,
    category: product?.category?.name,
    count: <TextField value={product?.count} onChange={(e) => changeCountProduct(product?.id, Number(e.currentTarget.value))} placeholder="cantidad" />,
    Total: Number(product?.price) * product?.count,
    settings: (
      <button className="ml-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    ),
  }));

  const UUID = uuidv4();
  const igv = total * (0.18 / (1 + 0.18));
  const subTotal = total - igv;

  const productFind = products.find((product) => product?.name === search || product?.id === search);

  useEffect(() => {
    loadStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      <Title>Cliente</Title>
      <div className="flex gap-4 items-center mt-6">
        <div>
          <label htmlFor="">Nombre</label>
          <TextField onChange={handleChangeClient} value={client?.client_name || ""} name="client_name" />
        </div>
        <div>
          <label htmlFor="">Apellido</label>
          <TextField onChange={handleChangeClient} value={client?.client_surname || ""} name="client_surname" />
        </div>
        <div>
          <label htmlFor="">DNI / RUC</label>
          <TextField onChange={handleChangeClient} value={client?.client_RUC_DNI || ""} name="client_RUC_DNI" />
        </div>
      </div>

      <div className="flex gap-3 items-center mt-5">
        <Title>Detalle producto</Title>
        <div className="flex  gap-2">
          <TextField isFull className="w-[37.5rem]" list="products" value={search} placeholder="Buscar producto" onChange={(event) => setSearch(event.currentTarget.value)} />
          <datalist id="products">
            {products?.map((product) => (
              <option key={product?.id} value={product?.name}>
                {product?.id}
              </option>
            ))}
          </datalist>
          {productFind && (
            <Button
              onClick={() => {
                addCart({ ...productFind, count: countProductFind || 0 });
                setSearch("");
                setCountProductFind(0);
              }}
            >
              Agregar
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 aspect-square">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center mt-5">
        <div>
          <label htmlFor="">Codigo</label>
          <TextField value={productFind?.id || ""} disabled />
        </div>
        <div>
          <label htmlFor="">Nombre</label>
          <TextField value={productFind?.name || ""} disabled />
        </div>
        <div>
          <label htmlFor="">Precio</label>
          <TextField value={productFind?.price || ""} disabled />
        </div>
        <div>
          <label htmlFor="">Cantidad</label>
          <TextField value={countProductFind || ""} onChange={(e) => setCountProductFind(Number(e.currentTarget?.value))} />
        </div>
      </div>
      <DataTable columns={columns} rows={rows} className="mt-6" />

      <div className="w-full flex  flex-col items-end mt-5">
        <p>subtotal: {subTotal}</p>
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
                  client_name: client?.client_name || "unknow",
                  client_RUC_DNI: client?.client_RUC_DNI || "unknow",
                  client_surname: client?.client_surname || "unknow",
                  desc: 0,
                  subTotal: subTotal,
                  total: total,
                  id: UUID,
                },
              });
            }}
            variant="Shop"
          >
            Realizar venta
          </Button>
          <Button variant="Alert" onClick={() => clearStorage()}>
            Limpiar tabla
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default Venta;
