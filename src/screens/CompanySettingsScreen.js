// src/screens/CompanySettingsScreen.js

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';

import styles from './CompanySettingsScreenStyle';

import {
  getCompanyProfiles,
  saveCompanyProfiles,
  upsertCompanyProfile,
  deleteCompanyProfile,
  setDefaultCompanyProfile,
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
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  companyContact: '',
  logo: null,
  logoBase64: null,
  isDefault: false,
};

const normalizeCompanyProfile = (profile) => {
  if (!profile) return emptyForm;

  const oldContact = profile.companyContact || '';

  const emailMatch = oldContact.match(/Email:\s*([^\n]+)/i);
  const phoneMatch = oldContact.match(/Phone:\s*([^\n]+)/i);

  return {
    ...emptyForm,
    ...profile,
    companyEmail: profile.companyEmail || emailMatch?.[1]?.trim() || '',
    companyPhone: profile.companyPhone || phoneMatch?.[1]?.trim() || '',
    companyContact: profile.companyContact || '',
  };
};

const buildCompanyContact = (email, phone) => {
  const lines = [];

  if (email?.trim()) {
    lines.push(`Email: ${email.trim()}`);
  }

  if (phone?.trim()) {
    lines.push(`Phone: ${phone.trim()}`);
  }

  return lines.join('\n');
};

const prepareCompanyProfilesForSave = (items = []) => {
  const normalizedItems = items.map((item) => {
    const normalized = normalizeCompanyProfile(item);

    return {
      ...normalized,
      companyContact: buildCompanyContact(
        normalized.companyEmail,
        normalized.companyPhone
      ),
    };
  });

  return ensureSingleDefaultPreset(normalizedItems);
};

export default function CompanySettingsScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);

  // ======================================================
  // COMPANY PRESET BACKUP STATES
  // NEW:
  // Only for Company Information export/import/select backup.
  // Existing save/edit/delete/default/logo logic is untouched.
  // ======================================================
  const [isBackupBusy, setIsBackupBusy] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const data = await getCompanyProfiles();
    setProfiles(data.map(normalizeCompanyProfile));
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

  const getCompanyProfileId = (item) => {
    return item?.id || '';
  };

  const getCompanyDisplayName = (item) => {
    return item?.companyName || item?.title || 'Company Name';
  };

  const getCompanySubDisplay = (item) => {
    return item?.title || item?.companyEmail || item?.companyPhone || 'Company Profile';
  };

  const selectedProfiles = profiles.filter((item) =>
    selectedProfileIds.includes(getCompanyProfileId(item))
  );

  const clearBackupSelection = () => {
    setSelectedProfileIds([]);
    setIsSelectMode(false);
  };

  const pickLogo = async () => {
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

      updateForm('logo', manipulated.uri);
      updateForm('logoBase64', manipulated.base64);
    } catch (error) {
      Alert.alert('Error', 'Logo upload failed.');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a profile title.');
      return;
    }

    if (!form.companyName.trim()) {
      Alert.alert('Required', 'Please enter company name.');
      return;
    }

    const profileToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      companyContact: buildCompanyContact(form.companyEmail, form.companyPhone),
      isDefault: profiles.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = await upsertCompanyProfile(profileToSave);

    setProfiles(updatedProfiles.map(normalizeCompanyProfile));
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Company profile updated successfully.'
        : 'Company profile saved successfully.'
    );
  };

  const handleEdit = (item) => {
    clearBackupSelection();
    setForm(normalizeCompanyProfile(item));
  };

  const handleView = (item) => {
    const normalizedItem = normalizeCompanyProfile(item);

    Alert.alert(
      normalizedItem.title || 'Company Profile',
      `Company Name:\n${normalizedItem.companyName || '-'}\n\nAddress:\n${
        normalizedItem.companyAddress || '-'
      }\n\nEmail:\n${normalizedItem.companyEmail || '-'}\n\nPhone:\n${
        normalizedItem.companyPhone || '-'
      }`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Company',
      'Are you sure you want to delete this company profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProfiles = await deleteCompanyProfile(id);
            setProfiles(updatedProfiles.map(normalizeCompanyProfile));
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
    const updatedProfiles = await setDefaultCompanyProfile(id);
    setProfiles(updatedProfiles.map(normalizeCompanyProfile));
  };

  // ======================================================
  // COMPANY PRESET BACKUP HELPERS
  // NEW:
  // Smart CSV export/import for Company Information only.
  // Logo/base64 is kept inside Smart CSV data when available.
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
    const profileId = getCompanyProfileId(item);

    if (!profileId) return;

    setSelectedProfileIds((prev) => {
      if (prev.includes(profileId)) {
        return prev.filter((id) => id !== profileId);
      }

      return [...prev, profileId];
    });
  };

  const exportCompanyProfiles = async (
    itemsToExport = [],
    exportType = 'all'
  ) => {
    try {
      const result = await exportPresetSmartCsv({
        items: itemsToExport,
        filePrefix: `company_profiles_${exportType}`,
        emptyMessage: 'There are no company profiles to export.',
      });

      if (!result.success && result.reason === 'empty') {
        Alert.alert('No Data', result.message);
        return;
      }

      if (result.success && !result.sharingAvailable) {
        Alert.alert('Export Ready', `CSV file saved at: ${result.fileUri}`);
      }
    } catch (error) {
      console.log('Company Profile Export Error:', error);
      Alert.alert('Export Error', 'Company profile CSV could not be exported.');
    }
  };

  const handleExportAllCompanies = () => {
    exportCompanyProfiles(profiles, 'all');
  };

  const handleExportSelectedCompanies = () => {
    if (selectedProfiles.length === 0) {
      Alert.alert('No Selection', 'Please select at least one company profile.');
      return;
    }

    exportCompanyProfiles(selectedProfiles, 'selected');
  };

  const handleExportSingleCompany = (item) => {
    exportCompanyProfiles([item], item?.title || item?.companyName || 'single');
  };

  const applyImportedCompanyProfiles = async (
    itemsToImport = [],
    mode = 'skip'
  ) => {
    try {
      setIsBackupBusy(true);

      const normalizedImports = itemsToImport.map(normalizeCompanyProfile);

      const { importedItems, nextItems } = applyPresetImportMode({
        existingItems: profiles,
        importedItems: normalizedImports,
        mode,
        idPrefix: 'company_profile',
      });

      if (!importedItems.length) {
        Alert.alert(
          'No New Companies',
          'No company profiles were imported with the selected conflict option.'
        );
        return;
      }

      const normalizedNextItems = prepareCompanyProfilesForSave(nextItems);
      const savedProfiles = await saveCompanyProfiles(normalizedNextItems);

      setProfiles(savedProfiles.map(normalizeCompanyProfile));
      clearBackupSelection();

      Alert.alert(
        'Import Complete',
        `Imported ${importedItems.length} company profile(s).`
      );
    } catch (error) {
      console.log('Company Profile Import Apply Error:', error);
      Alert.alert('Import Error', 'Company profile CSV could not be imported.');
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleImportCompanyCsv = async () => {
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
        Alert.alert('Import Error', 'No valid company profile data found.');
        return;
      }

      const conflictCount = getPresetImportConflictCount({
        existingItems: profiles,
        importedItems: parsedItems,
        idPrefix: 'company_profile',
      });

      if (conflictCount > 0) {
        Alert.alert(
          'Import Conflicts Found',
          `${conflictCount} duplicate/conflict company profile(s) found. What do you want to do?`,
          [
            {
              text: 'Skip Duplicates',
              onPress: () => applyImportedCompanyProfiles(parsedItems, 'skip'),
            },
            {
              text: 'Replace Existing',
              onPress: () =>
                applyImportedCompanyProfiles(parsedItems, 'replace'),
            },
            {
              text: 'Keep Both',
              onPress: () =>
                applyImportedCompanyProfiles(parsedItems, 'keepBoth'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await applyImportedCompanyProfiles(parsedItems, 'skip');
    } catch (error) {
      console.log('Company Profile Import Error:', error);
      setIsBackupBusy(false);
      Alert.alert('Import Error', 'Company profile CSV could not be imported.');
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
        <Ionicons name="business-outline" size={25} color={BRAND_COLOR} />
      </View>
    );
  };

  const renderCompanyRightTop = (item) => {
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
          COMPANY SETTINGS CUSTOM HEADER
          NEW:
          Replaces default native stack header and removes double title.
          Style follows Client / Invoice / Quotation pink header direction.
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
              {isEditMode ? 'Edit Company' : 'Company Information'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditMode
                ? 'Update saved company information'
                : 'Manage reusable company presets'}
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
            COMPANY PRESET BACKUP UI
            CSV backup/import/export for Company Profiles only.
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
                <Text style={styles.backupTitle}>Company Backup</Text>
                <Text style={styles.backupSubtitle}>
                  Export, select, or import company profiles as CSV.
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
                onPress={handleExportAllCompanies}
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
                onPress={handleImportCompanyCsv}
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
                  onPress={handleExportSelectedCompanies}
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
                name={isEditMode ? 'create-outline' : 'business-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Company Profile' : 'Add New Company'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved company information.'
                  : 'This information can be reused in quotation and invoice forms.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Company'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Profile Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. Main Business"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Company Name</Text>
          <TextInput
            value={form.companyName}
            onChangeText={(t) => updateForm('companyName', t)}
            placeholder="e.g. ABC Trading Co."
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Company Address</Text>
          <TextInput
            value={form.companyAddress}
            onChangeText={(t) => updateForm('companyAddress', t)}
            placeholder="e.g. 123 Business Street, Dhaka"
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.twoColumnRow}>
            <View style={[styles.twoColumnItem, { marginRight: 10 }]}>
              <Text style={styles.label}>Company Email</Text>
              <TextInput
                value={form.companyEmail}
                onChangeText={(t) => updateForm('companyEmail', t)}
                placeholder="info@example.com"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Company Phone</Text>
              <TextInput
                value={form.companyPhone}
                onChangeText={(t) => updateForm('companyPhone', t)}
                placeholder="01XXXXXXXXX"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Upload Logo</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.uploadBox}
            onPress={pickLogo}
          >
            {form.logo ? (
              <Image
                source={{ uri: form.logo }}
                style={styles.logoPreview}
                resizeMode="contain"
              />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color={BRAND_COLOR}
                />
                <Text style={styles.uploadText}>Click to upload logo</Text>
                <Text style={styles.uploadSubText}>PNG, JPG recommended</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this company automatically for new quotations and invoices.
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
                {isEditMode ? 'Update Company' : 'Save Company'}
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
              Update or cancel editing to view saved companies again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Companies</Text>
              <Text style={styles.savedCount}>{profiles.length} Saved</Text>
            </View>

            {profiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No company saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first company profile from the form above.
                </Text>
              </View>
            ) : (
              profiles.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedTopRow}>
                    <View style={styles.savedIconBox}>
                      {item.logo ? (
                        <Image
                          source={{ uri: item.logo }}
                          style={styles.savedLogo}
                          resizeMode="contain"
                        />
                      ) : (
                        <Ionicons
                          name="business-outline"
                          size={32}
                          color={BRAND_COLOR}
                        />
                      )}
                    </View>

                    <View style={styles.savedInfo}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {getCompanyDisplayName(item)}
                      </Text>

                      <Text style={styles.savedSubText} numberOfLines={1}>
                        {getCompanySubDisplay(item)}
                      </Text>
                    </View>

                    <View style={styles.savedRightTop}>
                      {renderCompanyRightTop(item)}
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
                      onPress={() => handleExportSingleCompany(item)}
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