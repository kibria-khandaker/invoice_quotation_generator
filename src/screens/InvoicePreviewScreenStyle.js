// src/screens/InvoicePreviewScreenStyle.js

// ======================================================
// INVOICE SIDE PREVIEW STYLE
// PHASE: BASIC PREVIEW + ACTION POLISH
//
// IMPORTANT:
// - This style file belongs only to InvoicePreviewScreen.
// - Quotation PreviewScreenStyle.js is not edited.
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
    fontSize: 25,
    lineHeight: 30,
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

  documentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  documentTitleArea: {
    flex: 1,
    paddingRight: 12,
  },

  documentTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    color: BRAND_COLOR,
    letterSpacing: 1,
  },

  documentNumber: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    color: '#667085',
  },

  logoPreviewBox: {
    width: 92,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffe3ed',
    backgroundColor: '#fff7fa',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  logoPreviewImage: {
    width: '100%',
    height: '100%',
  },

  logoPlaceholderBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ffe3ed',
    backgroundColor: '#fff7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },

  metaStatusRow: {
    marginTop: 14,
  },

  infoGridCompact: {
    flexDirection: 'row',
    gap: 10,
  },

  infoBox: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f2f4f7',
    padding: 11,
  },

  infoLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: '#667085',
  },

  infoValue: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: '#07142f',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 10,
  },

  statusBadgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
  },
  // ======================================================
  // INVOICE SIDE REFERENCE + STATUS INLINE STYLE
  // NEW:
  // Shows Reference Quotation and Payment Status side by side.
  // ======================================================
  referenceStatusRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
    marginTop: 10,
  },

  referenceBoxInline: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#fff7fa',
    borderWidth: 1,
    borderColor: '#ffd4e2',
    padding: 11,
    justifyContent: 'center',
  },

  statusBadgeInline: {
    minWidth: 118,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referenceBox: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: '#fff7fa',
    borderWidth: 1,
    borderColor: '#ffd4e2',
    padding: 11,
  },

  referenceLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: '#667085',
  },

  referenceValue: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  twoColumnRow: {
    flexDirection: 'row',
    gap: 10,
  },

  partyBox: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f2f4f7',
    padding: 12,
  },

  partyLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    color: BRAND_COLOR,
    textTransform: 'uppercase',
  },

  partyTitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  partyText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: '#667085',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  sectionIconBox: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: '#07142f',
  },

  emptyItemsBox: {
    borderRadius: 18,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f2f4f7',
    padding: 18,
    alignItems: 'center',
  },

  emptyItemsText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: '#667085',
  },

  itemPreviewRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f2f4f7',
    paddingVertical: 10,
  },

  itemPreviewLeft: {
    flex: 1,
    paddingRight: 10,
  },

  itemPreviewTitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  itemPreviewDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#667085',
  },

  itemPreviewMeta: {
    marginTop: 4,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '700',
    color: '#98a2b3',
  },

  itemPreviewAmount: {
    width: 86,
    textAlign: 'right',
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  summaryBox: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd4e2',
    backgroundColor: '#fff7fa',
    padding: 14,
  },

  summaryRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: '#344054',
  },

  summaryValue: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  summaryDivider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#ffd4e2',
    borderStyle: 'dashed',
    marginVertical: 8,
  },

  totalRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    minHeight: 54,
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

  textBlock: {
    borderTopWidth: 1,
    borderTopColor: '#f2f4f7',
    paddingTop: 10,
    marginTop: 10,
  },

  textBlockLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  textBlockValue: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    color: '#344054',
  },

  signaturePreviewBox: {
    minHeight: 96,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ffe3ed',
    backgroundColor: '#fff7fa',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  signaturePreviewImage: {
    width: '100%',
    height: 96,
  },

  signaturePlaceholderText: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: '#667085',
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

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 80,
  },

  outlineButton: {
    flex: 1,
    height: 56,
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
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  primaryButtonText: {
    marginLeft: 8,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    color: '#ffffff',
  },
});

export default styles;