// ======================================================
// FILE: src/screens/CreateQuotationScreen.js
// PURPOSE:
// Create / Edit Quotation Form Screen
// NOTE:
// ✔ No logic changed
// ✔ No action changed
// ✔ Only cleaned formatting + comments + structure
// ======================================================

import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';

import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { generateQuotationNumber } from '../utils/generateQuotationNumber';
import styles from './CreateQuotationScreenStyle';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


// ======================================================
// MAIN COMPONENT
// ======================================================
export default function CreateQuotationScreen({ navigation, route }) {

  // ======================================================
  // STATE : INVOICE / QUOTATION DATA
  // ======================================================
  const [invoice, setInvoice] = useState({

    // ------------------------------
    // Company Info
    // ------------------------------
    companyName: '',
    companyAddress: '',
    companyContact: '',

    // ------------------------------
    // Quotation Info
    // ------------------------------
    quotationNumber: '',
    date: new Date().toISOString().split('T')[0],
    validity: '',

    // ------------------------------
    // Client Info
    // ------------------------------
    clientName: '',
    clientCompany: '',
    clientAddress: '',

    // ------------------------------
    // Services
    // ------------------------------
    services: [
      {
        id: '1',
        name: '',
        description: '',
        quantity: '1',
        unitPrice: '',
      },
    ],

    // ------------------------------
    // Pricing
    // ------------------------------
    discount: '',
    tax: '',

    // ------------------------------
    // Payment
    // ------------------------------
    paymentTerms: '',
    paymentMethod: '',
    mobilePaymentInfo: '',

    // ------------------------------
    // Images
    // ------------------------------
    signature: '', // keep for compatibility

    logo: null,
    logoBase64: null,

    signatureImage: null,
    signatureBase64: null,

    // ------------------------------
    // Notes
    // ------------------------------
    notes: '',
  });


  // ======================================================
  // AUTO GENERATE QUOTATION NUMBER
  // ======================================================
  useEffect(() => {
    const init = async () => {
      const number = await generateQuotationNumber();

      setInvoice((prev) => ({
        ...prev,
        quotationNumber: number,
      }));
    };

    init();
  }, []);


  // ======================================================
  // EDIT MODE : LOAD EXISTING DATA
  // ======================================================
  useEffect(() => {
    if (route?.params?.editData) {
      setInvoice(route.params.editData);
    }
  }, [route?.params]);


  // ======================================================
  // UPDATE SINGLE FIELD
  // ======================================================
  const updateField = (key, value) => {
    setInvoice((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  // ======================================================
  // IMAGE PICKER + RESIZE + SAVE
  // ======================================================
  const pickAndProcessImage = async (field) => {
    try {
      // Permission request
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert('Permission required!');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      // Resize + Compress
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 300 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      // Save logo
      if (field === 'logo') {
        setInvoice((prev) => ({
          ...prev,
          logo: manipulated.uri,
          logoBase64: manipulated.base64,
        }));
      }

      // Save signature
      if (field === 'signature') {
        setInvoice((prev) => ({
          ...prev,
          signatureImage: manipulated.uri,
          signatureBase64: manipulated.base64,
        }));
      }

    } catch (err) {
      console.log(err);
    }
  };


  // ======================================================
  // UPDATE SERVICE ITEM
  // ======================================================
  const updateService = (id, field, value) => {
    const updated = invoice.services.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );

    setInvoice((prev) => ({
      ...prev,
      services: updated,
    }));
  };


  // ======================================================
  // ADD NEW SERVICE ROW
  // ======================================================
  const addService = () => {
    setInvoice((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          id: Date.now().toString(),
          name: '',
          description: '',
          quantity: '1',
          unitPrice: '',
        },
      ],
    }));
  };


  // ======================================================
  // REMOVE SERVICE ROW
  // ======================================================
  const removeService = (id) => {
    setInvoice((prev) => ({
      ...prev,
      services: prev.services.filter((item) => item.id !== id),
    }));
  };


  // ======================================================
  // PRICE CALCULATION
  // ======================================================
  const subtotal = invoice.services.reduce((sum, item) => {
    return (
      sum +
      ((parseFloat(item.quantity) || 0) *
        (parseFloat(item.unitPrice) || 0))
    );
  }, 0);

  const discountValue = parseFloat(invoice.discount) || 0;
  const taxValue = parseFloat(invoice.tax) || 0;

  const grandTotal = subtotal - discountValue + taxValue;


  // ======================================================
  // GO TO PREVIEW SCREEN
  // ======================================================
  const handlePreview = () => {
    navigation.navigate('Preview', {
      ...invoice,
      subtotal,
      discount: discountValue,
      tax: taxValue,
      grandTotal,
    });
  };


  // ======================================================
  // UI START
  // ======================================================
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView
        style={{ padding: 15 }}
        contentContainerStyle={{ paddingBottom: 350 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ================================================== */}
        {/* SECTION 1 : COMPANY INFO + LOGO */}
        {/* ================================================== */}
        
        {/* <Text style={styles.sectionSubTitle}>Name / Address / Contact / Logo </Text> */}
        <Text style={styles.sectionTitle}>Your Company Information:</Text>
        
        <View style={styles.headerContainer}>

          {/* Left Side : Company Info */}
          <View style={styles.companyInfo}>

            {/* <Text style={styles.inputFieldTitle}>Company Name</Text> */}
            <TextInput
              value={invoice.companyName}
              onChangeText={(t) => updateField('companyName', t)}
              placeholder="Company Name"
              placeholderTextColor="#9fbddc"
              style={styles.input}
            />

            {/* <Text style={styles.inputFieldTitle}>Company Address</Text> */}
            <TextInput
              value={invoice.companyAddress}
              onChangeText={(t) => updateField('companyAddress', t)}
              placeholder="Company Address"
              placeholderTextColor="#9fbddc"
              style={[styles.input, { height: 70,textAlignVertical: 'top', }]}
              multiline
            />

            {/* <Text style={styles.inputFieldTitle}>Company Email & Contact</Text> */}
            <TextInput
              value={invoice.companyContact}
              onChangeText={(t) => updateField('companyContact', t)}
              placeholder="Company Email & Contact"
              placeholderTextColor="#9fbddc"
              style={[styles.input, { height: 60,textAlignVertical: 'top', }]}
              multiline
            />

          </View>


          {/* Right Side : Logo Upload */}
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={() => pickAndProcessImage('logo')}
          >
            {invoice.logo ? (
              <Image
                source={{ uri: invoice.logo }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ fontSize: 12, color: '#9fbddc',textAlign:'center' }}>
                Company Upload Logo
              </Text>
            )}
          </TouchableOpacity>

        </View>


        {/* ================================================== */}
        {/* SECTION 2 : BILL TO + QUOTATION INFO */}
        {/* ================================================== */}
        <View style={styles.rowBetween}>

          {/* Bill To */}
          <View style={styles.halfBlock}>

            <Text style={styles.sectionTitle}>Bill To:</Text>

            {/* <Text style={styles.inputFieldTitle}>Name</Text> */}
            <TextInput
              value={invoice.clientName}
              onChangeText={(t) => updateField('clientName', t)}
              placeholder="Client's Name"
              placeholderTextColor="#9fbddc"
              style={styles.input}
            />

            {/* <Text style={styles.inputFieldTitle}>Company</Text> */}
            <TextInput
              value={invoice.clientCompany}
              onChangeText={(t) => updateField('clientCompany', t)}
              placeholder="Client's Company"
              placeholderTextColor="#9fbddc"
              style={styles.input}
            />

            {/* <Text style={styles.inputFieldTitle}>Address</Text> */}
            <TextInput
              value={invoice.clientAddress}
              onChangeText={(t) => updateField('clientAddress', t)}
              placeholder="Client's Address"
              placeholderTextColor="#9fbddc"
              style={[styles.input, { height: 60,textAlignVertical: 'top', }]}
              multiline
            />
          </View>


          {/* Quotation Info */}
          <View style={styles.halfBlock}>

            <Text style={styles.sectionTitle}>Quotation Info:</Text>

            {/* <Text style={styles.inputFieldTitle}>Quotation No</Text> */}
            <TextInput
              value={invoice.quotationNumber}
              onChangeText={(t) => updateField('quotationNumber', t)}
              editable={false}
              style={styles.input}
            />

            {/* <Text style={styles.inputFieldTitle}>Date</Text> */}
            <TextInput
              value={invoice.date}
              onChangeText={(t) => updateField('date', t)}
              editable={false}
              style={styles.input}
            />

            <Text style={styles.inputFieldTitle}>Validity</Text>
            {/* <TextInput
              value={invoice.validity}
              onChangeText={(t) => updateField('validity', t)}
              placeholder="Validity"
              placeholderTextColor="#9fbddc"
              style={styles.input}
            /> */}
            <TextInput
              // ভ্যালু দেখানোর সময় যদি সংখ্যা থাকে তবে তার সাথে ' days' যোগ হবে
              value={invoice.validity ? `${invoice.validity} days` : ''}
              
              onChangeText={(t) => {
                // ১. শুধুমাত্র সংখ্যা রাখার জন্য (অন্যান্য ক্যারেক্টার রিমুভ করবে)
                // শুধুমাত্র সংখ্যা বের করে নেওয়া (যাতে 'days' লেখাটি ডাটায় না ঢুকে যায়)
                const cleaned = t.replace(/[^0-9]/g, '');
                // ২. সংখ্যাটিকে ইন্টিজারে রূপান্তর
                const num = parseInt(cleaned, 10);
              // ৩. কন্ডিশন: যদি খালি থাকে তবে আপডেট হবে (ইউজার মুছে দিতে চাইলে)
                // অথবা যদি সংখ্যাটি ১ থেকে ৩০ এর মধ্যে হয় তবেই আপডেট হবে
                if (cleaned === '') {
                  updateField('validity', '');
                } else if (num >= 1 && num <= 30) {
                  updateField('validity', cleaned); // শুধুমাত্র সংখ্যাটি সেভ হবে
                }
              }}
              placeholder="Validity (1-30) days"
              placeholderTextColor="#9fbddc"
              style={styles.input}
              keyboardType="number-pad"
              maxLength={7} // '30 days' লিখতে মোট ৭টি ক্যারেক্টার লাগে, তাই এটি বাড়িয়ে দিন
            />

          </View>

        </View>

        {/* ================================================== */}
        {/* SECTION 3 : SERVICES */}
        {/* ================================================== */}
        <View style={styles.serviceHeaderRow}>
          <Text style={styles.sectionTitle}>Services</Text>
          
          <TouchableOpacity style={styles.addServiceBtn} onPress={addService}>
            <Text style={styles.addServiceBtnText}>+ Add Service</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceTable}>
          {/* Header */}
          <View style={styles.tableRowHeader}>
            <Text style={[styles.th, { flex: 0.3 }]}>#</Text>
            <Text style={[styles.th, { flex: 2 }]}>Service</Text>
            <Text style={[styles.th, { flex: 0.5 }]}>Qty</Text>
            <Text style={[styles.th, { flex: 1.4 }]}>Price</Text>
            <Text style={[styles.th, { width: 30 }]}></Text>
          </View>

          {/* Rows */}
          {invoice.services.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 0.3 }]}>{index + 1}</Text>

              <TextInput
                value={item.name}
                onChangeText={(t) => updateService(item.id, 'name', t)}
                style={[styles.inputCell, { flex: 2 }]}
                placeholder="Service"
                placeholderTextColor="#9fbddc"
              />

              <TextInput
                value={item.quantity}
                onChangeText={(t) => updateService(item.id, 'quantity', t)}
                style={[styles.inputCell, { flex: 0.5, textAlign: 'center' }]}
                keyboardType="numeric"
              />

              <TextInput
                value={item.unitPrice}
                onChangeText={(t) => updateService(item.id, 'unitPrice', t)}
                style={[styles.inputCell, { flex: 1.4, textAlign: 'left' }]}
                keyboardType="numeric"
              />

              <TouchableOpacity 
                style={styles.removeBtn} 
                onPress={() => removeService(item.id)}
              >
                <Text style={styles.removeBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ================================================== */}
        {/* SECTION 4 : PRICE SUMMARY */}
        {/* ================================================== */}
        <View style={styles.pricingContainer}>
          <View style={styles.pricingRow}>
            <Text style={styles.td}>Subtotal:</Text>
            <Text style={[styles.td, { fontWeight: 'bold' }]}>{subtotal}</Text>
          </View>

          <View style={styles.pricingRow}>
            <Text style={styles.td}>Discount:</Text>
            <TextInput
              value={invoice.discount}
              onChangeText={(t) => updateField('discount', t)}
              style={styles.priceInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.pricingRow}>
            <Text style={styles.td}>Tax (%):</Text>
            <TextInput
              value={invoice.tax}
              onChangeText={(t) => updateField('tax', t)}
              style={styles.priceInput}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.pricingRowTotal}>
            <Text style={styles.totalText}>Total Amount:</Text>
            <Text style={styles.totalAmountText}>{grandTotal}</Text>
          </View>
        </View>

        {/* ================================================== */}
        {/* SECTION 5 : PAYMENT */}
        {/* ================================================== */}
        <View style={styles.paymentRow}>

          {/* Payment Terms */}
          <View style={styles.paymentBlock}>
            <Text style={styles.sectionTitle}>
              Payment Terms
            </Text>

            <TextInput
              value={invoice.paymentTerms}
              onChangeText={(t) =>
                updateField('paymentTerms', t)
              }
              style={[styles.input, { height: 60, fontSize:12,textAlignVertical: 'top', }]}
              multiline
              placeholder={`Demand or Notice about pay by client`}
              placeholderTextColor="#9fbddc"
            />
          </View>


          {/* Payment Method */}
          <View style={styles.paymentBlock}>
            <Text style={styles.sectionTitle}>
              Payment Method
            </Text>

            <TextInput
              value={invoice.paymentMethod}
              onChangeText={(t) =>
                updateField('paymentMethod', t)
              }
              style={[styles.input, { height: 60, fontSize:12,textAlignVertical: 'top' }]}
              multiline
              placeholder={`Your Bank Info Details`}
              placeholderTextColor="#9fbddc"
            />
          </View>

        </View>


        {/* ================================================== */}
        {/* SECTION 6 : MOBILE PAYMENT INFO */}
        {/* ================================================== */}
        <View style={{ marginTop: 10 }}>

          <Text style={styles.sectionTitle}>
            Mobile Payment Info
          </Text>

          <TextInput
            value={invoice.mobilePaymentInfo}
            onChangeText={(t) =>
              updateField('mobilePaymentInfo', t)
            }
            // style={styles.textArea}
            style={[styles.input, { height: 80, fontSize:12,textAlignVertical: 'top' }]}
            multiline
            placeholderTextColor="#9fbddc"
            placeholder={`bKash: 01XXXXXXXXX
Nagad: 01XXXXXXXXX
Rocket: 01XXXXXXXXX`}
          />

        </View>


        {/* ================================================== */}
        {/* SECTION 7 : SIGNATURE */}
        {/* ================================================== */}
        <View style={styles.signatureContainer}>

          <TouchableOpacity
            onPress={() => pickAndProcessImage('signature')}
          >
            {invoice.signatureImage ? (
              <Image
                source={{ uri: invoice.signatureImage }}
                style={{ width: 120, height: 60 }}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.signatureBox}>
                <Text style={{ fontSize: 10, color: '#9fbddc',textAlign:'center' }}>
                  Upload Signature
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={{ marginBottom:0, color: '#419dff',marginTop:'-10', }}>
            ________________________
          </Text>

          <Text  style={{color: '#419dff'}} >Authorized Signature</Text>


        </View>


        {/* ================================================== */}
        {/* SECTION 8 : FOOTER + NOTES */}
        {/* ================================================== */}
        <View style={styles.footerContainer}>

          <Text style={styles.disclaimerText}>
            Thanks ForYour inquiry
          </Text>

          <Text style={styles.sectionTitle}>Notes</Text>

          <TextInput
            value={invoice.notes}
            onChangeText={(t) => updateField('notes', t)}
            placeholder="Write notes, terms or instructions..."
            placeholderTextColor="#9fbddc"
            style={[styles.input, { height: 70,textAlignVertical: 'top', }]}
            multiline
          />

          <Text style={styles.disclaimerText}>
            * This is a system generated quotation.
            Terms and conditions may apply.
          </Text>

          <Text style={styles.supportInfoText}>
            all support By netkib.com & kibria.net
          </Text>

        </View>


        {/* ================================================== */}
        {/* SECTION 9 : ACTION BUTTONS */}
        {/* ================================================== */}
        <Button
          title="Go to Preview"
          onPress={handlePreview}
        />

        <View style={{ height: 10 }} />

        <Button
          title="View History"
          onPress={() => navigation.navigate('History')}
        />

      </ScrollView>
    </SafeAreaView>
  );
}