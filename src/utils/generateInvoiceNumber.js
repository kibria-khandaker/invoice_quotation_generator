// src/utils/generateInvoiceNumber.js

// ======================================================
// INVOICE SIDE NUMBER GENERATOR
// NEW:
// Generates Invoice number separately from Quotation number.
//
// Format:
// DDMMYYI1001
//
// Example:
// 080526I1001
//
// IMPORTANT:
// - Quotation generator is not imported or edited.
// - Invoice uses "I" prefix.
// - Quotation uses its own existing flow.
// ======================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

const INVOICE_COUNTER_PREFIX = 'INVOICE_COUNTER';

export const generateInvoiceNumber = async () => {
  try {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);

    const dateKey = `${now.getFullYear()}-${month}-${day}`;
    const storageKey = `${INVOICE_COUNTER_PREFIX}_${dateKey}`;

    const savedCount = await AsyncStorage.getItem(storageKey);

    let nextCount = 1001;

    if (savedCount) {
      const parsedCount = parseInt(savedCount, 10);

      if (!Number.isNaN(parsedCount)) {
        nextCount = parsedCount + 1;
      }
    }

    await AsyncStorage.setItem(storageKey, String(nextCount));

    return `${day}${month}${year}IN${nextCount}`;
  } catch (error) {
    console.log('Invoice Number Generate Error:', error);

    return `INV-${Date.now()}`;
  }
};