// ======================================================
// FILE: src/screens/CreateQuotationScreen.js
// PURPOSE:
// Create / Edit Quotation Form Screen
// NOTE:
// ✔ Original navigation preserved
// ✔ Original pricing calculation preserved
// ✔ Phase 1 preset integration: Company + Client
// ✔ Phase 2 preset integration: Payment + Mobile + Signature + Notes
// ✔ Phase 3 integration: Items Catalog
// ✔ Edit mode protected from default preset overwrite
// ✔ FIXED: discount/tax input values stay safe for History/Edit mode
// ======================================================

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Modal,
  FlatList,
  Alert,
} from 'react-native';

import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { generateQuotationNumber } from '../utils/generateQuotationNumber';
import styles from './CreateQuotationScreenStyle';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import PresetSelector from '../components/PresetSelector';
import { updateQuotation } from '../services/storageService';

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
// SMALL HELPERS
// ======================================================
const toInputString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
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

// ======================================================
// NORMALIZE SETTINGS PRESETS
// ======================================================
const normalizeCompanyProfile = (profile) => {
  if (!profile) return null;

  const oldContact = profile.companyContact || '';
  const parsed = extractEmailPhoneFromContact(oldContact);

  return {
    ...profile,
    companyEmail: profile.companyEmail || parsed.email || '',
    companyPhone: profile.companyPhone || parsed.phone || '',
    companyContact: profile.companyContact || '',
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
    price: item.price || '',
  };
};

// ======================================================
// SERVICE / ITEM HELPERS
// ======================================================
const createEmptyService = () => ({
  id: Date.now().toString(),
  name: '',
  description: '',
  quantity: '1',
  unitPrice: '',
});

const createServiceFromCatalogItem = (catalogItem) => {
  const normalized = normalizeCatalogItem(catalogItem);

  return {
    id: Date.now().toString(),
    name: normalized?.itemName || normalized?.title || '',
    description: normalized?.description || '',
    quantity: normalized?.quantity || '1',
    unitPrice: normalized?.price || '',
  };
};

const normalizeServiceForEdit = (item, index) => ({
  id: item?.id || `${Date.now()}-${index}`,
  name: toInputString(item?.name),
  description: toInputString(item?.description),
  quantity: toInputString(item?.quantity, '1'),
  unitPrice: toInputString(item?.unitPrice),
});

const isBlankServiceItem = (item) => {
  const name = item?.name?.trim() || '';
  const description = item?.description?.trim() || '';
  const quantity = item?.quantity?.trim() || '';
  const unitPrice = item?.unitPrice?.trim() || '';

  return !name && !description && !unitPrice && (!quantity || quantity === '1');
};

const addItemToServiceList = (currentServices, newItem) => {
  const hasOnlyBlankItem =
    currentServices.length === 1 && isBlankServiceItem(currentServices[0]);

  if (hasOnlyBlankItem) {
    return [newItem];
  }

  return [...currentServices, newItem];
};

// ======================================================
// EMPTY INVOICE
// ======================================================
const createEmptyInvoice = () => ({
  // Company Info
  companyName: '',
  companyAddress: '',
  companyContact: '',
  companyEmail: '',
  companyPhone: '',

  // Quotation Info
  quotationNumber: '',
  date: new Date().toISOString().split('T')[0],
  validity: '',

  // Client Info
  clientName: '',
  clientCompany: '',
  clientAddress: '',
  clientEmail: '',
  clientPhone: '',

  // Items
  services: [
    {
      id: '1',
      name: '',
      description: '',
      quantity: '1',
      unitPrice: '',
    },
  ],

  // Pricing input values
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
// NORMALIZE EDIT DATA
// IMPORTANT:
// discount/tax must stay as input values, not calculated amounts.
// ======================================================
const normalizeInvoiceData = (data) => {
  const baseInvoice = createEmptyInvoice();

  const parsedCompanyContact = extractEmailPhoneFromContact(
    data?.companyContact || ''
  );

  const discountInput =
    data?.discountInput !== undefined
      ? data.discountInput
      : data?.discount !== undefined
      ? data.discount
      : '';

  const taxInput =
    data?.taxInput !== undefined
      ? data.taxInput
      : data?.taxPercentage !== undefined
      ? data.taxPercentage
      : data?.tax !== undefined
      ? data.tax
      : '';

  const normalizedServices =
    Array.isArray(data?.services) && data.services.length > 0
      ? data.services.map(normalizeServiceForEdit)
      : baseInvoice.services;

  return {
    ...baseInvoice,
    ...data,

    companyEmail: data?.companyEmail || parsedCompanyContact.email || '',
    companyPhone: data?.companyPhone || parsedCompanyContact.phone || '',
    companyContact: data?.companyContact || '',

    clientEmail: data?.clientEmail || '',
    clientPhone: data?.clientPhone || '',

    // TextInput values must be strings
    discount: toInputString(discountInput),
    tax: toInputString(taxInput),

    services: normalizedServices,
  };
};

// ======================================================
// APPLY PRESETS TO INVOICE
// ======================================================
const applyCompanyToInvoiceObject = (invoiceData, profile) => {
  const normalized = normalizeCompanyProfile(profile);

  if (!normalized) return invoiceData;

  return {
    ...invoiceData,
    companyName: normalized.companyName || '',
    companyAddress: normalized.companyAddress || '',
    companyEmail: normalized.companyEmail || '',
    companyPhone: normalized.companyPhone || '',
    companyContact: buildCompanyContact(
      normalized.companyEmail,
      normalized.companyPhone
    ),
    logo: normalized.logo || null,
    logoBase64: normalized.logoBase64 || null,
  };
};

const applyClientToInvoiceObject = (invoiceData, profile) => {
  const normalized = normalizeClientProfile(profile);

  if (!normalized) return invoiceData;

  return {
    ...invoiceData,
    clientName: normalized.clientName || '',
    clientCompany: normalized.clientCompany || '',
    clientAddress: normalized.clientAddress || '',
    clientEmail: normalized.clientEmail || '',
    clientPhone: normalized.clientPhone || '',
  };
};

const applyPaymentToInvoiceObject = (invoiceData, profile) => {
  const normalized = normalizePaymentProfile(profile);

  if (!normalized) return invoiceData;

  return {
    ...invoiceData,
    paymentTerms: normalized.paymentTerms || '',
    paymentMethod: normalized.paymentMethod || '',
  };
};

const applyMobilePaymentToInvoiceObject = (invoiceData, profile) => {
  const normalized = normalizeMobilePaymentProfile(profile);

  if (!normalized) return invoiceData;

  return {
    ...invoiceData,
    mobilePaymentInfo: normalized.mobilePaymentInfo || '',
  };
};

const applySignatureToInvoiceObject = (invoiceData, profile) => {
  const normalized = normalizeSignatureProfile(profile);

  if (!normalized) return invoiceData;

  return {
    ...invoiceData,
    signatureImage: normalized.signatureImage || null,
    signatureBase64: normalized.signatureBase64 || null,
  };
};

const applyNoteToInvoiceObject = (invoiceData, template) => {
  const normalized = normalizeNoteTemplate(template);

  if (!normalized) return invoiceData;

  return {
    ...invoiceData,
    notes: normalized.notes || '',
  };
};

// ======================================================
// SMALL UI COMPONENTS
// ======================================================
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
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.uploadBox}
      onPress={onPress}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.uploadImage, imageStyle]}
          resizeMode="contain"
        />
      ) : (
        <>
          <Ionicons name="cloud-upload-outline" size={26} color={BRAND_COLOR} />
          <Text style={styles.uploadText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function GradientButton({ title, icon, onPress, outline, editGradient, compact }) {
  if (outline && !editGradient) {
    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={styles.outlineButton}
        onPress={onPress}
      >
        <Ionicons name={icon} size={compact ? 16 : 18} color={BRAND_COLOR} />
        <Text
          style={[
            styles.outlineButtonText,
            compact && styles.actionButtonTextCompact,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {title}
        </Text>
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
        colors={editGradient ? ['#f97316', '#fb923c'] : [BRAND_COLOR, '#ff6b95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientButton}
      >
        <Ionicons name={icon} size={compact ? 16 : 18} color="#ffffff" />
        <Text
          style={[
            styles.gradientButtonText,
            compact && styles.actionButtonTextCompact,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================
export default function CreateQuotationScreen({ navigation, route }) {
  const [invoice, setInvoice] = useState(createEmptyInvoice);

  // Settings presets
  const [companyProfiles, setCompanyProfiles] = useState([]);
  const [clientProfiles, setClientProfiles] = useState([]);
  const [paymentProfiles, setPaymentProfiles] = useState([]);
  const [mobilePaymentProfiles, setMobilePaymentProfiles] = useState([]);
  const [signatureProfiles, setSignatureProfiles] = useState([]);
  const [noteTemplates, setNoteTemplates] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);

  const [selectedCompanyTitle, setSelectedCompanyTitle] = useState('');
  const [selectedClientTitle, setSelectedClientTitle] = useState('');
  const [selectedPaymentTitle, setSelectedPaymentTitle] = useState('');
  const [selectedMobilePaymentTitle, setSelectedMobilePaymentTitle] =
    useState('');
  const [selectedSignatureTitle, setSelectedSignatureTitle] = useState('');
  const [selectedNoteTitle, setSelectedNoteTitle] = useState('');

  const [itemCatalogModalVisible, setItemCatalogModalVisible] = useState(false);

  const isEditMode = Boolean(route?.params?.editData);

  // ======================================================
  // INIT : LOAD EDIT DATA OR NEW QUOTATION DEFAULTS
  // ======================================================
  useEffect(() => {
    const init = async () => {
      const companiesData = await getCompanyProfiles();
      const clientsData = await getClientProfiles();
      const paymentsData = await getPaymentProfiles();
      const mobilePaymentsData = await getMobilePaymentProfiles();
      const signaturesData = await getSignatureProfiles();
      const notesData = await getNoteTemplates();
      const catalogItemsData = await getCatalogItems();

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

      // EDIT MODE:
      // Do not generate a new quotation number.
      // Do not auto-fill settings defaults.
      if (route?.params?.editData) {
        setInvoice(normalizeInvoiceData(route.params.editData));

        setSelectedCompanyTitle('');
        setSelectedClientTitle('');
        setSelectedPaymentTitle('');
        setSelectedMobilePaymentTitle('');
        setSelectedSignatureTitle('');
        setSelectedNoteTitle('');

        return;
      }

      // NEW QUOTATION MODE:
      // Generate quotation number and apply default presets.
      const number = await generateQuotationNumber();

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

      setInvoice((prev) => {
        let nextInvoice = {
          ...prev,
          quotationNumber: number,
        };

        if (defaultCompany) {
          nextInvoice = applyCompanyToInvoiceObject(nextInvoice, defaultCompany);
        }

        if (defaultClient) {
          nextInvoice = applyClientToInvoiceObject(nextInvoice, defaultClient);
        }

        if (defaultPayment) {
          nextInvoice = applyPaymentToInvoiceObject(nextInvoice, defaultPayment);
        }

        if (defaultMobilePayment) {
          nextInvoice = applyMobilePaymentToInvoiceObject(
            nextInvoice,
            defaultMobilePayment
          );
        }

        if (defaultSignature) {
          nextInvoice = applySignatureToInvoiceObject(
            nextInvoice,
            defaultSignature
          );
        }

        if (defaultNote) {
          nextInvoice = applyNoteToInvoiceObject(nextInvoice, defaultNote);
        }

        return nextInvoice;
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
        setSelectedPaymentTitle(
          defaultPayment.title ||
            defaultPayment.paymentMethod ||
            'Payment Profile'
        );
      }

      if (defaultMobilePayment) {
        setSelectedMobilePaymentTitle(
          defaultMobilePayment.title || 'Mobile Payment'
        );
      }

      if (defaultSignature) {
        setSelectedSignatureTitle(
          defaultSignature.title || 'Default Signature'
        );
      }

      if (defaultNote) {
        setSelectedNoteTitle(defaultNote.title || 'Default Note');
      }
    };

    init();
  }, [route?.params?.editData]);

  // ======================================================
  // UPDATE SINGLE FIELD
  // ======================================================
  const updateField = (key, value) => {
    setInvoice((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateCompanyEmail = (value) => {
    setInvoice((prev) => ({
      ...prev,
      companyEmail: value,
      companyContact: buildCompanyContact(value, prev.companyPhone),
    }));
  };

  const updateCompanyPhone = (value) => {
    setInvoice((prev) => ({
      ...prev,
      companyPhone: value,
      companyContact: buildCompanyContact(prev.companyEmail, value),
    }));
  };

  // ======================================================
  // APPLY SELECTED PRESETS
  // ======================================================
  const applyCompanyProfile = (profile) => {
    const normalized = normalizeCompanyProfile(profile);

    if (!normalized) return;

    setSelectedCompanyTitle(
      normalized.title || normalized.companyName || 'Selected Company'
    );

    setInvoice((prev) => applyCompanyToInvoiceObject(prev, normalized));
  };

  const applyClientProfile = (profile) => {
    const normalized = normalizeClientProfile(profile);

    if (!normalized) return;

    setSelectedClientTitle(
      normalized.title || normalized.clientName || 'Selected Client'
    );

    setInvoice((prev) => applyClientToInvoiceObject(prev, normalized));
  };

  const applyPaymentProfile = (profile) => {
    const normalized = normalizePaymentProfile(profile);

    if (!normalized) return;

    setSelectedPaymentTitle(
      normalized.title || normalized.paymentMethod || 'Selected Payment'
    );

    setInvoice((prev) => applyPaymentToInvoiceObject(prev, normalized));
  };

  const applyMobilePaymentProfile = (profile) => {
    const normalized = normalizeMobilePaymentProfile(profile);

    if (!normalized) return;

    setSelectedMobilePaymentTitle(
      normalized.title || 'Selected Mobile Payment'
    );

    setInvoice((prev) => applyMobilePaymentToInvoiceObject(prev, normalized));
  };

  const applySignatureProfile = (profile) => {
    const normalized = normalizeSignatureProfile(profile);

    if (!normalized) return;

    setSelectedSignatureTitle(normalized.title || 'Selected Signature');

    setInvoice((prev) => applySignatureToInvoiceObject(prev, normalized));
  };

  const applyNoteTemplate = (template) => {
    const normalized = normalizeNoteTemplate(template);

    if (!normalized) return;

    setSelectedNoteTitle(normalized.title || 'Selected Note');

    setInvoice((prev) => applyNoteToInvoiceObject(prev, normalized));
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
  // UPDATE ITEM ROW
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
  // ADD CUSTOM ITEM ROW
  // ======================================================
  const addCustomItem = () => {
    setItemCatalogModalVisible(false);

    setInvoice((prev) => {
      const hasOnlyBlankItem =
        prev.services.length === 1 && isBlankServiceItem(prev.services[0]);

      if (hasOnlyBlankItem) {
        return prev;
      }

      return {
        ...prev,
        services: [...prev.services, createEmptyService()],
      };
    });
  };

  // ======================================================
  // ADD ITEM FROM CATALOG
  // ======================================================
  const addCatalogItemToQuotation = (catalogItem) => {
    const serviceItem = createServiceFromCatalogItem(catalogItem);

    setItemCatalogModalVisible(false);

    setInvoice((prev) => ({
      ...prev,
      services: addItemToServiceList(prev.services, serviceItem),
    }));
  };

  // ======================================================
  // REMOVE ITEM ROW
  // ======================================================
  const removeService = (id) => {
    setInvoice((prev) => ({
      ...prev,
      services: prev.services.filter((item) => item.id !== id),
    }));
  };

  // ======================================================
  // PRICE CALCULATION
  // IMPORTANT:
  // invoice.discount and invoice.tax are input values.
  // taxValue is calculated amount.
  // ======================================================
  const subtotal = invoice.services.reduce((sum, item) => {
    return (
      sum +
      (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)
    );
  }, 0);

  const discountValue = parseFloat(invoice.discount) || 0;
  const taxPercentage = parseFloat(invoice.tax) || 0;

  const taxableAmount = Math.max(subtotal - discountValue, 0);
  const taxValue = (taxableAmount * taxPercentage) / 100;

  const grandTotal = taxableAmount + taxValue;

    // ======================================================
  // EDIT MODE DISPLAY LABEL
  // Used only for showing edit mode banner.
  // No data/calculation logic is changed here.
  // ======================================================
  const getEditingLabel = () => {
    const quotationNo =
      invoice.quotationNumber || route?.params?.editData?.quotationNumber;

    const clientName = invoice.clientName || route?.params?.editData?.clientName;

    if (quotationNo) {
      return `Quotation #${quotationNo}`;
    }

    if (clientName) {
      return clientName;
    }

    return 'Saved Quotation';
  };

  // ======================================================
  // GO TO PREVIEW SCREEN
  // IMPORTANT:
  // discount/tax keep original input values for History/Edit.
  // calculated values are sent separately.
  // ======================================================
  const handlePreview = () => {
    const previewInvoice = {
      ...invoice,
      companyContact:
        buildCompanyContact(invoice.companyEmail, invoice.companyPhone) ||
        invoice.companyContact,
    };

    navigation.navigate('Preview', {
      ...previewInvoice,

      // Keep original input values for History/Edit mode
      discount: invoice.discount,
      tax: invoice.tax,
      discountInput: invoice.discount,
      taxInput: invoice.tax,

      // Calculated values for Preview/PDF display
      subtotal,
      discountAmount: discountValue,
      taxPercentage,
      taxAmount: taxValue,
      grandTotal,
    });
  };

  // ======================================================
  // UPDATE QUOTATION DIRECTLY FROM EDIT MODE
  // IMPORTANT:
  // This keeps the same data structure used by PreviewScreen.
  // ======================================================
  const handleUpdateQuotation = () => {
    if (!isEditMode) {
      navigation.navigate('DraftQuotation');
      return;
    }

    const updatedQuotation = {
      ...invoice,

      id: invoice.id || route?.params?.editData?.id,
      createdAt:
        invoice.createdAt ||
        route?.params?.editData?.createdAt ||
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      companyContact:
        buildCompanyContact(invoice.companyEmail, invoice.companyPhone) ||
        invoice.companyContact,

      // Keep original input values for History/Edit mode
      discount: invoice.discount,
      tax: invoice.tax,
      discountInput: invoice.discount,
      taxInput: invoice.tax,

      // Calculated values for Preview/PDF display
      subtotal,
      discountAmount: discountValue,
      taxPercentage,
      taxAmount: taxValue,
      grandTotal,
    };

    if (!updatedQuotation.id) {
      Alert.alert('Update Failed', 'Quotation ID not found.');
      return;
    }

    Alert.alert(
      'Update Quotation',
      'Are you sure you want to update this quotation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            const success = await updateQuotation(updatedQuotation);

            if (success) {
              Alert.alert('Success', 'Quotation updated successfully.', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('History'),
                },
              ]);
            } else {
              Alert.alert('Error', 'Something went wrong while updating.');
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // OPEN DRAFT PAGE WITH CONFIRMATION
  // IMPORTANT:
  // Draft save logic is not ready yet.
  // So this warning prevents user confusion.
  // ======================================================
  const handleDraftPress = () => {
    Alert.alert(
      'Open Drafts',
      'Draft save feature is not ready yet. This will open the Draft Quotations page, but your current form data will not be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Drafts',
          onPress: () => navigation.navigate('DraftQuotation'),
        },
      ]
    );
  };

  // ======================================================
  // UI START
  // ======================================================
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      <View style={styles.screen}>
        <LinearGradient
          colors={[BRAND_COLOR, '#ff6b95', '#ffe7ef']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topHeader}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Quotation' : 'Create Quotation'}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('History')}
          >
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
          {isEditMode ? (
            <View style={styles.editModeTopCard}>
              <View style={styles.editModeIconBox}>
                <Ionicons name="create-outline" size={22} color="#f97316" />
              </View>

              <View style={styles.editModeContent}>
                <Text style={styles.editModeTitle}>Edit Quotation Mode</Text>

                <Text style={styles.editModeSubtitle}>
                  You are editing a saved quotation. Review your changes before updating.
                </Text>

                <View style={styles.editModeBadge}>
                  <Ionicons name="document-text-outline" size={13} color="#f97316" />
                  <Text style={styles.editModeBadgeText}>
                    Editing: {getEditingLabel()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.cancelEditButton}
                onPress={() => navigation.navigate('History')}
              >
                <Ionicons name="close" size={15} color="#f97316" />
                <Text style={styles.cancelEditButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : null}

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

            <View style={styles.presetFullRow}>
              <PresetSelector
                label="Select Company"
                selectedLabel={selectedCompanyTitle}
                items={companyProfiles}
                icon="business-outline"
                emptyText="No company profiles found. Add one from Settings first."
                onSelect={applyCompanyProfile}
              />
            </View>

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
              value={invoice.companyEmail}
              onChangeText={updateCompanyEmail}
              placeholder="Company Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              icon="call-outline"
              value={invoice.companyPhone}
              onChangeText={updateCompanyPhone}
              placeholder="Company Phone"
              keyboardType="phone-pad"
            />
          </View>

          {/* Bill To + Quotation Info */}
          <View style={styles.twoColumnWrap}>
            <View style={[styles.card, styles.halfCard]}>
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
                    onSelect={applyClientProfile}
                  />
                }
              />

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
                icon="mail-outline"
                value={invoice.clientEmail}
                onChangeText={(t) => updateField('clientEmail', t)}
                placeholder="Client Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <AppInput
                icon="call-outline"
                value={invoice.clientPhone}
                onChangeText={(t) => updateField('clientPhone', t)}
                placeholder="Client Phone"
                keyboardType="phone-pad"
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
              <SectionHeader
                icon="document-text-outline"
                title="Quotation Info"
              />

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

          {/* Items */}
          <View style={styles.card}>
            <View style={styles.serviceHeaderRow}>
              <View style={styles.serviceHeaderLeft}>
                <View style={styles.sectionIconBox}>
                  <Ionicons
                    name="cube-outline"
                    size={20}
                    color={BRAND_COLOR}
                  />
                </View>

                <Text style={styles.sectionTitle}>Items / Services</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.addServiceBtn}
                onPress={() => setItemCatalogModalVisible(true)}
              >
                <Ionicons name="add" size={16} color={BRAND_COLOR} />
                <Text style={styles.addServiceBtnText}>Add Item</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.serviceTable}>
              <View style={styles.tableRowHeader}>
                <Text style={[styles.th, styles.colNumber]}>#</Text>
                <Text style={[styles.th, styles.colService]}>Item</Text>
                <Text style={[styles.th, styles.colQty]}>Qty</Text>
                <Text style={[styles.th, styles.colPrice]}>Price</Text>
                <Text style={[styles.th, styles.colAction]} />
              </View>

              {invoice.services.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.td, styles.colNumber]}>{index + 1}</Text>

                  <View style={[styles.serviceCellWrap, styles.colService]}>
                    <TextInput
                      value={item.name}
                      onChangeText={(t) => updateService(item.id, 'name', t)}
                      style={styles.serviceNameInput}
                      placeholder="Item / Service"
                      placeholderTextColor="#9aa4b5"
                    />

                    <TextInput
                      value={item.description}
                      onChangeText={(t) =>
                        updateService(item.id, 'description', t)
                      }
                      style={styles.serviceDescriptionInput}
                      placeholder="Description"
                      placeholderTextColor="#9aa4b5"
                    />
                  </View>

                  <TextInput
                    value={item.quantity}
                    onChangeText={(t) => updateService(item.id, 'quantity', t)}
                    style={[styles.inputCell, styles.colQty, styles.qtyInput]}
                    keyboardType="numeric"
                    placeholderTextColor="#9aa4b5"
                  />

                  <TextInput
                    value={item.unitPrice}
                    onChangeText={(t) =>
                      updateService(item.id, 'unitPrice', t)
                    }
                    style={[styles.inputCell, styles.colPrice]}
                    keyboardType="numeric"
                    placeholder="Price"
                    placeholderTextColor="#9aa4b5"
                  />

                  <TouchableOpacity
                    style={[styles.removeBtn, styles.colAction]}
                    onPress={() => removeService(item.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={BRAND_COLOR}
                    />
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
              <SectionHeader
                icon="card-outline"
                title="Payment Terms"
                right={
                  <PresetSelector
                    label="Select Payment"
                    selectedLabel={selectedPaymentTitle}
                    items={paymentProfiles}
                    icon="card-outline"
                    emptyText="No payment profiles found. Add one from Settings first."
                    onSelect={applyPaymentProfile}
                  />
                }
              />

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
                  onSelect={applyMobilePaymentProfile}
                />
              }
            />

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

            <View style={styles.presetFullRow}>
              <PresetSelector
                label="Select Signature"
                selectedLabel={selectedSignatureTitle}
                items={signatureProfiles}
                icon="create-outline"
                emptyText="No signature profiles found. Add one from Settings first."
                onSelect={applySignatureProfile}
              />
            </View>

            {invoice.signatureImage ? (
              <View style={styles.signaturePreviewInfo}>
                <Text style={styles.signatureLine}>
                  ________________________
                </Text>
                <Text style={styles.signatureLabel}>Authorized Signature</Text>
              </View>
            ) : null}
          </View>

          {/* Notes */}
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
                  onSelect={applyNoteTemplate}
                />
              }
            />

            <AppInput
              value={invoice.notes}
              onChangeText={(t) => updateField('notes', t)}
              placeholder="Write notes, terms or instructions..."
              multiline
              style={styles.notesWrap}
              inputStyle={styles.textAreaInput}
            />

            <Text style={styles.disclaimerText}>Thanks ForYour inquiry</Text>
            <Text style={styles.disclaimerText}>
              * This is a system generated quotation. Terms and conditions may
              apply.
            </Text>
            <Text style={styles.supportInfoText}>
              all support By netkib.com & kibria.net
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <GradientButton
              title="Go to Preview"
              icon="eye-outline"
              onPress={handlePreview}
            />

            <GradientButton
              title={isEditMode ? 'Update Quotation' : 'Draft'}
              icon={isEditMode ? 'checkmark-circle-outline' : 'document-text-outline'}
              outline={!isEditMode}
              editGradient={isEditMode}
              compact={isEditMode}
              onPress={isEditMode ? handleUpdateQuotation : handleDraftPress}
            />
          </View>
        </ScrollView>

        {/* Items Catalog Modal */}
        <Modal
          visible={itemCatalogModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setItemCatalogModalVisible(false)}
        >
          <View style={styles.catalogModalOverlay}>
            <View style={styles.catalogModalCard}>
              <View style={styles.catalogModalHeader}>
                <View>
                  <Text style={styles.catalogModalTitle}>Add Item</Text>
                  <Text style={styles.catalogModalSubtitle}>
                    Choose from saved catalog or add a custom item
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.catalogCloseButton}
                  onPress={() => setItemCatalogModalVisible(false)}
                >
                  <Ionicons name="close" size={20} color="#344054" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.catalogCustomButton}
                onPress={addCustomItem}
              >
                <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
                <Text style={styles.catalogCustomButtonText}>
                  Add Custom Item
                </Text>
              </TouchableOpacity>

              {catalogItems.length === 0 ? (
                <View style={styles.catalogEmptyBox}>
                  <Ionicons
                    name="folder-open-outline"
                    size={34}
                    color={BRAND_COLOR}
                  />
                  <Text style={styles.catalogEmptyTitle}>
                    No saved items found
                  </Text>
                  <Text style={styles.catalogEmptyText}>
                    Add items from Settings → Items Catalog, or use Add Custom
                    Item.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={catalogItems}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.catalogListContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.catalogOptionCard}
                      onPress={() => addCatalogItemToQuotation(item)}
                    >
                      <View style={styles.catalogOptionIconBox}>
                        <Ionicons
                          name="cube-outline"
                          size={22}
                          color={BRAND_COLOR}
                        />
                      </View>

                      <View style={styles.catalogOptionInfo}>
                        <Text
                          style={styles.catalogOptionTitle}
                          numberOfLines={1}
                        >
                          {item.title || item.itemName || 'Saved Item'}
                        </Text>

                        <Text
                          style={styles.catalogOptionSubtitle}
                          numberOfLines={2}
                        >
                          {item.itemName}
                          {item.description ? ` • ${item.description}` : ''}
                        </Text>

                        <Text style={styles.catalogOptionMeta}>
                          Qty: {item.quantity || '1'} • Price:{' '}
                          {item.price || '0'}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#98a2b3"
                      />
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}