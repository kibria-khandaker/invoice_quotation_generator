// src/screens/CreateInvoiceScreenStyle.js

// ======================================================
// INVOICE SIDE STYLE
// PHASE: UI + SETTINGS PRESET CONNECTION
//
// IMPORTANT:
// - This style file belongs only to CreateInvoiceScreen.
// - CreateQuotationScreenStyle.js is not edited.
// - Brand color follows project brand: #fd4475.
// ======================================================

import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
  },

  headerGradient: {
    minHeight: 132,
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
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '900',
    color: '#ffffff',
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
  },

  keyboardAvoidingWrap: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff7fa',
    marginTop: -22,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },

  firstCard: {
    marginTop: 0,
  },

  // ======================================================
  // INVOICE SIDE SAVED EDIT NOTICE CARD
  // NEW:
  // Shown only for Invoice History -> Edit mode.
  // Matches the orange notice pattern used by Edit Quotation.
  // ======================================================
  editModeTopCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
    flexDirection: 'row',
    alignItems: 'center',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },

  editModeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  editModeContent: {
    flex: 1,
    paddingRight: 8,
  },

  editModeTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    color: '#7c2d12',
  },

  editModeSubtitle: {
    marginTop: 2,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#9a3412',
    fontWeight: '600',
  },

  editModeBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffedd5',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  editModeBadgeText: {
    marginLeft: 5,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    color: '#f97316',
  },

  cancelEditButton: {
    height: 34,
    borderRadius: 999,
    backgroundColor: '#ffedd5',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  cancelEditButtonText: {
    marginLeft: 3,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    color: '#f97316',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },

  sectionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  sectionTitleWrap: {
    flex: 1,
  },

  // ======================================================
  // INVOICE SIDE SECTION TEXT STYLE
  // EDIT:
  // More compact title style to better match Create Quotation UI.
  // ======================================================
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: '#07142f',
  },

  sectionSubTitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#667085',
  },

  sectionHeaderRight: {
    maxWidth: 128,
    flexShrink: 0,
  },

  companyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  companyPresetWrap: {
    flex: 1,
  },

  uploadBox: {
    width: 150,
    height: 76,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#ff9fbd',
    backgroundColor: '#fff7fa',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  signatureUploadBox: {
    width: '100%',
    height: 95,
  },

  uploadText: {
    marginTop: 5,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '800',
    color: BRAND_COLOR,
  },

  uploadImage: {
    width: '100%',
    height: '100%',
  },

  logoPreview: {
    width: '100%',
    height: '100%',
  },

  signaturePreview: {
    width: '100%',
    height: '100%',
  },

  inputWrap: {
    minHeight: 54,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ======================================================
  // INVOICE SIDE INPUT TEXT STYLE
  // EDIT:
  // Slightly smaller and softer input text color.
  // ======================================================
  input: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#344054',
    paddingVertical: 10,
  },

  multilineInput: {
    minHeight: 68,
    textAlignVertical: 'top',
  },

  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    marginLeft: 0,
  },

  statusWrap: {
    marginTop: 2,
  },

  statusLabel: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '900',
    color: '#344054',
    marginBottom: 8,
  },

  statusPillRow: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    overflow: 'hidden',
    backgroundColor: '#fff7fa',
  },

  statusPill: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  statusPillActive: {
    backgroundColor: '#fff0f5',
  },

  statusPillText: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
    color: '#667085',
  },

  statusPillTextActive: {
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  addItemButton: {
    height: 42,
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: BRAND_COLOR,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  addItemText: {
    marginLeft: 5,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  itemsTable: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ffe3ed',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },

  itemsTableHeader: {
    height: 46,
    backgroundColor: '#fff6f9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  tableHeaderText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  colNumber: {
    width: 32,
  },

  colItem: {
    flex: 1,
  },

  colQty: {
    width: 52,
    textAlign: 'center',
  },

  colPrice: {
    width: 78,
    textAlign: 'center',
  },

  itemRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#f2f4f7',
  },

  itemIndex: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    color: '#1f2937',
  },

  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },

  itemNameInput: {
    minHeight: 28,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: '#1f2937',
    paddingVertical: 2,
  },

  itemDescriptionInput: {
    minHeight: 26,
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '600',
    color: '#667085',
    paddingVertical: 2,
  },

  qtyInput: {
    width: 46,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#1f2937',
    marginRight: 6,
  },

  priceInput: {
    width: 72,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginRight: 5,
  },

  deleteItemButton: {
    width: 32,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryBox: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    backgroundColor: '#fff7fa',
    padding: 14,
  },

  summaryRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    color: '#344054',
  },

  summaryValue: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: '#07142f',
  },

  summaryInput: {
    width: 104,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    backgroundColor: '#ffffff',
    textAlign: 'right',
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#344054',
  },

  // ======================================================
  // INVOICE SIDE TAX HINT STYLE
  // NEW:
  // Small helper text beside Tax (%) label.
  // ======================================================
  taxLabelWrap: {
    flex: 1,
    paddingRight: 10,
  },

  taxHintText: {
    marginTop: 2,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '700',
    color: '#98a2b3',
  },

  summaryDivider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#ffd4e2',
    borderStyle: 'dashed',
    marginVertical: 8,
  },

  totalLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  totalValue: {
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  dueRow: {
    minHeight: 58,
    borderRadius: 17,
    backgroundColor: '#fff0f5',
    marginTop: 8,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dueLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  dueValue: {
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '900',
    color: BRAND_COLOR,
  },
  // ======================================================
  // INVOICE SIDE AUTO PAYMENT STATUS STYLE
  // NEW:
  // Display-only status under Pricing Summary.
  // Color changes based on calculated due amount.
  // ======================================================
  autoStatusBox: {
    minHeight: 64,
    borderRadius: 17,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  autoStatusLeft: {
    flex: 1,
    paddingRight: 10,
  },

  autoStatusLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    color: '#344054',
  },

  autoStatusHint: {
    marginTop: 2,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '700',
    color: '#667085',
  },

  autoStatusBadge: {
    minHeight: 34,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  autoStatusBadgeText: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '900',
  },
  
  signatureLine: {
    height: 1,
    borderTopWidth: 1.4,
    borderTopColor: '#667085',
    borderStyle: 'dashed',
    marginTop: 18,
    marginHorizontal: 20,
  },

  signatureLabel: {
    marginTop: 6,
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: '#667085',
  },

  footerNoteBox: {
    marginTop: 10,
  },

  footerNoteText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: '#667085',
  },

  footerSmallText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: '#667085',
  },

  footerSupportText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 80,
  },

  gradientButtonWrap: {
    flex: 1,
    height: 58,
    borderRadius: 20,
    overflow: 'hidden',
  },

  gradientButton: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  gradientButtonText: {
    marginLeft: 8,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    color: '#ffffff',
  },

  outlineButton: {
    flex: 1,
    height: 58,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BRAND_COLOR,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  outlineButtonText: {
    marginLeft: 8,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  modalCard: {
    width: '100%',
    maxHeight: '82%',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 16,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    color: '#07142f',
  },

  modalSubtitle: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600',
    color: '#667085',
  },

  modalCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  customItemCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ffe3ed',
    backgroundColor: '#fff7fa',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  customItemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  customItemTextWrap: {
    flex: 1,
  },

  customItemTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  customItemSubtitle: {
    marginTop: 3,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    color: '#667085',
  },

  emptyCatalogBox: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyCatalogText: {
    marginTop: 9,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: '#667085',
    textAlign: 'center',
  },

  catalogListContent: {
    paddingBottom: 4,
  },

  catalogItemCard: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#f2f4f7',
    backgroundColor: '#ffffff',
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  catalogIconBox: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  catalogInfo: {
    flex: 1,
    paddingRight: 8,
  },

  catalogTitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  catalogSubtitle: {
    marginTop: 3,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    color: '#667085',
  },

  catalogPrice: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '900',
    color: BRAND_COLOR,
  },
});

export default styles;