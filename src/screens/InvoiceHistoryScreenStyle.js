// src/screens/InvoiceHistoryScreenStyle.js

// ======================================================
// INVOICE SIDE HISTORY STYLE
// PHASE: FILTERS + QUOTATION-LIKE SELECTION + BACKUP LOGIC UI
//
// IMPORTANT:
// - This style file belongs only to InvoiceHistoryScreen.
// - Quotation History styles are not edited.
// - Invoice card includes compact Total / Paid / Due summary boxes.
// ======================================================

import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
  },

  headerGradient: {
    minHeight: 92,
    paddingTop: 12,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  headerTitle: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    color: '#ffffff',
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff7fa',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
  },

  controlsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 10,
    marginHorizontal: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 30,
    zIndex: 3000,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  searchBox: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    backgroundColor: '#fff7fa',
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: '#344054',
    paddingVertical: 6,
  },

  refreshButton: {
    width: 44,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    backgroundColor: '#fff7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  showingBox: {
    flex: 1,
    minWidth: 124,
    height: 25,
    justifyContent: 'center',
  },

  showingText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '900',
    color: '#475467',
  },

  filterPillSmall: {
    width: 78,
    minHeight: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    backgroundColor: '#fff7fa',
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterPillMenu: {
    width: 103,
    minHeight: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    backgroundColor: '#fff7fa',
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterPillMenuActive: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  filterPillText: {
    marginRight: 3,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  filterPillTextActive: {
    color: '#ffffff',
  },

  pageSizeDropdownWrap: {
    position: 'relative',
    zIndex: 4000,
    elevation: 40,
  },

  dropdownList: {
    position: 'absolute',
    top: 29,
    right: 0,
    width: 76,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    overflow: 'hidden',

    zIndex: 5000,
    elevation: 50,
  },

  dropdownItem: {
    minHeight: 34,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3edf0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dropdownItemLast: {
    borderBottomWidth: 0,
  },

  dropdownItemActive: {
    backgroundColor: '#fff0f5',
  },

  dropdownText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    color: '#344054',
  },

  dropdownTextActive: {
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  advancedMenuWrap: {
    backgroundColor: '#ffffff',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f6d1dc',
    zIndex: 10,
    elevation: 3,
  },

  menuTabsWrap: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 6,
    marginBottom: 5,
    backgroundColor: '#fff7fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    overflow: 'hidden',
  },

  menuTab: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7fa',
  },

  menuTabWithBorder: {
    borderRightWidth: 1,
    borderRightColor: '#f6d1dc',
  },

  menuTabActive: {
    backgroundColor: '#fff0f5',
  },

  menuTabText: {
    marginTop: 2,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '900',
    color: '#667085',
  },

  menuTabTextActive: {
    color: BRAND_COLOR,
  },

  subMenuBox: {
    marginHorizontal: 14,
    padding: 8,
    backgroundColor: '#fff7fa',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    marginBottom: 4,
  },

  subMenuPlaceholderText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    color: '#667085',
    textAlign: 'center',
  },

  filterInputRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },

  amountInput: {
    flex: 1,
    minHeight: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#111827',
  },

  dateRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 7,
  },

  dateButton: {
    flex: 1,
    minHeight: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    justifyContent: 'center',
  },

  dateButtonText: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '800',
    color: '#111827',
  },

  dateButtonPlaceholder: {
    color: '#98a2b3',
  },

  sortScrollContent: {
    paddingRight: 6,
  },

  sortButton: {
    minHeight: 31,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    backgroundColor: '#ffffff',
    paddingHorizontal: 9,
    paddingVertical: 5,
    justifyContent: 'center',
    marginRight: 6,
  },

  sortButtonActive: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  sortButtonText: {
    fontSize: 9.8,
    lineHeight: 13,
    fontWeight: '900',
    color: '#667085',
  },

  sortButtonTextActive: {
    color: '#ffffff',
  },

  // ======================================================
  // INVOICE SIDE SELECTION UI
  // EDIT:
  // Quotation-like horizontal SELECT tab controls.
  // ======================================================
  selectionToggleButton: {
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    alignItems: 'center',
    minHeight: 32,
    justifyContent: 'center',
  },

  selectionToggleButtonActive: {
    backgroundColor: '#16a34a',
  },

  selectionToggleText: {
    color: '#ffffff',
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '900',
  },

  selectionScroll: {
    marginTop: 5,
    borderTopWidth: 1,
    borderColor: '#f6d1dc',
    paddingTop: 5,
  },

  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: BRAND_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    minHeight: 28,
  },

  selectedBadgeIcon: {
    marginRight: 3,
  },

  selectedBadgeText: {
    color: BRAND_COLOR,
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '900',
  },

  outlineActionButton: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    marginRight: 5,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    minHeight: 30,
    justifyContent: 'center',
  },

  selectCurrentButton: {
    borderColor: '#17a2b8',
  },

  selectCurrentText: {
    color: '#17a2b8',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
  },

  selectHistoryButton: {
    borderColor: '#6f42c1',
  },

  selectHistoryText: {
    color: '#6f42c1',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
  },

  clearButton: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 7,
    backgroundColor: '#ffffff',
    minHeight: 29,
    justifyContent: 'center',
  },

  clearButtonText: {
    color: '#dc3545',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
  },

  solidActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 7,
    marginRight: 6,
    minHeight: 32,
    justifyContent: 'center',
  },

  exportPdfButton: {
    backgroundColor: '#6f42c1',
  },

  exportCsvButton: {
    backgroundColor: '#17a2b8',
  },

  bulkDeleteButton: {
    backgroundColor: '#dc3545',
    marginRight: 0,
  },

  solidActionText: {
    color: '#ffffff',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
  },

  solidActionDangerText: {
    fontWeight: '900',
  },

  // Existing card checkbox styles kept.
  invoiceCardSelected: {
    borderColor: BRAND_COLOR,
    backgroundColor: '#fff8fb',
  },

  selectionCheckWrap: {
    width: 28,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },

  selectionCheckBox: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#f3c3d1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectionCheckBoxActive: {
    borderColor: BRAND_COLOR,
    backgroundColor: BRAND_COLOR,
  },

  // ======================================================
  // INVOICE SIDE BACKUP UI
  // Styles for BACKUP tab export/import controls.
  // ======================================================
  backupInfoBox: {
    minHeight: 36,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    backgroundColor: '#ffffff',
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  backupInfoText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 10.8,
    lineHeight: 15,
    fontWeight: '700',
    color: '#667085',
  },

  backupButtonGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 7,
  },

  backupButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 6,
  },

  backupButtonPrimary: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  backupButtonText: {
    marginLeft: 5,
    fontSize: 10.7,
    lineHeight: 14,
    fontWeight: '900',
    color: BRAND_COLOR,
    textAlign: 'center',
  },

  backupButtonTextPrimary: {
    marginLeft: 5,
    fontSize: 10.7,
    lineHeight: 14,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },

  listArea: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 8,
  },

  invoiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  cardLeftArea: {
    flex: 1,
    paddingRight: 8,
  },

  clientName: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '900',
    color: '#07142f',
  },

  companyLine: {
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
    color: '#667085',
  },

  metaLine: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: '#667085',
  },

  cardRightArea: {
    width: 142,
    alignItems: 'flex-end',
  },

  deleteIconButton: {
    width: 32,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },

  senderInfoBox: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 2,
    marginBottom: 7,
  },

  senderInlineText: {
    maxWidth: '100%',
    fontSize: 10.8,
    lineHeight: 14,
    fontWeight: '700',
    color: '#667085',
    textAlign: 'right',
  },

  senderInlineValue: {
    fontSize: 10.8,
    lineHeight: 14,
    fontWeight: '900',
    color: '#475467',
  },

  statusBadge: {
    maxWidth: 118,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusBadgeText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '900',
  },

  amountGrid: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 9,
  },

  amountBox: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: '#fff7fa',
    borderWidth: 1,
    borderColor: '#ffe3ed',
    paddingHorizontal: 9,
    paddingVertical: 6,
    justifyContent: 'center',
  },

  amountLabel: {
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '800',
    color: '#667085',
  },

  amountValue: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900',
    color: '#07142f',
  },

  dueValue: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  cardActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },

  cardActionButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  viewButton: {
    backgroundColor: '#ecfdf3',
  },

  editButton: {
    backgroundColor: '#fff1f3',
  },

  pdfButton: {
    backgroundColor: '#f3e8ff',
  },

  viewButtonText: {
    marginLeft: 6,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: '#16a34a',
  },

  editButtonText: {
    marginLeft: 6,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: '#e0526f',
  },

  pdfButtonText: {
    marginLeft: 6,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: '#7c3aed',
  },

  paginationBox: {
    minHeight: 52,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fff0f4',
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  paginationButton: {
    minWidth: 70,
    height: 35,
    borderRadius: 14,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },

  paginationButtonDisabled: {
    backgroundColor: '#d0d5dd',
  },

  paginationButtonText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: '#ffffff',
  },

  paginationButtonTextDisabled: {
    color: '#ffffff',
  },

  paginationText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    color: '#344054',
  },

  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  emptyIconBox: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    color: '#07142f',
    textAlign: 'center',
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: '#667085',
    textAlign: 'center',
  },

  createButton: {
    marginTop: 18,
    height: 50,
    borderRadius: 18,
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  createButtonText: {
    marginLeft: 7,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    color: '#ffffff',
  },

  noResultBox: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  noResultTitle: {
    marginTop: 10,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
    color: '#07142f',
    textAlign: 'center',
  },

  noResultSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#667085',
    textAlign: 'center',
  },
});

export default styles;