// src/screens/HistoryScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';

import JSZip from 'jszip';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import styles, { BRAND_COLOR } from './HistoryScreenStyle';

import {
  getQuotations,
  deleteQuotation,
  saveAllQuotations,
} from '../services/storageService';
import { generatePDF } from '../services/pdfService';

export default function HistoryScreen({ navigation }) {
  // ========================================================
  // 1. STATE MANAGEMENT
  // ========================================================
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- Selection States ---
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // --- Filter & Sort States ---
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [sortType, setSortType] = useState('latest');

  // --- Sub-Menu Toggles ---
  const [isFilterSubOpen, setIsFilterSubOpen] = useState(false);
  const [isSelectionSubOpen, setIsSelectionSubOpen] = useState(false);
  const [isBackupSubOpen, setIsBackupSubOpen] = useState(false);

  // --- Import/Backup States ---
  const [importHasConflict, setImportHasConflict] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingFileUri, setPendingFileUri] = useState(null);

  // --- Pagination & View States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isShowMenuOpen, setIsShowMenuOpen] = useState(false);

  // ========================================================
  // 2. DATA LOADING & EFFECTS
  // ========================================================
  const loadData = async () => {
    setLoading(true);
    const data = await getQuotations();
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  // ========================================================
  // 3. SMALL SAFE HELPERS
  // ========================================================
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

  const getRawDateValue = (item) => {
    return item?.createdAt || item?.date || '';
  };

  const getDateTime = (item) => {
    const rawDate = getRawDateValue(item);
    if (!rawDate) return 0;

    const time = new Date(rawDate).getTime();
    return Number.isNaN(time) ? 0 : time;
  };

  const getFilterDateTime = (dateString, endOfDay = false) => {
    if (!dateString) return null;

    const dateValue = endOfDay ? `${dateString}T23:59:59` : dateString;
    const time = new Date(dateValue).getTime();

    return Number.isNaN(time) ? null : time;
  };

  const formatHistoryDate = (item) => {
    const rawDate = getRawDateValue(item);

    if (!rawDate) return 'No Date';

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
      return String(rawDate);
    }

    return date.toLocaleDateString();
  };

  const formatDate = (date) => date.toISOString().split('T')[0];

  // ========================================================
  // 4. SELECTION LOGIC
  // ========================================================
  const toggleSelectItem = (item) => {
    const exists = selectedItems.find((i) => i.id === item.id);

    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const selectAll = () => setSelectedItems(paginatedList);

  const selectAllHistory = () => {
    setSelectedItems(filteredList);
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  // ========================================================
  // 5. EXPORT FUNCTIONS
  // ========================================================
  const exportAsPDF = async (item) => {
    try {
      const uri = await generatePDF(item);
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log('PDF Export Error:', error);
    }
  };

  const exportSelectedPDFs = async () => {
    const selectedCount = selectedItems.length;

    if (selectedCount === 0) {
      return Alert.alert('No Selection', 'Please select at least one');
    }

    try {
      setLoading(true);

      if (selectedCount === 1) {
        const item = selectedItems[0];
        const uri = await generatePDF(item);

        await Sharing.shareAsync(uri);
      } else {
        const zip = new JSZip();

        for (const item of selectedItems) {
          const uri = await generatePDF(item);

          const base64Data = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const cleanName = (item.clientName || 'Quotation').replace(/\s+/g, '_');
          const fileName = `${cleanName}_${item.id}.pdf`;

          zip.file(fileName, base64Data, { base64: true });
        }

        const zipBase64 = await zip.generateAsync({ type: 'base64' });
        const zipUri =
          FileSystem.cacheDirectory + `Quotations_Bundle_${Date.now()}.zip`;

        await FileSystem.writeAsStringAsync(zipUri, zipBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(zipUri, {
          mimeType: 'application/zip',
          dialogTitle: `Share ${selectedCount} Quotations`,
        });
      }
    } catch (error) {
      console.log('Export Error:', error);
      Alert.alert('Error', 'Could not export files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportSmartCSV = async (itemsToExport) => {
    try {
      if (itemsToExport.length === 0) {
        return Alert.alert('No Data', 'Nothing to export');
      }

      const header = 'id,data\n';

      const rows = itemsToExport
        .map((item) => {
          const safeData = JSON.stringify(item).replace(/"/g, '""');
          return `${item.id},"${safeData}"`;
        })
        .join('\n');

      const csv = header + rows;

      const fileName =
        itemsToExport.length === list.length
          ? `full_backup_${Date.now()}.csv`
          : `backup_quotations_${Date.now()}.csv`;

      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csv);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'Sharing not available');
      }
    } catch (error) {
      console.log('Export Error:', error);
    }
  };

  const exportAllSmartCSV = () => exportSmartCSV(list);

  // ========================================================
  // QUOTATION HISTORY BACKUP PARITY
  // NEW:
  // Export only the currently filtered/search result list.
  // Existing Full Backup and Selected CSV export are untouched.
  // ========================================================
  const exportFilteredSmartCSV = () => exportSmartCSV(filteredList);

  // ========================================================
  // 6. IMPORT & BULK DELETE LOGIC
  // ========================================================
  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileUri = result.assets?.[0]?.uri;
      if (!fileUri) return;

      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const lines = fileContent.split('\n');
      lines.shift();

      const importedItems = [];

      for (let line of lines) {
        if (!line.trim()) continue;

        const firstCommaIndex = line.indexOf(',');
        let data = line
          .substring(firstCommaIndex + 1)
          .replace(/^"|"$/g, '')
          .replace(/""/g, '"');

        try {
          importedItems.push(JSON.parse(data));
        } catch {}
      }

      const hasConflict = importedItems.some((newItem) =>
        list.find((old) => old.id === newItem.id)
      );

      setPendingFileUri(fileUri);
      setImportHasConflict(hasConflict);
      setShowImportModal(true);
    } catch (error) {
      Alert.alert('Error', 'File selection failed');
    }
  };

  const importSmartCSV = async (fileUri, mode = 'skip') => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const lines = fileContent.split('\n');
      lines.shift();

      const importedItems = [];

      for (let line of lines) {
        if (!line.trim()) continue;

        const firstCommaIndex = line.indexOf(',');

        let data = line
          .substring(firstCommaIndex + 1)
          .replace(/^"|"$/g, '')
          .replace(/""/g, '"');

        try {
          importedItems.push(JSON.parse(data));
        } catch {}
      }

      let updatedList = [...list];

      if (mode === 'replace') {
        const newList = [...list];

        importedItems.forEach((newItem) => {
          const index = newList.findIndex((old) => old.id === newItem.id);

          if (index !== -1) {
            newList[index] = newItem;
          } else {
            newList.unshift(newItem);
          }
        });

        updatedList = newList;
      } else if (mode === 'skip') {
        const filtered = importedItems.filter(
          (newItem) => !list.find((old) => old.id === newItem.id)
        );

        updatedList = [...filtered, ...list];
      } else if (mode === 'keep_both') {
        const keepBoth = [...list];

        importedItems.forEach((item, index) => {
          if (keepBoth.find((i) => i.id === item.id)) {
            keepBoth.unshift({
              ...item,
              id: `${item.id}_${Date.now()}_${index}`,
              clientName: `${item.clientName || 'Quotation'} (copy)`,
            });
          } else {
            keepBoth.unshift(item);
          }
        });

        updatedList = keepBoth;
      }

      const success = await saveAllQuotations(updatedList);

      if (!success) {
        Alert.alert('Error', 'Import failed while saving quotations.');
        return;
      }

      setList(updatedList);
      setPendingFileUri(null);
      setImportHasConflict(false);
      Alert.alert('Import Complete', `${importedItems.length} items processed`);
    } catch (error) {
      console.log('Import Error:', error);
      Alert.alert('Error', 'Import failed');
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      return Alert.alert('No Selection', 'No items selected');
    }

    Alert.alert(
      'Delete Selected',
      `Are you sure you want to delete ${selectedItems.length} selected items?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            for (let item of selectedItems) {
              await deleteQuotation(item.id);
            }

            await loadData();
            setSelectedItems([]);
            setIsSelectionMode(false);
            setCurrentPage(1);
          },
        },
      ]
    );
  };

  // ========================================================
  // 7. FILTER, SORT & PAGINATION LOGIC
  // ========================================================
  const filteredList = list
    .filter((item) => {
      const searchQuery = search.trim().toLowerCase();

      const searchableText = [
        item.clientName,
        item.clientCompany,
        item.companyName,
        item.quotationNumber,
        item.clientEmail,
        item.clientPhone,
        item.companyEmail,
        item.companyPhone,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !searchQuery || searchableText.includes(searchQuery);

      const amount = parseAmount(item.grandTotal);

      const afterMin = minAmount ? amount >= parseAmount(minAmount) : true;
      const beforeMax = maxAmount ? amount <= parseAmount(maxAmount) : true;

      const itemTime = getDateTime(item);
      const fromTime = getFilterDateTime(fromDate);
      const toTime = getFilterDateTime(toDate, true);

      const afterDate = fromTime ? itemTime > 0 && itemTime >= fromTime : true;
      const beforeDate = toTime ? itemTime > 0 && itemTime <= toTime : true;

      return matchesSearch && afterMin && beforeMax && afterDate && beforeDate;
    })
    .sort((a, b) => {
      if (sortType === 'latest') {
        return getDateTime(b) - getDateTime(a);
      }

      if (sortType === 'oldest') {
        return getDateTime(a) - getDateTime(b);
      }

      if (sortType === 'amount_high') {
        return parseAmount(b.grandTotal) - parseAmount(a.grandTotal);
      }

      if (sortType === 'amount_low') {
        return parseAmount(a.grandTotal) - parseAmount(b.grandTotal);
      }

      if (sortType === 'az') {
        return (a.clientName || '').localeCompare(b.clientName || '');
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ========================================================
  // 8. DELETE SINGLE ITEM
  // ========================================================
  const handleDelete = (id) => {
    Alert.alert('Confirm', 'Delete this quotation?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteQuotation(id);
          loadData();
        },
        style: 'destructive',
      },
    ]);
  };

  // ========================================================
  // 9. RENDER LIST ITEM
  // ========================================================
  const renderItem = ({ item }) => {
    const selected = selectedItems.some((i) => i.id === item.id);

    return (
      <View style={[styles.itemCard, selected && styles.itemCardSelected]}>
        {/* Header row: checkbox + client name + delete */}
        <View style={styles.historyCardHeaderRow}>
          {isSelectionMode && (
            <TouchableOpacity
              onPress={() => toggleSelectItem(item)}
              style={styles.cardCheckboxButton}
            >
              <Ionicons
                name={selected ? 'checkbox' : 'square-outline'}
                size={22}
                color={BRAND_COLOR}
              />
            </TouchableOpacity>
          )}

          <View style={styles.historyCardNameWrap}>
            <Text style={styles.clientNameText} numberOfLines={1}>
              {item.clientName || 'No Client'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.cardDeleteButton}
          >
            <Ionicons name="trash-outline" size={22} color="#ff3b30" />
          </TouchableOpacity>
        </View>

        {/* Info row 1: client company + quotation no */}
        <View style={styles.historyCardInfoRow}>
          <Text style={styles.historyCardLeftText} numberOfLines={1}>
            Company: {item.clientCompany || 'N/A'}
          </Text>

          <Text style={styles.historyCardRightText} numberOfLines={1}>
            QTN: {item.quotationNumber || 'N/A'}
          </Text>
        </View>

        {/* Info row 2: amount + date */}
        <View style={styles.historyCardInfoRow}>
          <Text style={styles.historyCardLeftText} numberOfLines={1}>
            Amount:{' '}
            <Text style={styles.historyCardAmountText}>
              ৳ {formatAmount(item.grandTotal)}
            </Text>
          </Text>

          <Text style={styles.historyCardRightText} numberOfLines={1}>
            Date: {formatHistoryDate(item)}
          </Text>
        </View>

        {/* Sender company row */}
        <View style={styles.historyCardFromRow}>
          <Text style={styles.historyCardFromText} numberOfLines={1}>
            From: {item.companyName || 'N/A'}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionButtonGroup}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Preview', {
                quotationData: item,
                mode: 'historyView',
              })
            }
            style={[styles.modernBtn, styles.viewBtn]}
          >
            <Ionicons name="eye-outline" size={15} color="#16a34a" />
            <Text style={[styles.btnText, styles.viewBtnText]}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Create', {
                editData: item,
                mode: 'historyEdit',
              })
            }
            style={[styles.modernBtn, styles.editBtn]}
          >
            <Ionicons name="create-outline" size={15} color="#dc3545" />
            <Text style={[styles.btnText, styles.editBtnText]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => exportAsPDF(item)}
            style={[styles.modernBtn, styles.pdfBtn]}
          >
            <Ionicons name="download-outline" size={15} color="#6f42c1" />
            <Text style={[styles.btnText, styles.pdfBtnText]}>PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ========================================================
  // 10. MAIN RENDER
  // ========================================================
  return (
    <SafeAreaView
      style={styles.historyMainContainer}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      {/* ----------------------------------------------------
          A. CUSTOM BRAND HEADER
          IMPORTANT: UI only. No History logic is changed.
      ------------------------------------------------------ */}
      <LinearGradient
        colors={[BRAND_COLOR, '#ff6b95', '#ffb7ca']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.historyBrandHeader}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          style={styles.historyHeaderBackButton}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.historyHeaderTitle}>Quotation History</Text>

        {/* ======================================================
            QUOTATION HISTORY HEADER ACTION
            NEW:
            Create shortcut only. Existing back/history logic is untouched.
        ====================================================== */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Create')}
          style={styles.historyHeaderCreateButton}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* ----------------------------------------------------
          B. TOP SEARCH / SUMMARY AREA
      ------------------------------------------------------ */}
      <View style={styles.topHeaderWrap}>
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search client, company, quotation no..."
            value={search}
            placeholderTextColor="#98a2b3"
            onChangeText={(text) => {
              setSearch(text);
              setCurrentPage(1);
            }}
            style={styles.searchInput}
          />

          <TouchableOpacity
            onPress={() => {
              setSearch('');
              setFromDate('');
              setToDate('');
              setMinAmount('');
              setMaxAmount('');
              setSortType('latest');
              setCurrentPage(1);
            }}
            style={styles.resetButton}
          >
            <Ionicons name="refresh" size={22} color={BRAND_COLOR} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerSummaryRow}>
          <Text style={styles.showingText}>
            Showing: {filteredList.length} | Total: {list.length}
          </Text>

          {/* Items Per Page Dropdown */}
          <View style={styles.itemsPerPageWrap}>
            <TouchableOpacity
              onPress={() => setIsFilterVisible(!isFilterVisible)}
              style={styles.chipButton}
            >
              <Text style={styles.chipText}>Show: {itemsPerPage}</Text>
              <Ionicons
                name={isFilterVisible ? 'chevron-up' : 'chevron-down'}
                size={15}
                color={BRAND_COLOR}
                style={styles.iconLeftSpace}
              />
            </TouchableOpacity>

            {isFilterVisible && (
              <View style={styles.dropdownList}>
                {[10, 20, 50, 100].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => {
                      setItemsPerPage(num);
                      setIsFilterVisible(false);
                      setCurrentPage(1);
                    }}
                    style={[
                      styles.dropdownItem,
                      num === 100 && styles.dropdownItemLast,
                      itemsPerPage === num && styles.dropdownItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        itemsPerPage === num && styles.dropdownTextActive,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Show/Hide Menu Button */}
          <TouchableOpacity
            onPress={() => setIsShowMenuOpen(!isShowMenuOpen)}
            style={[
              styles.showMenuButton,
              isShowMenuOpen && styles.showMenuButtonActive,
            ]}
          >
            <Text
              style={[
                styles.showMenuText,
                isShowMenuOpen && styles.showMenuTextActive,
              ]}
            >
              {isShowMenuOpen ? 'Hide Menu' : 'Show Menu'}
            </Text>
            <Ionicons
              name={isShowMenuOpen ? 'chevron-up' : 'chevron-down'}
              size={15}
              color={isShowMenuOpen ? '#ffffff' : BRAND_COLOR}
              style={styles.iconLeftSpace}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ----------------------------------------------------
          B. ADVANCED MENU AREA
      ------------------------------------------------------ */}
      {isShowMenuOpen && (
        <View style={styles.advancedMenuWrap}>
          {/* Main Menu Tabs */}
          <View style={styles.menuTabsWrap}>
            <TouchableOpacity
              onPress={() => setIsFilterSubOpen(!isFilterSubOpen)}
              style={[
                styles.menuTab,
                styles.menuTabWithBorder,
                isFilterSubOpen && styles.menuTabActive,
              ]}
            >
              <Ionicons
                name="filter-outline"
                size={22}
                color={isFilterSubOpen ? BRAND_COLOR : '#667085'}
              />
              <Text
                style={[
                  styles.menuTabText,
                  isFilterSubOpen && styles.menuTabTextActive,
                ]}
              >
                FILTERS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsSelectionSubOpen(!isSelectionSubOpen)}
              style={[
                styles.menuTab,
                styles.menuTabWithBorder,
                isSelectionSubOpen && styles.menuTabActive,
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={isSelectionSubOpen ? BRAND_COLOR : '#667085'}
              />
              <Text
                style={[
                  styles.menuTabText,
                  isSelectionSubOpen && styles.menuTabTextActive,
                ]}
              >
                SELECT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsBackupSubOpen(!isBackupSubOpen)}
              style={[styles.menuTab, isBackupSubOpen && styles.menuTabActive]}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color={isBackupSubOpen ? BRAND_COLOR : '#667085'}
              />
              <Text
                style={[
                  styles.menuTabText,
                  isBackupSubOpen && styles.menuTabTextActive,
                ]}
              >
                BACKUP
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Sub-Menu */}
          {isFilterSubOpen && (
            <View style={styles.subMenuBox}>
              <View style={styles.filterInputRow}>
                <TextInput
                  placeholder="Min"
                  value={minAmount}
                  placeholderTextColor="#98a2b3"
                  onChangeText={(v) => {
                    setMinAmount(v);
                    setCurrentPage(1);
                  }}
                  keyboardType="numeric"
                  style={styles.amountInput}
                />

                <TextInput
                  placeholder="Max"
                  value={maxAmount}
                  placeholderTextColor="#98a2b3"
                  onChangeText={(v) => {
                    setMaxAmount(v);
                    setCurrentPage(1);
                  }}
                  keyboardType="numeric"
                  style={styles.amountInput}
                />
              </View>

              <View style={styles.dateRow}>
                <TouchableOpacity
                  onPress={() => setShowFromPicker(true)}
                  style={styles.dateButton}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      !fromDate && styles.dateButtonPlaceholder,
                    ]}
                  >
                    {fromDate || 'From'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowToPicker(true)}
                  style={styles.dateButton}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      !toDate && styles.dateButtonPlaceholder,
                    ]}
                  >
                    {toDate || 'To'}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['latest', 'oldest', 'amount_high', 'amount_low', 'az'].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => {
                        setSortType(type);
                        setCurrentPage(1);
                      }}
                      style={[
                        styles.sortButton,
                        sortType === type && styles.sortButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sortButtonText,
                          sortType === type && styles.sortButtonTextActive,
                        ]}
                      >
                        {type.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
          )}

          {/* Selection Sub-Menu */}
          {isSelectionSubOpen && (
            <View style={styles.subMenuBox}>
              <View>
                <TouchableOpacity
                  onPress={() => setIsSelectionMode(!isSelectionMode)}
                  style={[
                    styles.selectionToggleButton,
                    isSelectionMode && styles.selectionToggleButtonActive,
                  ]}
                >
                  <Text style={styles.selectionToggleText}>
                    {isSelectionMode ? 'Selection ON' : 'Select Items'}
                  </Text>
                </TouchableOpacity>

                {isSelectionMode && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.selectionScroll}
                  >
                    <View style={styles.selectionRow}>
                      {selectedItems.length > 0 && (
                        <View style={styles.selectedBadge}>
                          <Ionicons
                            name="layers-outline"
                            size={12}
                            color={BRAND_COLOR}
                            style={styles.selectedBadgeIcon}
                          />
                          <Text style={styles.selectedBadgeText}>
                            {selectedItems.length} Selected
                          </Text>
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={selectAll}
                        style={[
                          styles.outlineActionButton,
                          styles.selectCurrentButton,
                        ]}
                      >
                        <Text style={styles.selectCurrentText}>
                          Select all Current Page items
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={selectAllHistory}
                        style={[
                          styles.outlineActionButton,
                          styles.selectHistoryButton,
                        ]}
                      >
                        <Text style={styles.selectHistoryText}>
                          Select All History Pages items
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={clearSelection}
                        style={styles.clearButton}
                      >
                        <Text style={styles.clearButtonText}>Mark Clear</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )}
              </View>

              {isSelectionMode && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.selectionScroll}
                >
                  <TouchableOpacity
                    onPress={exportSelectedPDFs}
                    style={[styles.solidActionButton, styles.exportPdfButton]}
                  >
                    <Text style={styles.solidActionText}>
                      Export Selected PDFs
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => exportSmartCSV(selectedItems)}
                    style={[styles.solidActionButton, styles.exportCsvButton]}
                  >
                    <Text style={styles.solidActionText}>
                      Export Selected CSVs for Backup
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleBulkDelete}
                    style={[styles.solidActionButton, styles.bulkDeleteButton]}
                  >
                    <Text
                      style={[
                        styles.solidActionText,
                        styles.solidActionDangerText,
                      ]}
                    >
                      Delete ({selectedItems.length}) selected items
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          )}

          {/* Backup Sub-Menu */}
          {isBackupSubOpen && (
            <View style={styles.backupBox}>
              <TouchableOpacity
                onPress={exportAllSmartCSV}
                style={[styles.backupButton, styles.fullBackupButton]}
              >
                <Text style={styles.backupButtonText}>Full Backup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={exportFilteredSmartCSV}
                style={[styles.backupButton, styles.filteredBackupButton]}
              >
                <Text style={styles.backupButtonText}>Export Filtered</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleImportCSV}
                style={[styles.backupButton, styles.importButton]}
              >
                <Text style={styles.backupButtonText}>Import CSV</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ----------------------------------------------------
          D. LIST AREA
      ------------------------------------------------------ */}
      <FlatList
        data={paginatedList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text>{loading ? 'Loading...' : 'No data found'}</Text>
          </View>
        )}
      />

      {/* ----------------------------------------------------
          E. PAGINATION FOOTER
      ------------------------------------------------------ */}
      <View style={styles.paginationFooter}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((p) => p - 1)}
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
        >
          <Text style={styles.paginationButtonText}>Prev</Text>
        </TouchableOpacity>

        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages || 1}
        </Text>

        <TouchableOpacity
          disabled={currentPage === totalPages || totalPages === 0}
          onPress={() => setCurrentPage((p) => p + 1)}
          style={[
            styles.paginationButton,
            (currentPage === totalPages || totalPages === 0) &&
              styles.paginationButtonDisabled,
          ]}
        >
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* ----------------------------------------------------
          F. MODALS & PICKERS
      ------------------------------------------------------ */}
      {showFromPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowFromPicker(false);
            if (d) setFromDate(formatDate(d));
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowToPicker(false);
            if (d) setToDate(formatDate(d));
          }}
        />
      )}

      {/* Import Conflict Modal */}
      {showImportModal && (
        <View style={styles.importModalContainer}>
          <Text style={styles.importModalTitle}>
            {importHasConflict ? 'Conflict Detected' : 'Ready to Import'}
          </Text>

          {importHasConflict ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setShowImportModal(false);
                  importSmartCSV(pendingFileUri, 'skip');
                }}
              >
                <Text style={styles.importOptionText}>Skip Duplicates</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowImportModal(false);
                  importSmartCSV(pendingFileUri, 'replace');
                }}
              >
                <Text style={styles.importOptionText}>Replace Existing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowImportModal(false);
                  importSmartCSV(pendingFileUri, 'keep_both');
                }}
              >
                <Text style={styles.importOptionText}>
                  Keep Both (Create Copy)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setShowImportModal(false);
                importSmartCSV(pendingFileUri, 'skip');
              }}
            >
              <Text style={styles.importProceedText}>Proceed with Import</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setShowImportModal(false)}>
            <Text style={styles.importCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}