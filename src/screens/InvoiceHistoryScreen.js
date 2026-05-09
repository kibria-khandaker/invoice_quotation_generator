// src/screens/InvoiceHistoryScreen.js

// ======================================================
// INVOICE SIDE HISTORY SCREEN
// PHASE: REAL SAVED INVOICE LIST + FILTERS + SELECTION + BACKUP + IMPORT CONFLICT LOGIC
//
// IMPORTANT:
// - This screen lists only saved/final invoice data.
// - Draft invoices are shown in InvoiceDraftScreen only.
// - Quotation HistoryScreen.js is not imported or edited.
// - FILTERS tab has real Min/Max/Date/Sort logic.
// - SELECT tab now follows Quotation-like selection UI/options.
// - BACKUP tab has Invoice CSV export/import.
// - Import supports conflict handling:
//   1) Skip Duplicates
//   2) Replace Existing
//   3) Keep Both
// ======================================================

import React, { useCallback, useMemo, useState } from 'react';

import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import JSZip from 'jszip';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import styles from './InvoiceHistoryScreenStyle';
import { generateInvoicePDF } from '../services/pdfService';

import {
  deleteInvoice,
  getInvoices,
  saveAllInvoices,
} from '../services/storageService';

const BRAND_COLOR = '#fd4475';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const SORT_OPTIONS = [
  { key: 'latest', label: 'LATEST' },
  { key: 'oldest', label: 'OLDEST' },
  { key: 'amount_high', label: 'HIGH' },
  { key: 'amount_low', label: 'LOW' },
  { key: 'az', label: 'A-Z' },
];

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

const PAYMENT_STATUS_META = {
  unpaid: {
    label: 'Unpaid',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  partiallyPaid: {
    label: 'Partially Paid',
    color: '#c2410c',
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  mostlyPaid: {
    label: 'Mostly Paid',
    color: '#d97706',
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  paid: {
    label: 'Paid',
    color: '#16a34a',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
};

const parseAmount = (value) => {
  const number = parseFloat(value);
  return Number.isNaN(number) ? 0 : number;
};

const formatMoney = (value) => {
  const number = parseAmount(value);

  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  return String(value).split('T')[0];
};

const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

const getFilterDateTime = (dateString, endOfDay = false) => {
  if (!dateString) {
    return null;
  }

  const dateValue = endOfDay ? `${dateString}T23:59:59` : dateString;
  const time = new Date(dateValue).getTime();

  return Number.isNaN(time) ? null : time;
};

const getInvoiceAmount = (invoice) => {
  return parseAmount(invoice?.totalAmount ?? invoice?.grandTotal ?? 0);
};

const getInvoiceDateTime = (invoice) => {
  const rawDate = invoice?.invoiceDate || invoice?.createdAt || invoice?.updatedAt;

  if (!rawDate) {
    return 0;
  }

  const time = new Date(rawDate).getTime();

  return Number.isNaN(time) ? 0 : time;
};

const getStatusMeta = (invoice) => {
  const key = invoice?.paymentStatus || invoice?.status || 'unpaid';

  return PAYMENT_STATUS_META[key] || PAYMENT_STATUS_META.unpaid;
};

const getClientDisplayName = (invoice) => {
  return invoice?.clientName || invoice?.clientCompany || 'No Client';
};

const getCompanyDisplayName = (invoice) => {
  return invoice?.clientCompany || 'N/A';
};

const getSenderDisplayName = (invoice) => {
  return invoice?.companyName || 'N/A';
};

const getInvoiceSelectionId = (invoice) => {
  return invoice?.id || '';
};

// ======================================================
// INVOICE SIDE CSV HELPERS
// Smart CSV keeps full invoice object as JSON.
// This is safer for future fields than flat CSV columns.
// ======================================================
const escapeCsvJson = (item) => {
  return JSON.stringify(item).replace(/"/g, '""');
};

const buildInvoiceCsv = (items = []) => {
  const header = 'id,data\n';

  const rows = items
    .map((item) => {
      const id = item?.id || `invoice_${Date.now()}`;
      const safeData = escapeCsvJson(item);

      return `${id},"${safeData}"`;
    })
    .join('\n');

  return header + rows;
};

const parseInvoiceCsv = (fileContent = '') => {
  const lines = String(fileContent).split(/\r?\n/);
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
      console.log('Invoice CSV Parse Row Error:', error);
    }
  }

  return importedItems;
};

const normalizeImportedInvoice = (invoice, index = 0) => {
  const now = new Date().toISOString();

  return {
    ...invoice,
    id: invoice?.id || `invoice_import_${Date.now()}_${index}`,
    saveType: 'saved',
    invoiceSaveStatus: 'saved',
    createdAt: invoice?.createdAt || now,
    updatedAt: now,
  };
};

const createKeepBothInvoiceId = (index = 0) => {
  return `invoice_import_keep_${Date.now()}_${index}_${Math.floor(
    Math.random() * 100000
  )}`;
};

// ======================================================
// INVOICE SIDE PDF HELPERS
// NEW:
// Used by single card PDF and selected multi-PDF export.
// Quotation side PDF logic is not touched.
// ======================================================
const sanitizeFileName = (value = 'Invoice') => {
  const cleaned = String(value || 'Invoice')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return cleaned || 'Invoice';
};

const getInvoicePdfFileName = (invoice = {}, index = 0) => {
  const invoiceNumber = sanitizeFileName(
    invoice?.invoiceNumber || `Invoice_${index + 1}`
  );

  const clientName = sanitizeFileName(getClientDisplayName(invoice));

  return `${invoiceNumber}_${clientName}.pdf`;
};

export default function InvoiceHistoryScreen({ navigation }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ======================================================
  // INVOICE SIDE FILTER STATES
  // Real filter/sort logic for Invoice History.
  // Quotation HistoryScreen is not touched.
  // ======================================================
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [sortType, setSortType] = useState('latest');

  // ======================================================
  // INVOICE SIDE HISTORY MENU STATES
  // ======================================================
  const [isPageSizeDropdownOpen, setIsPageSizeDropdownOpen] = useState(false);
  const [isShowMenuOpen, setIsShowMenuOpen] = useState(false);
  const [isFilterSubOpen, setIsFilterSubOpen] = useState(false);
  const [isSelectionSubOpen, setIsSelectionSubOpen] = useState(false);
  const [isBackupSubOpen, setIsBackupSubOpen] = useState(false);

  // ======================================================
  // INVOICE SIDE SELECTION STATES
  // Used by SELECT tab. Only saved/final invoices in this screen
  // are selectable. Draft records are not touched.
  // ======================================================
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);

  const loadInvoices = async () => {
    setLoading(true);

    const savedInvoices = await getInvoices();

    setInvoices(Array.isArray(savedInvoices) ? savedInvoices : []);
    setCurrentPage(1);

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  const filteredInvoices = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const minValue = minAmount ? parseAmount(minAmount) : null;
    const maxValue = maxAmount ? parseAmount(maxAmount) : null;
    const fromTime = getFilterDateTime(fromDate);
    const toTime = getFilterDateTime(toDate, true);

    return invoices
      .filter((item) => {
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

        const matchesSearch = !keyword || searchableText.includes(keyword);

        const amount = getInvoiceAmount(item);

        const afterMin = minValue === null ? true : amount >= minValue;
        const beforeMax = maxValue === null ? true : amount <= maxValue;

        const itemTime = getInvoiceDateTime(item);

        const afterDate = fromTime === null ? true : itemTime >= fromTime;
        const beforeDate = toTime === null ? true : itemTime <= toTime;

        return (
          matchesSearch &&
          afterMin &&
          beforeMax &&
          afterDate &&
          beforeDate
        );
      })
      .sort((a, b) => {
        if (sortType === 'latest') {
          return getInvoiceDateTime(b) - getInvoiceDateTime(a);
        }

        if (sortType === 'oldest') {
          return getInvoiceDateTime(a) - getInvoiceDateTime(b);
        }

        if (sortType === 'amount_high') {
          return getInvoiceAmount(b) - getInvoiceAmount(a);
        }

        if (sortType === 'amount_low') {
          return getInvoiceAmount(a) - getInvoiceAmount(b);
        }

        if (sortType === 'az') {
          return getClientDisplayName(a).localeCompare(getClientDisplayName(b));
        }

        return 0;
      });
  }, [
    invoices,
    searchText,
    minAmount,
    maxAmount,
    fromDate,
    toDate,
    sortType,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, pageSize, safeCurrentPage]);

  const selectedCount = selectedInvoiceIds.length;

  const selectedInvoicesForExport = useMemo(() => {
    return invoices.filter((item) =>
      selectedInvoiceIds.includes(getInvoiceSelectionId(item))
    );
  }, [invoices, selectedInvoiceIds]);

  const handleSearchChange = (text) => {
    setSearchText(text);
    setCurrentPage(1);
    setIsPageSizeDropdownOpen(false);
  };

  // ======================================================
  // INVOICE SIDE HISTORY → PREVIEW ACTION
  // EDIT:
  // When invoice is opened from History, pass fromHistory flag.
  // InvoicePreviewScreen will use this to send Edit icon to
  // CreateInvoice edit mode instead of simple goBack.
  // ======================================================
  const handleOpenInvoice = (invoice) => {
    if (isSelectionMode) {
      handleToggleSelectInvoice(invoice);
      return;
    }

    navigation.navigate('InvoicePreview', {
      invoiceData: invoice,
      fromHistory: true,
    });
  };

  const handleEditInvoice = (invoice) => {
    navigation.navigate('CreateInvoice', {
      editData: invoice,
      isSaved: true,
      fromHistory: true,
    });
  };

  // ======================================================
  // INVOICE SIDE SINGLE PDF ACTION
  // NEW:
  // History card PDF button now generates and shares real invoice PDF.
  // Quotation PDF flow is not touched.
  // ======================================================
  const handleGeneratePdf = async (invoice) => {
    try {
      setLoading(true);

      const uri = await generateInvoicePDF(invoice);
      const sharingAvailable = await Sharing.isAvailableAsync();

      if (sharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Share Invoice ${invoice?.invoiceNumber || ''}`,
        });
      } else {
        Alert.alert('PDF Ready', `PDF file saved at: ${uri}`);
      }
    } catch (error) {
      console.log('Invoice PDF Export Error:', error);
      Alert.alert('PDF Error', 'Invoice PDF could not be generated.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = (invoice) => {
    Alert.alert(
      'Delete Invoice',
      `Do you want to delete ${invoice?.invoiceNumber || 'this invoice'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteInvoice(invoice.id);

            if (success) {
              setSelectedInvoiceIds((prev) =>
                prev.filter((id) => id !== invoice.id)
              );

              await loadInvoices();
            } else {
              Alert.alert('Error', 'Invoice could not be deleted.');
            }
          },
        },
      ]
    );
  };

  const handleShowLimitMenu = () => {
    setIsPageSizeDropdownOpen((prev) => !prev);
  };

  const handleSelectPageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setIsPageSizeDropdownOpen(false);
  };

  const handleShowMenu = () => {
    setIsShowMenuOpen((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setIsFilterSubOpen(true);
        setIsSelectionSubOpen(false);
        setIsBackupSubOpen(false);
      }

      return nextValue;
    });

    setIsPageSizeDropdownOpen(false);
  };

  const handleOpenFilterTab = () => {
    setIsFilterSubOpen((prev) => !prev);
    setIsSelectionSubOpen(false);
    setIsBackupSubOpen(false);
  };

  const handleOpenSelectionTab = () => {
    setIsSelectionSubOpen((prev) => !prev);
    setIsFilterSubOpen(false);
    setIsBackupSubOpen(false);
  };

  const handleOpenBackupTab = () => {
    setIsBackupSubOpen((prev) => !prev);
    setIsFilterSubOpen(false);
    setIsSelectionSubOpen(false);
  };

  const handleResetFilters = async () => {
    setSearchText('');
    setMinAmount('');
    setMaxAmount('');
    setFromDate('');
    setToDate('');
    setSortType('latest');
    setCurrentPage(1);
    setIsPageSizeDropdownOpen(false);
    setSelectedInvoiceIds([]);
    setIsSelectionMode(false);

    await loadInvoices();
  };

  const handleChangeFilterField = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSelectSort = (type) => {
    setSortType(type);
    setCurrentPage(1);
  };

  // ======================================================
  // INVOICE SIDE SELECTION LOGIC
  // EDIT:
  // Button behavior now always follows the latest user action.
  // - Select Current Page REPLACES previous selection.
  // - Select All History REPLACES previous selection.
  // - Mark Clear clears selection and exits selection mode.
  // ======================================================
  const handleToggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
      const nextValue = !prev;

      if (!nextValue) {
        setSelectedInvoiceIds([]);
      }

      return nextValue;
    });
  };

  const handleToggleSelectInvoice = (invoice) => {
    const invoiceId = getInvoiceSelectionId(invoice);

    if (!invoiceId) {
      return;
    }

    setSelectedInvoiceIds((prev) => {
      if (prev.includes(invoiceId)) {
        return prev.filter((id) => id !== invoiceId);
      }

      return [...prev, invoiceId];
    });
  };

  const handleSelectCurrentPage = () => {
    const currentPageIds = Array.from(
      new Set(
        paginatedInvoices
          .map(getInvoiceSelectionId)
          .filter(Boolean)
      )
    );

    if (currentPageIds.length === 0) {
      Alert.alert('No Items', 'There are no invoices on this page to select.');
      return;
    }

    setIsSelectionMode(true);

    // INVOICE SIDE SELECT:
    // Always replace previous selection.
    // This allows Select All active → Select Page override.
    setSelectedInvoiceIds(() => currentPageIds);
  };

  const handleSelectAllHistory = () => {
    const filteredInvoiceIds = Array.from(
      new Set(
        filteredInvoices
          .map(getInvoiceSelectionId)
          .filter(Boolean)
      )
    );

    if (filteredInvoiceIds.length === 0) {
      Alert.alert('No Items', 'There are no filtered/saved invoices to select.');
      return;
    }

    setIsSelectionMode(true);

    // INVOICE SIDE SELECT:
    // Always replace previous selection.
    // This allows Select Page active → Select All override.
    setSelectedInvoiceIds(() => filteredInvoiceIds);
  };

    const handleClearSelection = () => {
      setSelectedInvoiceIds([]);
      setIsSelectionMode(false);
    };

  // ======================================================
  // INVOICE SIDE SELECTED PDF EXPORT
  // NEW:
  // - 1 selected invoice = direct PDF share
  // - 2+ selected invoices = ZIP bundle share
  // Follows the working Quotation History PDF bundle pattern.
  // ======================================================
  const handleExportSelectedInvoicePdfs = async () => {
    if (selectedInvoiceIds.length === 0) {
      Alert.alert('No Selection', 'Please select at least one invoice.');
      return;
    }

    const selectedInvoices = invoices.filter((item) =>
      selectedInvoiceIds.includes(getInvoiceSelectionId(item))
    );

    if (selectedInvoices.length === 0) {
      Alert.alert('No Selection', 'Selected invoice data could not be found.');
      return;
    }

    try {
      setLoading(true);

      const sharingAvailable = await Sharing.isAvailableAsync();

      if (selectedInvoices.length === 1) {
        const invoice = selectedInvoices[0];
        const uri = await generateInvoicePDF(invoice);

        if (sharingAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: `Share Invoice ${invoice?.invoiceNumber || ''}`,
          });
        } else {
          Alert.alert('PDF Ready', `PDF file saved at: ${uri}`);
        }

        return;
      }

      const zip = new JSZip();

      for (let index = 0; index < selectedInvoices.length; index += 1) {
        const invoice = selectedInvoices[index];
        const uri = await generateInvoicePDF(invoice);

        const base64Data = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        zip.file(getInvoicePdfFileName(invoice, index), base64Data, {
          base64: true,
        });
      }

      const zipBase64 = await zip.generateAsync({ type: 'base64' });
      const zipUri = `${FileSystem.cacheDirectory}Invoices_Bundle_${Date.now()}.zip`;

      await FileSystem.writeAsStringAsync(zipUri, zipBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (sharingAvailable) {
        await Sharing.shareAsync(zipUri, {
          mimeType: 'application/zip',
          dialogTitle: `Share ${selectedInvoices.length} Invoices`,
        });
      } else {
        Alert.alert('ZIP Ready', `ZIP file saved at: ${zipUri}`);
      }
    } catch (error) {
      console.log('Invoice Selected PDF Export Error:', error);
      Alert.alert('Export Error', 'Selected invoice PDFs could not be exported.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelectedInvoices = () => {
    if (selectedInvoiceIds.length === 0) {
      Alert.alert('No Selection', 'Please select invoices first.');
      return;
    }

    Alert.alert(
      'Delete Selected',
      `Do you want to delete ${selectedInvoiceIds.length} selected invoice(s)?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              let successCount = 0;

              for (const invoiceId of selectedInvoiceIds) {
                const success = await deleteInvoice(invoiceId);

                if (success) {
                  successCount += 1;
                }
              }

              setSelectedInvoiceIds([]);
              setIsSelectionMode(false);

              await loadInvoices();

              Alert.alert(
                'Deleted',
                `${successCount} selected invoice(s) deleted successfully.`
              );
            } catch (error) {
              console.log('Delete Selected Invoices Error:', error);
              Alert.alert('Error', 'Selected invoices could not be deleted.');
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // INVOICE SIDE BACKUP LOGIC
  // Export/Import Invoice CSV only.
  // Import conflict handling supports:
  // - Skip Duplicates
  // - Replace Existing
  // - Keep Both
  // ======================================================
  const handleExportInvoiceCsv = async (itemsToExport = [], exportType = 'all') => {
    try {
      if (!itemsToExport.length) {
        Alert.alert('No Data', 'There are no invoices to export.');
        return;
      }

      setLoading(true);

      const csv = buildInvoiceCsv(itemsToExport);

      const fileName = `invoice_${exportType}_backup_${Date.now()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csv);

      const sharingAvailable = await Sharing.isAvailableAsync();

      if (sharingAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Export Ready', `CSV file saved at: ${fileUri}`);
      }
    } catch (error) {
      console.log('Invoice CSV Export Error:', error);
      Alert.alert('Export Error', 'Invoice CSV could not be exported.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAllInvoices = () => {
    handleExportInvoiceCsv(invoices, 'all');
  };

  const handleExportFilteredInvoices = () => {
    handleExportInvoiceCsv(filteredInvoices, 'filtered');
  };

  const handleExportSelectedInvoices = () => {
    if (!selectedInvoicesForExport.length) {
      Alert.alert('No Selection', 'Please select invoices first.');
      return;
    }

    handleExportInvoiceCsv(selectedInvoicesForExport, 'selected');
  };

  const getImportConflictCount = (itemsToImport = []) => {
    const existingIds = new Set(
      invoices.map((item) => getInvoiceSelectionId(item)).filter(Boolean)
    );

    const importedIds = new Set();
    let conflictCount = 0;

    itemsToImport.forEach((item, index) => {
      const normalized = normalizeImportedInvoice(item, index);
      const invoiceId = getInvoiceSelectionId(normalized);

      if (
        !invoiceId ||
        existingIds.has(invoiceId) ||
        importedIds.has(invoiceId)
      ) {
        conflictCount += 1;
      }

      if (invoiceId) {
        importedIds.add(invoiceId);
      }
    });

    return conflictCount;
  };

  const applyImportedInvoices = async (itemsToImport = [], mode = 'skip') => {
    try {
      setLoading(true);

      const processedImports = [];
      const existingIds = new Set(
        invoices.map((item) => getInvoiceSelectionId(item)).filter(Boolean)
      );

      itemsToImport.forEach((item, index) => {
        let normalized = normalizeImportedInvoice(item, index);
        let invoiceId = getInvoiceSelectionId(normalized);

        if (!invoiceId) {
          invoiceId = createKeepBothInvoiceId(index);
          normalized = {
            ...normalized,
            id: invoiceId,
          };
        }

        const duplicateInsideImport = processedImports.some(
          (processedItem) => getInvoiceSelectionId(processedItem) === invoiceId
        );

        const duplicateExisting = existingIds.has(invoiceId);
        const hasConflict = duplicateExisting || duplicateInsideImport;

        if (mode === 'skip' && hasConflict) {
          return;
        }

        if (mode === 'replace') {
          if (duplicateInsideImport) {
            const previousIndex = processedImports.findIndex(
              (processedItem) => getInvoiceSelectionId(processedItem) === invoiceId
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
            id: createKeepBothInvoiceId(index),
            originalImportedId: invoiceId,
          });
          return;
        }

        processedImports.push(normalized);
      });

      if (!processedImports.length) {
        Alert.alert(
          'No New Invoices',
          'No invoices were imported with the selected conflict option.'
        );
        return;
      }

      let nextInvoices = [];

      if (mode === 'replace') {
        const importIds = new Set(
          processedImports.map((item) => getInvoiceSelectionId(item)).filter(Boolean)
        );

        nextInvoices = [
          ...processedImports,
          ...invoices.filter((item) => !importIds.has(getInvoiceSelectionId(item))),
        ];
      } else {
        nextInvoices = [...processedImports, ...invoices];
      }

      const success = await saveAllInvoices(nextInvoices);

      if (success) {
        setInvoices(nextInvoices);
        setCurrentPage(1);
        setSearchText('');
        setSelectedInvoiceIds([]);
        setIsSelectionMode(false);

        Alert.alert(
          'Import Complete',
          `Imported ${processedImports.length} invoice(s).`
        );
      } else {
        Alert.alert('Import Error', 'Invoice CSV could not be saved.');
      }
    } catch (error) {
      console.log('Apply Imported Invoices Error:', error);
      Alert.alert('Import Error', 'Invoice CSV could not be imported.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportInvoiceCsv = async () => {
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

      setLoading(true);

      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const parsedItems = parseInvoiceCsv(fileContent);

      setLoading(false);

      if (!parsedItems.length) {
        Alert.alert('Import Error', 'No valid invoice data found in this CSV.');
        return;
      }

      const conflictCount = getImportConflictCount(parsedItems);

      if (conflictCount > 0) {
        Alert.alert(
          'Import Conflicts Found',
          `${conflictCount} duplicate/conflict invoice(s) found. What do you want to do?`,
          [
            {
              text: 'Skip Duplicates',
              onPress: () => applyImportedInvoices(parsedItems, 'skip'),
            },
            {
              text: 'Replace Existing',
              onPress: () => applyImportedInvoices(parsedItems, 'replace'),
            },
            {
              text: 'Keep Both',
              onPress: () => applyImportedInvoices(parsedItems, 'keepBoth'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );

        return;
      }

      await applyImportedInvoices(parsedItems, 'skip');
    } catch (error) {
      console.log('Invoice CSV Import Error:', error);
      setLoading(false);
      Alert.alert('Import Error', 'Invoice CSV could not be imported.');
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const renderInvoiceItem = ({ item }) => {
    const statusMeta = getStatusMeta(item);
    const invoiceId = getInvoiceSelectionId(item);
    const isSelected = invoiceId ? selectedInvoiceIds.includes(invoiceId) : false;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.invoiceCard,
          isSelected && styles.invoiceCardSelected,
        ]}
        onPress={() => handleOpenInvoice(item)}
      >
        <View style={styles.cardTopRow}>
          {isSelectionMode && (
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.selectionCheckWrap}
              onPress={() => handleToggleSelectInvoice(item)}
            >
              <View
                style={[
                  styles.selectionCheckBox,
                  isSelected && styles.selectionCheckBoxActive,
                ]}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={15} color="#ffffff" />
                )}
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.cardLeftArea}>
            <Text style={styles.clientName} numberOfLines={1}>
              {getClientDisplayName(item)}
            </Text>

            <Text style={styles.companyLine} numberOfLines={1}>
              Company: {getCompanyDisplayName(item)}
            </Text>

            <Text style={styles.metaLine} numberOfLines={1}>
              INV: {item.invoiceNumber || 'N/A'}
            </Text>

            <Text style={styles.metaLine} numberOfLines={1}>
              Date: {formatDate(item.invoiceDate || item.createdAt)}
            </Text>
          </View>

          <View style={styles.cardRightArea}>
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.deleteIconButton}
              onPress={() => handleDeleteInvoice(item)}
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>

            <View style={styles.senderInfoBox}>
              <Text style={styles.senderInlineText} numberOfLines={1}>
                sender :{' '}
                <Text style={styles.senderInlineValue}>
                  {getSenderDisplayName(item)}
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusMeta.backgroundColor,
                  borderColor: statusMeta.borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: statusMeta.color },
                ]}
                numberOfLines={1}
              >
                {item.paymentStatusLabel || statusMeta.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.amountGrid}>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amountValue}>
              {formatMoney(item.totalAmount || item.grandTotal || 0)}
            </Text>
          </View>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Paid</Text>
            <Text style={styles.amountValue}>
              {formatMoney(item.paidAmount || 0)}
            </Text>
          </View>

          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Due</Text>
            <Text style={styles.dueValue}>
              {formatMoney(item.dueAmount || 0)}
            </Text>
          </View>
        </View>

        <View style={styles.cardActionRow}>
          <TouchableOpacity
            activeOpacity={0.86}
            style={[styles.cardActionButton, styles.viewButton]}
            onPress={() => handleOpenInvoice(item)}
          >
            <Ionicons name="eye-outline" size={17} color="#16a34a" />
            <Text style={styles.viewButtonText}>
              {isSelectionMode ? 'Select' : 'View'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            style={[styles.cardActionButton, styles.editButton]}
            onPress={() => handleEditInvoice(item)}
          >
            <Ionicons name="create-outline" size={17} color="#e0526f" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            style={[styles.cardActionButton, styles.pdfButton]}
            onPress={() => handleGeneratePdf(item)}
          >
            <Ionicons name="download-outline" size={17} color="#7c3aed" />
            <Text style={styles.pdfButtonText}>PDF</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeaderControls = () => (
    <View style={styles.controlsCard}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={17} color="#98a2b3" />
          <TextInput
            value={searchText}
            onChangeText={handleSearchChange}
            placeholder="Search invoice..."
            placeholderTextColor="#98a2b3"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          style={styles.refreshButton}
          onPress={handleResetFilters}
        >
          <Ionicons name="refresh-outline" size={21} color={BRAND_COLOR} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.showingBox}>
          <Text style={styles.showingText} numberOfLines={1}>
            Showing: {paginatedInvoices.length} | Total: {filteredInvoices.length}
          </Text>
        </View>

        <View style={styles.pageSizeDropdownWrap}>
          <TouchableOpacity
            activeOpacity={0.86}
            style={styles.filterPillSmall}
            onPress={handleShowLimitMenu}
          >
            <Text style={styles.filterPillText} numberOfLines={1}>
              Show:{pageSize}
            </Text>
            <Ionicons
              name={isPageSizeDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={BRAND_COLOR}
            />
          </TouchableOpacity>

          {isPageSizeDropdownOpen && (
            <View style={styles.dropdownList}>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.82}
                  style={[
                    styles.dropdownItem,
                    option === PAGE_SIZE_OPTIONS[PAGE_SIZE_OPTIONS.length - 1] &&
                      styles.dropdownItemLast,
                    pageSize === option && styles.dropdownItemActive,
                  ]}
                  onPress={() => handleSelectPageSize(option)}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      pageSize === option && styles.dropdownTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          style={[
            styles.filterPillMenu,
            isShowMenuOpen && styles.filterPillMenuActive,
          ]}
          onPress={handleShowMenu}
        >
          <Text
            style={[
              styles.filterPillText,
              isShowMenuOpen && styles.filterPillTextActive,
            ]}
            numberOfLines={1}
          >
            {isShowMenuOpen ? 'Hide Menu' : 'Show Menu'}
          </Text>
          <Ionicons
            name={isShowMenuOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={isShowMenuOpen ? '#ffffff' : BRAND_COLOR}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAdvancedMenuShell = () => (
    <View style={styles.advancedMenuWrap}>
      <View style={styles.menuTabsWrap}>
        <TouchableOpacity
          activeOpacity={0.86}
          style={[
            styles.menuTab,
            styles.menuTabWithBorder,
            isFilterSubOpen && styles.menuTabActive,
          ]}
          onPress={handleOpenFilterTab}
        >
          <Ionicons
            name="filter-outline"
            size={20}
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
          activeOpacity={0.86}
          style={[
            styles.menuTab,
            styles.menuTabWithBorder,
            isSelectionSubOpen && styles.menuTabActive,
          ]}
          onPress={handleOpenSelectionTab}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
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
          activeOpacity={0.86}
          style={[
            styles.menuTab,
            isBackupSubOpen && styles.menuTabActive,
          ]}
          onPress={handleOpenBackupTab}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={20}
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

      {isFilterSubOpen && (
        <View style={styles.subMenuBox}>
          <View style={styles.filterInputRow}>
            <TextInput
              placeholder="Min"
              placeholderTextColor="#98a2b3"
              value={minAmount}
              keyboardType="numeric"
              onChangeText={handleChangeFilterField(setMinAmount)}
              style={styles.amountInput}
            />

            <TextInput
              placeholder="Max"
              placeholderTextColor="#98a2b3"
              value={maxAmount}
              keyboardType="numeric"
              onChangeText={handleChangeFilterField(setMaxAmount)}
              style={styles.amountInput}
            />
          </View>

          <View style={styles.dateRow}>
            <TouchableOpacity
              activeOpacity={0.84}
              style={styles.dateButton}
              onPress={() => setShowFromPicker(true)}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  !fromDate && styles.dateButtonPlaceholder,
                ]}
                numberOfLines={1}
              >
                {fromDate || 'From'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.84}
              style={styles.dateButton}
              onPress={() => setShowToPicker(true)}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  !toDate && styles.dateButtonPlaceholder,
                ]}
                numberOfLines={1}
              >
                {toDate || 'To'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortScrollContent}
          >
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.84}
                style={[
                  styles.sortButton,
                  sortType === option.key && styles.sortButtonActive,
                ]}
                onPress={() => handleSelectSort(option.key)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    sortType === option.key && styles.sortButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {isSelectionSubOpen && (
        <View style={styles.subMenuBox}>
          <TouchableOpacity
            activeOpacity={0.84}
            style={[
              styles.selectionToggleButton,
              isSelectionMode && styles.selectionToggleButtonActive,
            ]}
            onPress={handleToggleSelectionMode}
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
                {selectedCount > 0 && (
                  <View style={styles.selectedBadge}>
                    <Ionicons
                      name="layers-outline"
                      size={12}
                      color={BRAND_COLOR}
                      style={styles.selectedBadgeIcon}
                    />
                    <Text style={styles.selectedBadgeText}>
                      {selectedCount} Selected
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.84}
                  onPress={handleSelectCurrentPage}
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
                  activeOpacity={0.84}
                  onPress={handleSelectAllHistory}
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
                  activeOpacity={0.84}
                  onPress={handleClearSelection}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Mark Clear</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {isSelectionMode && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectionScroll}
            >
              <TouchableOpacity
                activeOpacity={0.84}
                onPress={handleExportSelectedInvoicePdfs}
                style={[styles.solidActionButton, styles.exportPdfButton]}
              >
                <Text style={styles.solidActionText}>
                  Export Selected PDFs
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.84}
                onPress={handleExportSelectedInvoices}
                style={[styles.solidActionButton, styles.exportCsvButton]}
              >
                <Text style={styles.solidActionText}>
                  Export Selected CSVs for Backup
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.84}
                onPress={handleDeleteSelectedInvoices}
                style={[styles.solidActionButton, styles.bulkDeleteButton]}
              >
                <Text
                  style={[
                    styles.solidActionText,
                    styles.solidActionDangerText,
                  ]}
                >
                  Delete ({selectedCount}) selected items
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      )}

      {isBackupSubOpen && (
        <View style={styles.subMenuBox}>
          <View style={styles.backupInfoBox}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={BRAND_COLOR}
            />
            <Text style={styles.backupInfoText} numberOfLines={2}>
              Export/import saved invoice CSV. Import conflicts can be skipped,
              replaced, or kept both.
            </Text>
          </View>

          <View style={styles.backupButtonGrid}>
            <TouchableOpacity
              activeOpacity={0.84}
              style={styles.backupButton}
              onPress={handleExportAllInvoices}
            >
              <Ionicons
                name="cloud-download-outline"
                size={15}
                color={BRAND_COLOR}
              />
              <Text style={styles.backupButtonText}>Export All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.84}
              style={styles.backupButton}
              onPress={handleExportFilteredInvoices}
            >
              <Ionicons name="filter-outline" size={15} color={BRAND_COLOR} />
              <Text style={styles.backupButtonText}>Export Filtered</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.backupButtonGrid}>
            <TouchableOpacity
              activeOpacity={0.84}
              style={styles.backupButton}
              onPress={handleExportSelectedInvoices}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={15}
                color={BRAND_COLOR}
              />
              <Text style={styles.backupButtonText}>Export Selected</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.84}
              style={[styles.backupButton, styles.backupButtonPrimary]}
              onPress={handleImportInvoiceCsv}
            >
              <Ionicons name="cloud-upload-outline" size={15} color="#ffffff" />
              <Text style={styles.backupButtonTextPrimary}>Import CSV</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderPaginationFooter = () => {
    if (filteredInvoices.length === 0) {
      return null;
    }

    return (
      <View style={styles.paginationBox}>
        <TouchableOpacity
          activeOpacity={0.82}
          style={[
            styles.paginationButton,
            safeCurrentPage <= 1 && styles.paginationButtonDisabled,
          ]}
          disabled={safeCurrentPage <= 1}
          onPress={handlePrevPage}
        >
          <Text
            style={[
              styles.paginationButtonText,
              safeCurrentPage <= 1 && styles.paginationButtonTextDisabled,
            ]}
          >
            Prev
          </Text>
        </TouchableOpacity>

        <Text style={styles.paginationText}>
          Page {safeCurrentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          activeOpacity={0.82}
          style={[
            styles.paginationButton,
            safeCurrentPage >= totalPages && styles.paginationButtonDisabled,
          ]}
          disabled={safeCurrentPage >= totalPages}
          onPress={handleNextPage}
        >
          <Text
            style={[
              styles.paginationButtonText,
              safeCurrentPage >= totalPages && styles.paginationButtonTextDisabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

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
            <Text style={styles.headerTitle}>Invoice History</Text>
            <Text style={styles.headerSubtitle}>
              View saved invoices
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
        {renderHeaderControls()}

        {isShowMenuOpen && renderAdvancedMenuShell()}

        <View style={styles.listArea}>
          {invoices.length === 0 && !searchText ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="receipt-outline" size={38} color={BRAND_COLOR} />
              </View>

              <Text style={styles.emptyTitle}>
                {loading ? 'Loading invoices...' : 'No invoices saved yet'}
              </Text>

              <Text style={styles.emptySubtitle}>
                Final saved invoices will appear here after Preview → Save Invoice.
              </Text>

              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateInvoice')}
              >
                <Ionicons name="add" size={18} color="#ffffff" />
                <Text style={styles.createButtonText}>Create Invoice</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={paginatedInvoices}
              keyExtractor={(item, index) => item.id || `${index}`}
              renderItem={renderInvoiceItem}
              ListEmptyComponent={
                <View style={styles.noResultBox}>
                  <Ionicons name="search-outline" size={34} color={BRAND_COLOR} />
                  <Text style={styles.noResultTitle}>No matching invoices</Text>
                  <Text style={styles.noResultSubtitle}>
                    Try a different client, company, or invoice number.
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {renderPaginationFooter()}
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFromPicker(false);

            if (date) {
              setFromDate(formatDateForInput(date));
              setCurrentPage(1);
            }
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowToPicker(false);

            if (date) {
              setToDate(formatDateForInput(date));
              setCurrentPage(1);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}