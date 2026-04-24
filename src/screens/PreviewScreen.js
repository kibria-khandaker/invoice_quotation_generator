// src/screens/PreviewScreen.js:



import { View, Text, Button, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generatePDF } from '../services/pdfService';
import { saveQuotation, updateQuotation  } from '../services/storageService';
import * as Sharing from 'expo-sharing';

export default function PreviewScreen({ route }) {

  const data = route.params;

  const subtotal = data.subtotal;
  const grandTotal = data.grandTotal;

  const handleGeneratePDF = async () => {
    const uri = await generatePDF(data);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  };


const handleSaveQuotation = async () => {

  let success = false;

  // 👉 যদি ID already থাকে → UPDATE
  if (data.id) {
    success = await updateQuotation(data);
  } 
  // 👉 না থাকলে → NEW SAVE
  else {
    const newData = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    success = await saveQuotation(newData);
  }

  if (success) {
    alert('Quotation saved successfully!');
  } else {
    alert('Failed to save quotation');
  }
};


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 15 }} contentContainerStyle={{ paddingBottom: 50 }}>
{/* 1111111111 */}
{/* HEADER */}
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>

  {/* LEFT - COMPANY INFO */}
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
      {data.companyName}
    </Text>
    <Text>{data.companyAddress}</Text>
    <Text>{data.companyContact}</Text>
  </View>

  {/* RIGHT - LOGO */}
{data.logo ? (
  <Image
    source={{ uri: data.logo }}
    style={{
      width: 80,
      height: 80
    }}
    resizeMode="contain"
  />
) : (
  <View style={{
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Text style={{ fontSize: 10 }}>Logo</Text>
  </View>
)}

</View>
{/* 22222222222 */}
{/* 333333333333 */}
{/* BILL TO + QUOTATION INFO */}
<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

  {/* LEFT */}
  <View style={{ width: '48%' }}>
    <Text style={{ fontWeight: 'bold' }}>Bill To:</Text>
    <Text>{data.clientName}</Text>
    <Text>{data.clientCompany}</Text>
    <Text>{data.clientAddress}</Text>
  </View>

  {/* RIGHT */}
  <View style={{ width: '48%', alignItems: 'flex-end' }}>
    <Text style={{ fontWeight: 'bold' }}>Quotation Info:</Text>
    <Text>Quotation No: {data.quotationNumber}</Text>
    <Text>Date: {data.date}</Text>
    <Text>Validity: {data.validity}</Text>
  </View>

</View>

{/* TITLE CENTER */}
<Text style={{ textAlign: 'center', marginVertical: 15, fontWeight: 'bold' }}>
  QUOTATION
</Text>
{/* 444444444444 */}
       {/* 555555555 */}
<Text style={{ marginTop: 15, fontWeight: 'bold' }}>Services</Text>

<View style={{ borderWidth: 1, borderColor: '#ccc' }}>

  {/* HEADER */}
  <View style={{ flexDirection: 'row', backgroundColor: '#f2f2f2' }}>
    <Text style={{ flex: 1 }}>#</Text>
    <Text style={{ flex: 2 }}>Service</Text>
    <Text style={{ flex: 1 }}>Qty</Text>
    <Text style={{ flex: 1 }}>Price</Text>
  </View>

  {/* ROWS */}
  {data.services.map((item, index) => (
    <View key={item.id} style={{ flexDirection: 'row', borderTopWidth: 1 }}>

      <Text style={{ flex: 1 }}>{index + 1}</Text>
      <Text style={{ flex: 2 }}>{item.name}</Text>
      <Text style={{ flex: 1 }}>{item.quantity}</Text>
      <Text style={{ flex: 1 }}>{item.unitPrice}</Text>

    </View>
  ))}

</View>
{/* 6666666666666 */}
{/* 7777777 */}
<View style={{ marginTop: 20, alignSelf: 'flex-end', width: '60%' }}>

  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text>Subtotal:</Text>
    <Text>{subtotal}</Text>
  </View>

  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text>Discount:</Text>
    <Text>{data.discount}</Text>
  </View>

  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text>Tax:</Text>
    <Text>{data.tax}</Text>
  </View>

  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderTopWidth: 1 }}>
    <Text style={{ fontWeight: 'bold' }}>Total:</Text>
    <Text style={{ fontWeight: 'bold' }}>{grandTotal}</Text>
  </View>

</View>
{/* 88888888888 */}
{/* 999999 */}
{/* PAYMENT */}
<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>

  <View style={{ width: '48%' }}>
    <Text style={{ fontWeight: 'bold' }}>Payment Terms</Text>
    <Text>{data.paymentTerms}</Text>
  </View>

  <View style={{ width: '48%' }}>
    <Text style={{ fontWeight: 'bold' }}>Payment Method</Text>
    <Text>{data.paymentMethod}</Text>
  </View>

</View>

{/* MOBILE PAYMENT */}
{/* MOBILE PAYMENT */}
<View style={{ marginTop: 10 }}>
  <Text>{data.mobilePaymentInfo}</Text>
</View>

{/* SIGNATURE */}
<View style={{ alignItems: 'flex-end', marginTop: 30 }}>
  <Text>________________________</Text>
  
  {data.signatureImage ? (
      <Image
        source={{ uri: data.signatureImage }}
        style={{ width: 120, height: 60 }}
        resizeMode="contain"
      />
    ) : (
      <Text>{data.signature}</Text>
  )}
</View>
{/* 10 10 10  */}

{/* 11 11 11 11 */}
        {/* FOOTER */}

<View style={{ marginTop: 30, borderTopWidth: 1, paddingTop: 10 }}>

  <Text style={{ fontWeight: 'bold' }}>Notes</Text>
  <Text>{data.notes}</Text>

  <Text style={{ marginTop: 10, fontSize: 10, color: '#666' }}>
    * This is a system generated quotation. Terms may apply.
  </Text>

    <Text  style={{fontSize: 10, color: '#666', textAlign: 'center' }}> 
      all support By netkib.com & kibria.net
    </Text>

</View>
{/* 12 12 12 */}
        {/* <Button title="Save Quotation" onPress={handleSaveQuotation} /> */}
        <Button title={data.id ? "Update Quotation" : "Save Quotation"} onPress={handleSaveQuotation} />
        <View style={{ height: 10 }} />
        <Button title="Generate PDF" onPress={handleGeneratePDF} />

      </ScrollView>
    </SafeAreaView>
  );
}