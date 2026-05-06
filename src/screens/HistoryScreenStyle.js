import { StyleSheet } from 'react-native';

export const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  // ======================================================
  // MAIN CONTAINER
  // ======================================================
  historyMainContainer: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  // ======================================================
  // COMMON
  // ======================================================
  flexOne: {
    flex: 1,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconLeftSpace: {
    marginLeft: 5,
  },

  // ======================================================
  // TOP HEADER / SEARCH / MENU
  // ======================================================
  topHeaderWrap: {
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 30,
    zIndex: 3000,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#f6d1dc',
  },

  searchRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#fff7fa',
    color: '#111827',
  },

  resetButton: {
    backgroundColor: '#fff0f5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f3c3d1',
  },

  headerSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
    zIndex: 3001,
    elevation: 31,
    position: 'relative',
  },

  showingText: {
    fontSize: 11,
    color: '#475467',
    fontWeight: '700',
  },

  itemsPerPageWrap: {
    position: 'relative',
    zIndex: 4000,
    elevation: 40,
  },

  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: '#fff0f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f3c3d1',
  },

  chipText: {
    fontSize: 11,
    color: BRAND_COLOR,
    fontWeight: '800',
  },

  showMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: '#fff0f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BRAND_COLOR,
  },

  showMenuButtonActive: {
    backgroundColor: BRAND_COLOR,
  },

  showMenuText: {
    fontSize: 11,
    color: BRAND_COLOR,
    fontWeight: '800',
  },

  showMenuTextActive: {
    color: '#ffffff',
  },

  dropdownList: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 50,
    zIndex: 5000,
    width: 80,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    overflow: 'hidden',
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3edf0',
    backgroundColor: '#ffffff',
  },

  dropdownItemLast: {
    borderBottomWidth: 0,
  },

  dropdownItemActive: {
    backgroundColor: '#fff0f5',
  },

  dropdownText: {
    textAlign: 'center',
    color: '#333333',
    fontWeight: '600',
  },

  dropdownTextActive: {
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  // ======================================================
  // ADVANCED MENU
  // ======================================================
  advancedMenuWrap: {
    backgroundColor: '#ffffff',
    paddingBottom: 10,
    elevation: 3,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f6d1dc',
  },

  menuTabsWrap: {
    flexDirection: 'row',
    margin: 8,
    backgroundColor: '#fff7fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    overflow: 'hidden',
  },

  menuTab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff7fa',
  },

  menuTabWithBorder: {
    borderRightWidth: 1,
    borderColor: '#f6d1dc',
  },

  menuTabActive: {
    backgroundColor: '#fff0f5',
  },

  menuTabText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#667085',
  },

  menuTabTextActive: {
    color: BRAND_COLOR,
  },

  // ======================================================
  // FILTER SUB-MENU
  // ======================================================
  subMenuBox: {
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: '#fff7fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    marginBottom: 5,
  },

  filterInputRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 5,
  },

  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    padding: 7,
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },

  dateRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 8,
  },

  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    padding: 8,
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },

  dateButtonText: {
    fontSize: 11,
    color: '#111827',
  },

  dateButtonPlaceholder: {
    color: '#98a2b3',
  },

  sortButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#f3c3d1',
  },

  sortButtonActive: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  sortButtonText: {
    color: '#667085',
    fontSize: 10,
    fontWeight: '800',
  },

  sortButtonTextActive: {
    color: '#ffffff',
  },

  // ======================================================
  // SELECTION SUB-MENU
  // ======================================================
  selectionToggleButton: {
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
    marginRight: 8,
    zIndex: 1,
    alignItems: 'center',
  },

  selectionToggleButtonActive: {
    backgroundColor: '#16a34a',
  },

  selectionToggleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },

  selectionScroll: {
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#f6d1dc',
    paddingTop: 8,
  },

  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: BRAND_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },

  selectedBadgeIcon: {
    marginRight: 4,
  },

  selectedBadgeText: {
    color: BRAND_COLOR,
    fontSize: 10,
    fontWeight: '900',
  },

  outlineActionButton: {
    padding: 7,
    marginRight: 6,
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },

  selectCurrentButton: {
    borderColor: '#17a2b8',
  },

  selectCurrentText: {
    color: '#17a2b8',
    fontSize: 10.5,
    fontWeight: '900',
  },

  selectHistoryButton: {
    borderColor: '#6f42c1',
  },

  selectHistoryText: {
    color: '#6f42c1',
    fontSize: 10.5,
    fontWeight: '900',
  },

  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },

  clearButtonText: {
    color: '#dc3545',
    fontSize: 10.5,
    fontWeight: '900',
  },

  solidActionButton: {
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 7,
    marginRight: 8,
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
    fontWeight: '800',
  },

  solidActionDangerText: {
    fontWeight: '900',
  },

  // ======================================================
  // BACKUP SUB-MENU
  // ======================================================
  backupBox: {
    flexDirection: 'row',
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: '#fff7fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    marginBottom: 5,
  },

  backupButton: {
    flex: 1,
    padding: 9,
    borderRadius: 7,
  },

  fullBackupButton: {
    backgroundColor: '#344054',
    marginRight: 5,
  },

  importButton: {
    backgroundColor: '#16a34a',
  },

  backupButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
  },

  // ======================================================
  // HISTORY CARD - COMPACT VERSION
  // ======================================================
  itemCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    elevation: 2,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  itemCardSelected: {
    borderColor: BRAND_COLOR,
    borderWidth: 2,
  },

  historyCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardCheckboxButton: {
    marginRight: 7,
    paddingTop: 1,
  },

  historyCardNameWrap: {
    flex: 1,
    paddingRight: 8,
  },

  clientNameText: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '900',
    color: '#111827',
  },

  cardDeleteButton: {
    paddingLeft: 6,
    paddingVertical: 1,
  },

  historyCardInfoRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  historyCardLeftText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
    color: '#667085',
    fontWeight: '700',
    paddingRight: 6,
  },

  historyCardRightText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
    color: '#8a94a6',
    fontWeight: '800',
    textAlign: 'right',
  },

  historyCardAmountText: {
    fontSize: 14,
    lineHeight: 17,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  historyCardFromRow: {
    marginTop: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  historyCardFromText: {
    maxWidth: '72%',
    fontSize: 11,
    lineHeight: 14,
    color: '#667085',
    fontWeight: '800',
    textAlign: 'right',
  },

  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: '#f1edf0',
  },

  modernBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 8,
    flex: 0.31,
    minHeight: 30,
  },

  viewBtn: {
    backgroundColor: '#ecfdf3',
  },

  editBtn: {
    backgroundColor: '#fff1f2',
  },

  pdfBtn: {
    backgroundColor: '#f3edff',
  },

  btnText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    marginLeft: 4,
  },

  viewBtnText: {
    color: '#16a34a',
  },

  editBtnText: {
    color: '#dc3545',
  },

  pdfBtnText: {
    color: '#6f42c1',
  },

  // Old/backup card styles kept for compatibility
  selectionCheckboxButton: {
    marginRight: 10,
  },

  dateText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#8a94a6',
    marginTop: 2,
    fontWeight: '600',
  },

  amountLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: '#667085',
    fontWeight: '700',
  },

  amountText: {
    fontSize: 18,
    lineHeight: 22,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  compactCardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  compactTitleWrap: {
    flex: 1,
    paddingRight: 8,
  },

  compactSubText: {
    marginTop: 1,
    fontSize: 11,
    lineHeight: 14,
    color: '#667085',
    fontWeight: '600',
  },

  compactDeleteButton: {
    paddingLeft: 6,
    paddingTop: 1,
  },

  compactMetaRow: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  compactMetaText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
    color: '#8a94a6',
    fontWeight: '700',
  },

  compactAmountRow: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // ======================================================
  // LIST / EMPTY
  // ======================================================
  listContent: {
    paddingTop: 4,
    paddingBottom: 4,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },

  // ======================================================
  // PAGINATION
  // ======================================================
  paginationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#f6d1dc',
    backgroundColor: '#ffffff',
  },

  paginationButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  paginationButtonDisabled: {
    backgroundColor: '#d0d5dd',
  },

  paginationButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },

  pageText: {
    color: '#475467',
    fontWeight: '800',
  },

  // ======================================================
  // IMPORT MODAL
  // ======================================================
  importModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f6d1dc',
  },

  importModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  importOptionText: {
    padding: 10,
    color: BRAND_COLOR,
    fontWeight: '800',
  },

  importProceedText: {
    padding: 10,
    color: '#16a34a',
    fontWeight: '900',
  },

  importCancelText: {
    padding: 10,
    color: '#dc3545',
    textAlign: 'center',
    fontWeight: '900',
  },

  // ======================================================
  // COMMON UI HELPERS
  // ======================================================
  brandText: {
    color: BRAND_COLOR,
  },

  brandBackground: {
    backgroundColor: BRAND_COLOR,
  },

  softBrandBackground: {
    backgroundColor: '#fff0f5',
  },

  softBrandBorder: {
    borderColor: '#f6b9ca',
  },
});

export default styles;