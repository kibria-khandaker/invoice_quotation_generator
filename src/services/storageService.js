// src/services/storageService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================================================
// SINGLE SOURCE OF TRUTH
// ==================================================
const STORAGE_KEY = 'QUOTATIONS_HISTORY';


// ==================================================
// GET ALL
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
// SAVE SINGLE
// ==================================================
export const saveQuotation = async (quotation) => {
  try {
    const existing = await getQuotations();
    const updated = [quotation, ...existing];

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    return true;
  } catch (error) {
    console.log('Save Error:', error);
    return false;
  }
};


// ==================================================
// UPDATE
// ==================================================
export const updateQuotation = async (updatedQuotation) => {
  try {
    const existing = await getQuotations();

    const updated = existing.map(item =>
      item.id === updatedQuotation.id
        ? updatedQuotation
        : item
    );

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    return true;
  } catch (error) {
    console.log('Update Error:', error);
    return false;
  }
};


// ==================================================
// DELETE
// ==================================================
export const deleteQuotation = async (id) => {
  try {
    const existing = await getQuotations();

    const filtered = existing.filter(item => item.id !== id);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(filtered)
    );

    return true;
  } catch (error) {
    console.log('Delete Error:', error);
    return false;
  }
};


// ==================================================
// BULK SAVE (IMPORT SYSTEM)
// ==================================================
export const saveAllQuotations = async (list) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list)
    );

    return true;
  } catch (error) {
    console.log('Bulk Save Error:', error);
    return false;
  }
};


// ==================================================
// CLEAR ALL (OPTIONAL)
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