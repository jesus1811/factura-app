import { create } from "xmlbuilder2";
import { SignedXml } from "xml-crypto";
import axios from "axios";
import path from "path";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { IInvoice, IInvoiceDetail } from "@/services";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { invoice, invoiceDetails } = req.body as { invoice: IInvoice; invoiceDetails: IInvoiceDetail[] };

    try {
      // Generar el XML
      const invoiceXML = create({ version: "1.0", encoding: "UTF-8" })
        .ele("Invoice", {
          xmlns: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
          "xmlns:cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
          "xmlns:cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
        })
        .ele("cbc:ID")
        .txt(invoice.id)
        .up()
        .ele("cbc:IssueDate")
        .txt(moment(invoice.created_at).format("YYYY-MM-DD"))
        .up()
        // Añadir otros elementos necesarios según las especificaciones de SUNAT
        .ele("cac:AccountingSupplierParty")
        .ele("cbc:CustomerAssignedAccountID")
        .txt("1034567888")
        .up()
        .ele("cbc:AdditionalAccountID")
        .txt("6")
        .up()
        .ele("cac:Party")
        .ele("cac:PartyLegalEntity")
        .ele("cbc:RegistrationName")
        .txt("Jesudev SAC")
        .up()
        .up()
        .up()
        .up()
        .ele("cac:AccountingCustomerParty")
        .ele("cbc:CustomerAssignedAccountID")
        .txt(invoice.client_RUC_DNI)
        .up()
        .ele("cbc:AdditionalAccountID")
        .txt("6")
        .up()
        .ele("cac:Party")
        .ele("cac:PartyLegalEntity")
        .ele("cbc:RegistrationName")
        .txt(`${invoice.client_name} ${invoice.client_surname}`)
        .up()
        .up()
        .up()
        .up()
        .ele("cac:TaxTotal")
        .ele("cbc:TaxAmount", { currencyID: "PEN" })
        .txt(((invoice.total || 0) - (invoice.subTotal || 0)).toFixed(2))
        .up()
        .up()
        .ele("cac:LegalMonetaryTotal")
        .ele("cbc:PayableAmount", { currencyID: "PEN" })
        .txt(`${invoice.total}`)
        .up()
        .up()
        .ele("cac:InvoiceLine")
        .ele("cbc:ID")
        .txt("1")
        .up()
        .ele("cbc:InvoicedQuantity", { unitCode: "NIU" })
        .txt(`${invoiceDetails[0].stock}`)
        .up()
        .ele("cbc:LineExtensionAmount", { currencyID: "PEN" })
        .txt(`${invoiceDetails[0].price * invoiceDetails[0].stock}`)
        .up()
        .ele("cac:PricingReference")
        .ele("cac:AlternativeConditionPrice")
        .ele("cbc:PriceAmount", { currencyID: "PEN" })
        .txt(`${invoiceDetails[0].price}`)
        .up()
        .up()
        .up()
        .up()
        .end({ prettyPrint: true });

      // Firmar el XML
      const sig = new SignedXml();

      sig.addReference({
        uri: "//*[local-name()='Invoice']",
        digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
        transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"],
      });

      sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
      // const privateKey = fs.readFileSync(path.join(process.cwd(), "path/to/your/private_key.pem"));
      // sig.loadSignature(`${privateKey}`);

      // // Firmar el XML
      sig.computeSignature(invoiceXML.toString());

      // // Obtener el XML firmado
      const signedXml = sig.getSignedXml();

      // Enviar el XML firmado a SUNAT
      const response = await axios.post("https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService", signedXml, {
        headers: { "Content-Type": "application/xml" },
      });

      // Manejar la respuesta de SUNAT
      console.log("Respuesta de SUNAT:", response.data);

      res.status(200).json({ success: true, data: "ok" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
