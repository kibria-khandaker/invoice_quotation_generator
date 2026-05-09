// src/screens/InvoicePreviewScreen.js

// ======================================================
// INVOICE SIDE PREVIEW SCREEN
// PHASE: BASIC PREVIEW + ACTION POLISH
//
// IMPORTANT:
// - This screen is only for Invoice preview.
// - Quotation PreviewScreen.js is not imported or edited.
// - Save/PDF real logic will be added later.
// ======================================================

import React, { useMemo } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text as RNText,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as Sharing from 'expo-sharing';

import styles from './InvoicePreviewScreenStyle';
import { saveInvoice } from '../services/storageService';
import { generateInvoicePDF } from '../services/pdfService';

const BRAND_COLOR = '#fd4475';

// ======================================================
// INVOICE SIDE PREVIEW FONT CONTROL
// Keeps preview typography stable on Android/system font scale.
// ======================================================
function Text(props) {
  return (
    <RNText
      {...props}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
    />
  );
}

const PAYMENT_STATUS_META = {
  unpaid: {
    label: 'Unpaid',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  partiallyPaid: {
    label: 'Partially Paid',
    color: '#c2410c',
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  mostlyPaid: {
    label: 'Mostly Paid',
    color: '#d97706',
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  paid: {
    label: 'Paid',
    color: '#16a34a',
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
};

const formatMoney = (value) => {
  const number = parseFloat(value);

  if (Number.isNaN(number)) {
    return '0';
  }

  return number.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const getInvoiceItems = (invoiceData = {}) => {
  const items = invoiceData.invoiceItems || invoiceData.items || [];
  return Array.isArray(items) ? items : [];
};

const calculateItemTotal = (item = {}) => {
  const quantity = parseFloat(item.quantity || 0);
  const unitPrice = parseFloat(item.unitPrice || 0);

  const safeQuantity = Number.isNaN(quantity) ? 0 : quantity;
  const safeUnitPrice = Number.isNaN(unitPrice) ? 0 : unitPrice;

  return safeQuantity * safeUnitPrice;
};

const getImageUri = (uri, base64) => {
  if (uri) return uri;

  if (base64) {
    if (String(base64).startsWith('data:image')) {
      return base64;
    }

    return `data:image/jpeg;base64,${base64}`;
  }

  return null;
};

// ======================================================
// INVOICE SIDE FINAL VALIDATION HELPERS
// NEW:
// Used before Save Invoice and Generate PDF.
// Draft save remains handled from CreateInvoiceScreen.
// Quotation side validation is not touched.
// ======================================================
const safeTrim = (value) => {
  return String(value || '').trim();
};

const isValidInvoiceItemForFinal = (item) => {
  const name = safeTrim(item?.name);
  const description = safeTrim(item?.description);
  const quantity = parseFloat(item?.quantity);
  const unitPrice = parseFloat(item?.unitPrice);

  const hasItemText = Boolean(name || description);
  const hasValidQuantity = !Number.isNaN(quantity) && quantity > 0;
  const hasValidPrice = !Number.isNaN(unitPrice) && unitPrice > 0;

  return hasItemText && hasValidQuantity && hasValidPrice;
};

const buildInvoiceFinalValidationIssues = (invoiceData = {}) => {
  const issues = [];

  if (!safeTrim(invoiceData.companyName)) {
    issues.push('Company Name is required.');
  }

  if (!safeTrim(invoiceData.clientName) && !safeTrim(invoiceData.clientCompany)) {
    issues.push('Client Name or Client Company is required.');
  }

  const validItems = getInvoiceItems(invoiceData).filter(
    isValidInvoiceItemForFinal
  );

  if (validItems.length === 0) {
    issues.push('At least one valid item with name/description, quantity, and price is required.');
  }

  const totalAmount = parseFloat(
    invoiceData.totalAmount ?? invoiceData.grandTotal ?? 0
  ) || 0;

  if (totalAmount <= 0) {
    issues.push('Total Amount must be greater than 0.');
  }

  return issues;
};

const formatValidationIssues = (issues = []) => {
  return issues.map((item, index) => `${index + 1}. ${item}`).join('\n');
};

export default function InvoicePreviewScreen({ navigation, route }) {
  const invoiceData = route?.params?.invoiceData || {};

  // ======================================================
  // INVOICE SIDE PREVIEW SOURCE FLAG
  // NEW:
  // If preview opened from History, Edit icon should open
  // CreateInvoice edit mode. Otherwise it should go back.
  // ======================================================
  const fromHistory = Boolean(route?.params?.fromHistory);

  const invoiceItems = useMemo(() => {
    return getInvoiceItems(invoiceData);
  }, [invoiceData]);

  const subtotal = invoiceData.subtotal || 0;
  const discountAmount = invoiceData.discountAmount || 0;
  const taxAmount = invoiceData.taxAmount || 0;

  const totalAmount =
    invoiceData.totalAmount !== undefined
      ? invoiceData.totalAmount
      : invoiceData.grandTotal || 0;

  const paidAmount = invoiceData.paidAmount || 0;
  const dueAmount = invoiceData.dueAmount || 0;

  const paymentStatusKey =
    invoiceData.paymentStatus ||
    invoiceData.status ||
    'unpaid';

  const paymentStatusMeta =
    PAYMENT_STATUS_META[paymentStatusKey] || PAYMENT_STATUS_META.unpaid;

  const logoPreviewUri = getImageUri(
    invoiceData.logo,
    invoiceData.logoBase64
  );

  const signaturePreviewUri = getImageUri(
    invoiceData.signatureImage,
    invoiceData.signatureBase64
  );

// ======================================================
// INVOICE SIDE VALIDATION ALERT
// NEW:
// Used by Save Invoice and Generate PDF.
// Gives user a direct edit option.
// ======================================================
const showFinalValidationAlert = (validationIssues = []) => {
  Alert.alert(
    'Incomplete Invoice',
    `Please fix these before saving or generating PDF:\n\n${formatValidationIssues(
      validationIssues
    )}`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Go Edit',
        onPress: () => {
          if (fromHistory) {
            navigation.navigate('CreateInvoice', {
              editData: invoiceData,
              isSaved: true,
              fromHistory: true,
            });

            return;
          }

          navigation.goBack();
        },
      },
    ]
  );
};

// ======================================================
// INVOICE SIDE FINAL SAVE ACTION
// EDIT:
// Save Invoice now validates final/ready invoice data.
// Incomplete invoices should be saved as Draft from CreateInvoiceScreen.
// ======================================================
const handleSaveInvoice = () => {
  const validationIssues = buildInvoiceFinalValidationIssues(invoiceData);

  if (validationIssues.length > 0) {
    showFinalValidationAlert(validationIssues);
    return;
  }

  Alert.alert(
    'Save Invoice',
    'Do you want to save this invoice as final/ready?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Save Invoice',
        onPress: async () => {
          const success = await saveInvoice(invoiceData, 'saved');

          if (success) {
            Alert.alert('Saved', 'Invoice saved successfully.', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('InvoiceHistory'),
              },
            ]);
          } else {
            Alert.alert('Error', 'Invoice could not be saved.');
          }
        },
      },
    ]
  );
};

// ======================================================
// INVOICE SIDE PDF ACTION
// EDIT:
// Generate PDF now validates final/ready invoice data.
// This prevents empty/incomplete invoice PDF generation.
// ======================================================
const handleGeneratePDF = async () => {
  const validationIssues = buildInvoiceFinalValidationIssues(invoiceData);

  if (validationIssues.length > 0) {
    showFinalValidationAlert(validationIssues);
    return;
  }

  try {
    const uri = await generateInvoicePDF(invoiceData);

    const sharingAvailable = await Sharing.isAvailableAsync();

    if (sharingAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Share Invoice ${invoiceData.invoiceNumber || ''}`,
      });
    } else {
      Alert.alert('PDF Ready', `PDF file saved at: ${uri}`);
    }
  } catch (error) {
    console.log('Invoice PDF Generation Error:', error);
    Alert.alert('PDF Error', 'Invoice PDF could not be generated.');
  }
};

// ======================================================
// INVOICE SIDE PREVIEW EDIT ACTION
// EDIT:
// - CreateInvoice → Preview: Edit icon goes back to form.
// - History → Preview: Edit icon opens CreateInvoice edit mode.
// This keeps saved invoice ID and prevents duplicate records.
// ======================================================
const handleEditInvoice = () => {
  if (fromHistory) {
    navigation.navigate('CreateInvoice', {
      editData: invoiceData,
      isSaved: true,
      fromHistory: true,
    });

    return;
  }

  navigation.goBack();
};


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      <LinearGradient
        colors={[BRAND_COLOR, '#ff74a0', '#fff3f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Invoice Preview</Text>
            <Text style={styles.headerSubtitle}>
              Review invoice details before saving
            </Text>
          </View>

          {/* ======================================================
              INVOICE SIDE PREVIEW EDIT ACTION
              EDIT:
              Top-right icon now works as Edit Invoice action.
          ====================================================== */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.headerIconButton}
            onPress={handleEditInvoice}
          >
            <Ionicons name="create-outline" size={23} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================================
            INVOICE SIDE PREVIEW DOCUMENT HEADER
        ====================================================== */}
        <View style={[styles.card, styles.firstCard]}>
          <View style={styles.documentTopRow}>
            <View style={styles.documentTitleArea}>
              <Text style={styles.documentTitle}>INVOICE</Text>
              <Text style={styles.documentNumber}>
                {invoiceData.invoiceNumber || 'INVOICE-DRAFT'}
              </Text>
            </View>

            {/* ======================================================
                INVOICE SIDE LOGO PREVIEW
                NEW:
                Show company logo in invoice preview when available.
            ====================================================== */}
            {logoPreviewUri ? (
              <View style={styles.logoPreviewBox}>
                <Image
                  source={{ uri: logoPreviewUri }}
                  style={styles.logoPreviewImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={styles.logoPlaceholderBox}>
                <Ionicons name="business-outline" size={22} color={BRAND_COLOR} />
              </View>
            )}
          </View>

          <View style={styles.metaStatusRow}>
            <View style={styles.infoGridCompact}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Invoice Date</Text>
                <Text style={styles.infoValue}>
                  {invoiceData.invoiceDate || '-'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Due Date</Text>
                <Text style={styles.infoValue}>
                  {invoiceData.dueDate || '-'}
                </Text>
              </View>
            </View>
          </View>

          {/* ======================================================
              INVOICE SIDE REFERENCE + STATUS ROW
              EDIT:
              Reference Quotation and calculated Payment Status
              are now shown side by side in Invoice Preview.
              Quotation Preview screen is not touched.
          ====================================================== */}
          <View style={styles.referenceStatusRow}>
            {!!invoiceData.referenceQuotationNumber && (
              <View style={styles.referenceBoxInline}>
                <Text style={styles.referenceLabel}>Reference Quotation</Text>
                <Text style={styles.referenceValue}>
                  {invoiceData.referenceQuotationNumber}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.statusBadgeInline,
                {
                  backgroundColor: paymentStatusMeta.backgroundColor,
                  borderColor: paymentStatusMeta.borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: paymentStatusMeta.color },
                ]}
              >
                {invoiceData.paymentStatusLabel || paymentStatusMeta.label}
              </Text>
            </View>
          </View>

        </View>

        {/* ======================================================
            INVOICE SIDE COMPANY + CLIENT PREVIEW
        ====================================================== */}
        <View style={styles.card}>
          <View style={styles.twoColumnRow}>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>From</Text>
              <Text style={styles.partyTitle}>
                {invoiceData.companyName || 'Company Name'}
              </Text>

              {!!invoiceData.companyAddress && (
                <Text style={styles.partyText}>
                  {invoiceData.companyAddress}
                </Text>
              )}

              {!!invoiceData.companyEmail && (
                <Text style={styles.partyText}>
                  {invoiceData.companyEmail}
                </Text>
              )}

              {!!invoiceData.companyPhone && (
                <Text style={styles.partyText}>
                  {invoiceData.companyPhone}
                </Text>
              )}
            </View>

            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>Bill To</Text>
              <Text style={styles.partyTitle}>
                {invoiceData.clientName || 'Client Name'}
              </Text>

              {!!invoiceData.clientCompany && (
                <Text style={styles.partyText}>
                  {invoiceData.clientCompany}
                </Text>
              )}

              {!!invoiceData.clientEmail && (
                <Text style={styles.partyText}>
                  {invoiceData.clientEmail}
                </Text>
              )}

              {!!invoiceData.clientPhone && (
                <Text style={styles.partyText}>
                  {invoiceData.clientPhone}
                </Text>
              )}

              {!!invoiceData.clientAddress && (
                <Text style={styles.partyText}>
                  {invoiceData.clientAddress}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* ======================================================
            INVOICE SIDE ITEMS PREVIEW
        ====================================================== */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="cube-outline" size={20} color={BRAND_COLOR} />
            </View>

            <Text style={styles.sectionTitle}>Invoice Items</Text>
          </View>

          {invoiceItems.length === 0 ? (
            <View style={styles.emptyItemsBox}>
              <Text style={styles.emptyItemsText}>No invoice items added.</Text>
            </View>
          ) : (
            invoiceItems.map((item, index) => (
              <View key={item.id || `${index}`} style={styles.itemPreviewRow}>
                <View style={styles.itemPreviewLeft}>
                  <Text style={styles.itemPreviewTitle}>
                    {index + 1}. {item.name || 'Untitled Item'}
                  </Text>

                  {!!item.description && (
                    <Text style={styles.itemPreviewDescription}>
                      {item.description}
                    </Text>
                  )}

                  <Text style={styles.itemPreviewMeta}>
                    {item.quantity || '0'} × {formatMoney(item.unitPrice || 0)}
                  </Text>
                </View>

                <Text style={styles.itemPreviewAmount}>
                  {formatMoney(calculateItemTotal(item))}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* ======================================================
            INVOICE SIDE SUMMARY PREVIEW
        ====================================================== */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="pie-chart-outline" size={20} color={BRAND_COLOR} />
            </View>

            <Text style={styles.sectionTitle}>Pricing Summary</Text>
          </View>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatMoney(subtotal)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>
                {formatMoney(discountAmount)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Tax ({invoiceData.taxPercentage || 0}%)
              </Text>
              <Text style={styles.summaryValue}>
                {formatMoney(taxAmount)}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>
                {formatMoney(totalAmount)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Paid Amount</Text>
              <Text style={styles.summaryValue}>
                {formatMoney(paidAmount)}
              </Text>
            </View>

            <View style={styles.dueRow}>
              <Text style={styles.dueLabel}>Due Amount</Text>
              <Text style={styles.dueValue}>
                {formatMoney(dueAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* ======================================================
            INVOICE SIDE PAYMENT + NOTES PREVIEW
        ====================================================== */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="wallet-outline" size={20} color={BRAND_COLOR} />
            </View>

            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>

          {!!invoiceData.paymentTerms && (
            <View style={styles.textBlock}>
              <Text style={styles.textBlockLabel}>Payment Terms</Text>
              <Text style={styles.textBlockValue}>
                {invoiceData.paymentTerms}
              </Text>
            </View>
          )}

          {!!invoiceData.paymentMethod && (
            <View style={styles.textBlock}>
              <Text style={styles.textBlockLabel}>Payment Method</Text>
              <Text style={styles.textBlockValue}>
                {invoiceData.paymentMethod}
              </Text>
            </View>
          )}

          {!!invoiceData.mobilePaymentInfo && (
            <View style={styles.textBlock}>
              <Text style={styles.textBlockLabel}>Mobile Payment Info</Text>
              <Text style={styles.textBlockValue}>
                {invoiceData.mobilePaymentInfo}
              </Text>
            </View>
          )}

          {!!invoiceData.notes && (
            <View style={styles.textBlock}>
              <Text style={styles.textBlockLabel}>Notes</Text>
              <Text style={styles.textBlockValue}>
                {invoiceData.notes}
              </Text>
            </View>
          )}
        </View>

        {/* ======================================================
            INVOICE SIDE SIGNATURE PREVIEW
            NEW:
            Show selected/uploaded signature image in preview.
        ====================================================== */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBox}>
              <Ionicons name="create-outline" size={20} color={BRAND_COLOR} />
            </View>

            <Text style={styles.sectionTitle}>Signature</Text>
          </View>

          <View style={styles.signaturePreviewBox}>
            {signaturePreviewUri ? (
              <Image
                source={{ uri: signaturePreviewUri }}
                style={styles.signaturePreviewImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.signaturePlaceholderText}>
                No signature added.
              </Text>
            )}
          </View>

          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Authorized Signature</Text>
        </View>

        {/* ======================================================
            INVOICE SIDE PREVIEW BOTTOM ACTIONS
            EDIT:
            Left = Save Later alert
            Right = Generate PDF placeholder
        ====================================================== */}
        <View style={styles.actionRow}>
  
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.outlineButton}
            onPress={handleSaveInvoice}
          >
            <Ionicons name="save-outline" size={18} color={BRAND_COLOR} />
            <Text style={styles.outlineButtonText}>Save Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.primaryButton}
            onPress={handleGeneratePDF}
          >
            <Ionicons name="document-text-outline" size={18} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Generate PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}