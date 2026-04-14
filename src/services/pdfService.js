// src/services/pdfService.js:

import * as Print from 'expo-print';
import { generateQuotationHTML } from '../templates/quotationTemplate';

export const generatePDF = async (data) => {
  const html = generateQuotationHTML(data);

  const { uri } = await Print.printToFileAsync({ html });

  return uri;
};