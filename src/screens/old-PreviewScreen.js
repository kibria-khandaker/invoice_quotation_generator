// src/screens/PreviewScreen.js:



import { View, Text, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generatePDF } from '../services/pdfService';
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 15 }} contentContainerStyle={{ paddingBottom: 50 }}>

        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {data.companyName}
        </Text>

        <Text>{data.companyAddress}</Text>
        <Text>{data.companyContact}</Text>

        <Text style={{ textAlign: 'center', marginVertical: 10 }}>
          QUOTATION
        </Text>

        <Text>Quotation No: {data.quotationNumber}</Text>
        <Text>Date: {data.date}</Text>
        <Text>Validity: {data.validity}</Text>

        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Bill To</Text>
        <Text>{data.clientName}</Text>
        <Text>{data.clientCompany}</Text>
        <Text>{data.clientAddress}</Text>

        <Text style={{ marginTop: 10 }}>Services:</Text>

        {data.services.map(item => (
          <View key={item.id}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.quantity} x {item.unitPrice}</Text>
          </View>
        ))}

        <Text>Subtotal: {subtotal}</Text>
        <Text>Discount: {data.discount}</Text>
        <Text>Tax: {data.tax}</Text>
        <Text style={{ fontWeight: 'bold' }}>Total: {grandTotal}</Text>

        <Text>Payment Terms: {data.paymentTerms}</Text>
        <Text>Payment Method: {data.paymentMethod}</Text>

        <Text>Signature: {data.signature}</Text>
        <Text>Notes: {data.notes}</Text>

        <Button title="Generate PDF" onPress={handleGeneratePDF} />

      </ScrollView>
    </SafeAreaView>
  );
}