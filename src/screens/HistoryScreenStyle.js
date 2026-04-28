import { StyleSheet } from 'react-native';

// Not fully used yet this file in to HistoryScreen css, it will use net time taking time with modify css


const styles = StyleSheet.create({

historyMainContainer: { flex: 1, backgroundColor: '#fff' },

// renderItem are's CSS Code
// HistoryScreenStyle.js এ এই স্টাইলগুলো যোগ/আপডেট করুন

itemCard: {
  backgroundColor: '#fff',
  marginHorizontal: 15,
  marginVertical: 10,
  borderRadius: 15, // আপনার ছবির মতো বেশি রাউন্ডেড
  padding: 15,
  borderWidth: 1,
  borderColor: '#f0f0f0',
  elevation: 2, // হালকা শ্যাডো
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
},
clientNameText: {
  fontSize: 17,
  fontWeight: 'bold',
  color: '#212121',
},
dateText: {
  fontSize: 12,
  color: '#9e9e9e',
  marginTop: 0,
},
amountLabel: {
  fontSize: 12,
  color: '#757575',
  marginTop: 15,
},
amountText: {
  fontSize: 20, // বড় এবং বোল্ড টাকা
  color: '#007bff',
  fontWeight: 'bold',
  marginTop: 0,
},
actionButtonGroup: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 15,
  paddingTop: 10,
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
},
// হালকা ব্যাকগ্রাউন্ড বাটন স্টাইল
modernBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 5,
  flex: 0.27, // বাটনগুলো সমান মাপে থাকবে
},
btnText: {
  fontSize: 14,
  fontWeight: '600',
  marginLeft: 5,
},
  
  // Search & Reset

  // Summary Row

  // Menus

  // Sub-Menu: Filter

  // Sub-Menu: Selection
  
  // Sub-Menu: Backup

  // List Item
 
  // Pagination


});

export default styles;