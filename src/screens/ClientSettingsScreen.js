// src/screens/ClientSettingsScreen.js

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

import styles from './ClientSettingsScreenStyle';

import {
  getClientProfiles,
  saveClientProfiles,
  upsertClientProfile,
  deleteClientProfile,
  setDefaultClientProfile,
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
  clientName: '',
  clientCompany: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: '',
  isDefault: false,
};

export default function ClientSettingsScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);

  // ======================================================
  // CLIENT PRESET BACKUP STATES
  // NEW:
  // Only for Client Profiles export/import/select backup.
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
    const data = await getClientProfiles();
    setProfiles(data);
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

  const getClientProfileId = (item) => {
    return item?.id || '';
  };

  const getClientDisplayName = (item) => {
    return item?.clientName || item?.title || 'Client Full Name';
  };

  const getClientCompanyDisplay = (item) => {
    return item?.clientCompany || item?.title || 'Client Company Full name';
  };

  const selectedProfiles = profiles.filter((item) =>
    selectedProfileIds.includes(getClientProfileId(item))
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

    if (!form.clientName.trim()) {
      Alert.alert('Required', 'Please enter client name.');
      return;
    }

    const profileToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      isDefault: profiles.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = await upsertClientProfile(profileToSave);

    setProfiles(updatedProfiles);
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Client profile updated successfully.'
        : 'Client profile saved successfully.'
    );
  };

  const handleEdit = (item) => {
    clearBackupSelection();
    setForm(item);
  };

  const handleView = (item) => {
    Alert.alert(
      item.title || 'Client Profile',
      `Client Name:\n${item.clientName || '-'}\n\nCompany:\n${
        item.clientCompany || '-'
      }\n\nEmail:\n${item.clientEmail || '-'}\n\nPhone:\n${
        item.clientPhone || '-'
      }\n\nAddress:\n${item.clientAddress || '-'}`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProfiles = await deleteClientProfile(id);
            setProfiles(updatedProfiles);
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
    const updatedProfiles = await setDefaultClientProfile(id);
    setProfiles(updatedProfiles);
  };

  // ======================================================
  // CLIENT PRESET BACKUP HELPERS
  // NEW:
  // Smart CSV export/import for Client Profiles only.
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
    const profileId = getClientProfileId(item);

    if (!profileId) return;

    setSelectedProfileIds((prev) => {
      if (prev.includes(profileId)) {
        return prev.filter((id) => id !== profileId);
      }

      return [...prev, profileId];
    });
  };

  const exportClientProfiles = async (itemsToExport = [], exportType = 'all') => {
    try {
      const result = await exportPresetSmartCsv({
        items: itemsToExport,
        filePrefix: `client_profiles_${exportType}`,
        emptyMessage: 'There are no client profiles to export.',
      });

      if (!result.success && result.reason === 'empty') {
        Alert.alert('No Data', result.message);
        return;
      }

      if (result.success && !result.sharingAvailable) {
        Alert.alert('Export Ready', `CSV file saved at: ${result.fileUri}`);
      }
    } catch (error) {
      console.log('Client Profile Export Error:', error);
      Alert.alert('Export Error', 'Client profile CSV could not be exported.');
    }
  };

  const handleExportAllClients = () => {
    exportClientProfiles(profiles, 'all');
  };

  const handleExportSelectedClients = () => {
    if (selectedProfiles.length === 0) {
      Alert.alert('No Selection', 'Please select at least one client profile.');
      return;
    }

    exportClientProfiles(selectedProfiles, 'selected');
  };

  const handleExportSingleClient = (item) => {
    exportClientProfiles([item], item?.title || item?.clientName || 'single');
  };

  const applyImportedClientProfiles = async (
    itemsToImport = [],
    mode = 'skip'
  ) => {
    try {
      setIsBackupBusy(true);

      const { importedItems, nextItems } = applyPresetImportMode({
        existingItems: profiles,
        importedItems: itemsToImport,
        mode,
        idPrefix: 'client_profile',
      });

      if (!importedItems.length) {
        Alert.alert(
          'No New Clients',
          'No client profiles were imported with the selected conflict option.'
        );
        return;
      }

      const normalizedNextItems = ensureSingleDefaultPreset(nextItems);
      const savedProfiles = await saveClientProfiles(normalizedNextItems);

      setProfiles(savedProfiles);
      clearBackupSelection();

      Alert.alert(
        'Import Complete',
        `Imported ${importedItems.length} client profile(s).`
      );
    } catch (error) {
      console.log('Client Profile Import Apply Error:', error);
      Alert.alert('Import Error', 'Client profile CSV could not be imported.');
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleImportClientCsv = async () => {
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
        Alert.alert('Import Error', 'No valid client profile data found.');
        return;
      }

      const conflictCount = getPresetImportConflictCount({
        existingItems: profiles,
        importedItems: parsedItems,
        idPrefix: 'client_profile',
      });

      if (conflictCount > 0) {
        Alert.alert(
          'Import Conflicts Found',
          `${conflictCount} duplicate/conflict client profile(s) found. What do you want to do?`,
          [
            {
              text: 'Skip Duplicates',
              onPress: () => applyImportedClientProfiles(parsedItems, 'skip'),
            },
            {
              text: 'Replace Existing',
              onPress: () =>
                applyImportedClientProfiles(parsedItems, 'replace'),
            },
            {
              text: 'Keep Both',
              onPress: () =>
                applyImportedClientProfiles(parsedItems, 'keepBoth'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await applyImportedClientProfiles(parsedItems, 'skip');
    } catch (error) {
      console.log('Client Profile Import Error:', error);
      setIsBackupBusy(false);
      Alert.alert('Import Error', 'Client profile CSV could not be imported.');
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
    <Ionicons name="people-outline" size={25} color={BRAND_COLOR} />
  </View>
);
  };

  const renderClientRightTop = (item) => {
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      {/* ======================================================
          CLIENT SETTINGS CUSTOM HEADER
          NEW:
          Replaces default native stack header and removes double title.
          Style follows Create Quotation / Invoice pink header direction.
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
              {isEditMode ? 'Edit Client' : 'Client Profiles'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditMode
                ? 'Update saved client information'
                : 'Manage reusable client presets'}
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
            CLIENT PRESET BACKUP UI
            CSV backup/import/export for Client Profiles only.
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
                <Text style={styles.backupTitle}>Client Backup</Text>
                <Text style={styles.backupSubtitle}>
                  Export, select, or import client profiles as CSV.
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
                onPress={handleExportAllClients}
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
                onPress={handleImportClientCsv}
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
                  onPress={handleExportSelectedClients}
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
                name={isEditMode ? 'create-outline' : 'people-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Client Profile' : 'Add New Client'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved client information.'
                  : 'This client can be selected while creating quotations.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Client'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Profile Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. ABC Trading Client"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Client Name</Text>
          <TextInput
            value={form.clientName}
            onChangeText={(t) => updateForm('clientName', t)}
            placeholder="e.g. Mr. Rahim Ahmed"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Client Company</Text>
          <TextInput
            value={form.clientCompany}
            onChangeText={(t) => updateForm('clientCompany', t)}
            placeholder="e.g. ABC Trading Ltd."
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <View style={styles.twoColumnRow}>
            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Client Email</Text>
              <TextInput
                value={form.clientEmail}
                onChangeText={(t) => updateForm('clientEmail', t)}
                placeholder="client@example.com"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Client Phone</Text>
              <TextInput
                value={form.clientPhone}
                onChangeText={(t) => updateForm('clientPhone', t)}
                placeholder="01XXXXXXXXX"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Client Address</Text>
          <TextInput
            value={form.clientAddress}
            onChangeText={(t) => updateForm('clientAddress', t)}
            placeholder="e.g. House 12, Road 5, Dhaka"
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this client automatically for new quotations.
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
                {isEditMode ? 'Update Client' : 'Save Client'}
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
              Update or cancel editing to view saved clients again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Clients</Text>
              <Text style={styles.savedCount}>{profiles.length} Saved</Text>
            </View>

            {profiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No client saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first client profile from the form above.
                </Text>
              </View>
            ) : (
              profiles.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedTopRow}>
                    <View style={styles.savedIconBox}>
                      <Ionicons
                        name="person-outline"
                        size={34}
                        color={BRAND_COLOR}
                      />
                    </View>

                    <View style={styles.savedInfo}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {getClientDisplayName(item)}
                      </Text>

                      <Text style={styles.savedSubText} numberOfLines={1}>
                        {getClientCompanyDisplay(item)}
                      </Text>
                    </View>

                    <View style={styles.savedRightTop}>
                      {renderClientRightTop(item)}
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
                      onPress={() => handleExportSingleClient(item)}
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