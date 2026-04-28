// src/screens/CreateQuotationScreen.js:



import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateQuotationNumber } from '../utils/generateQuotationNumber';

export default function CreateQuotationScreen({ navigation }) {

  const [invoice, setInvoice] = useState({
    companyName: '',
    companyAddress: '',
    companyContact: '',

    quotationNumber: '',
    date: new Date().toISOString().split('T')[0],
    validity: '',

    clientName: '',
    clientCompany: '',
    clientAddress: '',

    services: [
      { id: '1', name: '', description: '', quantity: '1', unitPrice: '' }
    ],

    discount: '',
    tax: '',
    paymentTerms: '',
    paymentMethod: '',
    signature: '',
    notes: ''
  });

  // 🔥 AUTO GENERATE QUOTATION NUMBER
  useEffect(() => {
    const init = async () => {
      const number = await generateQuotationNumber();

      setInvoice(prev => ({
        ...prev,
        quotationNumber: number
      }));
    };

    init();
  }, []);

  const updateField = (key, value) => {
    setInvoice(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateService = (id, field, value) => {
    const updated = invoice.services.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );

    setInvoice(prev => ({
      ...prev,
      services: updated
    }));
  };

  const addService = () => {
    setInvoice(prev => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          quantity: '1',
          unitPrice: ''
        }
      ]
    }));
  };

  const removeService = (id) => {
    setInvoice(prev => ({
      ...prev,
      services: prev.services.filter(item => item.id !== id)
    }));
  };

  const subtotal = invoice.services.reduce((sum, item) => {
    return sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0));
  }, 0);

  const discountValue = parseFloat(invoice.discount) || 0;
  const taxValue = parseFloat(invoice.tax) || 0;
  const grandTotal = subtotal - discountValue + taxValue;

  const handlePreview = () => {
    navigation.navigate('Preview', {
      ...invoice,
      subtotal,
      discount: discountValue,
      tax: taxValue,
      grandTotal
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ padding: 15 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >

{/* 1111111111 */}
        {/* COMPANY */}
        <Text>Company Name</Text>
        <TextInput value={invoice.companyName} onChangeText={(t) => updateField('companyName', t)} style={{ borderWidth: 1 }} />

        <Text>Company Address</Text>
        <TextInput 
        value={invoice.companyAddress} 
        onChangeText={(t) => updateField('companyAddress', t)}   style={{
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top' // 👈 VERY IMPORTANT (Android fix)
  }}
        multiline={true}
  numberOfLines={4}
        />

        <Text>Company Contact</Text>
        <TextInput value={invoice.companyContact} onChangeText={(t) => updateField('companyContact', t)} style={{ borderWidth: 1 }} />
{/* 2222222222 */}
{/* 3333333333 */}
        {/* QUOTATION NUMBER (SMART) */}
        <Text>Quotation Number</Text>
        <TextInput
          value={invoice.quotationNumber}
          onChangeText={(t) => updateField('quotationNumber', t)}
          style={{ borderWidth: 1 }}
        />

        <Text>Date</Text>
        <TextInput value={invoice.date} onChangeText={(t) => updateField('date', t)} style={{ borderWidth: 1 }} />

        <Text>Validity</Text>
        <TextInput value={invoice.validity} onChangeText={(t) => updateField('validity', t)} style={{ borderWidth: 1 }} />

        {/* CLIENT */}
        <Text>Client Name</Text>
        <TextInput value={invoice.clientName} onChangeText={(t) => updateField('clientName', t)} style={{ borderWidth: 1 }} />

        <Text>Client Company</Text>
        <TextInput value={invoice.clientCompany} onChangeText={(t) => updateField('clientCompany', t)} style={{ borderWidth: 1 }} />

        <Text>Client Address</Text>
        <TextInput value={invoice.clientAddress} onChangeText={(t) => updateField('clientAddress', t)} style={{ borderWidth: 1 }} />
{/* 4444444444 */}

        {/* SERVICES */}
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Services</Text>

        {invoice.services.map(item => (
          <View key={item.id} style={{ marginBottom: 10 }}>

            <TextInput placeholder="Service Name"
              value={item.name}
              onChangeText={(t) => updateService(item.id, 'name', t)}
              style={{ borderWidth: 1 }} />

            <TextInput placeholder="Description"
              value={item.description}
              onChangeText={(t) => updateService(item.id, 'description', t)}
              style={{ borderWidth: 1 }} />

            <TextInput placeholder="Quantity"
              value={item.quantity}
              onChangeText={(t) => updateService(item.id, 'quantity', t)}
              keyboardType="numeric"
              style={{ borderWidth: 1 }} />

            <TextInput placeholder="Unit Price"
              value={item.unitPrice}
              onChangeText={(t) => updateService(item.id, 'unitPrice', t)}
              keyboardType="numeric"
              style={{ borderWidth: 1 }} />

            <Button title="Remove" onPress={() => removeService(item.id)} />
          </View>
        ))}

        <Button title="Add Service" onPress={addService} />

        {/* PRICING */}
        <Text>Discount</Text>
        <TextInput value={invoice.discount} onChangeText={(t) => updateField('discount', t)} style={{ borderWidth: 1 }} />

        <Text>Tax</Text>
        <TextInput value={invoice.tax} onChangeText={(t) => updateField('tax', t)} style={{ borderWidth: 1 }} />

        <Text>Subtotal: {subtotal}</Text>
        <Text>Grand Total: {grandTotal}</Text>

        {/* PAYMENT */}
        <Text>Payment Terms</Text>
        <TextInput value={invoice.paymentTerms} onChangeText={(t) => updateField('paymentTerms', t)} style={{ borderWidth: 1 }} />

        <Text>Payment Method</Text>
        <TextInput value={invoice.paymentMethod} onChangeText={(t) => updateField('paymentMethod', t)} style={{ borderWidth: 1 }} />

        {/* OTHERS */}
        <Text>Signature</Text>
        <TextInput value={invoice.signature} onChangeText={(t) => updateField('signature', t)} style={{ borderWidth: 1 }} />

        <Text>Notes</Text>
        <TextInput value={invoice.notes} onChangeText={(t) => updateField('notes', t)} style={{ borderWidth: 1 }} />

        <Button title="Go to Preview" onPress={handlePreview} />

      </ScrollView>
    </SafeAreaView>
  );
}