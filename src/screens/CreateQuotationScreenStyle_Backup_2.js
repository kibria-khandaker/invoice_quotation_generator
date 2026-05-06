// ======================================================
// FILE: src/screens/CreateQuotationScreenStyle.js
// PURPOSE:
// Styling for CreateQuotationScreen
// Brand color: #fd4475
// ======================================================

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
  },

  screen: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  topHeader: {
    minHeight: 118,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  headerTitle: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    textAlign: 'center',
    flex: 1,
  },

  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    zIndex: 2,
  },

  headerWaveOne: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -50,
    height: 82,
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    transform: [{ rotate: '-4deg' }],
  },

  headerWaveTwo: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -67,
    height: 96,
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    backgroundColor: '#fff7fa',
    transform: [{ rotate: '2deg' }],
  },

  scroll: {
    flex: 1,
    marginTop: -24,
  },

scrollContent: {
  paddingHorizontal: 13,
  paddingBottom: 90,
},

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffe6ee',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },

  twoColumnWrap: {
    flexDirection: 'column',
  },

  halfCard: {
    width: '100%',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },

  sectionHeaderRight: {
    marginLeft: 8,
  },

  sectionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#ffe8ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionTitleWrap: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: '900',
    color: '#0b1531',
  },

  sectionSubTitle: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: '#667085',
    fontWeight: '500',
  },

  inputWrap: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: '#e4e9f2',
    borderRadius: 11,
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
    marginBottom: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  disabledInputWrap: {
    backgroundColor: '#f8fafc',
  },

  input: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 7,
    paddingHorizontal: 7,
    color: '#263244',
    fontSize: 12.5,
    fontWeight: '500',
  },

  textAreaWrap: {
    minHeight: 70,
    alignItems: 'flex-start',
    paddingTop: 9,
  },

  textAreaWrapSmall: {
    minHeight: 62,
    alignItems: 'flex-start',
    paddingTop: 9,
  },

  textAreaInput: {
    minHeight: 48,
    textAlignVertical: 'top',
  },

  uploadBox: {
    width: 116,
    minHeight: 76,
    borderWidth: 1.2,
    borderColor: 'rgba(253, 68, 117, 0.45)',
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: '#fffafb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  uploadText: {
    marginTop: 5,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '800',
    color: '#263244',
    textAlign: 'center',
  },

  uploadImage: {
    width: '100%',
    height: 62,
  },

  signatureImage: {
    height: 58,
  },

serviceHeaderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
  gap: 8,
},
serviceHeaderLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

addServiceBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: BRAND_COLOR,
  borderRadius: 11,
  paddingHorizontal: 10,
  height: 36,
  backgroundColor: '#fffafb',
  flexShrink: 0,
  maxWidth: 124,
},

addServiceBtnText: {
  marginLeft: 4,
  fontSize: 11.5,
  fontWeight: '800',
  color: BRAND_COLOR,
},

  serviceTable: {
    borderWidth: 1,
    borderColor: '#edf0f5',
    borderRadius: 13,
    overflow: 'hidden',
    marginTop: 6,
  },

  tableRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7fa',
    borderBottomWidth: 1,
    borderBottomColor: '#edf0f5',
  },

  tableRow: {
    flexDirection: 'row',
    minHeight: 48,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#edf0f5',
    backgroundColor: '#ffffff',
  },

  th: {
    paddingVertical: 9,
    paddingHorizontal: 6,
    fontSize: 10.5,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  td: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 11.5,
    color: '#263244',
    fontWeight: '600',
  },

  inputCell: {
    minHeight: 42,
    paddingVertical: 6,
    paddingHorizontal: 6,
    color: '#263244',
    fontSize: 11.5,
    fontWeight: '600',
  },

  colNumber: {
    width: 30,
    textAlign: 'center',
  },

  colService: {
    flex: 1.6,
  },

  colQty: {
    width: 52,
    textAlign: 'center',
  },

  colPrice: {
    flex: 1.05,
  },

  colAction: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyInput: {
    textAlign: 'center',
  },

  removeBtn: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pricingBox: {
    backgroundColor: '#fff7fa',
    borderWidth: 1,
    borderColor: '#ffd4df',
    borderRadius: 16,
    padding: 12,
  },

  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
  },

  pricingLabel: {
    fontSize: 12.5,
    color: '#4f5b6d',
    fontWeight: '700',
  },

  pricingValue: {
    fontSize: 13,
    color: '#0b1531',
    fontWeight: '900',
  },

  priceInput: {
    minWidth: 86,
    height: 34,
    borderWidth: 1,
    borderColor: '#ffd4df',
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlign: 'right',
    color: '#0b1531',
    fontSize: 12.5,
    fontWeight: '800',
    backgroundColor: '#ffffff',
  },

  pricingDivider: {
    height: 1,
    backgroundColor: '#ffd4df',
    marginVertical: 8,
  },

  pricingRowTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalText: {
    fontSize: 14,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  totalAmountText: {
    fontSize: 20,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  paymentTextAreaWrap: {
    minHeight: 96,
    alignItems: 'flex-start',
    paddingTop: 9,
  },

  mobilePaymentWrap: {
    minHeight: 94,
    alignItems: 'flex-start',
    paddingTop: 9,
  },

  signaturePreviewInfo: {
    alignItems: 'flex-end',
    marginTop: 6,
  },

  signatureLine: {
    color: '#667085',
    fontSize: 12,
  },

  signatureLabel: {
    marginTop: 2,
    color: '#667085',
    fontSize: 11,
    fontWeight: '700',
  },

  notesWrap: {
    minHeight: 82,
    alignItems: 'flex-start',
    paddingTop: 9,
  },

  disclaimerText: {
    marginTop: 8,
    fontSize: 10.5,
    lineHeight: 15,
    color: '#667085',
  },

  supportInfoText: {
    marginTop: 7,
    fontSize: 10.5,
    color: BRAND_COLOR,
    textAlign: 'center',
    fontWeight: '700',
  },

actionRow: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 4,
  marginBottom: 34,
},

  gradientButtonWrap: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',

    elevation: 5,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9,
  },

gradientButton: {
  height: 48,
  borderRadius: 15,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

  gradientButtonText: {
    marginLeft: 7,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },

outlineButton: {
  flex: 1,
  height: 48,
  borderRadius: 15,
  borderWidth: 1.2,
  borderColor: BRAND_COLOR,
  backgroundColor: '#ffffff',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

  outlineButtonText: {
    marginLeft: 7,
    color: BRAND_COLOR,
    fontSize: 14,
    fontWeight: '900',
  },
});

export default styles;
