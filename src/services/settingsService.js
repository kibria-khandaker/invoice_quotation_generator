import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPANY_PROFILES_KEY = '@settings_company_profiles';
const CLIENT_PROFILES_KEY = '@settings_client_profiles';
const ITEM_CATALOG_KEY = '@settings_item_catalog';
const PAYMENT_PROFILES_KEY = '@settings_payment_profiles';
const MOBILE_PAYMENT_PROFILES_KEY = '@settings_mobile_payment_profiles';
const SIGNATURE_PROFILES_KEY = '@settings_signature_profiles';
const NOTE_TEMPLATES_KEY = '@settings_note_templates';

const safeParse = (value, fallback = []) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getItems = async (key) => {
  const data = await AsyncStorage.getItem(key);
  return safeParse(data, []);
};

const saveItems = async (key, items) => {
  await AsyncStorage.setItem(key, JSON.stringify(items));
  return items;
};

const upsertItem = async (key, profile) => {
  const profiles = await getItems(key);

  const isEditing = profiles.some((item) => item.id === profile.id);

  let updatedProfiles = isEditing
    ? profiles.map((item) => (item.id === profile.id ? profile : item))
    : [profile, ...profiles];

  if (profile.isDefault) {
    updatedProfiles = updatedProfiles.map((item) => ({
      ...item,
      isDefault: item.id === profile.id,
    }));
  }

  if (updatedProfiles.length === 1) {
    updatedProfiles[0].isDefault = true;
  }

  const hasDefault = updatedProfiles.some((item) => item.isDefault);

  if (!hasDefault && updatedProfiles.length > 0) {
    updatedProfiles[0].isDefault = true;
  }

  await saveItems(key, updatedProfiles);
  return updatedProfiles;
};

const deleteItem = async (key, id) => {
  const profiles = await getItems(key);

  const deletedItem = profiles.find((item) => item.id === id);
  let updatedProfiles = profiles.filter((item) => item.id !== id);

  if (deletedItem?.isDefault && updatedProfiles.length > 0) {
    updatedProfiles[0].isDefault = true;
  }

  const hasDefault = updatedProfiles.some((item) => item.isDefault);

  if (!hasDefault && updatedProfiles.length > 0) {
    updatedProfiles[0].isDefault = true;
  }

  await saveItems(key, updatedProfiles);
  return updatedProfiles;
};

const setDefaultItem = async (key, id) => {
  const profiles = await getItems(key);

  const updatedProfiles = profiles.map((item) => ({
    ...item,
    isDefault: item.id === id,
  }));

  await saveItems(key, updatedProfiles);
  return updatedProfiles;
};

// For catalog-style data where no default item is needed.
const upsertCatalogItem = async (key, catalogItem) => {
  const items = await getItems(key);

  const isEditing = items.some((item) => item.id === catalogItem.id);

  const updatedItems = isEditing
    ? items.map((item) => (item.id === catalogItem.id ? catalogItem : item))
    : [catalogItem, ...items];

  await saveItems(key, updatedItems);
  return updatedItems;
};

const deleteCatalogItem = async (key, id) => {
  const items = await getItems(key);
  const updatedItems = items.filter((item) => item.id !== id);

  await saveItems(key, updatedItems);
  return updatedItems;
};

// ======================================================
// Company Profiles
// ======================================================
export const getCompanyProfiles = async () => {
  return getItems(COMPANY_PROFILES_KEY);
};

export const saveCompanyProfiles = async (profiles) => {
  return saveItems(COMPANY_PROFILES_KEY, profiles);
};

export const upsertCompanyProfile = async (profile) => {
  return upsertItem(COMPANY_PROFILES_KEY, profile);
};

export const deleteCompanyProfile = async (id) => {
  return deleteItem(COMPANY_PROFILES_KEY, id);
};

export const setDefaultCompanyProfile = async (id) => {
  return setDefaultItem(COMPANY_PROFILES_KEY, id);
};

// ======================================================
// Client Profiles
// ======================================================
export const getClientProfiles = async () => {
  return getItems(CLIENT_PROFILES_KEY);
};

export const saveClientProfiles = async (profiles) => {
  return saveItems(CLIENT_PROFILES_KEY, profiles);
};

export const upsertClientProfile = async (profile) => {
  return upsertItem(CLIENT_PROFILES_KEY, profile);
};

export const deleteClientProfile = async (id) => {
  return deleteItem(CLIENT_PROFILES_KEY, id);
};

export const setDefaultClientProfile = async (id) => {
  return setDefaultItem(CLIENT_PROFILES_KEY, id);
};

// ======================================================
// Items Catalog
// ======================================================
export const getCatalogItems = async () => {
  return getItems(ITEM_CATALOG_KEY);
};

export const saveCatalogItems = async (items) => {
  return saveItems(ITEM_CATALOG_KEY, items);
};

export const upsertCatalogItemProfile = async (item) => {
  return upsertCatalogItem(ITEM_CATALOG_KEY, item);
};

export const deleteCatalogItemProfile = async (id) => {
  return deleteCatalogItem(ITEM_CATALOG_KEY, id);
};

// ======================================================
// Payment Profiles
// ======================================================
export const getPaymentProfiles = async () => {
  return getItems(PAYMENT_PROFILES_KEY);
};

export const savePaymentProfiles = async (profiles) => {
  return saveItems(PAYMENT_PROFILES_KEY, profiles);
};

export const upsertPaymentProfile = async (profile) => {
  return upsertItem(PAYMENT_PROFILES_KEY, profile);
};

export const deletePaymentProfile = async (id) => {
  return deleteItem(PAYMENT_PROFILES_KEY, id);
};

export const setDefaultPaymentProfile = async (id) => {
  return setDefaultItem(PAYMENT_PROFILES_KEY, id);
};

// ======================================================
// Mobile Payment Profiles
// ======================================================
export const getMobilePaymentProfiles = async () => {
  return getItems(MOBILE_PAYMENT_PROFILES_KEY);
};

export const saveMobilePaymentProfiles = async (profiles) => {
  return saveItems(MOBILE_PAYMENT_PROFILES_KEY, profiles);
};

export const upsertMobilePaymentProfile = async (profile) => {
  return upsertItem(MOBILE_PAYMENT_PROFILES_KEY, profile);
};

export const deleteMobilePaymentProfile = async (id) => {
  return deleteItem(MOBILE_PAYMENT_PROFILES_KEY, id);
};

export const setDefaultMobilePaymentProfile = async (id) => {
  return setDefaultItem(MOBILE_PAYMENT_PROFILES_KEY, id);
};

// ======================================================
// Signature Profiles
// ======================================================
export const getSignatureProfiles = async () => {
  return getItems(SIGNATURE_PROFILES_KEY);
};

export const saveSignatureProfiles = async (profiles) => {
  return saveItems(SIGNATURE_PROFILES_KEY, profiles);
};

export const upsertSignatureProfile = async (profile) => {
  return upsertItem(SIGNATURE_PROFILES_KEY, profile);
};

export const deleteSignatureProfile = async (id) => {
  return deleteItem(SIGNATURE_PROFILES_KEY, id);
};

export const setDefaultSignatureProfile = async (id) => {
  return setDefaultItem(SIGNATURE_PROFILES_KEY, id);
};

// ======================================================
// Note Templates
// ======================================================
export const getNoteTemplates = async () => {
  return getItems(NOTE_TEMPLATES_KEY);
};

export const saveNoteTemplates = async (templates) => {
  return saveItems(NOTE_TEMPLATES_KEY, templates);
};

export const upsertNoteTemplate = async (template) => {
  return upsertItem(NOTE_TEMPLATES_KEY, template);
};

export const deleteNoteTemplate = async (id) => {
  return deleteItem(NOTE_TEMPLATES_KEY, id);
};

export const setDefaultNoteTemplate = async (id) => {
  return setDefaultItem(NOTE_TEMPLATES_KEY, id);
};