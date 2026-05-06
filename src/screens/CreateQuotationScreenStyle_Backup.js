// ======================================================
// FILE: src/screens/CreateQuotationScreenStyle.js
// PURPOSE:
// Styling for CreateQuotationScreen
//
// NOTE:
// ✔ No style value changed
// ✔ No property removed
// ✔ No logic changed
// ✔ Only cleaned formatting + organized sections + comments
// ======================================================

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  // ======================================================
  // COMMON AND INPUT
  // Reusable TextInput style
  // ======================================================
  
  inputFieldTitle:{
    fontSize:12,
    color:'#62a4ea',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddeefe',
    backgroundColor:'rgb(243, 248, 255)',
    color:'#5085bd',
    paddingVertical: 3,
    paddingHorizontal:8,
    marginBottom: 5,
    borderRadius: 3,
    fontSize:12,
    placeholderTextColor:'#f10d3e',
  },
  temp_class_topBorder:{ 
    borderBottomWidth:1, 
    borderColor: '#98cfef', 
    borderStyle:'dashed',
  },
  temp_class_bottomBorderDetails:{ 
    borderBottomWidth:1, 
    borderColor: '#98cfef', 
    borderStyle:'dashed',
  },


  // ======================================================
  // SECTION 1 : COMPANY HEADER
  // Used in:
  // Company info + Logo area
  // ======================================================

  headerContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    marginBottom: 20,
  },

  companyInfo: {
    flex: 1,
    // paddingRight: 10,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ddeefe',
    backgroundColor:'rgb(242, 248, 255)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  // ======================================================
  // SECTION 2 : BILL TO + QUOTATION INFO
  // Two side-by-side blocks
  // ======================================================

  rowBetween: {
    flexDirection: 'col',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  halfBlock: {
    flex: 1,
  },

  sectionTitle: {
    fontWeight: 'bold',
    color:'#419dff',
    marginBottom: 8,
  },
sectionSubTitle:{
  fontSize:10,
  marginBottom: 0,
},
// ======================================================
  // SECTION 3 : SERVICES TABLE
  // ======================================================
  serviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addServiceBtn: {
    backgroundColor: '#419dff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  addServiceBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  serviceTable: {
    borderWidth: 1,
    borderColor: '#bedbf7',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#bedbf7',
    alignItems: 'center', // ইনপুটগুলো মাঝে রাখার জন্য
  },
  th: {
    padding: 6,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#62a4ea',
  },
  td: {
    padding: 6,
    fontSize: 12,
    color: '#62a4ea',
  },
  inputCell: {
    padding: 4,
    fontSize: 12,
    borderLeftWidth: 0.5,
    borderLeftColor: '#bedbf7',
    color: '#62a4ea',
  },
  removeBtn: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 0.5,
    borderLeftColor: '#bedbf7',
  },
  removeBtnText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    fontSize: 20,
  },

  // ======================================================
  // SECTION 4 : PRICING SUMMARY
  // ======================================================
  pricingContainer: {
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '60%',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pricingRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#bedbf7',
    paddingTop: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#bedbf7',
    width: 80,
    padding: 4,
    textAlign: 'right',
    fontSize: 12,
    color: '#62a4ea',
  },
  totalText: {
    fontWeight:'400',
    fontSize: 14,
    color: '#419dff',
  },
  totalAmountText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#419dff',
  },

  // ======================================================
  // SECTION 5 : PAYMENT + SIGNATURE
  // ======================================================

  paymentRow: {
    flexDirection: 'col',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  paymentBlock: {
    // width: '48%',
  },

  signatureContainer: {
    marginTop: 30,
    alignItems: 'flex-end',
  },

  signatureBox: {
    width: 120,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddeefe',
    backgroundColor:'rgb(242, 248, 255)',
    justifyContent: 'center',
    alignItems: 'center',
  },


  // ======================================================
  // SECTION 6 : FOOTER + NOTES
  // ======================================================

  footerContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 15,
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
  },

  disclaimerText: {
    marginTop: 10,
    fontSize: 10,
    color:'#62a4ea',
  },

  contactFooter: {
    marginTop: 10,
    alignItems: 'center',
  },

  supportInfoText: {
    fontSize: 10,
    color:'#62a4ea',
    textAlign: 'center',
  },


  // ======================================================
  // SECTION 7 : MOBILE PAYMENT INFO
  // ======================================================

  mobilePaymentInfo: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 3,
  },

  mobilePaymentInfoText: {
    fontSize: 10,
    // color: 'red',
  },


});

export default styles;