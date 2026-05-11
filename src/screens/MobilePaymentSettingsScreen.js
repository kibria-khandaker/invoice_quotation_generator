// src/screens/MobilePaymentSettingsScreen.js

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

import styles from './MobilePaymentSettingsScreenStyle';

import {
  getMobilePaymentProfiles,
  saveMobilePaymentProfiles,
  upsertMobilePaymentProfile,
  deleteMobilePaymentProfile,
  setDefaultMobilePaymentProfile,
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
  mobilePaymentInfo: '',
  isDefault: false,
};

const normalizeMobilePaymentProfile = (profile = {}) => {
  return {
    ...emptyForm,
    ...profile,
    title: String(profile.title || ''),
    mobilePaymentInfo: String(profile.mobilePaymentInfo || ''),
    isDefault: Boolean(profile.isDefault),
  };
};

const prepareMobilePaymentProfilesForSave = (profiles = []) => {
  const normalizedProfiles = profiles.map((item) => ({
    ...normalizeMobilePaymentProfile(item),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));

  return ensureSingleDefaultPreset(normalizedProfiles);
};

export default function MobilePaymentSettingsScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);

  // ======================================================
  // MOBILE PAYMENT PRESET BACKUP STATES
  // NEW:
  // Only for Mobile Payment Info export/import/select backup.
  // Existing save/edit/delete/default logic is untouched.
  // ======================================================
  const [isBackupBusy, setIsBackupBusy] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const data = await getMobilePaymentProfiles();
    setProfiles(
      Array.isArray(data) ? data.map(normalizeMobilePaymentProfile) : []
    );
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

  const getMobilePaymentProfileId = (item) => {
    return item?.id || '';
  };

  const getMobilePaymentDisplayName = (item) => {
    return item?.title || 'Mobile Payment Profile';
  };

  const getMobilePaymentSubDisplay = (item) => {
    return item?.mobilePaymentInfo || 'Mobile payment information';
  };

  const selectedProfiles = profiles.filter((item) =>
    selectedProfileIds.includes(getMobilePaymentProfileId(item))
  );

  const clearBackupSelection = () => {
    setSelectedProfileIds([]);
    setIsSelectMode(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a profile title.');
      return;
    }

    if (!form.mobilePaymentInfo.trim()) {
      Alert.alert('Required', 'Please enter mobile payment information.');
      return;
    }

    const profileToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      isDefault: profiles.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = await upsertMobilePaymentProfile(profileToSave);

    setProfiles(updatedProfiles.map(normalizeMobilePaymentProfile));
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Mobile payment profile updated successfully.'
        : 'Mobile payment profile saved successfully.'
    );
  };

  const handleEdit = (item) => {
    clearBackupSelection();
    setForm(normalizeMobilePaymentProfile(item));
  };

  const handleView = (item) => {
    const normalizedItem = normalizeMobilePaymentProfile(item);

    Alert.alert(
      normalizedItem.title || 'Mobile Payment Profile',
      `Mobile Payment Info:\n${normalizedItem.mobilePaymentInfo || '-'}`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Mobile Payment Profile',
      'Are you sure you want to delete this mobile payment profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProfiles = await deleteMobilePaymentProfile(id);
            setProfiles(updatedProfiles.map(normalizeMobilePaymentProfile));
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
    const updatedProfiles = await setDefaultMobilePaymentProfile(id);
    setProfiles(updatedProfiles.map(normalizeMobilePaymentProfile));
  };

  // ======================================================
  // MOBILE PAYMENT PRESET BACKUP HELPERS
  // NEW:
  // Smart CSV export/import for Mobile Payment Info only.
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
    const profileId = getMobilePaymentProfileId(item);

    if (!profileId) return;

    setSelectedProfileIds((prev) => {
      if (prev.includes(profileId)) {
        return prev.filter((id) => id !== profileId);
      }

      return [...prev, profileId];
    });
  };

  const exportMobilePaymentProfiles = async (
    itemsToExport = [],
    exportType = 'all'
  ) => {
    try {
      const result = await exportPresetSmartCsv({
        items: itemsToExport,
        filePrefix: `mobile_payment_profiles_${exportType}`,
        emptyMessage: 'There are no mobile payment profiles to export.',
      });

      if (!result.success && result.reason === 'empty') {
        Alert.alert('No Data', result.message);
        return;
      }

      if (result.success && !result.sharingAvailable) {
        Alert.alert('Export Ready', `CSV file saved at: ${result.fileUri}`);
      }
    } catch (error) {
      console.log('Mobile Payment Export Error:', error);
      Alert.alert(
        'Export Error',
        'Mobile payment profile CSV could not be exported.'
      );
    }
  };

  const handleExportAllMobilePayments = () => {
    exportMobilePaymentProfiles(profiles, 'all');
  };

  const handleExportSelectedMobilePayments = () => {
    if (selectedProfiles.length === 0) {
      Alert.alert(
        'No Selection',
        'Please select at least one mobile payment profile.'
      );
      return;
    }

    exportMobilePaymentProfiles(selectedProfiles, 'selected');
  };

  const handleExportSingleMobilePayment = (item) => {
    exportMobilePaymentProfiles([item], item?.title || 'single');
  };

  const applyImportedMobilePaymentProfiles = async (
    itemsToImport = [],
    mode = 'skip'
  ) => {
    try {
      setIsBackupBusy(true);

      const normalizedImports = itemsToImport.map(
        normalizeMobilePaymentProfile
      );

      const { importedItems, nextItems } = applyPresetImportMode({
        existingItems: profiles,
        importedItems: normalizedImports,
        mode,
        idPrefix: 'mobile_payment_profile',
      });

      if (!importedItems.length) {
        Alert.alert(
          'No New Mobile Payments',
          'No mobile payment profiles were imported with the selected conflict option.'
        );
        return;
      }

      const normalizedNextItems = prepareMobilePaymentProfilesForSave(nextItems);
      const savedProfiles = await saveMobilePaymentProfiles(normalizedNextItems);

      setProfiles(savedProfiles.map(normalizeMobilePaymentProfile));
      clearBackupSelection();

      Alert.alert(
        'Import Complete',
        `Imported ${importedItems.length} mobile payment profile(s).`
      );
    } catch (error) {
      console.log('Mobile Payment Import Apply Error:', error);
      Alert.alert(
        'Import Error',
        'Mobile payment profile CSV could not be imported.'
      );
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleImportMobilePaymentCsv = async () => {
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
        Alert.alert(
          'Import Error',
          'No valid mobile payment profile data found.'
        );
        return;
      }

      const conflictCount = getPresetImportConflictCount({
        existingItems: profiles,
        importedItems: parsedItems,
        idPrefix: 'mobile_payment_profile',
      });

      if (conflictCount > 0) {
        Alert.alert(
          'Import Conflicts Found',
          `${conflictCount} duplicate/conflict mobile payment profile(s) found. What do you want to do?`,
          [
            {
              text: 'Skip Duplicates',
              onPress: () =>
                applyImportedMobilePaymentProfiles(parsedItems, 'skip'),
            },
            {
              text: 'Replace Existing',
              onPress: () =>
                applyImportedMobilePaymentProfiles(parsedItems, 'replace'),
            },
            {
              text: 'Keep Both',
              onPress: () =>
                applyImportedMobilePaymentProfiles(parsedItems, 'keepBoth'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await applyImportedMobilePaymentProfiles(parsedItems, 'skip');
    } catch (error) {
      console.log('Mobile Payment Import Error:', error);
      setIsBackupBusy(false);
      Alert.alert(
        'Import Error',
        'Mobile payment profile CSV could not be imported.'
      );
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
        <Ionicons
          name="phone-portrait-outline"
          size={25}
          color={BRAND_COLOR}
        />
      </View>
    );
  };

  const renderMobilePaymentRightTop = (item) => {
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
          MOBILE PAYMENT SETTINGS CUSTOM HEADER
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
              {isEditMode ? 'Edit Mobile Payment' : 'Mobile Payment'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditMode
                ? 'Update saved mobile payment profile'
                : 'Manage reusable mobile payment details'}
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
            MOBILE PAYMENT PRESET BACKUP UI
            CSV backup/import/export for Mobile Payment Profiles only.
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
                <Text style={styles.backupTitle}>Mobile Payment Backup</Text>
                <Text style={styles.backupSubtitle}>
                  Export, select, or import mobile payment profiles as CSV.
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
                onPress={handleExportAllMobilePayments}
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
                onPress={handleImportMobilePaymentCsv}
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
                  onPress={handleExportSelectedMobilePayments}
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
                name={isEditMode ? 'create-outline' : 'phone-portrait-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode
                  ? 'Edit Mobile Payment Profile'
                  : 'Add New Mobile Payment'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved mobile payment information.'
                  : 'This profile can be reused in quotation and invoice forms.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Mobile Payment'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Profile Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. bKash Personal"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Mobile Payment Info</Text>
          <TextInput
            value={form.mobilePaymentInfo}
            onChangeText={(t) => updateForm('mobilePaymentInfo', t)}
            placeholder={`e.g. bKash: 01XXXXXXXXX\nName: Hasib\nType: Personal\n\nNagad: 01XXXXXXXXX\nRocket: 01XXXXXXXXX`}
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textAreaLarge]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this mobile payment profile automatically for new quotations and invoices.
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
                {isEditMode ? 'Update Profile' : 'Save Profile'}
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
              Update or cancel editing to view saved mobile payment profiles
              again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Mobile Payments</Text>
              <Text style={styles.savedCount}>{profiles.length} Saved</Text>
            </View>

            {profiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>
                  No mobile payment saved yet
                </Text>
                <Text style={styles.emptyText}>
                  Add your first mobile payment profile from the form above.
                </Text>
              </View>
            ) : (
              profiles.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedTopRow}>
                    <View style={styles.savedIconBox}>
                      <Ionicons
                        name="phone-portrait-outline"
                        size={32}
                        color={BRAND_COLOR}
                      />
                    </View>

                    <View style={styles.savedInfo}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {getMobilePaymentDisplayName(item)}
                      </Text>

                      <Text style={styles.savedSubText} numberOfLines={1}>
                        {getMobilePaymentSubDisplay(item)}
                      </Text>
                    </View>

                    <View style={styles.savedRightTop}>
                      {renderMobilePaymentRightTop(item)}
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
                      onPress={() => handleExportSingleMobilePayment(item)}
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