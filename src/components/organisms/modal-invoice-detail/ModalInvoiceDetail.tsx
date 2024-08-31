import { Button, Loader, Modal, Title } from "@/components/atoms";
import { IModalInvoiceDetailProps } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TypeShop, deleteInvoice, getInvoiceDetails } from "@/services";
import moment from "moment";
import { toast } from "sonner";
import axios from "axios";

export function ModalInvoiceDetail(props: IModalInvoiceDetailProps) {
  const { closeModal, isModal, invoiceId } = props;
  const queryClient = useQueryClient();
  const { data: invoiceDetails = [], isFetching } = useQuery({ queryKey: ["getInvoiceDetails", invoiceId], queryFn: () => getInvoiceDetails({ invoiceId: invoiceId }), enabled: isModal });
  const { mutate: deleteInvoiceMutate } = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInvoices"] });
      toast("Venta eliminada correctamente", { className: "!bg-primary-500" });
      closeModal();
    },
    onError: () => {
      toast("Error al eliminar venta", { className: "!bg-alertError" });
    },
  });

  const invoice = invoiceDetails?.find((invoiceDetail) => invoiceDetail)?.invoice;

  const sendInvoiceToSunat = async () => {
    try {
      const response = await axios.post("/api/sunat", { invoice, invoiceDetails });
      if (response.data.success) {
        toast("Factura enviada a SUNAT correctamente", { className: "!bg-primary-500" });
      } else {
        toast("Error al enviar la factura a SUNAT", { className: "!bg-alertError" });
      }
    } catch (error) {
      toast("Error al enviar la factura a SUNAT", { className: "!bg-alertError" });
    }
  };

  const printInvoiceDetail = () => {
    const contentPrint = document.getElementById("invoice");
    if (!contentPrint) return;
    const winPrint = window.open("", "_blank");
    if (!winPrint) return;
    winPrint.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                    #invoice {
                      padding-left: 64px;
                      padding-right: 64px;
                      width: 100%;
                      max-width: 500px;
                      margin: 0 auto;
                    }
                    </style>
                </head>
                <body>
                    ${contentPrint.outerHTML}
                </body>
                </html>
            `);

    winPrint.document.close();
    winPrint.onload = function () {
      winPrint.print();
    };
  };

  return (
    <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[480px] flex flex-col px-6 py-9 gap-5">
      <div className="flex justify-center">
        <Title>
          Detalle {invoice?.type} - {invoice?.invoice_method?.name}
        </Title>
      </div>
      {isFetching && <Loader />}
      {!isFetching && (
        <div className=" py-5 px-5 text-sm" id="invoice">
          <p className="text-center uppercase">Jesudev SAC</p>
          <p className="text-center mb-5 uppercase">AV tunga suca - Comas</p>

          <p className="font-bold">
            RUC: <span className="font-normal">1034567888</span>
          </p>
          <p className="font-bold">
            Nº FACTURA: <span className="font-normal">{invoice?.id}</span>
          </p>

          <p className="font-bold">
            FECHA EMISIÓN: <span className="font-normal">{moment.utc(invoice?.created_at).local().format("D [de] MMMM [del] YYYY [a las] h:mm a")}</span>
          </p>

          <hr className="border-gray-500 my-3" />

          {invoice?.type === TypeShop.Invoice && (
            <div className="w-full">
              <p className="uppercase">
                NOMBRES: {invoice?.client_name} {invoice?.client_surname}
              </p>
              <p className="uppercase">RUC: {invoice?.client_RUC_DNI}</p>
              <hr className="border-gray-500 my-3" />
            </div>
          )}

          <table className="mb-5 w-full">
            <thead>
              <tr>
                <td>DESCR.</td>
                <td>CANT.</td>
                <td>P. UNIT.</td>
                <td>TOTAL</td>
              </tr>
            </thead>

            <tbody>
              {invoiceDetails?.map((invoiceDetail) => (
                <tr key={invoiceDetail?.id}>
                  <td>{invoiceDetail?.product?.name}</td>
                  <td>{invoiceDetail?.stock}</td>
                  <td>{invoiceDetail?.price}</td>
                  <td>{invoiceDetail?.price * invoiceDetail?.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>SUBTOTAL: {invoice?.subTotal}</p>
          <p>IVA 18%: {((invoice?.total || 0) - (invoice?.subTotal || 0))?.toFixed(2)}</p>
          <p>DESCUENTO: 0</p>
          <p>TOTAL: {invoice?.total}</p>

          <p className="pt-5 text-center">MUCHAS GRACIAS POR SU COMPRA</p>
        </div>
      )}
      <div className="px-5 flex w-full gap-2">
        <Button onClick={printInvoiceDetail}>
          Imprimir{" "}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
            />
          </svg>
        </Button>
        {invoice && (
          <Button variant="Alert" onClick={() => deleteInvoiceMutate({ invoiceId: invoice?.id, invoiceDetails: invoiceDetails })}>
            Eliminar
          </Button>
        )}
      </div>
    </Modal>
  );
}

export default ModalInvoiceDetail;
