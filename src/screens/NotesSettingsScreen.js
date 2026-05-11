// src/screens/NotesSettingsScreen.js

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

import styles from './NotesSettingsScreenStyle';

import {
  getNoteTemplates,
  saveNoteTemplates,
  upsertNoteTemplate,
  deleteNoteTemplate,
  setDefaultNoteTemplate,
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
  notes: '',
  isDefault: false,
};

const normalizeNoteTemplate = (template = {}) => {
  return {
    ...emptyForm,
    ...template,
    title: String(template.title || ''),
    notes: String(template.notes || ''),
    isDefault: Boolean(template.isDefault),
  };
};

const prepareNoteTemplatesForSave = (templates = []) => {
  const normalizedTemplates = templates.map((item) => ({
    ...normalizeNoteTemplate(item),
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));

  return ensureSingleDefaultPreset(normalizedTemplates);
};

export default function NotesSettingsScreen({ navigation }) {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyForm);

  // ======================================================
  // NOTES PRESET BACKUP STATES
  // NEW:
  // Only for Notes export/import/select backup.
  // Existing save/edit/delete/default logic is untouched.
  // ======================================================
  const [isBackupBusy, setIsBackupBusy] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await getNoteTemplates();
    setTemplates(Array.isArray(data) ? data.map(normalizeNoteTemplate) : []);
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

  const getNoteTemplateId = (item) => {
    return item?.id || '';
  };

  const getNoteDisplayName = (item) => {
    return item?.title || 'Note Template';
  };

  const getNoteSubDisplay = (item) => {
    return item?.notes || 'Reusable note template';
  };

  const selectedTemplates = templates.filter((item) =>
    selectedTemplateIds.includes(getNoteTemplateId(item))
  );

  const clearBackupSelection = () => {
    setSelectedTemplateIds([]);
    setIsSelectMode(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a template title.');
      return;
    }

    if (!form.notes.trim()) {
      Alert.alert('Required', 'Please enter notes content.');
      return;
    }

    const templateToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      isDefault: templates.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedTemplates = await upsertNoteTemplate(templateToSave);

    setTemplates(updatedTemplates.map(normalizeNoteTemplate));
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Note template updated successfully.'
        : 'Note template saved successfully.'
    );
  };

  const handleEdit = (item) => {
    clearBackupSelection();
    setForm(normalizeNoteTemplate(item));
  };

  const handleView = (item) => {
    const normalizedItem = normalizeNoteTemplate(item);

    Alert.alert(
      normalizedItem.title || 'Note Template',
      `Notes:\n${normalizedItem.notes || '-'}`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Note Template',
      'Are you sure you want to delete this note template?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedTemplates = await deleteNoteTemplate(id);
            setTemplates(updatedTemplates.map(normalizeNoteTemplate));
            setSelectedTemplateIds((prev) =>
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
    const updatedTemplates = await setDefaultNoteTemplate(id);
    setTemplates(updatedTemplates.map(normalizeNoteTemplate));
  };

  // ======================================================
  // NOTES PRESET BACKUP HELPERS
  // NEW:
  // Smart CSV export/import for Note Templates only.
  // Quotation / Invoice logic is not touched.
  // ======================================================
  const handleToggleSelectMode = () => {
    setIsSelectMode((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setSelectedTemplateIds([]);
      }

      return nextValue;
    });
  };

  const handleToggleSelectTemplate = (item) => {
    const templateId = getNoteTemplateId(item);

    if (!templateId) return;

    setSelectedTemplateIds((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId);
      }

      return [...prev, templateId];
    });
  };

  const exportNoteTemplates = async (
    itemsToExport = [],
    exportType = 'all'
  ) => {
    try {
      const result = await exportPresetSmartCsv({
        items: itemsToExport,
        filePrefix: `note_templates_${exportType}`,
        emptyMessage: 'There are no note templates to export.',
      });

      if (!result.success && result.reason === 'empty') {
        Alert.alert('No Data', result.message);
        return;
      }

      if (result.success && !result.sharingAvailable) {
        Alert.alert('Export Ready', `CSV file saved at: ${result.fileUri}`);
      }
    } catch (error) {
      console.log('Note Template Export Error:', error);
      Alert.alert('Export Error', 'Note template CSV could not be exported.');
    }
  };

  const handleExportAllNotes = () => {
    exportNoteTemplates(templates, 'all');
  };

  const handleExportSelectedNotes = () => {
    if (selectedTemplates.length === 0) {
      Alert.alert('No Selection', 'Please select at least one note template.');
      return;
    }

    exportNoteTemplates(selectedTemplates, 'selected');
  };

  const handleExportSingleNote = (item) => {
    exportNoteTemplates([item], item?.title || 'single');
  };

  const applyImportedNoteTemplates = async (
    itemsToImport = [],
    mode = 'skip'
  ) => {
    try {
      setIsBackupBusy(true);

      const normalizedImports = itemsToImport.map(normalizeNoteTemplate);

      const { importedItems, nextItems } = applyPresetImportMode({
        existingItems: templates,
        importedItems: normalizedImports,
        mode,
        idPrefix: 'note_template',
      });

      if (!importedItems.length) {
        Alert.alert(
          'No New Notes',
          'No note templates were imported with the selected conflict option.'
        );
        return;
      }

      const normalizedNextItems = prepareNoteTemplatesForSave(nextItems);
      const savedTemplates = await saveNoteTemplates(normalizedNextItems);

      setTemplates(savedTemplates.map(normalizeNoteTemplate));
      clearBackupSelection();

      Alert.alert(
        'Import Complete',
        `Imported ${importedItems.length} note template(s).`
      );
    } catch (error) {
      console.log('Note Template Import Apply Error:', error);
      Alert.alert('Import Error', 'Note template CSV could not be imported.');
    } finally {
      setIsBackupBusy(false);
    }
  };

  const handleImportNoteCsv = async () => {
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
        Alert.alert('Import Error', 'No valid note template data found.');
        return;
      }

      const conflictCount = getPresetImportConflictCount({
        existingItems: templates,
        importedItems: parsedItems,
        idPrefix: 'note_template',
      });

      if (conflictCount > 0) {
        Alert.alert(
          'Import Conflicts Found',
          `${conflictCount} duplicate/conflict note template(s) found. What do you want to do?`,
          [
            {
              text: 'Skip Duplicates',
              onPress: () => applyImportedNoteTemplates(parsedItems, 'skip'),
            },
            {
              text: 'Replace Existing',
              onPress: () =>
                applyImportedNoteTemplates(parsedItems, 'replace'),
            },
            {
              text: 'Keep Both',
              onPress: () =>
                applyImportedNoteTemplates(parsedItems, 'keepBoth'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await applyImportedNoteTemplates(parsedItems, 'skip');
    } catch (error) {
      console.log('Note Template Import Error:', error);
      setIsBackupBusy(false);
      Alert.alert('Import Error', 'Note template CSV could not be imported.');
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
        <Ionicons name="document-text-outline" size={25} color={BRAND_COLOR} />
      </View>
    );
  };

  const renderNoteRightTop = (item) => {
    const isSelected = selectedTemplateIds.includes(item.id);

    if (isSelectMode) {
      return (
        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.selectCircleTouchable}
          onPress={() => handleToggleSelectTemplate(item)}
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
          NOTES SETTINGS CUSTOM HEADER
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
              {isEditMode ? 'Edit Note' : 'Notes'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditMode
                ? 'Update saved note template'
                : 'Manage reusable quotation and invoice notes'}
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
            NOTES PRESET BACKUP UI
            CSV backup/import/export for Note Templates only.
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
                <Text style={styles.backupTitle}>Notes Backup</Text>
                <Text style={styles.backupSubtitle}>
                  Export, select, or import note templates as CSV.
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
                onPress={handleExportAllNotes}
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
                onPress={handleImportNoteCsv}
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
                    {selectedTemplateIds.length} Selected
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.exportSelectedButton}
                  onPress={handleExportSelectedNotes}
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
                name={isEditMode ? 'create-outline' : 'document-text-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Note Template' : 'Add New Note'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved note template.'
                  : 'This note can be reused in quotation and invoice forms.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Note'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Template Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. Default Quotation Note"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Notes Content</Text>
          <TextInput
            value={form.notes}
            onChangeText={(t) => updateForm('notes', t)}
            placeholder={`e.g. This quotation is valid for 15 days.\nPrices may change after validity period.\nTerms and conditions apply.`}
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textAreaLarge]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this note automatically for new quotations and invoices.
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
                {isEditMode ? 'Update Note' : 'Save Note'}
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
              Update or cancel editing to view saved note templates again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Notes</Text>
              <Text style={styles.savedCount}>{templates.length} Saved</Text>
            </View>

            {templates.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No note saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first note template from the form above.
                </Text>
              </View>
            ) : (
              templates.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedTopRow}>
                    <View style={styles.savedIconBox}>
                      <Ionicons
                        name="document-text-outline"
                        size={32}
                        color={BRAND_COLOR}
                      />
                    </View>

                    <View style={styles.savedInfo}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {getNoteDisplayName(item)}
                      </Text>

                      <Text style={styles.savedSubText} numberOfLines={1}>
                        {getNoteSubDisplay(item)}
                      </Text>
                    </View>

                    <View style={styles.savedRightTop}>
                      {renderNoteRightTop(item)}
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
                      onPress={() => handleExportSingleNote(item)}
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