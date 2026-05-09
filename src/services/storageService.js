// src/services/storageService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================================================
// QUOTATION SIDE STORAGE
// IMPORTANT:
// Existing Quotation logic is preserved.
// Do not rename or change these keys/functions unless needed.
// ==================================================

// ==================================================
// SINGLE SOURCE OF TRUTH
// ==================================================
const STORAGE_KEY = 'QUOTATIONS_HISTORY';
const DRAFT_STORAGE_KEY = 'QUOTATION_DRAFTS';

// ==================================================
// GET ALL QUOTATIONS
// ==================================================
export const getQuotations = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Fetch Error:', error);
    return [];
  }
};

// ==================================================
// SAVE SINGLE QUOTATION
// ==================================================
export const saveQuotation = async (quotation) => {
  try {
    const existing = await getQuotations();
    const updated = [quotation, ...existing];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return true;
  } catch (error) {
    console.log('Save Error:', error);
    return false;
  }
};

// ==================================================
// UPDATE QUOTATION
// ==================================================
export const updateQuotation = async (updatedQuotation) => {
  try {
    const existing = await getQuotations();

    const updated = existing.map((item) =>
      item.id === updatedQuotation.id ? updatedQuotation : item
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return true;
  } catch (error) {
    console.log('Update Error:', error);
    return false;
  }
};

// ==================================================
// DELETE QUOTATION
// ==================================================
export const deleteQuotation = async (id) => {
  try {
    const existing = await getQuotations();

    const filtered = existing.filter((item) => item.id !== id);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    return true;
  } catch (error) {
    console.log('Delete Error:', error);
    return false;
  }
};

// ==================================================
// BULK SAVE QUOTATIONS (IMPORT SYSTEM)
// ==================================================
export const saveAllQuotations = async (list) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    return true;
  } catch (error) {
    console.log('Bulk Save Error:', error);
    return false;
  }
};

// ==================================================
// CLEAR ALL QUOTATIONS (OPTIONAL)
// ==================================================
export const clearAllQuotations = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.log('Clear Error:', error);
    return false;
  }
};

// ==================================================
// QUOTATION SIDE DRAFT STORAGE
// IMPORTANT:
// Drafts are stored separately from final quotation history.
// This prevents draft items from mixing with HistoryScreen data.
// ==================================================

// ==================================================
// GET ALL DRAFTS
// ==================================================
export const getDraftQuotations = async () => {
  try {
    const data = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Draft Fetch Error:', error);
    return [];
  }
};

// ==================================================
// SAVE / UPSERT DRAFT
// If draft already exists, update it.
// If it is new, add it to the top of draft list.
// ==================================================
export const saveDraftQuotation = async (draftQuotation) => {
  try {
    const existing = await getDraftQuotations();

    const now = new Date().toISOString();

    const draftId =
      draftQuotation?.draftId ||
      draftQuotation?.id ||
      `draft_${Date.now().toString()}`;

    const normalizedDraft = {
      ...draftQuotation,
      id: draftId,
      draftId,
      isDraft: true,
      status: 'draft',
      createdAt: draftQuotation?.createdAt || now,
      updatedAt: now,
    };

    const alreadyExists = existing.some((item) => item.draftId === draftId);

    const updated = alreadyExists
      ? existing.map((item) =>
          item.draftId === draftId ? normalizedDraft : item
        )
      : [normalizedDraft, ...existing];

    await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));

    return true;
  } catch (error) {
    console.log('Draft Save Error:', error);
    return false;
  }
};

// ==================================================
// UPDATE DRAFT
// Same behavior as saveDraftQuotation for safety.
// ==================================================
export const updateDraftQuotation = async (updatedDraft) => {
  try {
    return await saveDraftQuotation(updatedDraft);
  } catch (error) {
    console.log('Draft Update Error:', error);
    return false;
  }
};

// ==================================================
// DELETE SINGLE DRAFT
// ==================================================
export const deleteDraftQuotation = async (draftId) => {
  try {
    const existing = await getDraftQuotations();

    const filtered = existing.filter((item) => {
      const itemDraftId = item.draftId || item.id;
      return itemDraftId !== draftId;
    });

    await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filtered));

    return true;
  } catch (error) {
    console.log('Draft Delete Error:', error);
    return false;
  }
};

// ==================================================
// CLEAR ALL DRAFTS
// ==================================================
export const clearDraftQuotations = async () => {
  try {
    await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
    return true;
  } catch (error) {
    console.log('Draft Clear Error:', error);
    return false;
  }
};

// ======================================================
// INVOICE SIDE MASTER STORAGE
// NEW FLOW:
//
// Single master storage for all invoice records.
// Draft and Saved invoices stay in the same storage array,
// but are separated by invoiceLifecycle.
//
// invoiceLifecycle:
// - 'draft' = incomplete invoice, shown in InvoiceDraftScreen
// - 'saved' = final/ready invoice, shown in InvoiceHistoryScreen
//
// IMPORTANT:
// - Quotation storage keys/functions above are not touched.
// - Same invoice ID updates existing record, not duplicate.
// - Draft → Saved and Saved → Draft movement is done by
//   changing invoiceLifecycle only.
// - Old invoice storage key is kept only for safe migration.
// ======================================================

const INVOICE_RECORDS_KEY = 'INVOICE_RECORDS';
const LEGACY_SAVED_INVOICES_KEY = 'SAVED_INVOICES';

const normalizeInvoiceLifecycle = (lifecycle) => {
  if (lifecycle === 'draft') {
    return 'draft';
  }

  return 'saved';
};

const createFallbackInvoiceId = () => {
  return `invoice_${Date.now().toString()}_${Math.random()
    .toString(16)
    .slice(2)}`;
};

const normalizeLegacyInvoiceRecord = (invoiceData = {}) => {
  const now = new Date().toISOString();

  const invoiceLifecycle = normalizeInvoiceLifecycle(
    invoiceData.invoiceLifecycle ||
      invoiceData.saveType ||
      invoiceData.invoiceSaveStatus ||
      'saved'
  );

  const id =
    invoiceData.id ||
    invoiceData.invoiceId ||
    invoiceData.draftId ||
    createFallbackInvoiceId();

  return {
    ...invoiceData,

    id,
    invoiceLifecycle,

    // Compatibility fields for current/older Invoice screens.
    saveType: invoiceLifecycle,
    invoiceSaveStatus: invoiceLifecycle,

    createdAt: invoiceData.createdAt || now,
    updatedAt: invoiceData.updatedAt || now,
  };
};

const prepareInvoiceRecord = (invoiceData = {}, lifecycle = 'saved') => {
  const now = new Date().toISOString();
  const invoiceLifecycle = normalizeInvoiceLifecycle(lifecycle);

  const id =
    invoiceData.id ||
    invoiceData.invoiceId ||
    invoiceData.draftId ||
    createFallbackInvoiceId();

  return {
    ...invoiceData,

    id,
    invoiceLifecycle,

    // Compatibility fields for current/older Invoice screens.
    saveType: invoiceLifecycle,
    invoiceSaveStatus: invoiceLifecycle,

    createdAt: invoiceData.createdAt || now,
    updatedAt: now,
  };
};

// ======================================================
// INVOICE SIDE: GET ALL MASTER RECORDS
// Includes safe migration from old SAVED_INVOICES key.
// ======================================================
export const getAllInvoiceRecords = async () => {
  try {
    const rawData = await AsyncStorage.getItem(INVOICE_RECORDS_KEY);

    if (rawData) {
      const parsedData = JSON.parse(rawData);
      return Array.isArray(parsedData) ? parsedData : [];
    }

    // ======================================================
    // INVOICE SIDE LEGACY MIGRATION
    // If old SAVED_INVOICES data exists from previous phase,
    // migrate it into INVOICE_RECORDS once.
    // ======================================================
    const legacyRawData = await AsyncStorage.getItem(LEGACY_SAVED_INVOICES_KEY);

    if (!legacyRawData) {
      return [];
    }

    const legacyParsedData = JSON.parse(legacyRawData);
    const legacyList = Array.isArray(legacyParsedData)
      ? legacyParsedData
      : [];

    const migratedRecords = legacyList.map(normalizeLegacyInvoiceRecord);

    await AsyncStorage.setItem(
      INVOICE_RECORDS_KEY,
      JSON.stringify(migratedRecords)
    );

    return migratedRecords;
  } catch (error) {
    console.log('Get All Invoice Records Error:', error);
    return [];
  }
};

// ======================================================
// INVOICE SIDE: SAVE ALL MASTER RECORDS
// ======================================================
export const saveAllInvoiceRecords = async (records = []) => {
  try {
    await AsyncStorage.setItem(INVOICE_RECORDS_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.log('Save All Invoice Records Error:', error);
    return false;
  }
};

// ======================================================
// INVOICE SIDE: UPSERT MASTER RECORD
// Same invoice id updates existing record.
// If id is missing but invoiceNumber matches, it also updates.
// This prevents duplicate records during Draft ↔ Saved flow.
// ======================================================
export const upsertInvoiceRecord = async (
  invoiceData = {},
  lifecycle = 'saved'
) => {
  try {
    const existingRecords = await getAllInvoiceRecords();
    let preparedRecord = prepareInvoiceRecord(invoiceData, lifecycle);

    const existingMatch = existingRecords.find((item) => {
      const sameId = item.id && item.id === preparedRecord.id;

      const sameInvoiceNumber =
        preparedRecord.invoiceNumber &&
        item.invoiceNumber &&
        item.invoiceNumber === preparedRecord.invoiceNumber;

      return sameId || sameInvoiceNumber;
    });

    if (existingMatch) {
      preparedRecord = {
        ...preparedRecord,

        // Keep the original permanent internal id.
        id: existingMatch.id,

        // Keep original createdAt so update does not look like new item.
        createdAt: existingMatch.createdAt || preparedRecord.createdAt,
      };
    }

    const filteredRecords = existingRecords.filter((item) => {
      const sameId = item.id && item.id === preparedRecord.id;

      const sameInvoiceNumber =
        preparedRecord.invoiceNumber &&
        item.invoiceNumber &&
        item.invoiceNumber === preparedRecord.invoiceNumber;

      return !sameId && !sameInvoiceNumber;
    });

    const nextRecords = [preparedRecord, ...filteredRecords];

    await saveAllInvoiceRecords(nextRecords);

    return true;
  } catch (error) {
    console.log('Upsert Invoice Record Error:', error);
    return false;
  }
};

// ======================================================
// INVOICE SIDE: GET ONLY DRAFT INVOICES
// Used by future InvoiceDraftScreen.
// ======================================================
export const getInvoiceDrafts = async () => {
  try {
    const records = await getAllInvoiceRecords();

    return records.filter((item) => item.invoiceLifecycle === 'draft');
  } catch (error) {
    console.log('Get Invoice Drafts Error:', error);
    return [];
  }
};

// ======================================================
// INVOICE SIDE: GET ONLY SAVED / FINAL INVOICES
// Used by InvoiceHistoryScreen.
// ======================================================
export const getInvoices = async () => {
  try {
    const records = await getAllInvoiceRecords();

    return records.filter((item) => item.invoiceLifecycle === 'saved');
  } catch (error) {
    console.log('Get Saved Invoices Error:', error);
    return [];
  }
};

// ======================================================
// INVOICE SIDE: SAVE DRAFT
// Incomplete invoice → Draft page.
// ======================================================
export const saveInvoiceDraft = async (invoiceData = {}) => {
  return upsertInvoiceRecord(invoiceData, 'draft');
};

// ======================================================
// INVOICE SIDE: SAVE FINAL / READY INVOICE
// Complete invoice → History page.
//
// NOTE:
// lifecycle parameter is kept for backward compatibility.
// Existing calls like saveInvoice(data, 'draft') will still work,
// but new CreateInvoiceScreen should use saveInvoiceDraft(data).
// ======================================================
export const saveInvoice = async (invoiceData = {}, lifecycle = 'saved') => {
  return upsertInvoiceRecord(invoiceData, lifecycle);
};

// ======================================================
// INVOICE SIDE: UPDATE RECORD BY ID
// Keeps same id and prevents duplicate.
// ======================================================
export const updateInvoice = async (invoiceId, updatedData = {}) => {
  try {
    const existingRecords = await getAllInvoiceRecords();

    const nextRecords = existingRecords.map((item) => {
      if (item.id !== invoiceId) {
        return item;
      }

      const nextLifecycle = normalizeInvoiceLifecycle(
        updatedData.invoiceLifecycle ||
          updatedData.saveType ||
          updatedData.invoiceSaveStatus ||
          item.invoiceLifecycle ||
          'saved'
      );

      return {
        ...item,
        ...updatedData,

        // Keep original permanent id.
        id: item.id,

        invoiceLifecycle: nextLifecycle,
        saveType: nextLifecycle,
        invoiceSaveStatus: nextLifecycle,

        createdAt: item.createdAt || updatedData.createdAt,
        updatedAt: new Date().toISOString(),
      };
    });

    await saveAllInvoiceRecords(nextRecords);

    return true;
  } catch (error) {
    console.log('Update Invoice Error:', error);
    return false;
  }
};

// ======================================================
// INVOICE SIDE: DELETE RECORD FROM MASTER STORAGE
// Works for both Draft and Saved invoices.
// ======================================================
export const deleteInvoiceRecord = async (invoiceId) => {
  try {
    const existingRecords = await getAllInvoiceRecords();

    const nextRecords = existingRecords.filter((item) => item.id !== invoiceId);

    await saveAllInvoiceRecords(nextRecords);

    return true;
  } catch (error) {
    console.log('Delete Invoice Record Error:', error);
    return false;
  }
};

// ======================================================
// INVOICE SIDE: DELETE COMPATIBILITY ALIAS
// Existing InvoiceHistoryScreen code may already call deleteInvoice().
// This now deletes from master storage.
// ======================================================
export const deleteInvoice = async (invoiceId) => {
  return deleteInvoiceRecord(invoiceId);
};

// ======================================================
// INVOICE SIDE: BULK SAVE COMPATIBILITY
// Saves provided invoices as master records.
// Existing code can call saveAllInvoices() if needed.
// ======================================================
export const saveAllInvoices = async (invoices = []) => {
  const normalizedRecords = invoices.map((item) =>
    normalizeLegacyInvoiceRecord(item)
  );

  return saveAllInvoiceRecords(normalizedRecords);
};

// ======================================================
// INVOICE SIDE: CLEAR FINAL/SAVED INVOICES ONLY
// Drafts remain in master storage.
// ======================================================
export const clearAllInvoices = async () => {
  try {
    const records = await getAllInvoiceRecords();

    const draftOnlyRecords = records.filter(
      (item) => item.invoiceLifecycle === 'draft'
    );

    await saveAllInvoiceRecords(draftOnlyRecords);

    return true;
  } catch (error) {
    console.log('Clear Saved Invoices Error:', error);
    return false;
  }
};

// ======================================================
// INVOICE SIDE: CLEAR DRAFT INVOICES ONLY
// Saved/final invoices remain in master storage.
// ======================================================
export const clearInvoiceDrafts = async () => {
  try {
    const records = await getAllInvoiceRecords();

    const savedOnlyRecords = records.filter(
      (item) => item.invoiceLifecycle === 'saved'
    );

    await saveAllInvoiceRecords(savedOnlyRecords);

    return true;
  } catch (error) {
    console.log('Clear Invoice Drafts Error:', error);
    return false;
  }
};

// ======================================================
// INVOICE SIDE: CLEAR ALL INVOICE RECORDS
// Removes both Draft and Saved invoice records.
// Quotation data is not touched.
// ======================================================
export const clearAllInvoiceRecords = async () => {
  try {
    await AsyncStorage.removeItem(INVOICE_RECORDS_KEY);
    return true;
  } catch (error) {
    console.log('Clear All Invoice Records Error:', error);
    return false;
  }
};