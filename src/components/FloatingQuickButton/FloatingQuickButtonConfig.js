// src/components/FloatingQuickButton/FloatingQuickButtonConfig.js

// ======================================================
// FLOATING QUICK BUTTON MODULE CONFIG
// This file is fully isolated.
// Add/remove shortcut menu items here only.
// ======================================================

export const FLOATING_QUICK_BUTTON_HIDDEN_ROUTES = [
  'Home',
];

export const FLOATING_QUICK_BUTTON_MENU_ITEMS = [
  // NEW: Always show Home shortcut inside FloatingQuickButton menu.
  // This gives users a direct way to return to HomeScreen from any supported screen.
  {
    id: 'home',
    title: 'Home',
    route: 'Home',
    icon: 'home-outline',
    hideOnRoutes: ['Home'],
  },
  {
    id: 'createQuotation',
    title: 'Create Quotation',
    route: 'Create',
    icon: 'document-text-outline',
    hideOnRoutes: ['Create'],
  },
  {
    id: 'quotationHistory',
    title: 'Quotation History',
    route: 'History',
    icon: 'time-outline',
    hideOnRoutes: ['History'],
  },
  {
    id: 'quotationDrafts',
    title: 'Quotation Drafts',
    route: 'DraftQuotation',
    icon: 'file-tray-full-outline',
    hideOnRoutes: ['DraftQuotation'],
  },

  // ======================================================
  // SETTINGS GROUP
  // Important:
  // These menu items are hidden on the Settings screen because
  // they already exist inside the Settings page menu.
  // ======================================================
  {
    id: 'settings',
    title: 'Settings',
    route: 'Settings',
    icon: 'settings-outline',
    hideOnRoutes: [
      'Settings',
      'CompanySettings',
      'ClientSettings',
      'ItemsCatalogSettings',
      'PaymentSettings',
      'MobilePaymentSettings',
      'SignatureSettings',
      'NotesSettings',
      'FloatingQuickButtonSettings',
    ],
  },
  {
    id: 'companySettings',
    title: 'Company Info',
    route: 'CompanySettings',
    icon: 'business-outline',
    hideOnRoutes: ['Settings', 'CompanySettings'],
  },
  {
    id: 'clientSettings',
    title: 'Client Profiles',
    route: 'ClientSettings',
    icon: 'people-outline',
    hideOnRoutes: ['Settings', 'ClientSettings'],
  },
  {
    id: 'itemsCatalog',
    title: 'Items Catalog',
    route: 'ItemsCatalogSettings',
    icon: 'cube-outline',
    hideOnRoutes: ['Settings', 'ItemsCatalogSettings'],
  },
  {
    id: 'paymentSettings',
    title: 'Payment Settings',
    route: 'PaymentSettings',
    icon: 'card-outline',
    hideOnRoutes: ['Settings', 'PaymentSettings'],
  },
  {
    id: 'mobilePaymentSettings',
    title: 'Mobile Payment',
    route: 'MobilePaymentSettings',
    icon: 'phone-portrait-outline',
    hideOnRoutes: ['Settings', 'MobilePaymentSettings'],
  },
  {
    id: 'signatureSettings',
    title: 'Signature',
    route: 'SignatureSettings',
    icon: 'create-outline',
    hideOnRoutes: ['Settings', 'SignatureSettings'],
  },
  {
    id: 'notesSettings',
    title: 'Notes',
    route: 'NotesSettings',
    icon: 'document-text-outline',
    hideOnRoutes: ['Settings', 'NotesSettings'],
  },
  // ======================================================
  // FLOATING QUICK BUTTON SETTINGS MENU START
  // NEW: Optional shortcut to the dedicated FloatingQuickButton
  // settings page. It stays inside this isolated module config.
  // ======================================================
  {
    id: 'floatingQuickButtonSettings',
    title: 'Floating Button',
    route: 'FloatingQuickButtonSettings',
    icon: 'options-outline',
    hideOnRoutes: ['Settings', 'FloatingQuickButtonSettings'],
  },
  // ======================================================
  // FLOATING QUICK BUTTON SETTINGS MENU END
  // ======================================================

  // Invoice routes are already present in AppNavigator.
  // These will become more useful after Invoice side is completed.
  {
    id: 'createInvoice',
    title: 'Create Invoice',
    route: 'CreateInvoice',
    icon: 'receipt-outline',
    hideOnRoutes: ['CreateInvoice'],
  },
  {
    id: 'invoiceHistory',
    title: 'Invoice History',
    route: 'InvoiceHistory',
    icon: 'archive-outline',
    hideOnRoutes: ['InvoiceHistory'],
  },
];