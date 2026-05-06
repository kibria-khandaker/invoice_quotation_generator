// ======================================================
// FILE: src/screens/PreviewScreenStyle.js
// PURPOSE:
// Styles for PreviewScreen
// ======================================================

import { StyleSheet } from 'react-native';

export const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
  },

  screen: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  header: {
    height: 72,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 12,
    paddingBottom: 34,
  },

  paper: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3d0da',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  companyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  companyLeft: {
    flex: 1,
    paddingRight: 12,
  },

  companyName: {
    color: BRAND_COLOR,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
  },

  companySubTitle: {
    marginTop: -2,
    marginBottom: 4,
    color: '#111827',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
  },

  logoBox: {
    width: 86,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  logo: {
    width: '100%',
    height: '100%',
  },

  logoPlaceholder: {
    marginTop: 3,
    fontSize: 10,
    color: '#667085',
  },

  infoLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },

  infoIcon: {
    marginRight: 4,
    marginTop: 1,
  },

  infoLabel: {
    fontSize: 11,
    lineHeight: 15,
    color: '#111827',
    fontWeight: '900',
  },

  infoValue: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    color: '#111827',
    fontWeight: '500',
  },

  infoValueStrong: {
    fontWeight: '800',
  },

  redDivider: {
    height: 1.2,
    backgroundColor: BRAND_COLOR,
    marginTop: 10,
    marginBottom: 12,
  },

  billQuoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  billBox: {
    flex: 1,
    paddingRight: 10,
  },

  quoteInfoBox: {
    width: '38%',
    alignItems: 'flex-end',
  },

  quoteInfoItem: {
    marginBottom: 8,
    alignItems: 'flex-end',
  },

  blockTitle: {
    marginBottom: 4,
    fontSize: 12,
    lineHeight: 16,
    color: '#111827',
    fontWeight: '900',
  },

  quoteInfoLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: '#111827',
    fontWeight: '900',
    textAlign: 'right',
  },

  quoteInfoValue: {
    marginTop: 2,
    fontSize: 11.5,
    lineHeight: 15,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'right',
  },

  centerTitleRow: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerTitleLine: {
    width: 52,
    height: 1,
    backgroundColor: BRAND_COLOR,
  },

  centerTitle: {
    marginHorizontal: 10,
    color: '#111827',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },

  itemTable: {
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  itemTableHeader: {
    flexDirection: 'row',
    backgroundColor: BRAND_COLOR,
  },

  itemTableRow: {
    flexDirection: 'row',
    minHeight: 46,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  noItemRow: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noItemText: {
    fontSize: 11,
    color: '#667085',
    fontWeight: '600',
  },

  th: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 10.5,
    lineHeight: 14,
    color: '#ffffff',
    fontWeight: '900',
  },

  td: {
    paddingVertical: 7,
    paddingHorizontal: 4,
    fontSize: 10.5,
    lineHeight: 14,
    color: '#111827',
    fontWeight: '500',
  },

  colNo: {
    width: 28,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },

  colDescription: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },

  colQty: {
    width: 38,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },

  colRate: {
    width: 68,
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },

  colAmount: {
    width: 76,
    textAlign: 'right',
  },

  itemDescriptionCell: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },

  itemNameText: {
    color: '#111827',
    fontSize: 10.8,
    lineHeight: 14,
    fontWeight: '800',
  },

  itemDescText: {
    marginTop: 1,
    color: '#4b5563',
    fontSize: 9.8,
    lineHeight: 13,
  },

  summaryBox: {
    alignSelf: 'flex-end',
    width: '54%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d1d5db',
  },

  summaryLine: {
    minHeight: 24,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '700',
  },

  summaryValue: {
    fontSize: 11,
    color: '#111827',
    fontWeight: '700',
  },

  netAmountLine: {
    minHeight: 28,
    paddingHorizontal: 8,
    backgroundColor: BRAND_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  netAmountLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },

  netAmountValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },

  paymentRow: {
    marginTop: 14,
    flexDirection: 'row',
  },

  paymentBox: {
    flex: 1,
    minHeight: 96,
    borderWidth: 1,
    borderColor: '#f5b5c8',
    borderRadius: 8,
    padding: 9,
    marginRight: 8,
  },

  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  paymentTitle: {
    marginLeft: 5,
    color: BRAND_COLOR,
    fontSize: 11.5,
    fontWeight: '900',
  },

  paymentText: {
    color: '#111827',
    fontSize: 10.5,
    lineHeight: 15,
  },

  mobilePaymentBox: {
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f5b5c8',
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  mobilePaymentText: {
    flex: 1,
    marginLeft: 6,
    color: '#111827',
    fontSize: 10.5,
    lineHeight: 15,
  },

  signatureArea: {
    marginTop: 16,
    alignItems: 'flex-end',
  },

  signatureImage: {
    width: 135,
    height: 52,
  },

  signatureText: {
    fontSize: 13,
    color: '#111827',
    fontStyle: 'italic',
  },

  signatureBlank: {
    width: 135,
    height: 42,
  },

  signatureLine: {
    width: 155,
    height: 1,
    backgroundColor: '#111827',
  },

  signatureLabel: {
    marginTop: 4,
    fontSize: 10.5,
    color: '#111827',
    fontWeight: '800',
  },

  signatureCompany: {
    marginTop: 1,
    fontSize: 10,
    color: '#111827',
  },

  notesBox: {
    marginTop: 18,
  },

  thanksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  thanksText: {
    marginLeft: 5,
    fontSize: 11,
    color: '#111827',
    fontWeight: '900',
  },

  notesText: {
    fontSize: 10.2,
    lineHeight: 15,
    color: '#111827',
  },

  notesBold: {
    fontWeight: '900',
  },

  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingTop: 7,
    alignItems: 'center',
  },

  footerHelp: {
    fontSize: 9.5,
    color: '#6b7280',
    textAlign: 'center',
  },

  footerContactRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerContact: {
    fontSize: 9.5,
    color: '#111827',
  },

  footerDivider: {
    marginHorizontal: 8,
    color: '#9ca3af',
  },

  footerSupport: {
    marginTop: 3,
    fontSize: 9.5,
    color: BRAND_COLOR,
    textAlign: 'center',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 18,
  },

  primaryButtonWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 6,
  },

  primaryButton: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    flexShrink: 1,
    marginLeft: 6,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },

  outlineButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: BRAND_COLOR,
    backgroundColor: '#ffffff',
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  outlineButtonText: {
    flexShrink: 1,
    marginLeft: 6,
    color: BRAND_COLOR,
    fontSize: 13,
    fontWeight: '900',
  },
});

export default styles;