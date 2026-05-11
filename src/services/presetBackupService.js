// src/services/presetBackupService.js

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

// ======================================================
// PRESET BACKUP SERVICE
// Reusable Smart CSV helper for Settings preset pages.
// This file does not touch Quotation, Invoice, Draft,
// History, or PDF logic.
// ======================================================

const safeFileName = (value = 'preset_backup') => {
  const cleaned = String(value || 'preset_backup')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return cleaned || 'preset_backup';
};

const escapeCsvJson = (item) => {
  return JSON.stringify(item || {}).replace(/"/g, '""');
};

export const buildPresetSmartCsv = (items = []) => {
  const header = 'id,data\n';

  const rows = items
    .map((item, index) => {
      const id = item?.id || `preset_${Date.now()}_${index}`;
      const safeData = escapeCsvJson(item);

      return `${id},"${safeData}"`;
    })
    .join('\n');

  return header + rows;
};

export const parsePresetSmartCsv = (fileContent = '') => {
  const lines = String(fileContent || '').split(/\r?\n/);
  lines.shift();

  const importedItems = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const firstCommaIndex = line.indexOf(',');

    if (firstCommaIndex === -1) continue;

    const rawData = line
      .substring(firstCommaIndex + 1)
      .replace(/^"|"$/g, '')
      .replace(/""/g, '"');

    try {
      const parsed = JSON.parse(rawData);

      if (parsed && typeof parsed === 'object') {
        importedItems.push(parsed);
      }
    } catch (error) {
      console.log('Preset CSV Parse Row Error:', error);
    }
  }

  return importedItems;
};

export const exportPresetSmartCsv = async ({
  items = [],
  filePrefix = 'preset_backup',
  emptyMessage = 'There is no data to export.',
}) => {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      success: false,
      reason: 'empty',
      message: emptyMessage,
    };
  }

  const csv = buildPresetSmartCsv(items);
  const fileName = `${safeFileName(filePrefix)}_${Date.now()}.csv`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, csv);

  const sharingAvailable = await Sharing.isAvailableAsync();

  if (sharingAvailable) {
    await Sharing.shareAsync(fileUri);
  }

  return {
    success: true,
    fileUri,
    sharingAvailable,
  };
};

const getItemId = (item) => {
  return item?.id || '';
};

const createKeepBothId = (idPrefix = 'preset', index = 0) => {
  return `${idPrefix}_keep_${Date.now()}_${index}_${Math.floor(
    Math.random() * 100000
  )}`;
};

const normalizeImportedPresetItem = (
  item = {},
  index = 0,
  idPrefix = 'preset'
) => {
  const now = new Date().toISOString();

  return {
    ...item,
    id: item?.id || `${idPrefix}_import_${Date.now()}_${index}`,
    createdAt: item?.createdAt || now,
    updatedAt: now,
  };
};

export const getPresetImportConflictCount = ({
  existingItems = [],
  importedItems = [],
  idPrefix = 'preset',
}) => {
  const existingIds = new Set(existingItems.map(getItemId).filter(Boolean));
  const importedIds = new Set();

  let conflictCount = 0;

  importedItems.forEach((item, index) => {
    const normalized = normalizeImportedPresetItem(item, index, idPrefix);
    const itemId = getItemId(normalized);

    if (!itemId || existingIds.has(itemId) || importedIds.has(itemId)) {
      conflictCount += 1;
    }

    if (itemId) {
      importedIds.add(itemId);
    }
  });

  return conflictCount;
};

export const applyPresetImportMode = ({
  existingItems = [],
  importedItems = [],
  mode = 'skip',
  idPrefix = 'preset',
}) => {
  const existingIds = new Set(existingItems.map(getItemId).filter(Boolean));
  const processedImports = [];

  importedItems.forEach((item, index) => {
    let normalized = normalizeImportedPresetItem(item, index, idPrefix);
    let itemId = getItemId(normalized);

    if (!itemId) {
      itemId = createKeepBothId(idPrefix, index);
      normalized = {
        ...normalized,
        id: itemId,
      };
    }

    const duplicateInsideImport = processedImports.some(
      (processedItem) => getItemId(processedItem) === itemId
    );

    const duplicateExisting = existingIds.has(itemId);
    const hasConflict = duplicateExisting || duplicateInsideImport;

    if (mode === 'skip' && hasConflict) {
      return;
    }

    if (mode === 'replace') {
      if (duplicateInsideImport) {
        const previousIndex = processedImports.findIndex(
          (processedItem) => getItemId(processedItem) === itemId
        );

        if (previousIndex !== -1) {
          processedImports.splice(previousIndex, 1);
        }
      }

      processedImports.push(normalized);
      return;
    }

    if (mode === 'keepBoth' && hasConflict) {
      processedImports.push({
        ...normalized,
        id: createKeepBothId(idPrefix, index),
        originalImportedId: itemId,
      });
      return;
    }

    processedImports.push(normalized);
  });

  if (mode === 'replace') {
    const importIds = new Set(processedImports.map(getItemId).filter(Boolean));

    return {
      importedItems: processedImports,
      nextItems: [
        ...processedImports,
        ...existingItems.filter((item) => !importIds.has(getItemId(item))),
      ],
    };
  }

  return {
    importedItems: processedImports,
    nextItems: [...processedImports, ...existingItems],
  };
};

// ======================================================
// DEFAULT PRESET NORMALIZER
// Used for profile-type Settings data.
// Ensures exactly one default item when list is not empty.
// ======================================================
export const ensureSingleDefaultPreset = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  let hasDefault = false;

  const normalized = items.map((item) => {
    if (item?.isDefault && !hasDefault) {
      hasDefault = true;
      return {
        ...item,
        isDefault: true,
      };
    }

    return {
      ...item,
      isDefault: false,
    };
  });

  if (!hasDefault && normalized.length > 0) {
    normalized[0] = {
      ...normalized[0],
      isDefault: true,
    };
  }

  return normalized;
};