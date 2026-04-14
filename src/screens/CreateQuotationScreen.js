// src/screens/CreateQuotationScreen.js:


import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateQuotationScreen({ navigation }) {

  // --- STATES ---
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyContact, setCompanyContact] = useState('');

  const [quotationNumber, setQuotationNumber] = useState(`QTN-${Date.now()}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validity, setValidity] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const [services, setServices] = useState([
    { id: '1', name: '', description: '', quantity: '1', unitPrice: '' }
  ]);

  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');

  const [paymentTerms, setPaymentTerms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [signature, setSignature] = useState('');
  const [notes, setNotes] = useState('');

  // --- FUNCTIONS ---
  const addService = () => {
    setServices([...services, {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: '1',
      unitPrice: ''
    }]);
  };

  const updateService = (id, field, value) => {
    setServices(services.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeService = (id) => {
    setServices(services.filter(item => item.id !== id));
  };

  const subtotal = services.reduce((sum, item) => {
    return sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0));
  }, 0);

  const discountValue = parseFloat(discount) || 0;
  const taxValue = parseFloat(tax) || 0;

  const grandTotal = subtotal - discountValue + taxValue;

  return (
    <SafeAreaView style={{ flex: 1 }}>

    <ScrollView
      style={{ padding: 15}}
      contentContainerStyle={{ paddingBottom: 40,
  flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >

      {/* COMPANY */}
      <Text>Company Name</Text>
      <TextInput value={companyName} onChangeText={setCompanyName} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Company Address</Text>
      <TextInput value={companyAddress} onChangeText={setCompanyAddress} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Contact</Text>
      <TextInput value={companyContact} onChangeText={setCompanyContact} style={{ borderWidth: 1, marginBottom: 10 }} />

      {/* QUOTATION */}
      <Text>Quotation Number</Text>
      <TextInput value={quotationNumber} onChangeText={setQuotationNumber} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Date</Text>
      <TextInput value={date} onChangeText={setDate} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Validity</Text>
      <TextInput value={validity} onChangeText={setValidity} style={{ borderWidth: 1, marginBottom: 10 }} />

      {/* CLIENT */}
      <Text>Client Name</Text>
      <TextInput value={clientName} onChangeText={setClientName} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Client Company</Text>
      <TextInput value={clientCompany} onChangeText={setClientCompany} style={{ borderWidth: 1, marginBottom: 10 }} />

      <Text>Client Address</Text>
      <TextInput value={clientAddress} onChangeText={setClientAddress} style={{ borderWidth: 1, marginBottom: 10 }} />

      {/* SERVICES */}
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Services</Text>

      {services.map((item) => (
        <View key={item.id} style={{ marginBottom: 10 }}>
          <TextInput placeholder="Service Name" value={item.name}
            onChangeText={(text) => updateService(item.id, 'name', text)}
            style={{ borderWidth: 1, marginBottom: 5 }} />

          <TextInput placeholder="Description" value={item.description}
            onChangeText={(text) => updateService(item.id, 'description', text)}
            style={{ borderWidth: 1, marginBottom: 5 }} />

          <TextInput placeholder="Quantity" keyboardType="numeric" value={item.quantity}
            onChangeText={(text) => updateService(item.id, 'quantity', text)}
            style={{ borderWidth: 1, marginBottom: 5 }} />

          <TextInput placeholder="Unit Price" keyboardType="numeric" value={item.unitPrice}
            onChangeText={(text) => updateService(item.id, 'unitPrice', text)}
            style={{ borderWidth: 1, marginBottom: 5 }} />

          <Button title="Remove" onPress={() => removeService(item.id)} />
        </View>
      ))}

      <Button title="Add Service" onPress={addService} />

      {/* PRICING */}
      <Text style={{ marginTop: 10 }}>Discount</Text>
      <TextInput value={discount} onChangeText={setDiscount} keyboardType="numeric" style={{ borderWidth: 1 }} />

      <Text>Tax</Text>
      <TextInput value={tax} onChangeText={setTax} keyboardType="numeric" style={{ borderWidth: 1 }} />

      <Text>Subtotal: {subtotal}</Text>
      <Text>Grand Total: {grandTotal}</Text>

      {/* PAYMENT */}
      <Text>Payment Terms</Text>
      <TextInput value={paymentTerms} onChangeText={setPaymentTerms} style={{ borderWidth: 1 }} />

      <Text>Payment Method</Text>
      <TextInput value={paymentMethod} onChangeText={setPaymentMethod} style={{ borderWidth: 1 }} />

      {/* OTHERS */}
      <Text>Signature</Text>
      <TextInput value={signature} onChangeText={setSignature} style={{ borderWidth: 1 }} />

      <Text>Notes</Text>
      <TextInput value={notes} onChangeText={setNotes} style={{ borderWidth: 1 }} />

      <Button
        title="Go to Preview"
        onPress={() =>
          navigation.navigate('Preview', {
            companyName,
            companyAddress,
            companyContact,
            quotationNumber,
            date,
            validity,
            clientName,
            clientCompany,
            clientAddress,
            services,
            subtotal,
            discount: discountValue,
            tax: taxValue,
            grandTotal,
            paymentTerms,
            paymentMethod,
            signature,
            notes
          })
        }
      />

    </ScrollView>
    </SafeAreaView>
  );
}