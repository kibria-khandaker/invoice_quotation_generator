// src/screens/CreateInvoiceScreen.js

// ======================================================
// INVOICE SIDE UI SCREEN
// PHASE: UI + SETTINGS PRESET CONNECTION + DRAFT CONTINUE FLOW
//
// IMPORTANT:
// - This screen follows Create Quotation UI structure/style.
// - Quotation side CreateQuotationScreen.js is not imported or edited.
// - Quotation-side stable names `invoice` and `services` are not used here.
// - Invoice side naming uses invoiceForm / invoiceItems.
// - Save as Draft uses Invoice master storage via saveInvoiceDraft().
// - Final/ready save remains in InvoicePreviewScreen.
// ======================================================

import React, { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import PresetSelector from '../components/PresetSelector';
import styles from './CreateInvoiceScreenStyle';

import { generateInvoiceNumber } from '../utils/generateInvoiceNumber';

// ======================================================
// INVOICE SIDE DRAFT STORAGE IMPORT
// NEW:
// CreateInvoiceScreen saves incomplete work as Draft.
// Final invoice save remains in InvoicePreviewScreen.
// ======================================================
import { saveInvoiceDraft } from '../services/storageService';

import {
  getCompanyProfiles,
  getClientProfiles,
  getPaymentProfiles,
  getMobilePaymentProfiles,
  getSignatureProfiles,
  getNoteTemplates,
  getCatalogItems,
} from '../services/settingsService';

const BRAND_COLOR = '#fd4475';

// ======================================================
// INVOICE SIDE UI FONT CONTROL
// Prevent Android/system font scaling from breaking this
// Invoice UI layout. This is local to this screen only.
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

function TextInput(props) {
  return (
    <RNTextInput
      {...props}
      allowFontScaling={false}
      maxFontSizeMultiplier={1}
    />
  );
}
// ======================================================
// INVOICE SIDE UI FONT CONTROL END
// ======================================================

// ======================================================
// INVOICE SIDE PAYMENT STATUS
// EDIT:
// Payment status is now calculated automatically from
// Total Amount and Due Amount.
// It is display-only/muted in Create Invoice screen.
// Quotation payment logic is not touched.
// ======================================================
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

const getInvoicePaymentStatus = (totalAmountValue, dueAmountValue) => {
  const safeTotal = parseFloat(totalAmountValue) || 0;
  const safeDue = parseFloat(dueAmountValue) || 0;

  if (safeTotal <= 0) {
    return 'unpaid';
  }

  if (safeDue <= 0) {
    return 'paid';
  }

  if (safeDue >= safeTotal) {
    return 'unpaid';
  }

  if (safeDue <= safeTotal / 2) {
    return 'mostlyPaid';
  }

  return 'partiallyPaid';
};

// ======================================================
// INVOICE SIDE DATE HELPERS
// NEW:
// Default due date is 30 days after invoice date.
// User can still edit dueDate manually.
// Quotation date/validity logic is not touched.
// ======================================================
const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

const addDaysToDate = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const createEmptyInvoiceItem = () => ({
  id: Date.now().toString(),
  name: '',
  description: '',
  quantity: '1',

  // ======================================================
  // INVOICE SIDE DEFAULT ITEM PRICE
  // Default price shows 0 in Invoice UI.
  // Quotation-side services item structure is not touched.
  // ======================================================
  unitPrice: '0',
});

const createEmptyInvoiceForm = () => {
  const today = new Date();
  const invoiceDate = formatDateForInput(today);
  const dueDate = formatDateForInput(addDaysToDate(today, 30));

  return {
    // ======================================================
    // INVOICE SIDE FORM DATA
    // Real save/preview logic comes later.
    // ======================================================

    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    companyContact: '',
    logo: null,
    logoBase64: null,

    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',

    invoiceNumber: 'AUTO-GENERATE-LATER',
    invoiceDate,
    dueDate,
    paymentStatus: 'unpaid',
    referenceQuotationNumber: '',

    // ======================================================
    // INVOICE SIDE DEFAULT PRICING VALUES
    // Discount, Tax, and Paid Amount show 0 by default.
    // ======================================================
    discount: '0',
    tax: '0',
    paidAmount: '0',

    paymentTerms: '',
    paymentMethod: '',
    mobilePaymentInfo: '',

    signatureImage: null,
    signatureBase64: null,

    notes: '',
  };
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

const buildCompanyContact = (email, phone) => {
  const lines = [];

  if (email?.trim()) {
    lines.push(`Email: ${email.trim()}`);
  }

  if (phone?.trim()) {
    lines.push(`Phone: ${phone.trim()}`);
  }

  return lines.join('\n');
};

const extractEmailPhoneFromContact = (contact = '') => {
  const emailMatch = String(contact || '').match(/Email:\s*([^\n]+)/i);
  const phoneMatch = String(contact || '').match(/Phone:\s*([^\n]+)/i);

  return {
    email: emailMatch?.[1]?.trim() || '',
    phone: phoneMatch?.[1]?.trim() || '',
  };
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

const isBlankInvoiceItem = (item) => {
  const name = item?.name?.trim() || '';
  const description = item?.description?.trim() || '';
  const quantity = item?.quantity?.trim() || '';
  const unitPrice = item?.unitPrice?.trim() || '';

  const priceIsBlank = unitPrice === '' || unitPrice === '0';
  const qtyIsDefault = quantity === '' || quantity === '1';

  return !name && !description && qtyIsDefault && priceIsBlank;
};

const createInvoiceItemFromCatalog = (catalogItem) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: catalogItem?.itemName || catalogItem?.title || '',
  description: catalogItem?.description || '',
  quantity: catalogItem?.quantity || '1',
  unitPrice: catalogItem?.price || '0',
});

const addItemToInvoiceItems = (currentItems, newItem) => {
  const hasOnlyBlankItem =
    currentItems.length === 1 && isBlankInvoiceItem(currentItems[0]);

  if (hasOnlyBlankItem) {
    return [newItem];
  }

  return [...currentItems, newItem];
};

// ======================================================
// INVOICE SIDE PRESET NORMALIZERS
// These read existing Settings data safely.
// Quotation screen logic is untouched.
// ======================================================
const normalizeCompanyProfile = (profile) => {
  if (!profile) return null;

  const parsed = extractEmailPhoneFromContact(profile.companyContact || '');

  return {
    ...profile,
    companyEmail: profile.companyEmail || parsed.email || '',
    companyPhone: profile.companyPhone || parsed.phone || '',
  };
};

const normalizeClientProfile = (profile) => {
  if (!profile) return null;

  return {
    ...profile,
    clientEmail: profile.clientEmail || '',
    clientPhone: profile.clientPhone || '',
  };
};

const normalizePaymentProfile = (profile) => {
  if (!profile) return null;

  return {
    ...profile,
    paymentTerms: profile.paymentTerms || '',
    paymentMethod: profile.paymentMethod || '',
  };
};

const normalizeMobilePaymentProfile = (profile) => {
  if (!profile) return null;

  return {
    ...profile,
    mobilePaymentInfo: profile.mobilePaymentInfo || '',
  };
};

const normalizeSignatureProfile = (profile) => {
  if (!profile) return null;

  return {
    ...profile,
    signatureImage: profile.signatureImage || null,
    signatureBase64: profile.signatureBase64 || null,
  };
};

const normalizeNoteTemplate = (template) => {
  if (!template) return null;

  return {
    ...template,
    notes: template.notes || '',
  };
};

const normalizeCatalogItem = (item) => {
  if (!item) return null;

  return {
    ...item,
    title: item.title || '',
    itemName: item.itemName || '',
    description: item.description || '',
    quantity: item.quantity || '1',
    price: item.price || '0',
  };
};

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

function UploadBox({ label, icon, imageUri, onPress, isSignature }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.uploadBox,
        isSignature && styles.signatureUploadBox,
      ]}
      onPress={onPress}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.uploadImage,
            isSignature ? styles.signaturePreview : styles.logoPreview,
          ]}
          resizeMode="contain"
        />
      ) : (
        <>
          <Ionicons name={icon} size={26} color={BRAND_COLOR} />
          <Text style={styles.uploadText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
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
        <Ionicons name={icon} size={18} color={BRAND_COLOR} />
        <Text style={styles.outlineButtonText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.gradientButtonWrap}
      onPress={onPress}
    >
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

export default function CreateInvoiceScreen({ navigation, route }) {
  const [invoiceForm, setInvoiceForm] = useState(createEmptyInvoiceForm);
  const [invoiceItems, setInvoiceItems] = useState([createEmptyInvoiceItem()]);
  const [itemModalVisible, setItemModalVisible] = useState(false);

  const [companyProfiles, setCompanyProfiles] = useState([]);
  const [clientProfiles, setClientProfiles] = useState([]);
  const [paymentProfiles, setPaymentProfiles] = useState([]);
  const [mobilePaymentProfiles, setMobilePaymentProfiles] = useState([]);
  const [signatureProfiles, setSignatureProfiles] = useState([]);
  const [noteTemplates, setNoteTemplates] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);

  const [selectedCompanyTitle, setSelectedCompanyTitle] = useState('');
  const [selectedClientTitle, setSelectedClientTitle] = useState('');
  const [selectedPaymentTermsTitle, setSelectedPaymentTermsTitle] =
    useState('');
  const [selectedPaymentMethodTitle, setSelectedPaymentMethodTitle] =
    useState('');
  const [selectedMobilePaymentTitle, setSelectedMobilePaymentTitle] =
    useState('');
  const [selectedSignatureTitle, setSelectedSignatureTitle] = useState('');
  const [selectedNoteTitle, setSelectedNoteTitle] = useState('');

  // ======================================================
  // INVOICE SIDE EDIT / CONTINUE MODE
  // NEW:
  // Used when opening a draft invoice from InvoiceDraftScreen.
  // Same ID is preserved to prevent duplicate draft records.
  // ======================================================
  const editData = route?.params?.editData || null;
  const isContinueDraftMode = Boolean(route?.params?.isDraft && editData);

  // ======================================================
  // INVOICE SIDE INIT
  // Load Settings presets and apply default values.
  // If a draft is opened, load draft data instead of defaults.
  // Quotation side init logic is not touched.
  // ======================================================
  useEffect(() => {
    const loadInvoicePresetData = async () => {
      const companiesData = await getCompanyProfiles();
      const clientsData = await getClientProfiles();
      const paymentsData = await getPaymentProfiles();
      const mobilePaymentsData = await getMobilePaymentProfiles();
      const signaturesData = await getSignatureProfiles();
      const notesData = await getNoteTemplates();
      const catalogItemsData = await getCatalogItems();

      // ======================================================
      // INVOICE SIDE NUMBER LOAD
      // EDIT:
      // Fresh invoice gets a new number.
      // Continue Draft keeps the existing invoice number and
      // does not consume a new invoice counter.
      // ======================================================
      const generatedInvoiceNumber = editData?.invoiceNumber
        ? editData.invoiceNumber
        : await generateInvoiceNumber();

      const normalizedCompanies = (companiesData || [])
        .map(normalizeCompanyProfile)
        .filter(Boolean);

      const normalizedClients = (clientsData || [])
        .map(normalizeClientProfile)
        .filter(Boolean);

      const normalizedPayments = (paymentsData || [])
        .map(normalizePaymentProfile)
        .filter(Boolean);

      const normalizedMobilePayments = (mobilePaymentsData || [])
        .map(normalizeMobilePaymentProfile)
        .filter(Boolean);

      const normalizedSignatures = (signaturesData || [])
        .map(normalizeSignatureProfile)
        .filter(Boolean);

      const normalizedNotes = (notesData || [])
        .map(normalizeNoteTemplate)
        .filter(Boolean);

      const normalizedCatalogItems = (catalogItemsData || [])
        .map(normalizeCatalogItem)
        .filter(Boolean);

      setCompanyProfiles(normalizedCompanies);
      setClientProfiles(normalizedClients);
      setPaymentProfiles(normalizedPayments);
      setMobilePaymentProfiles(normalizedMobilePayments);
      setSignatureProfiles(normalizedSignatures);
      setNoteTemplates(normalizedNotes);
      setCatalogItems(normalizedCatalogItems);

      const defaultCompany = normalizedCompanies.find((item) => item.isDefault);
      const defaultClient = normalizedClients.find((item) => item.isDefault);
      const defaultPayment = normalizedPayments.find((item) => item.isDefault);
      const defaultMobilePayment = normalizedMobilePayments.find(
        (item) => item.isDefault
      );
      const defaultSignature = normalizedSignatures.find(
        (item) => item.isDefault
      );
      const defaultNote = normalizedNotes.find((item) => item.isDefault);

      // ======================================================
      // INVOICE SIDE CONTINUE DRAFT LOAD
      // NEW:
      // If this screen is opened from InvoiceDraftScreen,
      // load existing draft data instead of creating a fresh form.
      // Preserves id, invoiceNumber, createdAt, and invoiceItems.
      // ======================================================
      if (editData) {
        setInvoiceForm({
          ...createEmptyInvoiceForm(),
          ...editData,

          id: editData.id,
          invoiceNumber: editData.invoiceNumber || generatedInvoiceNumber,

          discount: String(editData.discountInput ?? editData.discount ?? '0'),
          tax: String(editData.taxInput ?? editData.tax ?? '0'),
          paidAmount: String(editData.paidAmount ?? '0'),
        });

        if (
          Array.isArray(editData.invoiceItems) &&
          editData.invoiceItems.length > 0
        ) {
          setInvoiceItems(
            editData.invoiceItems.map((item, index) => ({
              id: item.id || `${Date.now()}-${index}`,
              name: String(item.name || ''),
              description: String(item.description || ''),
              quantity: String(item.quantity || '1'),
              unitPrice: String(item.unitPrice ?? '0'),
            }))
          );
        } else {
          setInvoiceItems([createEmptyInvoiceItem()]);
        }

        setSelectedCompanyTitle(editData.companyName || '');
        setSelectedClientTitle(editData.clientName || editData.clientCompany || '');
        setSelectedPaymentTermsTitle(
          editData.paymentTerms ? 'Draft Payment Terms' : ''
        );
        setSelectedPaymentMethodTitle(
          editData.paymentMethod ? 'Draft Payment Method' : ''
        );
        setSelectedMobilePaymentTitle(
          editData.mobilePaymentInfo ? 'Draft Mobile Payment' : ''
        );
        setSelectedSignatureTitle(
          editData.signatureImage || editData.signatureBase64
            ? 'Draft Signature'
            : ''
        );
        setSelectedNoteTitle(editData.notes ? 'Draft Note' : '');

        return;
      }

      setInvoiceForm((prev) => {
        let nextForm = {
          ...prev,
          invoiceNumber: generatedInvoiceNumber || prev.invoiceNumber,
        };

        if (defaultCompany) {
          nextForm = {
            ...nextForm,
            companyName: defaultCompany.companyName || '',
            companyAddress: defaultCompany.companyAddress || '',
            companyEmail: defaultCompany.companyEmail || '',
            companyPhone: defaultCompany.companyPhone || '',
            companyContact: buildCompanyContact(
              defaultCompany.companyEmail,
              defaultCompany.companyPhone
            ),
            logo: defaultCompany.logo || null,
            logoBase64: defaultCompany.logoBase64 || null,
          };
        }

        if (defaultClient) {
          nextForm = {
            ...nextForm,
            clientName: defaultClient.clientName || '',
            clientCompany: defaultClient.clientCompany || '',
            clientEmail: defaultClient.clientEmail || '',
            clientPhone: defaultClient.clientPhone || '',
            clientAddress: defaultClient.clientAddress || '',
          };
        }

        if (defaultPayment) {
          nextForm = {
            ...nextForm,
            paymentTerms: defaultPayment.paymentTerms || '',
            paymentMethod: defaultPayment.paymentMethod || '',
          };
        }

        if (defaultMobilePayment) {
          nextForm = {
            ...nextForm,
            mobilePaymentInfo: defaultMobilePayment.mobilePaymentInfo || '',
          };
        }

        if (defaultSignature) {
          nextForm = {
            ...nextForm,
            signatureImage: defaultSignature.signatureImage || null,
            signatureBase64: defaultSignature.signatureBase64 || null,
          };
        }

        if (defaultNote) {
          nextForm = {
            ...nextForm,
            notes: defaultNote.notes || '',
          };
        }

        return nextForm;
      });

      if (defaultCompany) {
        setSelectedCompanyTitle(
          defaultCompany.title || defaultCompany.companyName || 'Default Company'
        );
      }

      if (defaultClient) {
        setSelectedClientTitle(
          defaultClient.title || defaultClient.clientName || 'Default Client'
        );
      }

      if (defaultPayment) {
        const paymentTitle =
          defaultPayment.title ||
          defaultPayment.paymentMethod ||
          'Default Payment';

        setSelectedPaymentTermsTitle(paymentTitle);
        setSelectedPaymentMethodTitle(paymentTitle);
      }

      if (defaultMobilePayment) {
        setSelectedMobilePaymentTitle(
          defaultMobilePayment.title || 'Default Mobile'
        );
      }

      if (defaultSignature) {
        setSelectedSignatureTitle(defaultSignature.title || 'Default Signature');
      }

      if (defaultNote) {
        setSelectedNoteTitle(defaultNote.title || 'Default Note');
      }
    };

    loadInvoicePresetData();
  }, [editData]);

  const updateInvoiceField = (field, value) => {
    setInvoiceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateInvoiceItem = (id, field, value) => {
    setInvoiceItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addBlankInvoiceItem = () => {
    setItemModalVisible(false);

    setInvoiceItems((prev) => {
      const hasOnlyBlankItem =
        prev.length === 1 && isBlankInvoiceItem(prev[0]);

      if (hasOnlyBlankItem) {
        return prev;
      }

      return [
        ...prev,
        {
          ...createEmptyInvoiceItem(),
          id: `${Date.now()}-${prev.length + 1}`,
        },
      ];
    });
  };

  const addCatalogItemToInvoice = (catalogItem) => {
    const newItem = createInvoiceItemFromCatalog(catalogItem);

    setItemModalVisible(false);
    setInvoiceItems((prev) => addItemToInvoiceItems(prev, newItem));
  };

  const removeInvoiceItem = (id) => {
    setInvoiceItems((prev) => {
      if (prev.length <= 1) {
        return [createEmptyInvoiceItem()];
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const pickAndProcessImage = async (target) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow media permission.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];

      if (!asset?.uri) return;

      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: target === 'logo' ? 400 : 650 } }],
        {
          compress: 0.55,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (target === 'logo') {
        setInvoiceForm((prev) => ({
          ...prev,
          logo: manipulated.uri,
          logoBase64: manipulated.base64 || null,
        }));
      }

      if (target === 'signature') {
        setInvoiceForm((prev) => ({
          ...prev,
          signatureImage: manipulated.uri,
          signatureBase64: manipulated.base64 || null,
        }));
      }
    } catch (error) {
      console.log('Invoice Image Pick Error:', error);
      Alert.alert('Image Error', 'Image could not be selected.');
    }
  };

  const subtotal = useMemo(() => {
    return invoiceItems.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;

      return sum + quantity * unitPrice;
    }, 0);
  }, [invoiceItems]);

  const discountValue = parseFloat(invoiceForm.discount) || 0;
  const taxPercentage = parseFloat(invoiceForm.tax) || 0;
  const taxableAmount = Math.max(subtotal - discountValue, 0);
  const taxValue = (taxableAmount * taxPercentage) / 100;
  const totalAmount = taxableAmount + taxValue;
  const paidAmount = parseFloat(invoiceForm.paidAmount) || 0;
  const dueAmount = Math.max(totalAmount - paidAmount, 0);

  // ======================================================
  // INVOICE SIDE AUTO PAYMENT STATUS
  // NEW:
  // Status is calculated from Due Amount after all pricing
  // calculations are complete.
  // ======================================================
  const autoPaymentStatus = getInvoicePaymentStatus(totalAmount, dueAmount);
  const autoPaymentStatusMeta =
    PAYMENT_STATUS_META[autoPaymentStatus] || PAYMENT_STATUS_META.unpaid;

  // ======================================================
  // INVOICE SIDE DATA BUILDER
  // NEW:
  // Builds a clean invoiceData object for InvoicePreview and Draft Save.
  // This does not directly decide saved/draft lifecycle.
  // ======================================================
  const buildInvoiceData = () => {
    const now = new Date().toISOString();

    return {
      ...invoiceForm,

      // ======================================================
      // INVOICE SIDE PERMANENT ID
      // EDIT:
      // Preserve existing draft/saved invoice id during edit.
      // This prevents duplicate invoice records.
      // ======================================================
      id:
        invoiceForm.id ||
        editData?.id ||
        `invoice_${Date.now().toString()}`,

      invoiceItems,

      companyContact:
        buildCompanyContact(invoiceForm.companyEmail, invoiceForm.companyPhone) ||
        invoiceForm.companyContact,

      paymentStatus: autoPaymentStatus,
      paymentStatusLabel: autoPaymentStatusMeta.label,
      status: autoPaymentStatus,

      discountInput: invoiceForm.discount,
      taxInput: invoiceForm.tax,

      subtotal,
      discountAmount: discountValue,
      taxPercentage,
      taxAmount: taxValue,
      totalAmount,
      grandTotal: totalAmount,
      paidAmount,
      dueAmount,

      createdAt: invoiceForm.createdAt || editData?.createdAt || now,
      updatedAt: now,
    };
  };

  // ======================================================
  // INVOICE SIDE PREVIEW ACTION
  // NEW:
  // Opens InvoicePreview screen with current invoiceData.
  // Quotation PreviewScreen is not used or touched.
  // ======================================================
  const handlePreviewInvoice = () => {
    navigation.navigate('InvoicePreview', {
      invoiceData: buildInvoiceData(),
    });
  };

  // ======================================================
  // INVOICE SIDE SAVE AS DRAFT ACTION
  // EDIT:
  // CreateInvoiceScreen is the working/editing screen.
  // Incomplete invoice is saved as Draft from here.
  // Final/ready save happens from InvoicePreviewScreen.
  // Same ID updates existing draft, preventing duplicates.
  // ======================================================
  const handleSaveDraftInvoice = () => {
    Alert.alert(
      'Save as Draft',
      isContinueDraftMode
        ? 'Do you want to update this draft invoice?'
        : 'Do you want to save this invoice as draft?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: isContinueDraftMode ? 'Update Draft' : 'Save Draft',
          onPress: async () => {
            const success = await saveInvoiceDraft(buildInvoiceData());

            if (success) {
              Alert.alert(
                'Saved',
                isContinueDraftMode
                  ? 'Invoice draft updated successfully.'
                  : 'Invoice draft saved successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('InvoiceDraft'),
                  },
                ]
              );
            } else {
              Alert.alert('Error', 'Invoice draft could not be saved.');
            }
          },
        },
      ]
    );
  };

  const logoPreviewUri = getImageUri(invoiceForm.logo, invoiceForm.logoBase64);

  const signaturePreviewUri = getImageUri(
    invoiceForm.signatureImage,
    invoiceForm.signatureBase64
  );

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
            <Text style={styles.headerTitle}>
              {isContinueDraftMode ? 'Continue Draft' : 'Create Invoice'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isContinueDraftMode
                ? 'Continue and update incomplete invoice'
                : 'Create and manage professional invoices'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('InvoiceHistory')}
          >
            <Ionicons name="time-outline" size={23} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* ======================================================
              INVOICE SIDE SECTION 1: COMPANY INFORMATION
          ====================================================== */}
          <View style={[styles.card, styles.firstCard]}>
            <SectionHeader
              icon="business-outline"
              title="Company Information"
              subtitle="Your business details will appear on the invoice"
            />

            <View style={styles.companyTopRow}>
              <UploadBox
                label="Upload Logo"
                icon="cloud-upload-outline"
                imageUri={logoPreviewUri}
                onPress={() => pickAndProcessImage('logo')}
              />

              <View style={styles.companyPresetWrap}>
                <PresetSelector
                  label="Select Company"
                  selectedLabel={selectedCompanyTitle}
                  items={companyProfiles}
                  icon="business-outline"
                  emptyText="No company profiles found. Add one from Settings first."
                  onSelect={(profile) => {
                    const normalized = normalizeCompanyProfile(profile);

                    setSelectedCompanyTitle(
                      normalized?.title ||
                        normalized?.companyName ||
                        'Selected Company'
                    );

                    setInvoiceForm((prev) => ({
                      ...prev,
                      companyName: normalized?.companyName || '',
                      companyAddress: normalized?.companyAddress || '',
                      companyEmail: normalized?.companyEmail || '',
                      companyPhone: normalized?.companyPhone || '',
                      companyContact: buildCompanyContact(
                        normalized?.companyEmail,
                        normalized?.companyPhone
                      ),
                      logo: normalized?.logo || null,
                      logoBase64: normalized?.logoBase64 || null,
                    }));
                  }}
                />
              </View>
            </View>

            <AppInput
              icon="business-outline"
              placeholder="Company Name"
              value={invoiceForm.companyName}
              onChangeText={(text) => updateInvoiceField('companyName', text)}
            />

            <AppInput
              icon="location-outline"
              placeholder="Company Address"
              value={invoiceForm.companyAddress}
              onChangeText={(text) => updateInvoiceField('companyAddress', text)}
              multiline
              inputStyle={styles.multilineInput}
            />

            <AppInput
              icon="mail-outline"
              placeholder="Company Email"
              value={invoiceForm.companyEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => updateInvoiceField('companyEmail', text)}
            />

            <AppInput
              icon="call-outline"
              placeholder="Company Phone"
              value={invoiceForm.companyPhone}
              keyboardType="phone-pad"
              onChangeText={(text) => updateInvoiceField('companyPhone', text)}
            />
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 2: BILL TO
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader
              icon="person-outline"
              title="Bill To"
              right={
                <PresetSelector
                  label="Select Client"
                  selectedLabel={selectedClientTitle}
                  items={clientProfiles}
                  icon="person-outline"
                  emptyText="No client profiles found. Add one from Settings first."
                  onSelect={(profile) => {
                    const normalized = normalizeClientProfile(profile);

                    setSelectedClientTitle(
                      normalized?.title ||
                        normalized?.clientName ||
                        'Selected Client'
                    );

                    setInvoiceForm((prev) => ({
                      ...prev,
                      clientName: normalized?.clientName || '',
                      clientCompany: normalized?.clientCompany || '',
                      clientEmail: normalized?.clientEmail || '',
                      clientPhone: normalized?.clientPhone || '',
                      clientAddress: normalized?.clientAddress || '',
                    }));
                  }}
                />
              }
            />

            <AppInput
              icon="person-outline"
              placeholder="Client Name"
              value={invoiceForm.clientName}
              onChangeText={(text) => updateInvoiceField('clientName', text)}
            />

            <AppInput
              icon="business-outline"
              placeholder="Client Company"
              value={invoiceForm.clientCompany}
              onChangeText={(text) => updateInvoiceField('clientCompany', text)}
            />

            <AppInput
              icon="mail-outline"
              placeholder="Client Email"
              value={invoiceForm.clientEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => updateInvoiceField('clientEmail', text)}
            />

            <AppInput
              icon="call-outline"
              placeholder="Client Phone"
              value={invoiceForm.clientPhone}
              keyboardType="phone-pad"
              onChangeText={(text) => updateInvoiceField('clientPhone', text)}
            />

            <AppInput
              icon="location-outline"
              placeholder="Client Address"
              value={invoiceForm.clientAddress}
              onChangeText={(text) => updateInvoiceField('clientAddress', text)}
              multiline
              inputStyle={styles.multilineInput}
            />
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 3: INVOICE INFO
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader icon="document-text-outline" title="Invoice Info" />

            <AppInput
              icon="pricetag-outline"
              placeholder="Invoice Number"
              value={invoiceForm.invoiceNumber}
              editable={false}
            />

            <AppInput
              icon="calendar-outline"
              placeholder="Invoice Date"
              value={invoiceForm.invoiceDate}
              editable={false}
            />

            <AppInput
              icon="calendar-number-outline"
              placeholder="Due Date"
              value={invoiceForm.dueDate}
              onChangeText={(text) => updateInvoiceField('dueDate', text)}
            />

            <AppInput
              icon="document-attach-outline"
              placeholder="Reference Quotation Number (Optional)"
              value={invoiceForm.referenceQuotationNumber}
              onChangeText={(text) =>
                updateInvoiceField('referenceQuotationNumber', text)
              }
            />
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 4: INVOICE ITEMS
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader
              icon="cube-outline"
              title="Invoice Items"
              right={
                <TouchableOpacity
                  activeOpacity={0.86}
                  style={styles.addItemButton}
                  onPress={() => setItemModalVisible(true)}
                >
                  <Ionicons name="add" size={18} color={BRAND_COLOR} />
                  <Text style={styles.addItemText}>Add Item</Text>
                </TouchableOpacity>
              }
            />

            <View style={styles.itemsTable}>
              <View style={styles.itemsTableHeader}>
                <Text style={[styles.tableHeaderText, styles.colNumber]}>#</Text>
                <Text style={[styles.tableHeaderText, styles.colItem]}>Item</Text>
                <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
                <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
              </View>

              {invoiceItems.map((item, index) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={[styles.itemIndex, styles.colNumber]}>
                    {index + 1}
                  </Text>

                  <View style={styles.itemInfo}>
                    <TextInput
                      placeholder="Item / Service"
                      placeholderTextColor="#9aa4b5"
                      value={item.name}
                      onChangeText={(text) =>
                        updateInvoiceItem(item.id, 'name', text)
                      }
                      style={styles.itemNameInput}
                    />

                    <TextInput
                      placeholder="Description"
                      placeholderTextColor="#9aa4b5"
                      value={item.description}
                      onChangeText={(text) =>
                        updateInvoiceItem(item.id, 'description', text)
                      }
                      style={styles.itemDescriptionInput}
                    />
                  </View>

                  <TextInput
                    placeholder="1"
                    placeholderTextColor="#9aa4b5"
                    value={item.quantity}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      updateInvoiceItem(item.id, 'quantity', text)
                    }
                    style={styles.qtyInput}
                  />

                  <TextInput
                    placeholder="Price"
                    placeholderTextColor="#9aa4b5"
                    value={item.unitPrice}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      updateInvoiceItem(item.id, 'unitPrice', text)
                    }
                    style={styles.priceInput}
                  />

                  <TouchableOpacity
                    activeOpacity={0.82}
                    style={styles.deleteItemButton}
                    onPress={() => removeInvoiceItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={BRAND_COLOR} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 5: PRICING SUMMARY
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader icon="pie-chart-outline" title="Pricing Summary" />

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatMoney(subtotal)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#9aa4b5"
                  value={invoiceForm.discount}
                  keyboardType="numeric"
                  onChangeText={(text) => updateInvoiceField('discount', text)}
                  style={styles.summaryInput}
                />
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.taxLabelWrap}>
                  <Text style={styles.summaryLabel}>Tax (%)</Text>

                  {/* ======================================================
                      INVOICE SIDE TAX HINT
                      NEW:
                      Shows how tax amount is calculated.
                      Example: Tax on 200 × 10% = 20
                      Quotation pricing summary is not touched.
                  ====================================================== */}
                  <Text style={styles.taxHintText}>
                    Tax on {formatMoney(taxableAmount)} × {taxPercentage || 0}% ={' '}
                    {formatMoney(taxValue)}
                  </Text>
                </View>

                <TextInput
                  placeholder="0"
                  placeholderTextColor="#9aa4b5"
                  value={invoiceForm.tax}
                  keyboardType="numeric"
                  onChangeText={(text) => updateInvoiceField('tax', text)}
                  style={styles.summaryInput}
                />
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>{formatMoney(totalAmount)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Paid Amount</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#9aa4b5"
                  value={invoiceForm.paidAmount}
                  keyboardType="numeric"
                  onChangeText={(text) => updateInvoiceField('paidAmount', text)}
                  style={styles.summaryInput}
                />
              </View>

              <View style={styles.dueRow}>
                <Text style={styles.dueLabel}>Due Amount</Text>
                <Text style={styles.dueValue}>{formatMoney(dueAmount)}</Text>
              </View>

              {/* ======================================================
                  INVOICE SIDE AUTO PAYMENT STATUS DISPLAY
                  NEW:
                  Display-only payment status based on Due Amount.
                  Positioned under Pricing Summary as requested.
              ====================================================== */}
              <View
                style={[
                  styles.autoStatusBox,
                  {
                    backgroundColor: autoPaymentStatusMeta.backgroundColor,
                    borderColor: autoPaymentStatusMeta.borderColor,
                  },
                ]}
              >
                <View style={styles.autoStatusLeft}>
                  <Text style={styles.autoStatusLabel}>Payment Status</Text>
                  <Text style={styles.autoStatusHint}>
                    Based on due amount after total calculation
                  </Text>
                </View>

                <View
                  style={[
                    styles.autoStatusBadge,
                    {
                      backgroundColor: autoPaymentStatusMeta.backgroundColor,
                      borderColor: autoPaymentStatusMeta.borderColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.autoStatusBadgeText,
                      { color: autoPaymentStatusMeta.color },
                    ]}
                  >
                    {autoPaymentStatusMeta.label}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 6: PAYMENT TERMS
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader
              icon="card-outline"
              title="Payment Terms"
              right={
                <PresetSelector
                  label="Select Payment Terms"
                  selectedLabel={selectedPaymentTermsTitle}
                  items={paymentProfiles}
                  icon="card-outline"
                  emptyText="No payment profiles found. Add one from Settings first."
                  onSelect={(profile) => {
                    const normalized = normalizePaymentProfile(profile);

                    setSelectedPaymentTermsTitle(
                      normalized?.title ||
                        normalized?.paymentMethod ||
                        'Selected Payment'
                    );

                    updateInvoiceField(
                      'paymentTerms',
                      normalized?.paymentTerms || ''
                    );
                  }}
                />
              }
            />

            <AppInput
              placeholder="Payment terms..."
              value={invoiceForm.paymentTerms}
              onChangeText={(text) => updateInvoiceField('paymentTerms', text)}
              multiline
              inputStyle={styles.textAreaInput}
            />
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 7: PAYMENT METHOD
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader
              icon="wallet-outline"
              title="Payment Method"
              right={
                <PresetSelector
                  label="Select Payment Method"
                  selectedLabel={selectedPaymentMethodTitle}
                  items={paymentProfiles}
                  icon="wallet-outline"
                  emptyText="No payment profiles found. Add one from Settings first."
                  onSelect={(profile) => {
                    const normalized = normalizePaymentProfile(profile);

                    setSelectedPaymentMethodTitle(
                      normalized?.title ||
                        normalized?.paymentMethod ||
                        'Selected Method'
                    );

                    updateInvoiceField(
                      'paymentMethod',
                      normalized?.paymentMethod || ''
                    );
                  }}
                />
              }
            />

            <AppInput
              placeholder="Bank / cash / payment method details..."
              value={invoiceForm.paymentMethod}
              onChangeText={(text) => updateInvoiceField('paymentMethod', text)}
              multiline
              inputStyle={styles.textAreaInput}
            />
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 8: MOBILE PAYMENT INFO
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader
              icon="phone-portrait-outline"
              title="Mobile Payment Info"
              right={
                <PresetSelector
                  label="Select Mobile"
                  selectedLabel={selectedMobilePaymentTitle}
                  items={mobilePaymentProfiles}
                  icon="phone-portrait-outline"
                  emptyText="No mobile payment profiles found. Add one from Settings first."
                  onSelect={(profile) => {
                    const normalized = normalizeMobilePaymentProfile(profile);

                    setSelectedMobilePaymentTitle(
                      normalized?.title || 'Selected Mobile'
                    );

                    updateInvoiceField(
                      'mobilePaymentInfo',
                      normalized?.mobilePaymentInfo || ''
                    );
                  }}
                />
              }
            />

            <AppInput
              placeholder="bKash / Nagad / Rocket details..."
              value={invoiceForm.mobilePaymentInfo}
              onChangeText={(text) =>
                updateInvoiceField('mobilePaymentInfo', text)
              }
              multiline
              inputStyle={styles.textAreaInput}
            />
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 9: SIGNATURE
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader
              icon="create-outline"
              title="Signature"
              subtitle="Upload your signature to appear on invoice"
              right={
                <PresetSelector
                  label="Select Signature"
                  selectedLabel={selectedSignatureTitle}
                  items={signatureProfiles}
                  icon="create-outline"
                  emptyText="No signature profiles found. Add one from Settings first."
                  onSelect={(profile) => {
                    const normalized = normalizeSignatureProfile(profile);

                    setSelectedSignatureTitle(
                      normalized?.title || 'Selected Signature'
                    );

                    setInvoiceForm((prev) => ({
                      ...prev,
                      signatureImage: normalized?.signatureImage || null,
                      signatureBase64: normalized?.signatureBase64 || null,
                    }));
                  }}
                />
              }
            />

            <UploadBox
              label="Upload Signature"
              icon="create-outline"
              imageUri={signaturePreviewUri}
              isSignature
              onPress={() => pickAndProcessImage('signature')}
            />

            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 10: NOTES
          ====================================================== */}
          <View style={styles.card}>
            <SectionHeader
              icon="reader-outline"
              title="Notes"
              right={
                <PresetSelector
                  label="Select Note"
                  selectedLabel={selectedNoteTitle}
                  items={noteTemplates}
                  icon="reader-outline"
                  emptyText="No note templates found. Add one from Settings first."
                  onSelect={(template) => {
                    const normalized = normalizeNoteTemplate(template);

                    setSelectedNoteTitle(normalized?.title || 'Selected Note');

                    updateInvoiceField('notes', normalized?.notes || '');
                  }}
                />
              }
            />

            <AppInput
              placeholder="Write notes, terms or instructions..."
              value={invoiceForm.notes}
              onChangeText={(text) => updateInvoiceField('notes', text)}
              multiline
              inputStyle={styles.textAreaInput}
            />

            <View style={styles.footerNoteBox}>
              <Text style={styles.footerNoteText}>
                Thanks for your business.
              </Text>

              <Text style={styles.footerSmallText}>
                * This is a system generated invoice. Terms and conditions may apply.
              </Text>

              <Text style={styles.footerSupportText}>
                all support By netkib.com & kibria.net
              </Text>
            </View>
          </View>

          {/* ======================================================
              INVOICE SIDE SECTION 11: BOTTOM ACTIONS
              CreateInvoiceScreen = Work/Edit screen.
              Final save happens from InvoicePreviewScreen.
          ====================================================== */}
          <View style={styles.actionRow}>
            <ActionButton
              title="Go Preview"
              icon="eye-outline"
              onPress={handlePreviewInvoice}
            />

            <ActionButton
              title={isContinueDraftMode ? 'Update Draft' : 'Save as Draft'}
              icon="bookmark-outline"
              outline
              onPress={handleSaveDraftInvoice}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ======================================================
          INVOICE SIDE ITEM CATALOG MODAL
      ====================================================== */}
      <Modal
        visible={itemModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setItemModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Add Invoice Item</Text>
                <Text style={styles.modalSubtitle}>
                  Choose from saved catalog or add a custom item
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalCloseButton}
                onPress={() => setItemModalVisible(false)}
              >
                <Ionicons name="close" size={21} color="#344054" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.customItemCard}
              onPress={addBlankInvoiceItem}
            >
              <View style={styles.customItemIconBox}>
                <Ionicons
                  name="add-circle-outline"
                  size={23}
                  color={BRAND_COLOR}
                />
              </View>

              <View style={styles.customItemTextWrap}>
                <Text style={styles.customItemTitle}>Add Custom Item</Text>
                <Text style={styles.customItemSubtitle}>
                  Create a blank invoice item row
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#98a2b3" />
            </TouchableOpacity>

            {catalogItems.length === 0 ? (
              <View style={styles.emptyCatalogBox}>
                <Ionicons name="cube-outline" size={36} color={BRAND_COLOR} />
                <Text style={styles.emptyCatalogText}>
                  No saved catalog items found.
                </Text>
              </View>
            ) : (
              <FlatList
                data={catalogItems}
                keyExtractor={(item, index) => item.id || `${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.catalogListContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.86}
                    style={styles.catalogItemCard}
                    onPress={() => addCatalogItemToInvoice(item)}
                  >
                    <View style={styles.catalogIconBox}>
                      <Ionicons name="cube-outline" size={21} color={BRAND_COLOR} />
                    </View>

                    <View style={styles.catalogInfo}>
                      <Text style={styles.catalogTitle} numberOfLines={1}>
                        {item.itemName || item.title || 'Saved Item'}
                      </Text>

                      <Text style={styles.catalogSubtitle} numberOfLines={2}>
                        {item.description || 'Tap to add this invoice item'}
                      </Text>
                    </View>

                    <Text style={styles.catalogPrice}>
                      {item.price ? formatMoney(item.price) : '0'}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}