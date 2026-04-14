// src/screens/PreviewScreen.js:

import { View, Text, Button, ScrollView } from 'react-native';
import { generatePDF } from '../services/pdfService';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PreviewScreen({ route }) {

  const data = route.params;

  const handleGeneratePDF = async () => {
    try {
      const uri = await generatePDF(data);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }

    } catch (error) {
      alert('Error generating PDF');
    }
  };

  return (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView
      style={{ padding: 20 }}
      contentContainerStyle={{ paddingBottom: 50,
  flexGrow: 1 }}
    >

      {/* COMPANY */}
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{data.companyName}</Text>
      <Text>{data.companyAddress}</Text>
      <Text>{data.companyContact}</Text>

      {/* TITLE */}
      <Text style={{ textAlign: 'center', fontSize: 20, marginVertical: 10 }}>
        QUOTATION
      </Text>

      {/* QUOTATION DETAILS */}
      <Text>Quotation No: {data.quotationNumber}</Text>
      <Text>Date: {data.date}</Text>
      <Text>Validity: {data.validity}</Text>

      {/* CLIENT */}
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Bill To:</Text>
      <Text>{data.clientName}</Text>
      <Text>{data.clientCompany}</Text>
      <Text>{data.clientAddress}</Text>

      {/* SERVICES */}
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Services:</Text>

      {data.services.map((item) => (
        <View key={item.id} style={{ marginBottom: 5 }}>
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text>{item.quantity} x {item.unitPrice}</Text>
          <Text>Total: {item.quantity * item.unitPrice}</Text>
        </View>
      ))}

      {/* PRICING */}
      <Text style={{ marginTop: 10 }}>Subtotal: {data.subtotal}</Text>
      <Text>Discount: {data.discount}</Text>
      <Text>Tax: {data.tax}</Text>
      <Text style={{ fontWeight: 'bold' }}>Total: {data.grandTotal}</Text>

      {/* PAYMENT */}
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Payment Terms</Text>
      <Text>{data.paymentTerms}</Text>

      <Text style={{ fontWeight: 'bold' }}>Payment Method</Text>
      <Text>{data.paymentMethod}</Text>

      {/* SIGNATURE */}
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Signature</Text>
      <Text>{data.signature}</Text>

      {/* NOTES */}
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Notes</Text>
      <Text>{data.notes}</Text>

      <Button title="Generate PDF" onPress={handleGeneratePDF} />

        </ScrollView>
  </SafeAreaView>
  );
}