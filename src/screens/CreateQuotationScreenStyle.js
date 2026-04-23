import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  // 1111 - 2222 
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  companyInfo: {
    flex: 1,
    paddingRight: 10,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
  },


  // 3333 - 4444 
rowBetween: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 20,
},

halfBlock: {
  flex: 1,
},

sectionTitle: {
  fontWeight: "bold",
  marginBottom: 8,
},
// 5555-6666
table: {
  borderWidth: 1,
  borderColor: '#ccc',
},

tableRowHeader: {
  flexDirection: 'row',
  backgroundColor: '#f2f2f2',
},

tableRow: {
  flexDirection: 'row',
  borderTopWidth: 1,
  borderColor: '#ccc',
},

th: {
  flex: 1,
  padding: 6,
  fontWeight: 'bold',
  fontSize: 12,
},

td: {
  flex: 1,
  padding: 6,
  fontSize: 12,
},

inputCell: {
  flex: 1,
  borderWidth: 0.5,
  padding: 4,
  fontSize: 12,
},

// 777-888
pricingContainer: {
  marginTop: 20,
  alignSelf: 'flex-end',
  width: '60%',
},

pricingRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},

pricingRowTotal: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
  borderTopWidth: 1,
  paddingTop: 8,
},

priceInput: {
  borderWidth: 1,
  width: 80,
  padding: 4,
  textAlign: 'right',
},

// 99999-10 10 10
paymentRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
},

paymentBlock: {
  width: '48%',
},

signatureContainer: {
  marginTop: 30,
  alignItems: 'flex-end',
},
// 11 11 - 12 12
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
  color: '#666',
},

contactFooter: {
  marginTop: 10,
  alignItems: 'center',
},

mobilePaymentInfo:{
  // flexDirection: 'row',
  // justifyContent: 'space-between',
  marginTop:3,
},
mobilePaymentInfoText:{
    fontSize: 10,
    // color: 'red',
},
supportInfoText: {
  fontSize: 10,
  color: '#666',
  textAlign:'center',
},
//  signature 
signatureBox: {
  width: 120,
  height: 60,
  borderWidth: 1,
  borderColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
}


});

export default styles;