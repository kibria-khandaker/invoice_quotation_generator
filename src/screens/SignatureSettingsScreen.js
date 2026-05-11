// src/screens/SignatureSettingsScreen.js

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

import styles from './SignatureSettingsScreenStyle';

import {
  getSignatureProfiles,
  saveSignatureProfiles,
  upsertSignatureProfile,
  deleteSignatureProfile,
  setDefaultSignatureProfile,
} from '../services/settingsService';

import {
  applyPresetImportMode,
  ensureSingleDefaultPreset,
  exportPresetSmartCsv,
  getPresetImportConflictCount,
  parsePresetSmartCsv,
} from '../services/presetBackupService';

const BRAND_COLOR = '#fd4475';
const SUCCESS_COLOR = '#16a34a';

const emptyForm = {
  id: null,
  title: '',
  signatureImage: null,
  signatureBase64: null,
  isDefault: false,
};

const buildSignatureDataUri = (base64Value) => {
  if (!base64Value) return null;

  if (String(base64Value).startsWith('data:image')) {
    return base64Value;
  }

  return `data:image/jpeg;base64,${base64Value}`;
};

const normalizeSignatureProfile = (profile = {}) => {
  const signatureBase64 = profile.signatureBase64 || null;

  return {
    ...emptyForm,
    ...profile,
    title: String(profile.title || ''),
    signatureImage:
      profile.signatureImage ||
      buildSignatureDataUri(signatureBase64) ||
      null,
    signatureBase64,
    isDefault: Boolean(profile.isDefault),
  };
};

const prepareSignatureProfilesForSave = (profiles = []) => {
  const normalizedProfiles = profiles.map((item) => ({
    ...normalizeSignatureProfile(item),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));

  return ensureSingleDefaultPreset(normalizedProfiles);
};

export default function SignatureSettingsScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);

  // ======================================================
  // SIGNATURE PRESET BACKUP STATES
  // NEW:
  // Only for Signature export/import/select backup.
  // Existing save/edit/delete/default/upload logic is untouched.
  // ======================================================
  const [isBackupBusy, setIsBackupBusy] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const data = await getSignatureProfiles();
    setProfiles(Array.isArray(data) ? data.map(normalizeSignatureProfile) : []);
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

  const getSignatureProfileId = (item) => {
    return item?.id || '';
  };

  const getSignatureDisplayName = (item) => {
    return item?.title || 'Signature Profile';
  };

  const selectedProfiles = profiles.filter((item) =>
    selectedProfileIds.includes(getSignatureProfileId(item))
  );

  const clearBackupSelection = () => {
    setSelectedProfileIds([]);
    setIsSelectMode(false);
  };

  const pickSignature = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow media permission.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 300 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      updateForm('signatureImage', manipulated.uri);
      updateForm('signatureBase64', manipulated.base64);
    } catch (error) {
      Alert.alert('Error', 'Signature upload failed.');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a profile title.');
      return;
    }

    if (!form.signatureImage || !form.signatureBase64) {
      Alert.alert('Required', 'Please upload a signature image.');
      return;
    }

    const profileToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      isDefault: profiles.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = await upsertSignatureProfile(profileToSave);

    setProfiles(updatedProfiles.map(normalizeSignatureProfile));
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Signature profile updated successfully.'
        : 'Signature profile saved successfully.'
    );
  };

  const handleEdit = (item) => {
    clearBackupSelection();
    setForm(normalizeSignatureProfile(item));
  };

  const handleView = (item) => {
    const normalizedItem = normalizeSignatureProfile(item);

    Alert.alert(
      normalizedItem.title || 'Signature Profile',
      `This signature profile is saved successfully.\n\nDefault: ${
        normalizedItem.isDefault ? 'Yes' : 'No'
      }`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Signature',
      'Are you sure you want to delete this signature profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProfiles = await deleteSignatureProfile(id);
            setProfiles(updatedProfiles.map(normalizeSignatureProfile));
            setSelectedProfileIds((prev) =>
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

  const handleSetDefault = async (id) => {
    const updatedProfiles = await setDefaultSignatureProfile(id);
    setProfiles(updatedProfiles.map(normalizeSignatureProfile));
  };

  // ======================================================
  // SIGNATURE PRESET BACKUP HELPERS
  // NEW:
  // Smart CSV export/import for Signature Profiles only.
  // signatureBase64 is preserved inside Smart CSV.
  // Quotation / Invoice logic is not touched.
  // ======================================================
  const handleToggleSelectMode = () => {
    setIsSelectMode((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setSelectedProfileIds([]);
      }

      return nextValue;
    });
  };

  const handleToggleSelectProfile = (item) => {
    const profileId = getSignatureProfileId(item);

    if (!profileId) return;

    setSelectedProfileIds((prev) => {
      if (prev.includes(profileId)) {
        return prev.filter((id) => id !== profileId);
      }

      return [...prev, profileId];
    });
  };

  const exportSignatureProfiles = async (
    itemsToExport = [],
    exportType = 'all'
  ) => {
    try {
      const result = await exportPresetSmartCsv({
        items: itemsToExport,
        filePrefix: `signature_profiles_${exportType}`,
        emptyMessage: 'There are no signature profiles to export.',
      });

      if (!result.success && result.reason === 'empty') {
        Alert.alert('No Data', result.message);
        return;
      }

      if (result.success && !result.sharingAvailable) {
        Alert.alert('Export Ready', `CSV file saved at: ${result.fileUri}`);
      }
    } catch (error) {
      console.log('Signature Profile Export Error:', error);
      Alert.alert('Export Error', 'Signature profile CSV could not be exported.');
    }
  };

  const handleExportAllSignatures = () => {
    exportSignatureProfiles(profiles, 'all');
  };

  const handleExportSelectedSignatures = () => {
    if (selectedProfiles.length === 0) {
      Alert.alert('No Selection', 'Please select at least one signature profile.');
      return;
    }

    exportSignatureProfiles(selectedProfiles, 'selected');
  };

  const handleExportSingleSignature = (item) => {
    exportSignatureProfiles([item], item?.title || 'single');
  };

  const applyImportedSignatureProfiles = async (
    itemsToImport = [],
    mode = 'skip'
  ) => {
    try {
      setIsBackupBusy(true);

      const normalizedImports = itemsToImport.map(normalizeSignatureProfile);

      const { importedItems, nextItems } = applyPresetImportMode({
        existingItems: profiles,
        importedItems: normalizedImports,
        mode,
        idPrefix: 'signature_profile',
      });

      if (!importedItems.length) {
        Alert.alert(
          'No New Signatures',
          'No signature profiles were imported with the selected conflict option.'
        );
        return;
      }

      const normalizedNextItems = prepareSignatureProfilesForSave(nextItems);
      const savedProfiles = await saveSignatureProfiles(normalizedNextItems);

      setProfiles(savedProfiles.map(normalizeSignatureProfile));
      clearBackupSelection();

      Alert.alert(
        'Import Complete',
        `Imported ${importedItems.length} signature profile(s).`
      );
    } catch (error) {
      console.log('Signature Profile Import Apply Error:', error);
      Alert.alert('Import Error', 'Signature profile CSV could not be imported.');
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleImportSignatureCsv = async () => {
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
        Alert.alert('Import Error', 'No valid signature profile data found.');
        return;
      }

      const conflictCount = getPresetImportConflictCount({
        existingItems: profiles,
        importedItems: parsedItems,
        idPrefix: 'signature_profile',
      });

      if (conflictCount > 0) {
        Alert.alert(
          'Import Conflicts Found',
          `${conflictCount} duplicate/conflict signature profile(s) found. What do you want to do?`,
          [
            {
              text: 'Skip Duplicates',
              onPress: () => applyImportedSignatureProfiles(parsedItems, 'skip'),
            },
            {
              text: 'Replace Existing',
              onPress: () =>
                applyImportedSignatureProfiles(parsedItems, 'replace'),
            },
            {
              text: 'Keep Both',
              onPress: () =>
                applyImportedSignatureProfiles(parsedItems, 'keepBoth'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await applyImportedSignatureProfiles(parsedItems, 'skip');
    } catch (error) {
      console.log('Signature Profile Import Error:', error);
      setIsBackupBusy(false);
      Alert.alert('Import Error', 'Signature profile CSV could not be imported.');
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
        <Ionicons name="pencil-outline" size={25} color={BRAND_COLOR} />
      </View>
    );
  };

  const renderSignatureRightTop = (item) => {
    const isSelected = selectedProfileIds.includes(item.id);

    if (isSelectMode) {
      return (
        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.selectCircleTouchable}
          onPress={() => handleToggleSelectProfile(item)}
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

    if (item.isDefault) {
      return (
        <View style={styles.defaultBadgeTop}>
          <Text style={styles.defaultBadgeTopText}>Default</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => handleSetDefault(item.id)}
      >
        <Text style={styles.setDefaultTopText}>Set as default</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      {/* ======================================================
          SIGNATURE SETTINGS CUSTOM HEADER
          NEW:
          Replaces default native stack header and removes double title.
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
              {isEditMode ? 'Edit Signature' : 'Signature'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditMode
                ? 'Update saved signature profile'
                : 'Manage reusable signature images'}
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
            SIGNATURE PRESET BACKUP UI
            CSV backup/import/export for Signature Profiles only.
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
                <Text style={styles.backupTitle}>Signature Backup</Text>
                <Text style={styles.backupSubtitle}>
                  Export, select, or import signature profiles as CSV.
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
                onPress={handleExportAllSignatures}
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
                onPress={handleImportSignatureCsv}
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
                    {selectedProfileIds.length} Selected
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.exportSelectedButton}
                  onPress={handleExportSelectedSignatures}
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
                name={isEditMode ? 'create-outline' : 'pencil-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Signature Profile' : 'Add New Signature'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved signature image.'
                  : 'This signature can be reused in quotation and invoice forms.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Signature'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Profile Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. Main Signature"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Upload Signature</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.uploadBox}
            onPress={pickSignature}
          >
            {form.signatureImage ? (
              <Image
                source={{ uri: form.signatureImage }}
                style={styles.signaturePreview}
                resizeMode="contain"
              />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color={BRAND_COLOR}
                />
                <Text style={styles.uploadText}>Click to upload signature</Text>
                <Text style={styles.uploadSubText}>PNG, JPG recommended</Text>
              </>
            )}
          </TouchableOpacity>

          {form.signatureImage ? (
            <View style={styles.signatureLinePreview}>
              <Text style={styles.signatureLine}>________________________</Text>
              <Text style={styles.signatureLabel}>Authorized Signature</Text>
            </View>
          ) : null}

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this signature automatically for new quotations and invoices.
              </Text>
            </View>

            <Switch
              value={form.isDefault}
              onValueChange={(value) => updateForm('isDefault', value)}
              trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
              thumbColor={form.isDefault ? SUCCESS_COLOR : '#ffffff'}
            />
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
                {isEditMode ? 'Update Signature' : 'Save Signature'}
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
              Update or cancel editing to view saved signatures again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Signatures</Text>
              <Text style={styles.savedCount}>{profiles.length} Saved</Text>
            </View>

            {profiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No signature saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first signature profile from the form above.
                </Text>
              </View>
            ) : (
              profiles.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedTopRow}>
                    <View style={styles.savedIconBox}>
                      {item.signatureImage ? (
                        <Image
                          source={{ uri: item.signatureImage }}
                          style={styles.savedSignatureImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Ionicons
                          name="pencil-outline"
                          size={32}
                          color={BRAND_COLOR}
                        />
                      )}
                    </View>

                    <View style={styles.savedInfo}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {getSignatureDisplayName(item)}
                      </Text>

                      <Text style={styles.savedSubText} numberOfLines={1}>
                        Signature profile
                      </Text>
                    </View>

                    <View style={styles.savedRightTop}>
                      {renderSignatureRightTop(item)}
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
                      onPress={() => handleExportSingleSignature(item)}
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