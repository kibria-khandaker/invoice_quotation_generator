// src/screens/DraftQuotationScreen.js

import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import styles, { BRAND_COLOR } from './DraftQuotationScreenStyle';

import {
  getDraftQuotations,
  deleteDraftQuotation,
  clearDraftQuotations,
} from '../services/storageService';

// ======================================================
// HELPERS
// ======================================================
const parseAmount = (value) => {
  const amount = parseFloat(value);
  return Number.isNaN(amount) ? 0 : amount;
};

const formatAmount = (value) => {
  const amount = parseAmount(value);

  try {
    return amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  } catch {
    return String(amount);
  }
};

const formatDraftDate = (value) => {
  if (!value) return 'No Date';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  try {
    return date.toLocaleDateString('en-GB');
  } catch {
    return String(value);
  }
};

const safeText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const getDraftId = (item) => {
  return safeText(item?.draftId || item?.id).trim();
};

const getDraftDisplayTitle = (item) => {
  return (
    safeText(item?.draftTitle).trim() ||
    safeText(item?.clientName).trim() ||
    safeText(item?.clientCompany).trim() ||
    safeText(item?.companyName).trim() ||
    safeText(item?.quotationNumber).trim() ||
    'Untitled Draft'
  );
};

const getFirstMeaningfulItemName = (item) => {
  const services = Array.isArray(item?.services) ? item.services : [];

  const found = services.find((service) => {
    const name = safeText(service?.name).trim();
    const description = safeText(service?.description).trim();
    const unitPrice = safeText(service?.unitPrice).trim();

    return name || description || unitPrice;
  });

  if (!found) return '';

  return safeText(found?.name).trim() || safeText(found?.description).trim();
};

const buildQuotationPreviewDataFromDraft = (draft) => {
  const {
    id,
    draftId,
    isDraft,
    status,
    draftTitle,
    updatedAt,
    createdAt,
    ...cleanQuotationData
  } = draft || {};

  return cleanQuotationData;
};

export default function DraftQuotationScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // ======================================================
  // QUOTATION DRAFT SELECT STATES
  // NEW:
  // Adds checkbox/select parity without changing Continue,
  // Preview, Delete, Draft cleanup, or storage logic.
  // ======================================================
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);

  useLayoutEffect(() => {
    navigation?.setOptions?.({
      headerShown: false,
    });
  }, [navigation]);

  // ======================================================
  // LOAD DRAFTS
  // ======================================================
  const loadDrafts = async () => {
    try {
      setLoading(true);
      const data = await getDraftQuotations();
      const nextDrafts = Array.isArray(data) ? data : [];
      const existingIds = new Set(nextDrafts.map(getDraftId).filter(Boolean));

      setDrafts(nextDrafts);
      setSelectedDraftIds((prev) =>
        prev.filter((draftId) => existingIds.has(draftId))
      );
    } catch (error) {
      console.log('Load drafts error:', error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDrafts);
    return unsubscribe;
  }, [navigation]);

  // ======================================================
  // FILTERED DRAFTS
  // ======================================================
  const filteredDrafts = drafts.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    const searchableText = [
      item?.draftTitle,
      item?.clientName,
      item?.clientCompany,
      item?.companyName,
      item?.quotationNumber,
      item?.clientEmail,
      item?.clientPhone,
      getFirstMeaningfulItemName(item),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  const filteredDraftIds = filteredDrafts.map(getDraftId).filter(Boolean);

  const selectedDrafts = drafts.filter((item) =>
    selectedDraftIds.includes(getDraftId(item))
  );

  // ======================================================
  // ACTIONS
  // ======================================================
  const handleRefresh = async () => {
    setSearch('');
    await loadDrafts();
  };

  const clearSelection = () => {
    setSelectedDraftIds([]);
    setIsSelectMode(false);
  };

  const handleToggleSelectMode = () => {
    setIsSelectMode((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setSelectedDraftIds([]);
      }

      return nextValue;
    });
  };

  const handleToggleDraftSelection = (item) => {
    const draftId = getDraftId(item);

    if (!draftId) {
      return;
    }

    setSelectedDraftIds((prev) => {
      if (prev.includes(draftId)) {
        return prev.filter((id) => id !== draftId);
      }

      return [...prev, draftId];
    });
  };

  const handleSelectAllFilteredDrafts = () => {
    if (filteredDraftIds.length === 0) {
      Alert.alert('No Drafts', 'There are no visible drafts to select.');
      return;
    }

    setIsSelectMode(true);
    setSelectedDraftIds(filteredDraftIds);
  };

  const handleDeleteSelectedDrafts = () => {
    if (selectedDrafts.length === 0) {
      Alert.alert('No Selection', 'Please select at least one draft.');
      return;
    }

    Alert.alert(
      'Delete Selected Drafts',
      `Are you sure you want to delete ${selectedDrafts.length} selected draft(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Selected',
          style: 'destructive',
          onPress: async () => {
            const selectedIds = [...selectedDraftIds];

            for (const draftId of selectedIds) {
              await deleteDraftQuotation(draftId);
            }

            clearSelection();
            await loadDrafts();
          },
        },
      ]
    );
  };

  const handleDeleteDraft = (item) => {
    const draftId = item?.draftId || item?.id;

    if (!draftId) {
      Alert.alert('Error', 'Draft ID not found.');
      return;
    }

    Alert.alert(
      'Delete Draft',
      'Are you sure you want to delete this draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteDraftQuotation(draftId);

            if (success) {
              setSelectedDraftIds((prev) =>
                prev.filter((selectedId) => selectedId !== draftId)
              );
              await loadDrafts();
            } else {
              Alert.alert('Error', 'Could not delete draft.');
            }
          },
        },
      ]
    );
  };

  const handleClearAllDrafts = () => {
    if (drafts.length === 0) {
      Alert.alert('No Drafts', 'There are no drafts to clear.');
      return;
    }

    Alert.alert(
      'Clear All Drafts',
      `Are you sure you want to delete all ${drafts.length} drafts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearDraftQuotations();

            if (success) {
              setDrafts([]);
              clearSelection();
            } else {
              Alert.alert('Error', 'Could not clear drafts.');
            }
          },
        },
      ]
    );
  };

  const handleContinueDraft = (item) => {
    navigation.navigate('Create', {
      draftData: item,
      mode: 'draftEdit',
    });
  };

  const handlePreviewDraft = (item) => {
    const previewData = buildQuotationPreviewDataFromDraft(item);
    const sourceDraftId = item?.draftId || item?.id || null;

    navigation.navigate('Preview', {
      quotationData: previewData,
      mode: 'draftPreview',
      sourceDraftId,
    });
  };

  // ======================================================
  // RENDER ITEM
  // ======================================================
  const renderDraftItem = ({ item }) => {
    const draftId = getDraftId(item);
    const isSelected = selectedDraftIds.includes(draftId);
    const title = getDraftDisplayTitle(item);
    const firstItemName = getFirstMeaningfulItemName(item);
    const updatedDate = item?.updatedAt || item?.createdAt;

    const subtitleText = item?.clientCompany
      ? `Client Company: ${item.clientCompany}`
      : firstItemName
        ? `Item: ${firstItemName}`
        : 'Incomplete quotation draft';

    return (
      <View style={styles.draftCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.cardTitleArea}>
            <View style={styles.draftIconBox}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={BRAND_COLOR}
              />
            </View>

            <View style={styles.cardTextArea}>
              <Text style={styles.draftTitle} numberOfLines={1}>
                {title}
              </Text>

              <Text style={styles.draftSubTitle} numberOfLines={1}>
                {subtitleText}
              </Text>
            </View>
          </View>

          {isSelectMode ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.selectCircleButton}
              onPress={() => handleToggleDraftSelection(item)}
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
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.deleteButton}
              onPress={() => handleDeleteDraft(item)}
            >
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText} numberOfLines={1}>
            <Text style={styles.infoLabel}>QTN : </Text>
            {item?.quotationNumber || 'N/A'}
          </Text>

          <Text style={styles.infoTextRight} numberOfLines={1}>
            <Text style={styles.infoLabel}>Updated </Text>
            {formatDraftDate(updatedDate)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText} numberOfLines={1}>
            <Text style={styles.infoLabel}>Amount : </Text>
            ৳ {formatAmount(item?.grandTotal)}
          </Text>

          <Text style={styles.infoTextRight} numberOfLines={1}>
            <Text style={styles.infoLabel}>From: </Text>
            {item?.companyName || 'N/A'}
          </Text>
        </View>

        <View style={styles.cardDivider} />
 
        <View style={styles.cardActions}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.cardActionButton, styles.continueButton]}
            onPress={() => handleContinueDraft(item)}
          >
            <Ionicons name="create-outline" size={15} color="#ffffff" />
            <Text style={styles.cardActionButtonText}>Continue Editing</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  const bottomListPadding =
    filteredDrafts.length > 0 ? insets.bottom + 54 : insets.bottom + 16;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      {/* HEADER */}
      <LinearGradient
        colors={[BRAND_COLOR, '#ff6b95', '#ffb7ca']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topHeader}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.headerIconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Draft Quotations</Text>

        <View style={styles.headerRightSpacer} />
      </LinearGradient>

      {/* TOP CONTROLS */}
      <View style={styles.topControls}>
        <Text style={styles.helperText}>Saved incomplete quotation drafts</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#98a2b3"
              style={styles.searchIcon}
            />

            <TextInput
              placeholder="Search draft..."
              placeholderTextColor="#98a2b3"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />

            {search ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSearch('')}
                style={styles.clearSearchButton}
              >
                <Ionicons name="close-circle" size={18} color="#98a2b3" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={20} color={BRAND_COLOR} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryPill}>
            <Ionicons name="layers-outline" size={14} color={BRAND_COLOR} />
            <Text style={styles.summaryText}>
              Showing {filteredDrafts.length} / {drafts.length}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.selectToggleButton,
              isSelectMode && styles.selectToggleButtonActive,
            ]}
            onPress={handleToggleSelectMode}
          >
            <Ionicons
              name={isSelectMode ? 'checkmark-circle-outline' : 'checkbox-outline'}
              size={14}
              color={isSelectMode ? '#ffffff' : BRAND_COLOR}
            />
            <Text
              style={[
                styles.selectToggleText,
                isSelectMode && styles.selectToggleTextActive,
              ]}
            >
              {isSelectMode ? 'Selecting' : 'Select'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.clearAllButton}
            onPress={handleClearAllDrafts}
          >
            <Ionicons name="trash-bin-outline" size={14} color="#dc3545" />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {isSelectMode ? (
          <View style={styles.selectionActionRow}>
            <View style={styles.selectedCountPill}>
              <Text style={styles.selectedCountText}>
                {selectedDraftIds.length} Selected
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.selectAllButton}
              onPress={handleSelectAllFilteredDrafts}
            >
              <Text style={styles.selectAllText}>Select All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.deleteSelectedButton}
              onPress={handleDeleteSelectedDrafts}
            >
              <Text style={styles.deleteSelectedText}>Delete Selected</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.clearSelectionButton}
              onPress={clearSelection}
            >
              <Text style={styles.clearSelectionText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* LIST */}
      <FlatList
        data={filteredDrafts}
        keyExtractor={(item, index) => String(item?.draftId || item?.id || index)}
        renderItem={renderDraftItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: bottomListPadding,
          },
        ]}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Ionicons name="folder-open-outline" size={44} color="#f3a4bb" />

            <Text style={styles.emptyTitle}>
              {loading ? 'Loading drafts...' : 'No drafts found'}
            </Text>

            <Text style={styles.emptyText}>
              Save an incomplete quotation as draft and it will appear here.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.emptyCreateButton}
              onPress={() => navigation.navigate('Create')}
            >
              <Ionicons name="add-circle-outline" size={17} color="#ffffff" />
              <Text style={styles.emptyCreateButtonText}>
                Create New Quotation
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* FIXED FOOTER BUTTON */}
      {filteredDrafts.length > 0 && (
        <View
          style={[
            styles.footerFloating,
            {
              bottom: Math.max(insets.bottom, 10),
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.createNewButton}
            onPress={() => navigation.navigate('Create')}
          >
            <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.createNewButtonText}>Create New Quotation</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}