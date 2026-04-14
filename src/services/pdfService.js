// src/services/pdfService.js:

import * as Print from 'expo-print';
import { generateQuotationHTML } from '../templates/quotationTemplate';

export const generatePDF = async (data) => {
  try {
    const html = generateQuotationHTML(data);

    const { uri } = await Print.printToFileAsync({
      html,
    });

    return uri;
  } catch (error) {
    console.log('PDF Generation Error:', error);
    throw error;
  }
};