// src/components/FloatingQuickButton/FloatingQuickButtonConfig.js

// ======================================================
// FLOATING QUICK BUTTON MODULE CONFIG
// This file is fully isolated.
// Add/remove shortcut menu items here only.
//
// IMPORTANT:
// - This menu is intentionally compact.
// - Only main workflow shortcuts are kept here.
// - Settings sub-pages stay inside Settings screen.
// - Quotation / Invoice logic is not touched.
// ======================================================

export const FLOATING_QUICK_BUTTON_HIDDEN_ROUTES = [
  'Home',
];

export const FLOATING_QUICK_BUTTON_MENU_ITEMS = [
  // ======================================================
  // MAIN NAVIGATION
  // ======================================================
  {
    id: 'home',
    title: 'Home',
    route: 'Home',
    icon: 'home-outline',
    hideOnRoutes: ['Home'],
  },

  // ======================================================
  // QUOTATION SIDE MAIN FLOW
  // ======================================================
  {
    id: 'createQuotation',
    title: 'Create Quotation',
    route: 'Create',
    icon: 'document-text-outline',
    hideOnRoutes: ['Create'],
  },
  {
    id: 'createInvoice',
    title: 'Create Invoice',
    route: 'CreateInvoice',
    icon: 'receipt-outline',
    hideOnRoutes: ['CreateInvoice'],
  },
  {
    id: 'quotationHistory',
    title: 'History Quotation',
    route: 'History',
    icon: 'time-outline',
    hideOnRoutes: ['History'],
  },
    {
    id: 'invoiceHistory',
    title: 'History Invoice',
    route: 'InvoiceHistory',
    icon: 'archive-outline',
    hideOnRoutes: ['InvoiceHistory'],
  },

  {
    id: 'quotationDrafts',
    title: 'Drafts Quotation',
    route: 'DraftQuotation',
    icon: 'file-tray-full-outline',
    hideOnRoutes: ['DraftQuotation'],
  },
  {
    id: 'invoiceDrafts',
    title: 'Drafts Invoice',
    route: 'InvoiceDraft',
    icon: 'file-tray-full-outline',
    hideOnRoutes: ['InvoiceDraft'],
  },

  // ======================================================
  // SETTINGS ENTRY
  // IMPORTANT:
  // Settings sub-pages such as Company Info, Client Profiles,
  // Items Catalog, Payment Settings, Mobile Payment, Signature,
  // Notes, and Floating Button settings should stay inside
  // Settings screen to keep this Quick Menu short and safe.
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
];