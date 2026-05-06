// ======================================================
// FILE: src/services/pdfService.js
// PURPOSE:
// Generate A4 PDF from quotation HTML
// ======================================================

import * as Print from 'expo-print';
import { generateQuotationHTML } from '../templates/quotationTemplate';

export const generatePDF = async (data) => {
  const html = generateQuotationHTML(data);

  // A4 size in points at 72 DPI:
  // A4 = 595 x 842 pt
  const { uri } = await Print.printToFileAsync({
    html,
    width: 595,
    height: 842,
  });

  return uri;
};