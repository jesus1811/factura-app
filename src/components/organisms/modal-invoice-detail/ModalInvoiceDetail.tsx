import { Loader, Modal, Title } from "@/components/atoms";
import { IModalInvoiceDetailProps } from "./types";
import { useQuery } from "@tanstack/react-query";
import { getInvoiceDetails } from "@/services";
import moment from "moment";
import { useEffect } from "react";

export function ModalInvoiceDetail(props: IModalInvoiceDetailProps) {
  const { closeModal, isModal, invoiceId } = props;

  const { data: invoiceDetails = [], isFetching } = useQuery({ queryKey: ["getInvoiceDetails", invoiceId], queryFn: () => getInvoiceDetails({ invoiceId: invoiceId }) });

  const invoice = invoiceDetails?.find((invoiceDetail) => invoiceDetail)?.invoice;

  return (
    <Modal closeModal={closeModal} isModal={isModal} className="bg-black border-[0.0625rem] border-gray-500 rounded-lg w-full max-w-[480px] flex flex-col px-6 py-9 gap-5">
      <div className="flex justify-center">
        <Title>Detalle factura</Title>
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

          <p className="uppercase">
            NOMBRES: {invoice?.client_name} {invoice?.client_surname}
          </p>
          <p className="uppercase">RUC/C.I/PPT: {invoice?.client_RUC_DNI}</p>

          <hr className="border-gray-500 my-3" />

          <table className="mb-5 w-full">
            <thead>
              <tr>
                <td>COD.</td>
                <td>DESCR.</td>
                <td>CANT.</td>
                <td>P. UNIT.</td>
                <td>TOTAL</td>
              </tr>
            </thead>

            <tbody>
              {invoiceDetails?.map((invoiceDetail) => (
                <tr key={invoiceDetail?.id}>
                  <td>{invoiceDetail?.id}</td>
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
    </Modal>
  );
}

export default ModalInvoiceDetail;
