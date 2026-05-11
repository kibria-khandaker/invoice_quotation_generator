// src/screens/InvoiceDraftScreen.js

// ======================================================
// INVOICE SIDE DRAFT SCREEN
// PHASE: QUOTATION-LIKE DRAFT UI FOR INVOICE
//
// IMPORTANT:
// - Shows only invoiceLifecycle === 'draft' records.
// - Quotation Draft screen is not imported or edited.
// - Draft item continues in CreateInvoiceScreen edit mode.
// - UI follows DraftQuotationScreen pattern, but invoice data
//   uses Invoice-specific fields: INV / Total / Paid / Due.
// ======================================================

import { useCallback, useMemo, useState } from 'react';

import {
  Alert,
  FlatList,
  Text as RNText,
  TextInput as RNTextInput,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import styles from './InvoiceDraftScreenStyle';

import {
  clearInvoiceDrafts,
  deleteInvoiceRecord,
  getInvoiceDrafts,
} from '../services/storageService';

const BRAND_COLOR = '#fd4475';

function Text(props) {
  return (
    <RNText
      {...props}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
    />
  );
}

function TextInput(props) {
  return (
    <RNTextInput
      {...props}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
    />
  );
}

const parseAmount = (value) => {
  const amount = parseFloat(value);
  return Number.isNaN(amount) ? 0 : amount;
};

const formatMoney = (value) => {
  const number = parseAmount(value);

  try {
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch {
    return String(number);
  }
};

const formatDraftDate = (value) => {
  if (!value) return 'No Date';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).split('T')[0];
  }

  try {
    return date.toLocaleDateString('en-GB');
  } catch {
    return String(value).split('T')[0];
  }
};

const safeText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const getClientDisplayName = (item) => {
  return (
    safeText(item?.clientName).trim() ||
    safeText(item?.clientCompany).trim() ||
    safeText(item?.invoiceNumber).trim() ||
    'No Client'
  );
};

const getClientCompany = (item) => {
  return safeText(item?.clientCompany).trim() || 'N/A';
};

const getSenderName = (item) => {
  return safeText(item?.companyName).trim() || 'N/A';
};

const getInvoiceNumber = (item) => {
  return safeText(item?.invoiceNumber).trim() || 'N/A';
};

const getTotalAmount = (item) => {
  return item?.totalAmount ?? item?.grandTotal ?? 0;
};

const getPaidAmount = (item) => {
  return item?.paidAmount ?? 0;
};

const getDueAmount = (item) => {
  return item?.dueAmount ?? 0;
};

const getInvoiceDraftId = (item) => {
  return safeText(item?.id).trim();
};

export default function InvoiceDraftScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // ======================================================
  // INVOICE DRAFT SELECT STATES
  // NEW:
  // Adds checkbox/select parity without changing Continue,
  // Delete, Draft lifecycle, or storage logic.
  // ======================================================
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);

  const loadDrafts = async () => {
    try {
      setLoading(true);

      const draftInvoices = await getInvoiceDrafts();
      const nextDrafts = Array.isArray(draftInvoices) ? draftInvoices : [];
      const existingIds = new Set(nextDrafts.map(getInvoiceDraftId).filter(Boolean));

      setDrafts(nextDrafts);
      setSelectedDraftIds((prev) =>
        prev.filter((draftId) => existingIds.has(draftId))
      );
    } catch (error) {
      console.log('Load Invoice Drafts Error:', error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDrafts();
    }, [])
  );

  const filteredDrafts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return drafts;
    }

    return drafts.filter((item) => {
      const searchableText = [
        item?.invoiceNumber,
        item?.clientName,
        item?.clientCompany,
        item?.clientEmail,
        item?.clientPhone,
        item?.companyName,
        item?.referenceQuotationNumber,
        item?.paymentStatusLabel,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [drafts, search]);

  const filteredDraftIds = filteredDrafts.map(getInvoiceDraftId).filter(Boolean);

  const selectedDrafts = drafts.filter((item) =>
    selectedDraftIds.includes(getInvoiceDraftId(item))
  );

  const handleRefresh = async () => {
    setSearch('');
    await loadDrafts();
  };

  const handleClearSearch = () => {
    setSearch('');
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

  const handleToggleDraftSelection = (draft) => {
    const draftId = getInvoiceDraftId(draft);

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
      Alert.alert('No Drafts', 'There are no visible invoice drafts to select.');
      return;
    }

    setIsSelectMode(true);
    setSelectedDraftIds(filteredDraftIds);
  };

  const handleDeleteSelectedDrafts = () => {
    if (selectedDrafts.length === 0) {
      Alert.alert('No Selection', 'Please select at least one invoice draft.');
      return;
    }

    Alert.alert(
      'Delete Selected Drafts',
      `Do you want to delete ${selectedDrafts.length} selected invoice draft(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Selected',
          style: 'destructive',
          onPress: async () => {
            const selectedIds = [...selectedDraftIds];

            for (const draftId of selectedIds) {
              await deleteInvoiceRecord(draftId);
            }

            clearSelection();
            await loadDrafts();
          },
        },
      ]
    );
  };

  const handleContinueDraft = (draft) => {
    navigation.navigate('CreateInvoice', {
      editData: draft,
      isDraft: true,
    });
  };

  const handleDeleteDraft = (draft) => {
    Alert.alert(
      'Delete Draft',
      `Do you want to delete ${draft?.invoiceNumber || 'this draft'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteInvoiceRecord(draft.id);

            if (success) {
              const draftId = getInvoiceDraftId(draft);
              setSelectedDraftIds((prev) =>
                prev.filter((selectedId) => selectedId !== draftId)
              );
              await loadDrafts();
            } else {
              Alert.alert('Error', 'Draft could not be deleted.');
            }
          },
        },
      ]
    );
  };

  const handleClearAllDrafts = () => {
    if (drafts.length === 0) {
      Alert.alert('No Drafts', 'There are no invoice drafts to clear.');
      return;
    }

    Alert.alert(
      'Clear All Drafts',
      `Do you want to delete all ${drafts.length} invoice drafts?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearInvoiceDrafts();

            if (success) {
              setDrafts([]);
              setSearch('');
              clearSelection();
            } else {
              Alert.alert('Error', 'Invoice drafts could not be cleared.');
            }
          },
        },
      ]
    );
  };

  const renderDraftItem = ({ item }) => {
    const draftId = getInvoiceDraftId(item);
    const isSelected = selectedDraftIds.includes(draftId);
    const clientName = getClientDisplayName(item);
    const clientCompany = getClientCompany(item);
    const invoiceNumber = getInvoiceNumber(item);
    const senderName = getSenderName(item);
    const updatedDate = formatDraftDate(item?.updatedAt || item?.createdAt);

    const totalAmount = getTotalAmount(item);
    const paidAmount = getPaidAmount(item);
    const dueAmount = getDueAmount(item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.draftCard}
        onPress={() =>
          isSelectMode
            ? handleToggleDraftSelection(item)
            : handleContinueDraft(item)
        }
      >
        <View style={styles.cardMainRow}>
          <View style={styles.cardLeftBlock}>
            <View style={styles.titleRow}>
              <View style={styles.draftIconBox}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={BRAND_COLOR}
                />
              </View>

              <View style={styles.titleTextBlock}>
                <Text style={styles.clientName} numberOfLines={1}>
                  {clientName}
                </Text>

                <Text style={styles.clientCompany} numberOfLines={1}>
                  Company: {clientCompany}
                </Text>
              </View>
            </View>

            <Text style={styles.leftInvoiceNumberText} numberOfLines={1}>
              INV : {invoiceNumber}
            </Text>

            <Text style={styles.amountMainText} numberOfLines={1}>
              Amount : ৳ {formatMoney(totalAmount)}
            </Text>
          </View>

          <View style={styles.cardRightBlock}>
            {/* ======================================================
                INVOICE DRAFT CARD RIGHT ACTION
                EDIT:
                Normal mode shows Delete icon.
                Select mode hides Delete and shows select circle.
                Existing delete/select logic is reused.
            ====================================================== */}
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
                style={styles.cardTopDeleteButton}
                onPress={() => handleDeleteDraft(item)}
              >
                <Ionicons name="trash-outline" size={20} color="#b42318" />
              </TouchableOpacity>
            )}

            <Text style={styles.rightInfoText} numberOfLines={1}>
              <Text style={styles.rightInfoLabel}>Updated </Text>
              {updatedDate}
            </Text>

            <Text style={styles.rightInfoText} numberOfLines={1}>
              <Text style={styles.rightInfoLabel}>From: </Text>
              {senderName}
            </Text>
          </View>
          
        </View>

        {/* ======================================================
            INVOICE SIDE DRAFT AMOUNT BOXES
            NEW:
            Compact Total / Paid / Due boxes for invoice drafts.
        ====================================================== */}
        <View style={styles.amountGrid}>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total:</Text>
            <Text style={styles.amountValue} numberOfLines={1}>
              {formatMoney(totalAmount)}
            </Text>
          </View>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Paid:</Text>
            <Text style={styles.amountValue} numberOfLines={1}>
              {formatMoney(paidAmount)}
            </Text>
          </View>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Due:</Text>
            <Text style={styles.dueValue} numberOfLines={1}>
              {formatMoney(dueAmount)}
            </Text>
          </View>
        </View>

        {/* ======================================================
            INVOICE DRAFT CARD ACTION
            EDIT:
            Bottom action keeps only Continue.
            Delete is now shown on the card top-right in normal mode.
        ====================================================== */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.cardActionButton, styles.continueButton]}
            onPress={() => handleContinueDraft(item)}
          >
            <Ionicons name="create-outline" size={17} color="#ffffff" />
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    );
  };

  const bottomListPadding = Math.max(insets.bottom, 12) + 76;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      {/* ======================================================
          INVOICE SIDE DRAFT HEADER
          EDIT:
          Compact pink gradient header with reduced subtitle gap.
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
            <Text style={styles.headerTitle}>Invoice Drafts</Text>
            <Text style={styles.headerSubtitle}>
              Continue incomplete invoices
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('CreateInvoice')}
          >
            <Ionicons name="add" size={26} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        {/* ======================================================
            INVOICE SIDE FIXED TOP CONTROLS
            Search, clear search, refresh, showing count, clear all.
        ====================================================== */}
        <View style={styles.topControls}>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={19}
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

              {!!search && (
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={handleClearSearch}
                  style={styles.clearSearchButton}
                >
                  <Ionicons name="close-circle" size={18} color="#98a2b3" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Ionicons name="refresh" size={21} color={BRAND_COLOR} />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Ionicons name="layers-outline" size={15} color={BRAND_COLOR} />
              <Text style={styles.summaryText} numberOfLines={1}>
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
                size={15}
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
              <Ionicons name="trash-bin-outline" size={15} color="#b42318" />
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

        <FlatList
          data={filteredDrafts}
          keyExtractor={(item, index) => String(item?.id || index)}
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
                {loading ? 'Loading drafts...' : 'No draft invoices found'}
              </Text>

              <Text style={styles.emptyText}>
                Save an incomplete invoice as draft and it will appear here.
              </Text>
            </View>
          )}
        />
      </View>

      {/* ======================================================
          INVOICE SIDE FIXED FOOTER BUTTON
          NEW:
          Fixed Create New Invoice button like DraftQuotationScreen.
      ====================================================== */}
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
          onPress={() => navigation.navigate('CreateInvoice')}
        >
          <Ionicons name="add-circle-outline" size={19} color="#ffffff" />
          <Text style={styles.createNewButtonText}>Create New Invoice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}