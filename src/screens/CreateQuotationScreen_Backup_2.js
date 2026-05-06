// ======================================================
// FILE: src/screens/CreateQuotationScreen.js
// PURPOSE:
// Create / Edit Quotation Form Screen
// NOTE:
// ✔ Original state keys preserved
// ✔ Original handlers preserved
// ✔ Original navigation preserved
// ✔ UI redesigned with brand color #fd4475
// ======================================================

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { generateQuotationNumber } from '../utils/generateQuotationNumber';
import styles from './CreateQuotationScreenStyle';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const BRAND_COLOR = '#fd4475';

function SectionHeader({ icon, title, subtitle, right }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionHeaderLeft}>
        <View style={styles.sectionIconBox}>
          <Ionicons name={icon} size={20} color={BRAND_COLOR} />
        </View>

        <View style={styles.sectionTitleWrap}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.sectionSubTitle}>{subtitle}</Text>}
        </View>
      </View>

      {right ? <View style={styles.sectionHeaderRight}>{right}</View> : null}
    </View>
  );
}

function AppInput({ icon, style, inputStyle, ...props }) {
  return (
    <View style={[styles.inputWrap, style]}>
      {!!icon && <Ionicons name={icon} size={15} color="#7d8797" />}
      <TextInput
        {...props}
        placeholderTextColor="#9aa4b5"
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}

function UploadBox({ label, imageUri, onPress, imageStyle }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.uploadBox} onPress={onPress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.uploadImage, imageStyle]} resizeMode="contain" />
      ) : (
        <>
          <Ionicons name="cloud-upload-outline" size={26} color={BRAND_COLOR} />
          <Text style={styles.uploadText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function GradientButton({ title, icon, onPress, outline }) {
  if (outline) {
    return (
      <TouchableOpacity activeOpacity={0.86} style={styles.outlineButton} onPress={onPress}>
        <Ionicons name={icon} size={18} color={BRAND_COLOR} />
        <Text style={styles.outlineButtonText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.88} style={styles.gradientButtonWrap} onPress={onPress}>
      <LinearGradient
        colors={[BRAND_COLOR, '#ff6b95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientButton}
      >
        <Ionicons name={icon} size={18} color="#ffffff" />
        <Text style={styles.gradientButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================
export default function CreateQuotationScreen({ navigation, route }) {
  // ======================================================
  // STATE : INVOICE / QUOTATION DATA
  // ======================================================
  const [invoice, setInvoice] = useState({
    // Company Info
    companyName: '',
    companyAddress: '',
    companyContact: '',

    // Quotation Info
    quotationNumber: '',
    date: new Date().toISOString().split('T')[0],
    validity: '',

    // Client Info
    clientName: '',
    clientCompany: '',
    clientAddress: '',

    // Services
    services: [
      {
        id: '1',
        name: '',
        description: '',
        quantity: '1',
        unitPrice: '',
      },
    ],

    // Pricing
    discount: '',
    tax: '',

    // Payment
    paymentTerms: '',
    paymentMethod: '',
    mobilePaymentInfo: '',

    // Images
    signature: '', // keep for compatibility

    logo: null,
    logoBase64: null,

    signatureImage: null,
    signatureBase64: null,

    // Notes
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
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert('Permission required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 300 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (field === 'logo') {
        setInvoice((prev) => ({
          ...prev,
          logo: manipulated.uri,
          logoBase64: manipulated.base64,
        }));
      }

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
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      <View style={styles.screen}>
        <LinearGradient
          colors={[BRAND_COLOR, '#ff6b95', '#ffe7ef']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topHeader}
        >
          <TouchableOpacity activeOpacity={0.8} style={styles.headerIconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Quotation</Text>

          <TouchableOpacity activeOpacity={0.8} style={styles.headerIconButton} onPress={() => navigation.navigate('History')}>
            <Ionicons name="time-outline" size={21} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerWaveOne} />
          <View style={styles.headerWaveTwo} />
        </LinearGradient>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Company Information */}
          <View style={styles.card}>
            <SectionHeader
              icon="business-outline"
              title="Company Information"
              subtitle="Your business details will appear on the quotation"
              right={
                <UploadBox
                  label="Upload Logo"
                  imageUri={invoice.logo}
                  onPress={() => pickAndProcessImage('logo')}
                />
              }
            />

            <AppInput
              icon="business-outline"
              value={invoice.companyName}
              onChangeText={(t) => updateField('companyName', t)}
              placeholder="Company Name"
            />

            <AppInput
              icon="location-outline"
              value={invoice.companyAddress}
              onChangeText={(t) => updateField('companyAddress', t)}
              placeholder="Company Address"
              multiline
              style={styles.textAreaWrap}
              inputStyle={styles.textAreaInput}
            />

            <AppInput
              icon="mail-outline"
              value={invoice.companyContact}
              onChangeText={(t) => updateField('companyContact', t)}
              placeholder="Company Email & Contact"
              multiline
              style={styles.textAreaWrapSmall}
              inputStyle={styles.textAreaInput}
            />
          </View>

          {/* Bill To + Quotation Info */}
          <View style={styles.twoColumnWrap}>
            <View style={[styles.card, styles.halfCard]}>
              <SectionHeader icon="person-outline" title="Bill To" />

              <AppInput
                icon="person-outline"
                value={invoice.clientName}
                onChangeText={(t) => updateField('clientName', t)}
                placeholder="Client's Name"
              />

              <AppInput
                icon="business-outline"
                value={invoice.clientCompany}
                onChangeText={(t) => updateField('clientCompany', t)}
                placeholder="Client's Company"
              />

              <AppInput
                icon="location-outline"
                value={invoice.clientAddress}
                onChangeText={(t) => updateField('clientAddress', t)}
                placeholder="Client's Address"
                multiline
                style={styles.textAreaWrapSmall}
                inputStyle={styles.textAreaInput}
              />
            </View>

            <View style={[styles.card, styles.halfCard]}>
              <SectionHeader icon="document-text-outline" title="Quotation Info" />

              <AppInput
                icon="pricetag-outline"
                value={invoice.quotationNumber}
                onChangeText={(t) => updateField('quotationNumber', t)}
                editable={false}
                style={styles.disabledInputWrap}
                placeholder="Quotation No"
              />

              <AppInput
                icon="calendar-outline"
                value={invoice.date}
                onChangeText={(t) => updateField('date', t)}
                editable={false}
                style={styles.disabledInputWrap}
                placeholder="Date"
              />

              <AppInput
                icon="hourglass-outline"
                value={invoice.validity ? `${invoice.validity} days` : ''}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, '');
                  const num = parseInt(cleaned, 10);

                  if (cleaned === '') {
                    updateField('validity', '');
                  } else if (num >= 1 && num <= 30) {
                    updateField('validity', cleaned);
                  }
                }}
                placeholder="Validity (1-30) days"
                keyboardType="number-pad"
                maxLength={7}
              />
            </View>
          </View>

          {/* Services */}
          <View style={styles.card}>
            <View style={styles.serviceHeaderRow}>
              <View style={styles.serviceHeaderLeft}>
                <View style={styles.sectionIconBox}>
                  <Ionicons name="list-outline" size={20} color={BRAND_COLOR} />
                </View>

                <Text style={styles.sectionTitle}>Services</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addServiceBtn}
                onPress={addService}
              >
                <Ionicons name="add" size={16} color={BRAND_COLOR} />
                <Text style={styles.addServiceBtnText}>Add Service</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.serviceTable}>
              <View style={styles.tableRowHeader}>
                <Text style={[styles.th, styles.colNumber]}>#</Text>
                <Text style={[styles.th, styles.colService]}>Service</Text>
                <Text style={[styles.th, styles.colQty]}>Qty</Text>
                <Text style={[styles.th, styles.colPrice]}>Price</Text>
                <Text style={[styles.th, styles.colAction]} />
              </View>

              {invoice.services.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.td, styles.colNumber]}>{index + 1}</Text>

                  <TextInput
                    value={item.name}
                    onChangeText={(t) => updateService(item.id, 'name', t)}
                    style={[styles.inputCell, styles.colService]}
                    placeholder="Service"
                    placeholderTextColor="#9aa4b5"
                  />

                  <TextInput
                    value={item.quantity}
                    onChangeText={(t) => updateService(item.id, 'quantity', t)}
                    style={[styles.inputCell, styles.colQty, styles.qtyInput]}
                    keyboardType="numeric"
                    placeholderTextColor="#9aa4b5"
                  />

                  <TextInput
                    value={item.unitPrice}
                    onChangeText={(t) => updateService(item.id, 'unitPrice', t)}
                    style={[styles.inputCell, styles.colPrice]}
                    keyboardType="numeric"
                    placeholder="Price"
                    placeholderTextColor="#9aa4b5"
                  />

                  <TouchableOpacity style={[styles.removeBtn, styles.colAction]} onPress={() => removeService(item.id)}>
                    <Ionicons name="trash-outline" size={18} color={BRAND_COLOR} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Pricing Summary */}
          <View style={styles.card}>
            <SectionHeader icon="pie-chart-outline" title="Pricing Summary" />

            <View style={styles.pricingBox}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Subtotal</Text>
                <Text style={styles.pricingValue}>{subtotal}</Text>
              </View>

              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Discount</Text>
                <TextInput
                  value={invoice.discount}
                  onChangeText={(t) => updateField('discount', t)}
                  style={styles.priceInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#9aa4b5"
                />
              </View>

              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Tax (%)</Text>
                <TextInput
                  value={invoice.tax}
                  onChangeText={(t) => updateField('tax', t)}
                  style={styles.priceInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#9aa4b5"
                />
              </View>

              <View style={styles.pricingDivider} />

              <View style={styles.pricingRowTotal}>
                <Text style={styles.totalText}>Total Amount</Text>
                <Text style={styles.totalAmountText}>{grandTotal}</Text>
              </View>
            </View>
          </View>

          {/* Payment */}
          <View style={styles.twoColumnWrap}>
            <View style={[styles.card, styles.halfCard]}>
              <SectionHeader icon="card-outline" title="Payment Terms" />

              <AppInput
                value={invoice.paymentTerms}
                onChangeText={(t) => updateField('paymentTerms', t)}
                multiline
                placeholder="Demand or notice about pay by client"
                style={styles.paymentTextAreaWrap}
                inputStyle={styles.textAreaInput}
              />
            </View>

            <View style={[styles.card, styles.halfCard]}>
              <SectionHeader icon="wallet-outline" title="Payment Method" />

              <AppInput
                value={invoice.paymentMethod}
                onChangeText={(t) => updateField('paymentMethod', t)}
                multiline
                placeholder="Your bank info details"
                style={styles.paymentTextAreaWrap}
                inputStyle={styles.textAreaInput}
              />
            </View>
          </View>

          {/* Mobile Payment Info */}
          <View style={styles.card}>
            <SectionHeader icon="phone-portrait-outline" title="Mobile Payment Info" />

            <AppInput
              value={invoice.mobilePaymentInfo}
              onChangeText={(t) => updateField('mobilePaymentInfo', t)}
              multiline
              placeholder={`bKash: 01XXXXXXXXX\nNagad: 01XXXXXXXXX\nRocket: 01XXXXXXXXX`}
              style={styles.mobilePaymentWrap}
              inputStyle={styles.textAreaInput}
            />
          </View>

          {/* Signature */}
          <View style={styles.card}>
            <SectionHeader
              icon="create-outline"
              title="Signature"
              subtitle="Upload your signature to appear on quotation"
              right={
                <UploadBox
                  label="Upload Signature"
                  imageUri={invoice.signatureImage}
                  imageStyle={styles.signatureImage}
                  onPress={() => pickAndProcessImage('signature')}
                />
              }
            />

            {invoice.signatureImage ? (
              <View style={styles.signaturePreviewInfo}>
                <Text style={styles.signatureLine}>________________________</Text>
                <Text style={styles.signatureLabel}>Authorized Signature</Text>
              </View>
            ) : null}
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <SectionHeader icon="reader-outline" title="Notes" />

            <AppInput
              value={invoice.notes}
              onChangeText={(t) => updateField('notes', t)}
              placeholder="Write notes, terms or instructions..."
              multiline
              style={styles.notesWrap}
              inputStyle={styles.textAreaInput}
            />

            <Text style={styles.disclaimerText}>Thanks ForYour inquiry</Text>
            <Text style={styles.disclaimerText}>* This is a system generated quotation. Terms and conditions may apply.</Text>
            <Text style={styles.supportInfoText}>all support By netkib.com & kibria.net</Text>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <GradientButton title="Go to Preview" icon="eye-outline" onPress={handlePreview} />
            <GradientButton title="View History" icon="time-outline" outline onPress={() => navigation.navigate('History')} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
