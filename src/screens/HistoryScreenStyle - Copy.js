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
    marginLeft: 4,
  },

  // ======================================================
  // TOP HEADER / SEARCH / MENU - COMPACT
  // ======================================================
  topHeaderWrap: {
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#ffffff',
    elevation: 30,
    zIndex: 3000,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#f6d1dc',
  },

  searchRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    paddingHorizontal: 8,
    paddingVertical: 5,
    minHeight: 38,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#fff7fa',
    color: '#111827',
    fontSize: 13,
    lineHeight: 17,
  },

  resetButton: {
    backgroundColor: '#fff0f5',
    paddingHorizontal: 9,
    paddingVertical: 7,
    minHeight: 38,
    minWidth: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f3c3d1',
  },

  headerSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    justifyContent: 'space-between',
    zIndex: 3001,
    elevation: 31,
    position: 'relative',
  },

  showingText: {
    fontSize: 10.5,
    lineHeight: 14,
    color: '#475467',
    fontWeight: '800',
  },

  itemsPerPageWrap: {
    position: 'relative',
    zIndex: 4000,
    elevation: 40,
  },

  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    minHeight: 30,
    backgroundColor: '#fff0f5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f3c3d1',
  },

  chipText: {
    fontSize: 10.5,
    lineHeight: 14,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  showMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    minHeight: 30,
    backgroundColor: '#fff0f5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BRAND_COLOR,
  },

  showMenuButtonActive: {
    backgroundColor: BRAND_COLOR,
  },

  showMenuText: {
    fontSize: 10.5,
    lineHeight: 14,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  showMenuTextActive: {
    color: '#ffffff',
  },

  dropdownList: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 50,
    zIndex: 5000,
    width: 76,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    fontSize: 12,
    fontWeight: '700',
  },

  dropdownTextActive: {
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  // ======================================================
  // ADVANCED MENU - SUPER COMPACT
  // ======================================================
  advancedMenuWrap: {
    backgroundColor: '#ffffff',
    paddingBottom: 4,
    elevation: 3,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f6d1dc',
  },

  menuTabsWrap: {
    flexDirection: 'row',
    marginHorizontal: 8,
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
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7fa',
    minHeight: 50,
  },

  menuTabWithBorder: {
    borderRightWidth: 1,
    borderColor: '#f6d1dc',
  },

  menuTabActive: {
    backgroundColor: '#fff0f5',
  },

  menuTabText: {
    marginTop: 1,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '900',
    color: '#667085',
  },

  menuTabTextActive: {
    color: BRAND_COLOR,
  },

  // ======================================================
  // FILTER SUB-MENU - COMPACT
  // ======================================================
  subMenuBox: {
    marginHorizontal: 8,
    padding: 6,
    backgroundColor: '#fff7fa',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    marginBottom: 4,
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
    paddingHorizontal: 7,
    paddingVertical: 4,
    minHeight: 34,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },

  dateRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 6,
  },

  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    paddingHorizontal: 7,
    paddingVertical: 5,
    minHeight: 34,
    borderRadius: 7,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },

  dateButtonText: {
    fontSize: 11.5,
    lineHeight: 15,
    color: '#111827',
  },

  dateButtonPlaceholder: {
    color: '#98a2b3',
  },

  sortButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#f3c3d1',
    minHeight: 30,
    justifyContent: 'center',
  },

  sortButtonActive: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  sortButtonText: {
    color: '#667085',
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '900',
  },

  sortButtonTextActive: {
    color: '#ffffff',
  },

  // ======================================================
  // SELECTION SUB-MENU - COMPACT
  // ======================================================
  selectionToggleButton: {
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
    marginRight: 8,
    zIndex: 1,
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

  // ======================================================
  // BACKUP SUB-MENU - COMPACT
  // ======================================================
  backupBox: {
    flexDirection: 'row',
    marginHorizontal: 8,
    padding: 6,
    backgroundColor: '#fff7fa',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f6d1dc',
    marginBottom: 4,
  },

  backupButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 7,
    minHeight: 36,
    justifyContent: 'center',
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
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '900',
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#f6d1dc',
    backgroundColor: '#ffffff',
  },

  paginationButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    minHeight: 36,
    justifyContent: 'center',
  },

  paginationButtonDisabled: {
    backgroundColor: '#d0d5dd',
  },

  paginationButtonText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
  },

  pageText: {
    color: '#475467',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
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