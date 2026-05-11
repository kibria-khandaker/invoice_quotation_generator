// src/screens/ItemsCatalogSettingsScreen.js

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

import styles from './ItemsCatalogSettingsScreenStyle';

import {
  getCatalogItems,
  saveCatalogItems,
  upsertCatalogItemProfile,
  deleteCatalogItemProfile,
} from '../services/settingsService';

import {
  applyPresetImportMode,
  exportPresetSmartCsv,
  getPresetImportConflictCount,
  parsePresetSmartCsv,
} from '../services/presetBackupService';

const BRAND_COLOR = '#fd4475';

const emptyForm = {
  id: null,
  title: '',
  itemName: '',
  description: '',
  quantity: '1',
  price: '',
};

const normalizeCatalogItem = (item = {}) => {
  return {
    ...emptyForm,
    ...item,
    title: String(item.title || ''),
    itemName: String(item.itemName || ''),
    description: String(item.description || ''),
    quantity: String(item.quantity || '1'),
    price: String(item.price || ''),
  };
};

const prepareCatalogItemsForSave = (items = []) => {
  return items.map((item) => ({
    ...normalizeCatalogItem(item),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));
};

export default function ItemsCatalogSettingsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);

  // ======================================================
  // ITEMS CATALOG BACKUP STATES
  // NEW:
  // Only for Items Catalog export/import/select backup.
  // Existing save/edit/delete logic is untouched.
  // ======================================================
  const [isBackupBusy, setIsBackupBusy] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getCatalogItems();
    setItems(Array.isArray(data) ? data.map(normalizeCatalogItem) : []);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const getCatalogItemId = (item) => {
    return item?.id || '';
  };

  const getItemDisplayName = (item) => {
    return item?.itemName || item?.title || 'Item Name';
  };

  const getItemSubDisplay = (item) => {
    return item?.description || item?.title || 'Catalog Item';
  };

  const selectedItems = items.filter((item) =>
    selectedItemIds.includes(getCatalogItemId(item))
  );

  const clearBackupSelection = () => {
    setSelectedItemIds([]);
    setIsSelectMode(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter an item title.');
      return;
    }

    if (!form.itemName.trim()) {
      Alert.alert('Required', 'Please enter item name.');
      return;
    }

    if (!form.price.trim()) {
      Alert.alert('Required', 'Please enter unit price.');
      return;
    }

    const itemToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      quantity: form.quantity?.trim() || '1',
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = await upsertCatalogItemProfile(itemToSave);

    setItems(updatedItems.map(normalizeCatalogItem));
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Item updated successfully.'
        : 'Item saved successfully.'
    );
  };

  const handleEdit = (item) => {
    clearBackupSelection();
    setForm(normalizeCatalogItem(item));
  };

  const handleView = (item) => {
    const normalizedItem = normalizeCatalogItem(item);

    Alert.alert(
      normalizedItem.title || 'Catalog Item',
      `Item Name:\n${normalizedItem.itemName || '-'}\n\nDescription:\n${
        normalizedItem.description || '-'
      }\n\nQuantity:\n${normalizedItem.quantity || '1'}\n\nUnit Price:\n${
        normalizedItem.price || '-'
      }`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this catalog item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = await deleteCatalogItemProfile(id);
            setItems(updatedItems.map(normalizeCatalogItem));
            setSelectedItemIds((prev) =>
              prev.filter((itemId) => itemId !== id)
            );

            if (form.id === id) {
              resetForm();
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // ITEMS CATALOG BACKUP HELPERS
  // NEW:
  // Smart CSV export/import for Items Catalog only.
  // Quotation / Invoice logic is not touched.
  // ======================================================
  const handleToggleSelectMode = () => {
    setIsSelectMode((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setSelectedItemIds([]);
      }

      return nextValue;
    });
  };

  const handleToggleSelectItem = (item) => {
    const itemId = getCatalogItemId(item);

    if (!itemId) return;

    setSelectedItemIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }

      return [...prev, itemId];
    });
  };

  const exportCatalogItems = async (itemsToExport = [], exportType = 'all') => {
    try {
      const result = await exportPresetSmartCsv({
        items: itemsToExport,
        filePrefix: `items_catalog_${exportType}`,
        emptyMessage: 'There are no catalog items to export.',
      });

      if (!result.success && result.reason === 'empty') {
        Alert.alert('No Data', result.message);
        return;
      }

      if (result.success && !result.sharingAvailable) {
        Alert.alert('Export Ready', `CSV file saved at: ${result.fileUri}`);
      }
    } catch (error) {
      console.log('Items Catalog Export Error:', error);
      Alert.alert('Export Error', 'Items Catalog CSV could not be exported.');
    }
  };

  const handleExportAllItems = () => {
    exportCatalogItems(items, 'all');
  };

  const handleExportSelectedItems = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Selection', 'Please select at least one catalog item.');
      return;
    }

    exportCatalogItems(selectedItems, 'selected');
  };

  const handleExportSingleItem = (item) => {
    exportCatalogItems([item], item?.title || item?.itemName || 'single');
  };

  const applyImportedCatalogItems = async (
    itemsToImport = [],
    mode = 'skip'
  ) => {
    try {
      setIsBackupBusy(true);

      const normalizedImports = itemsToImport.map(normalizeCatalogItem);

      const { importedItems, nextItems } = applyPresetImportMode({
        existingItems: items,
        importedItems: normalizedImports,
        mode,
        idPrefix: 'catalog_item',
      });

      if (!importedItems.length) {
        Alert.alert(
          'No New Items',
          'No catalog items were imported with the selected conflict option.'
        );
        return;
      }

      const normalizedNextItems = prepareCatalogItemsForSave(nextItems);
      const savedItems = await saveCatalogItems(normalizedNextItems);

      setItems(savedItems.map(normalizeCatalogItem));
      clearBackupSelection();

      Alert.alert(
        'Import Complete',
        `Imported ${importedItems.length} catalog item(s).`
      );
    } catch (error) {
      console.log('Items Catalog Import Apply Error:', error);
      Alert.alert('Import Error', 'Items Catalog CSV could not be imported.');
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleImportCatalogCsv = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets?.[0]?.uri;

      if (!fileUri) {
        Alert.alert('Import Error', 'No file selected.');
        return;
      }

      setIsBackupBusy(true);

      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const parsedItems = parsePresetSmartCsv(fileContent);

      setIsBackupBusy(false);

      if (!parsedItems.length) {
        Alert.alert('Import Error', 'No valid catalog item data found.');
        return;
      }

      const conflictCount = getPresetImportConflictCount({
        existingItems: items,
        importedItems: parsedItems,
        idPrefix: 'catalog_item',
      });

      if (conflictCount > 0) {
        Alert.alert(
          'Import Conflicts Found',
          `${conflictCount} duplicate/conflict catalog item(s) found. What do you want to do?`,
          [
            {
              text: 'Skip Duplicates',
              onPress: () => applyImportedCatalogItems(parsedItems, 'skip'),
            },
            {
              text: 'Replace Existing',
              onPress: () =>
                applyImportedCatalogItems(parsedItems, 'replace'),
            },
            {
              text: 'Keep Both',
              onPress: () =>
                applyImportedCatalogItems(parsedItems, 'keepBoth'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await applyImportedCatalogItems(parsedItems, 'skip');
    } catch (error) {
      console.log('Items Catalog Import Error:', error);
      setIsBackupBusy(false);
      Alert.alert('Import Error', 'Items Catalog CSV could not be imported.');
    }
  };

  const renderHeaderRightButton = () => {
    if (isEditMode) {
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.headerIconButton, styles.headerIconButtonLight]}
          onPress={resetForm}
        >
          <Ionicons name="close" size={24} color={BRAND_COLOR} />
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.headerIconButton, styles.headerIconButtonLight]}>
        <Ionicons name="cube-outline" size={25} color={BRAND_COLOR} />
      </View>
    );
  };

  const renderItemRightTop = (item) => {
    const isSelected = selectedItemIds.includes(item.id);

    if (isSelectMode) {
      return (
        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.selectCircleTouchable}
          onPress={() => handleToggleSelectItem(item)}
        >
          <View
            style={[
              styles.selectCircle,
              isSelected && styles.selectCircleActive,
            ]}
          >
            {isSelected ? (
              <Ionicons name="checkmark" size={15} color="#ffffff" />
            ) : null}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.pricePillTop}>
        <Text style={styles.pricePillTopText}>
          {item.price || '0'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      {/* ======================================================
          ITEMS CATALOG CUSTOM HEADER
          NEW:
          Replaces default native stack header and removes double title.
          Style follows Client / Company / Invoice / Quotation direction.
      ====================================================== */}
      <LinearGradient
        colors={[BRAND_COLOR, '#ff74a0', '#fff3f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Edit Item' : 'Items Catalog'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditMode
                ? 'Update saved catalog item'
                : 'Manage reusable products and services'}
            </Text>
          </View>

          {renderHeaderRightButton()}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ======================================================
            ITEMS CATALOG BACKUP UI
            CSV backup/import/export for Items Catalog only.
            Hidden while editing to avoid UI conflict.
        ====================================================== */}
        {!isEditMode ? (
          <View style={styles.backupCard}>
            <View style={styles.backupHeaderRow}>
              <View style={styles.backupIconBox}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color={BRAND_COLOR}
                />
              </View>

              <View style={styles.backupTitleArea}>
                <Text style={styles.backupTitle}>Items Backup</Text>
                <Text style={styles.backupSubtitle}>
                  Export, select, or import catalog items as CSV.
                </Text>
              </View>

              {isBackupBusy ? (
                <ActivityIndicator size="small" color={BRAND_COLOR} />
              ) : null}
            </View>

            <View style={styles.backupButtonRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.backupButton}
                onPress={handleExportAllItems}
                disabled={isBackupBusy}
              >
                <Ionicons
                  name="cloud-download-outline"
                  size={15}
                  color={BRAND_COLOR}
                />
                <Text style={styles.backupButtonText}>Export All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.backupButton}
                onPress={handleToggleSelectMode}
                disabled={isBackupBusy}
              >
                <Ionicons
                  name={
                    isSelectMode
                      ? 'checkmark-circle-outline'
                      : 'checkbox-outline'
                  }
                  size={15}
                  color={BRAND_COLOR}
                />
                <Text style={styles.backupButtonText}>
                  {isSelectMode ? 'Selecting' : 'Select'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.backupButton, styles.backupButtonPrimary]}
                onPress={handleImportCatalogCsv}
                disabled={isBackupBusy}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={15}
                  color="#ffffff"
                />
                <Text style={styles.backupButtonPrimaryText}>Import</Text>
              </TouchableOpacity>
            </View>

            {isSelectMode ? (
              <View style={styles.selectionBackupRow}>
                <View style={styles.selectedCountPill}>
                  <Text style={styles.selectedCountText}>
                    {selectedItemIds.length} Selected
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.exportSelectedButton}
                  onPress={handleExportSelectedItems}
                  disabled={isBackupBusy}
                >
                  <Text style={styles.exportSelectedText}>Export Selected</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.clearSelectionButton}
                  onPress={clearBackupSelection}
                  disabled={isBackupBusy}
                >
                  <Text style={styles.clearSelectionText}>Clear</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={[styles.formCard, isEditMode && styles.formCardEdit]}>
          <View style={styles.formHeader}>
            <View style={styles.formIconBox}>
              <Ionicons
                name={isEditMode ? 'create-outline' : 'cube-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Catalog Item' : 'Add New Item'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved item information.'
                  : 'This item can be selected while creating quotations and invoices.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Item'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Item Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. Web Design Package"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Item Name</Text>
          <TextInput
            value={form.itemName}
            onChangeText={(t) => updateForm('itemName', t)}
            placeholder="e.g. Web Design / Wireless Mouse"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(t) => updateForm('description', t)}
            placeholder="e.g. Responsive website design or product details"
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.twoColumnRow}>
            <View style={[styles.twoColumnItem, { marginRight: 10 }]}>
              <Text style={styles.label}>Default Quantity</Text>
              <TextInput
                value={form.quantity}
                onChangeText={(t) => updateForm('quantity', t)}
                placeholder="1"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Unit Price</Text>
              <TextInput
                value={form.price}
                onChangeText={(t) => updateForm('price', t)}
                placeholder="15000"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.88} onPress={handleSave}>
            <LinearGradient
              colors={
                isEditMode
                  ? ['#f97316', '#fb923c']
                  : [BRAND_COLOR, '#ff6b95']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <Ionicons
                name={isEditMode ? 'checkmark-circle-outline' : 'save-outline'}
                size={18}
                color="#ffffff"
              />
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Update Item' : 'Save Item'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {isEditMode ? (
          <View style={styles.editListHiddenCard}>
            <Ionicons
              name="information-circle-outline"
              size={26}
              color="#f97316"
            />
            <Text style={styles.editListHiddenTitle}>
              Saved list hidden while editing
            </Text>
            <Text style={styles.editListHiddenText}>
              Update or cancel editing to view saved items again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Items</Text>
              <Text style={styles.savedCount}>{items.length} Saved</Text>
            </View>

            {items.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No item saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first product, service, or quotation item from the
                  form above.
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedTopRow}>
                    <View style={styles.savedIconBox}>
                      <Ionicons
                        name="cube-outline"
                        size={32}
                        color={BRAND_COLOR}
                      />
                    </View>

                    <View style={styles.savedInfo}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {getItemDisplayName(item)}
                      </Text>

                      <Text style={styles.savedSubText} numberOfLines={1}>
                        {getItemSubDisplay(item)}
                      </Text>

                      <Text style={styles.savedPriceText} numberOfLines={1}>
                        Qty: {item.quantity || '1'} • Price: {item.price || '0'}
                      </Text>
                    </View>

                    <View style={styles.savedRightTop}>
                      {renderItemRightTop(item)}
                    </View>
                  </View>

                  <View style={styles.savedActionRow}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.savedActionButton}
                      onPress={() => handleView(item)}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={17}
                        color={BRAND_COLOR}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.savedActionButton}
                      onPress={() => handleEdit(item)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={17}
                        color={BRAND_COLOR}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.savedActionButton}
                      onPress={() => handleExportSingleItem(item)}
                    >
                      <Ionicons
                        name="download-outline"
                        size={17}
                        color="#0ea5e9"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.savedActionButton}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}