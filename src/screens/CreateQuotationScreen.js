// src/screens/CreateQuotationScreen.js:



import { View, Text, TextInput, Button, ScrollView  } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateQuotationNumber } from '../utils/generateQuotationNumber';
import styles from './CreateQuotationScreenStyle';

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
mobilePaymentInfo: '', // ✅ NEW FIELD
signature: '', // ✅ will store image URI
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
        contentContainerStyle={{ paddingBottom: 350 }}
        keyboardShouldPersistTaps="handled"
      >

{/* 1111111111 */}
 {/* COMPANY */}
  {/* COMPANY HEADER (UPDATED UI) */}
  <View style={styles.headerContainer}>

    {/* LEFT SIDE - COMPANY INFO */}
    <View style={styles.companyInfo}>
      
      <Text>Company Name</Text>
      <TextInput 
        value={invoice.companyName} 
        onChangeText={(t) => updateField('companyName', t)} 
        style={styles.input}
      />

      <Text>Company Address</Text>
      <TextInput 
        value={invoice.companyAddress} 
        onChangeText={(t) => updateField('companyAddress', t)}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Text>Company Contact</Text>
      <TextInput 
        value={invoice.companyContact} 
        onChangeText={(t) => updateField('companyContact', t)} 
        style={styles.input}
      />

    </View>

    {/* RIGHT SIDE - LOGO */}
    <View style={styles.logoContainer}>
      <Text style={{ fontSize: 12, color: '#888' }}>Logo</Text>
    </View>

  </View>
{/* 2222222222  */}

{/* 3333333333 */}
{/* BILL TO + QUOTATION INFO */}
  <View style={styles.rowBetween}>

    {/* LEFT - BILL TO */}
    <View style={styles.halfBlock}>
      <Text style={styles.sectionTitle}>Bill To:</Text>

      <Text>Name</Text>
      <TextInput
        value={invoice.clientName}
        onChangeText={(t) => updateField('clientName', t)}
        style={styles.input}
      />

      <Text>Company</Text>
      <TextInput
        value={invoice.clientCompany}
        onChangeText={(t) => updateField('clientCompany', t)}
        style={styles.input}
      />

      <Text>Address</Text>
      <TextInput
        value={invoice.clientAddress}
        onChangeText={(t) => updateField('clientAddress', t)}
        style={[styles.input, { height: 60 }]}
        multiline
      />
    </View>

    {/* RIGHT - QUOTATION INFO */}
    <View style={styles.halfBlock}>
      <Text style={styles.sectionTitle}>Quotation Info:</Text>

      <Text>Quotation No</Text>
      <TextInput
        value={invoice.quotationNumber}
        onChangeText={(t) => updateField('quotationNumber', t)}
        style={styles.input}
      />

      <Text>Date</Text>
      <TextInput
        value={invoice.date}
        onChangeText={(t) => updateField('date', t)}
        style={styles.input}
      />

      <Text>Validity</Text>
      <TextInput
        value={invoice.validity}
        onChangeText={(t) => updateField('validity', t)}
        style={styles.input}
      />
    </View>

  </View>
{/* 4444444444 */}
{/* 5555555555 */}
        {/* SERVICES */}
{/* SERVICES TABLE */}
<Text style={styles.sectionTitle}>Services</Text>

<View style={styles.table}>

  {/* HEADER */}
  <View style={styles.tableRowHeader}>
    <Text style={styles.th}>#</Text>
    <Text style={styles.th}>Service</Text>
    <Text style={styles.th}>Qty</Text>
    <Text style={styles.th}>Price</Text>
  </View>

  {/* ROWS */}
  {invoice.services.map((item, index) => (
    <View key={item.id} style={styles.tableRow}>

      <Text style={styles.td}>{index + 1}</Text>

      <TextInput
        value={item.name}
        onChangeText={(t) => updateService(item.id, 'name', t)}
        style={styles.inputCell}
        placeholder="Service"
      />

      <TextInput
        value={item.quantity}
        onChangeText={(t) => updateService(item.id, 'quantity', t)}
        style={styles.inputCell}
        keyboardType="numeric"
      />

      <TextInput
        value={item.unitPrice}
        onChangeText={(t) => updateService(item.id, 'unitPrice', t)}
        style={styles.inputCell}
        keyboardType="numeric"
      />

    </View>
  ))}

</View>

<Button title="Add Service" onPress={addService} />
{/* 66666666666666 */}


        {/* PRICING */}
{/* 7777777777777777777 */}
{/* PRICING SUMMARY */}
<View style={styles.pricingContainer}>

  <View style={styles.pricingRow}>
    <Text>Subtotal:</Text>
    <Text>{subtotal}</Text>
  </View>

  <View style={styles.pricingRow}>
    <Text>Discount:</Text>
    <TextInput
      value={invoice.discount}
      onChangeText={(t) => updateField('discount', t)}
      style={styles.priceInput}
      keyboardType="numeric"
    />
  </View>

  <View style={styles.pricingRow}>
    <Text>Tax:</Text>
    <TextInput
      value={invoice.tax}
      onChangeText={(t) => updateField('tax', t)}
      style={styles.priceInput}
      keyboardType="numeric"
    />
  </View>

  <View style={styles.pricingRowTotal}>
    <Text style={{ fontWeight: 'bold' }}>Total:</Text>
    <Text style={{ fontWeight: 'bold' }}>{grandTotal}</Text>
  </View>

</View>
{/* 8888888888888 */}

{/* 999999999999999 */}
{/* PAYMENT */}
{/* PAYMENT + SIGNATURE */}

<View style={styles.paymentRow}>

  {/* LEFT - PAYMENT TERMS */}
  <View style={styles.paymentBlock}>
    <Text style={styles.sectionTitle}>Payment Terms</Text>
    <TextInput
      value={invoice.paymentTerms}
      onChangeText={(t) => updateField('paymentTerms', t)}
      style={styles.input}
      multiline
    />
  </View>

  {/* RIGHT - PAYMENT METHOD */}
  <View style={styles.paymentBlock}>
    <Text style={styles.sectionTitle}>Payment Method</Text>
    <TextInput
      value={invoice.paymentMethod}
      onChangeText={(t) => updateField('paymentMethod', t)}
      style={styles.input}
      multiline
    />
  </View>

</View>

{/* MOBILE PAYMENT INFO */}
{/* MOBILE PAYMENT INFO */}
<View style={{ marginTop: 10 }}>
  <Text style={styles.sectionTitle}>Mobile Payment Info</Text>

  <TextInput
    value={invoice.mobilePaymentInfo}
    onChangeText={(t) => updateField('mobilePaymentInfo', t)}
    style={styles.textArea}
    multiline
    placeholder={`bKash: 01XXXXXXXXX
Nagad: 01XXXXXXXXX
Rocket: 01XXXXXXXXX`}
  />
</View>

{/* SIGNATURE */}
<View style={styles.signatureContainer}>
  <Text style={{ marginBottom: 20 }}>________________________</Text>
  <Text>Authorized Signature</Text>

  <TextInput
    value={invoice.signature}
    onChangeText={(t) => updateField('signature', t)}
    style={styles.input}
    placeholder="Signature Name"
  />
</View>
{/* 10, 10, 10, 10  */}

{/* 11 11 11 11 */}
{/* FOOTER */}

<View style={styles.footerContainer}>

  <Text style={styles.disclaimerText}>Thanks ForYour inquiry</Text>
  <Text style={styles.sectionTitle}>Notes</Text>
  <TextInput
    value={invoice.notes}
    onChangeText={(t) => updateField('notes', t)}
    style={styles.textArea}
    multiline
    placeholder="Write notes, terms or instructions..."
  />

  {/* DISCLAIMER (optional future) */}
  <Text style={styles.disclaimerText}>
    * This is a system generated quotation. Terms and conditions may apply.
  </Text>

  {/* CONTACT FOOTER */}
    <Text  style={styles.supportInfoText}>
      all support By netkib.com & kibria.net
    </Text>

</View>
{/* 12 12 12 12 */}
        <Button title="Go to Preview" onPress={handlePreview} />

      </ScrollView>
    </SafeAreaView>
  );
}