// src/screens/InvoiceHistoryScreen.js

// ======================================================
// INVOICE SIDE HISTORY SCREEN
// PHASE: REAL SAVED INVOICE LIST + QUOTATION-LIKE MENU SHELL
//
// IMPORTANT:
// - This screen lists only saved/final invoice data.
// - Draft invoices are shown in InvoiceDraftScreen only.
// - Quotation HistoryScreen.js is not imported or edited.
// - Show dropdown and Show/Hide Menu now follow Quotation-like UI.
// - Future PDF/Edit/Filter/Select/Backup advanced logic can be
//   connected step by step.
// ======================================================

import React, { useCallback, useMemo, useState } from 'react';

import {
  Alert,
  FlatList,
  StatusBar,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from './InvoiceHistoryScreenStyle';

import {
  deleteInvoice,
  getInvoices,
} from '../services/storageService';

const BRAND_COLOR = '#fd4475';

// ======================================================
// INVOICE SIDE PAGE SIZE OPTIONS
// EDIT:
// Includes 100 like Quotation History dropdown.
// ======================================================
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

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

const formatMoney = (value) => {
  const number = parseFloat(value);

  if (Number.isNaN(number)) {
    return '0';
  }

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

export default function InvoiceHistoryScreen({ navigation }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ======================================================
  // INVOICE SIDE HISTORY MENU STATES
  // NEW:
  // Quotation-like dropdown and show/hide menu UI.
  // Quotation HistoryScreen is not touched.
  // ======================================================
  const [isPageSizeDropdownOpen, setIsPageSizeDropdownOpen] = useState(false);
  const [isShowMenuOpen, setIsShowMenuOpen] = useState(false);

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

    if (!keyword) {
      return invoices;
    }

    return invoices.filter((item) => {
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

      return searchableText.includes(keyword);
    });
  }, [invoices, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, pageSize, safeCurrentPage]);

  const handleSearchChange = (text) => {
    setSearchText(text);
    setCurrentPage(1);
    setIsPageSizeDropdownOpen(false);
  };

  const handleOpenInvoice = (invoice) => {
    navigation.navigate('InvoicePreview', {
      invoiceData: invoice,
    });
  };

  const handleEditInvoice = (invoice) => {
    // ======================================================
    // INVOICE SIDE HISTORY EDIT ACTION
    // Existing:
    // Opens saved invoice in CreateInvoiceScreen with same data/id.
    // Final saved update flow will be polished in the next phase.
    // ======================================================
    navigation.navigate('CreateInvoice', {
      editData: invoice,
      isSaved: true,
      fromHistory: true,
    });
  };

  const handleGeneratePdf = (invoice) => {
    Alert.alert(
      'Generate PDF',
      `PDF generation for ${invoice?.invoiceNumber || 'this invoice'} will be connected in the PDF phase.`
    );
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
              await loadInvoices();
            } else {
              Alert.alert('Error', 'Invoice could not be deleted.');
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // INVOICE SIDE HISTORY SHOW DROPDOWN
  // EDIT:
  // Replaces Alert menu with Quotation-like inline dropdown.
  // ======================================================
  const handleShowLimitMenu = () => {
    setIsPageSizeDropdownOpen((prev) => !prev);
  };

  const handleSelectPageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setIsPageSizeDropdownOpen(false);
  };

  // ======================================================
  // INVOICE SIDE HISTORY ADVANCED MENU TOGGLE
  // EDIT:
  // Replaces Alert menu with Quotation-like show/hide menu shell.
  // Real filter/select/backup logic will be connected next.
  // ======================================================
  const handleShowMenu = () => {
    setIsShowMenuOpen((prev) => !prev);
    setIsPageSizeDropdownOpen(false);
  };

  const handleRefreshInvoices = async () => {
    setSearchText('');
    setCurrentPage(1);
    setIsPageSizeDropdownOpen(false);
    await loadInvoices();
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const renderInvoiceItem = ({ item }) => {
    const statusMeta = getStatusMeta(item);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.invoiceCard}
        onPress={() => handleOpenInvoice(item)}
      >
        <View style={styles.cardTopRow}>
          {/* ======================================================
              INVOICE SIDE HISTORY CARD LEFT
              Client/Company/Invoice number/Date stay on left.
          ====================================================== */}
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

          {/* ======================================================
              INVOICE SIDE HISTORY CARD RIGHT
              Sender and Payment Status stay on right vertically.
          ====================================================== */}
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

        {/* ======================================================
            INVOICE SIDE AMOUNT SUMMARY
            Compact Total / Paid / Due boxes.
        ====================================================== */}
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
            <Text style={styles.viewButtonText}>View</Text>
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
          onPress={handleRefreshInvoices}
        >
          <Ionicons name="refresh-outline" size={21} color={BRAND_COLOR} />
        </TouchableOpacity>
      </View>

      {/* ======================================================
          INVOICE SIDE HISTORY TOP CONTROL ROW
          EDIT:
          Quotation-like Showing / Show dropdown / Show Menu.
      ====================================================== */}
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

  // ======================================================
  // INVOICE SIDE HISTORY ADVANCED MENU SHELL
  // NEW:
  // UI shell follows Quotation History menu pattern.
  // Real filter/select/backup logic will be connected step by step.
  // ======================================================
  const renderAdvancedMenuShell = () => (
    <View style={styles.advancedMenuWrap}>
      <View style={styles.menuTabsWrap}>
        <TouchableOpacity
          activeOpacity={0.86}
          style={[styles.menuTab, styles.menuTabWithBorder]}
        >
          <Ionicons name="filter-outline" size={20} color={BRAND_COLOR} />
          <Text style={styles.menuTabText}>FILTERS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.86}
          style={[styles.menuTab, styles.menuTabWithBorder]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={BRAND_COLOR}
          />
          <Text style={styles.menuTabText}>SELECT</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.86} style={styles.menuTab}>
          <Ionicons name="cloud-upload-outline" size={20} color={BRAND_COLOR} />
          <Text style={styles.menuTabText}>BACKUP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subMenuBox}>
        <Text style={styles.subMenuPlaceholderText}>
          Invoice filters, selection, backup and import options will be connected step by step.
        </Text>
      </View>
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
        {/* ======================================================
            INVOICE SIDE FIXED TOP CONTROLS
            Search/filter controls stay fixed under header.
        ====================================================== */}
        {renderHeaderControls()}

        {/* ======================================================
            INVOICE SIDE ADVANCED MENU
            NEW:
            Quotation-like show/hide menu shell.
        ====================================================== */}
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

        {/* ======================================================
            INVOICE SIDE FIXED PAGINATION
            Pagination stays fixed at bottom.
        ====================================================== */}
        {renderPaginationFooter()}
      </View>
    </SafeAreaView>
  );
}