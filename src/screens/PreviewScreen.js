// ======================================================
// FILE: src/screens/PreviewScreen.js
// PURPOSE:
// Preview quotation before saving/updating/generating PDF
// NOTE:
// ✔ Save / Update logic preserved
// ✔ Generate PDF logic preserved
// ✔ Styles moved to PreviewScreenStyle.js
// ✔ Services naming changed to Items
// ✔ No blank reserved rows in item table
// ✔ Logo border removed
// ✔ Quotation info stacked to avoid text breaking
// ✔ Mode-based title/buttons supported
// ======================================================

import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { generatePDF } from '../services/pdfService';
import {
  saveQuotation,
  updateQuotation,
  deleteDraftQuotation,
} from '../services/storageService';
import * as Sharing from 'expo-sharing';

import styles, { BRAND_COLOR } from './PreviewScreenStyle';

const safeText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const parseNumber = (value) => {
  const number = parseFloat(value);
  return Number.isNaN(number) ? 0 : number;
};

const formatMoney = (value) => {
  const number = parseNumber(value);

  try {
    return number.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  } catch {
    return String(number);
  }
};

const extractEmailPhoneFromContact = (contact = '') => {
  const emailMatch = safeText(contact).match(/Email:\s*([^\n]+)/i);
  const phoneMatch = safeText(contact).match(/Phone:\s*([^\n]+)/i);

  return {
    email: emailMatch?.[1]?.trim() || '',
    phone: phoneMatch?.[1]?.trim() || '',
  };
};

const getItemAmount = (item) => {
  return parseNumber(item?.quantity) * parseNumber(item?.unitPrice);
};

const isBlankItem = (item) => {
  const name = safeText(item?.name).trim();
  const description = safeText(item?.description).trim();
  const quantity = safeText(item?.quantity).trim();
  const unitPrice = safeText(item?.unitPrice).trim();

  return !name && !description && !unitPrice && (!quantity || quantity === '1');
};

const getDisplayRows = (services = []) => {
  const safeServices = Array.isArray(services) ? services : [];
  return safeServices.filter((item) => !isBlankItem(item));
};

function InfoLine({ icon, label, value, strong }) {
  if (!value) return null;

  return (
    <View style={styles.infoLine}>
      {icon ? (
        <Ionicons
          name={icon}
          size={12}
          color="#4b5563"
          style={styles.infoIcon}
        />
      ) : null}

      {label ? <Text style={styles.infoLabel}>{label}: </Text> : null}

      <Text style={[styles.infoValue, strong && styles.infoValueStrong]}>
        {value}
      </Text>
    </View>
  );
}

function QuoteInfoItem({ label, value }) {
  if (!value) return null;

  return (
    <View style={styles.quoteInfoItem}>
      <Text style={styles.quoteInfoLabel}>{label}</Text>
      <Text style={styles.quoteInfoValue}>{value}</Text>
    </View>
  );
}

function SectionTitle({ title }) {
  return (
    <View style={styles.centerTitleRow}>
      <View style={styles.centerTitleLine} />
      <Text style={styles.centerTitle}>{title}</Text>
      <View style={styles.centerTitleLine} />
    </View>
  );
}

function ActionButton({ title, icon, onPress, outline }) {
  if (outline) {
    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={styles.outlineButton}
        onPress={onPress}
      >
        <Ionicons name={icon} size={16} color={BRAND_COLOR} />
        <Text
          style={styles.outlineButtonText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.primaryButtonWrap}
      onPress={onPress}
    >
      <LinearGradient
        colors={[BRAND_COLOR, '#ff6b95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryButton}
      >
        <Ionicons name={icon} size={16} color="#ffffff" />
        <Text
          style={styles.primaryButtonText}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function PreviewScreen({ route, navigation }) {
  const params = route.params || {};

  // ======================================================
  // SCREEN MODE SUPPORT
  // Supported flows:
  // 1. Create -> Preview: normal preview
  // 2. History -> View: historyView
  // 3. Edit -> Preview: editPreview / saved data with id
  //
  // Backward compatible:
  // Old navigation.navigate('Preview', item) still works.
  // New navigation can use:
  // navigation.navigate('Preview', { quotationData: item, mode: 'historyView' })
  // ======================================================
  const screenMode = params.mode || params.screenMode || 'preview';

  const data = params.quotationData || params.data || params;

  // ======================================================
  // QUOTATION DRAFT CLEANUP SUPPORT
  // NEW:
  // If Preview came from a draft, sourceDraftId is used only
  // after successful final save to remove that draft.
  // It is stripped from final History/PDF data.
  // ======================================================
  const sourceDraftId = params.sourceDraftId || data.sourceDraftId || null;

  const getCleanFinalQuotationData = (quotationData = data) => {
    const {
      sourceDraftId: _sourceDraftId,
      draftId: _draftId,
      draftTitle: _draftTitle,
      isDraft: _isDraft,
      status: _status,
      ...cleanData
    } = quotationData || {};

    return cleanData;
  };

  const isHistoryViewMode = screenMode === 'historyView';

  const headerTitle = isHistoryViewMode
    ? 'View Quotation'
    : 'Preview Quotation';

  const headerRightIcon = isHistoryViewMode
    ? 'time-outline'
    : 'document-text-outline';

  const primaryActionTitle = isHistoryViewMode
    ? 'Go to Edit'
    : data.id
      ? 'Update Quotation'
      : 'Save Quotation';

  const primaryActionIcon = isHistoryViewMode
    ? 'create-outline'
    : 'save-outline';

  const parsedCompanyContact = extractEmailPhoneFromContact(data.companyContact);

  const companyEmail = data.companyEmail || parsedCompanyContact.email;
  const companyPhone = data.companyPhone || parsedCompanyContact.phone;

  const subtotal = parseNumber(data.subtotal);
  const discount = parseNumber(data.discount);

  const taxPercentage =
    data.taxPercentage !== undefined && data.taxPercentage !== null
      ? parseNumber(data.taxPercentage)
      : null;

  const taxAmount =
    data.taxAmount !== undefined && data.taxAmount !== null
      ? parseNumber(data.taxAmount)
      : parseNumber(data.tax);

  const grandTotal = parseNumber(data.grandTotal);

  const displayRows = getDisplayRows(data.services);

  const showMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const uri = await generatePDF(getCleanFinalQuotationData(data));

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      showMessage('PDF generation failed!');
    }
  };

  const handleSaveQuotation = async () => {
    const performSave = async () => {
      let success = false;
      const cleanQuotationData = getCleanFinalQuotationData(data);

      if (cleanQuotationData.id) {
        success = await updateQuotation(cleanQuotationData);
      } else {
        const newData = {
          ...cleanQuotationData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };

        success = await saveQuotation(newData);
      }

      if (success) {
        // ======================================================
        // QUOTATION DRAFT → FINAL CLEANUP
        // NEW:
        // Only after final save/update succeeds, remove the source
        // draft so it no longer remains in Draft Quotations.
        // Normal new quotation and History edit flows are untouched.
        // ======================================================
        if (sourceDraftId) {
          await deleteDraftQuotation(sourceDraftId);
        }

        showMessage(
          cleanQuotationData.id ? 'Quotation updated!' : 'Quotation saved!'
        );
        navigation.navigate('History');
      } else {
        showMessage('Something went wrong!');
      }
    };

    if (data.id) {
      Alert.alert(
        'Update Quotation',
        'Are you sure you want to update this quotation?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Update', onPress: performSave },
        ]
      );
    } else {
      performSave();
    }
  };

  // ======================================================
  // HEADER RIGHT ACTION
  // History view mode: go back to History
  // Other preview modes: generate/share PDF
  // ======================================================
  const handleHeaderRightPress = () => {
    if (isHistoryViewMode) {
      navigation.navigate('History');
      return;
    }

    handleGeneratePDF();
  };

  // ======================================================
  // PRIMARY BOTTOM ACTION
  // History view mode: go to edit screen
  // Other preview modes: save/update quotation
  // ======================================================
  const handlePrimaryAction = () => {
    if (isHistoryViewMode) {
      navigation.navigate('Create', {
        editData: data,
        mode: 'historyEdit',
      });
      return;
    }

    handleSaveQuotation();
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      <View style={styles.screen}>
        <LinearGradient
          colors={[BRAND_COLOR, '#ff6b95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{headerTitle}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerIconButton}
            onPress={handleHeaderRightPress}
          >
            <Ionicons name={headerRightIcon} size={21} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.paper}>
            {/* Company Header */}
            <View style={styles.companyHeader}>
              <View style={styles.companyLeft}>
                <Text style={styles.companyName}>
                  {safeText(data.companyName, 'Company Name')}
                </Text>

                <Text style={styles.companySubTitle}>Item Service</Text>

                <InfoLine
                  icon="location-outline"
                  value={safeText(data.companyAddress)}
                />
                <InfoLine icon="mail-outline" value={companyEmail} />
                <InfoLine icon="call-outline" value={companyPhone} />
              </View>

              <View style={styles.logoBox}>
                {data.logo ? (
                  <Image
                    source={{ uri: data.logo }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="business-outline"
                      size={28}
                      color={BRAND_COLOR}
                    />
                    <Text style={styles.logoPlaceholder}>Logo</Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.redDivider} />

            {/* Bill To + Quotation Info */}
            <View style={styles.billQuoteRow}>
              <View style={styles.billBox}>
                <Text style={styles.blockTitle}>Bill To :</Text>

                <InfoLine label="Name" value={safeText(data.clientName)} strong />
                <InfoLine label="Company" value={safeText(data.clientCompany)} />
                <InfoLine label="Email" value={safeText(data.clientEmail)} />
                <InfoLine label="Address" value={safeText(data.clientAddress)} />
                <InfoLine label="Contact" value={safeText(data.clientPhone)} />
              </View>

              <View style={styles.quoteInfoBox}>
                <QuoteInfoItem
                  label="Quotation No"
                  value={safeText(data.quotationNumber)}
                />

                <QuoteInfoItem
                  label="Quotation Date"
                  value={safeText(data.date)}
                />

                {data.validity ? (
                  <QuoteInfoItem
                    label="Validity"
                    value={`${safeText(data.validity)}${
                      String(data.validity).includes('day') ? '' : ' days'
                    }`}
                  />
                ) : null}
              </View>
            </View>

            <SectionTitle title="Item Details" />

            {/* Items Table */}
            <View style={styles.itemTable}>
              <View style={styles.itemTableHeader}>
                <Text style={[styles.th, styles.colNo]}>#</Text>
                <Text style={[styles.th, styles.colDescription]}>
                  Description
                </Text>
                <Text style={[styles.th, styles.colQty]}>Qty</Text>
                <Text style={[styles.th, styles.colRate]}>Rate</Text>
                <Text style={[styles.th, styles.colAmount]}>Amount</Text>
              </View>

              {displayRows.length === 0 ? (
                <View style={styles.noItemRow}>
                  <Text style={styles.noItemText}>No item added</Text>
                </View>
              ) : (
                displayRows.map((item, index) => {
                  const amount = getItemAmount(item);

                  return (
                    <View
                      key={item.id || `row-${index}`}
                      style={styles.itemTableRow}
                    >
                      <Text style={[styles.td, styles.colNo]}>{index + 1}</Text>

                      <View
                        style={[
                          styles.itemDescriptionCell,
                          styles.colDescription,
                        ]}
                      >
                        <Text style={styles.itemNameText} numberOfLines={1}>
                          {safeText(item.name)}
                        </Text>

                        {item.description ? (
                          <Text style={styles.itemDescText} numberOfLines={2}>
                            {item.description}
                          </Text>
                        ) : null}
                      </View>

                      <Text style={[styles.td, styles.colQty]}>
                        {safeText(item.quantity)}
                      </Text>

                      <Text style={[styles.td, styles.colRate]}>
                        {formatMoney(item.unitPrice)}
                      </Text>

                      <Text style={[styles.td, styles.colAmount]}>
                        {formatMoney(amount)}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>

            {/* Summary */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatMoney(subtotal)}</Text>
              </View>

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={styles.summaryValue}>{formatMoney(discount)}</Text>
              </View>

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>
                  {taxPercentage !== null ? `Tax (${taxPercentage}%)` : 'Tax'}
                </Text>
                <Text style={styles.summaryValue}>{formatMoney(taxAmount)}</Text>
              </View>

              <View style={styles.netAmountLine}>
                <Text style={styles.netAmountLabel}>Net Amount</Text>
                <Text style={styles.netAmountValue}>
                  {formatMoney(grandTotal)}
                </Text>
              </View>
            </View>

            {/* Payment Blocks */}
            <View style={styles.paymentRow}>
              <View style={styles.paymentBox}>
                <View style={styles.paymentTitleRow}>
                  <Ionicons
                    name="receipt-outline"
                    size={15}
                    color={BRAND_COLOR}
                  />
                  <Text style={styles.paymentTitle}>Payment Terms</Text>
                </View>

                <Text style={styles.paymentText}>
                  {safeText(data.paymentTerms, 'No payment terms added.')}
                </Text>
              </View>

              <View style={styles.paymentBox}>
                <View style={styles.paymentTitleRow}>
                  <Ionicons
                    name="business-outline"
                    size={15}
                    color={BRAND_COLOR}
                  />
                  <Text style={styles.paymentTitle}>Payment Method</Text>
                </View>

                <Text style={styles.paymentText}>
                  {safeText(data.paymentMethod, 'No payment method added.')}
                </Text>
              </View>
            </View>

            {data.mobilePaymentInfo ? (
              <View style={styles.mobilePaymentBox}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={14}
                  color={BRAND_COLOR}
                />
                <Text style={styles.mobilePaymentText}>
                  {safeText(data.mobilePaymentInfo)}
                </Text>
              </View>
            ) : null}

            {/* Signature */}
            <View style={styles.signatureArea}>
              {data.signatureImage ? (
                <Image
                  source={{ uri: data.signatureImage }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              ) : data.signature ? (
                <Text style={styles.signatureText}>{data.signature}</Text>
              ) : (
                <View style={styles.signatureBlank} />
              )}

              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Authorized Signature</Text>
              <Text style={styles.signatureCompany}>
                {safeText(data.companyName)}
              </Text>
            </View>

            {/* Notes */}
            <View style={styles.notesBox}>
              <View style={styles.thanksRow}>
                <Ionicons name="heart" size={13} color={BRAND_COLOR} />
                <Text style={styles.thanksText}>THANKS FOR YOUR INQUIRY!</Text>
              </View>

              <Text style={styles.notesText}>
                <Text style={styles.notesBold}>Notes: </Text>
                {safeText(data.notes, 'No additional notes added.')}
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerHelp}>
                If you have any questions about this Quotation, please contact
                with us
              </Text>

              <View style={styles.footerContactRow}>
                <Text style={styles.footerContact}>{companyPhone}</Text>
                <Text style={styles.footerDivider}>|</Text>
                <Text style={styles.footerContact}>{companyEmail}</Text>
              </View>

              <Text style={styles.footerSupport}>
                Development & maintenance support by netkib.com & kibria.net
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <ActionButton
              title={primaryActionTitle}
              icon={primaryActionIcon}
              onPress={handlePrimaryAction}
            />

            <ActionButton
              title="Generate PDF"
              icon="document-text-outline"
              outline
              onPress={handleGeneratePDF}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}