// ======================================================
// FILE: src/services/pdfService.js
// PURPOSE:
// Generate A4 PDF from quotation/invoice HTML
//
// IMPORTANT:
// - generatePDF is preserved for Quotation side.
// - generateInvoicePDF is added for Invoice side.
// ======================================================

import * as Print from 'expo-print';

import { generateQuotationHTML } from '../templates/quotationTemplate';
import { generateInvoiceHTML } from '../templates/invoiceTemplate';

// ======================================================
// QUOTATION SIDE PDF
// IMPORTANT:
// Existing Quotation flow uses this function.
// Do not rename or remove.
// ======================================================
export const generatePDF = async (data) => {
  const html = generateQuotationHTML(data);

  const { uri } = await Print.printToFileAsync({
    html,
    width: 595,
    height: 842,
  });

  return uri;
};

// ======================================================
// INVOICE SIDE PDF
// NEW:
// Separate Invoice PDF generator.
// Quotation side is not affected.
// ======================================================
export const generateInvoicePDF = async (invoiceData) => {
  const html = generateInvoiceHTML(invoiceData);

  const { uri } = await Print.printToFileAsync({
    html,
    width: 595,
    height: 842,
  });

  return uri;
};