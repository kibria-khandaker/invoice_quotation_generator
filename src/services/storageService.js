// src/services/storageService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

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
// DRAFT QUOTATION STORAGE
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