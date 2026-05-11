# Invoice & Quotation Generator App

A professional mobile application for creating, previewing, saving, updating, exporting, importing, backing up, and managing quotations and invoices.

Built with **Expo**, **React Native**, **AsyncStorage**, and an offline-first local storage approach, this app is designed for freelancers, agencies, small businesses, shops, service providers, and individuals who need a fast, mobile-friendly business document generator.

---

## 📱 App Overview

The **Invoice & Quotation Generator App** helps users create professional business documents directly from a mobile device.

The app currently supports both:

- Quotation creation and management
- Invoice creation and management
- Draft saving and continuation
- History management
- PDF generation and sharing
- CSV backup and import
- Reusable settings/preset data
- Floating quick actions
- About, Terms & Conditions, and Privacy Policy pages

The project has been developed carefully using a safe, phase-by-phase workflow so that new Invoice features do not break existing Quotation features.

---

## ✅ Current Project Status

```text
Status: Active Development

Core Quotation Flow: Complete
Core Invoice Flow: Complete
Settings Preset Backup: Complete
Draft / History / PDF Flow: Stable
Mobile UI Polish: Ongoing
```

Completed major modules:

```text
✅ Quotation Generator
✅ Quotation Preview
✅ Quotation PDF Generation
✅ Quotation History
✅ Quotation Drafts
✅ Quotation Validation
✅ Quotation Unsaved Protection
✅ Quotation Auto Draft
✅ Quotation Draft → Final Save Cleanup

✅ Invoice Generator
✅ Invoice Preview
✅ Invoice PDF Generation
✅ Invoice History
✅ Invoice Drafts
✅ Invoice Validation
✅ Invoice Unsaved Protection
✅ Invoice Auto Draft
✅ Invoice Draft → Final Save Flow
✅ Invoice Move to Draft Flow
✅ Invoice Edit Mode Update Flow

✅ Settings Preset Management
✅ Settings CSV Export / Import
✅ Settings Conflict Handling
✅ Floating Quick Button
✅ About Page
✅ Terms & Conditions Page
✅ Privacy Policy Page
```

Optional future work:

```text
⬜ Quotation Draft CSV Backup / Import
⬜ Invoice Draft CSV Backup / Import
⬜ Currency customization
⬜ Cloud backup
⬜ Authentication
⬜ Multi-language support
⬜ Dark mode
⬜ Reports / analytics
⬜ Production build testing
```

---

## ✨ Main Features

### 🧾 Quotation Generator

Quotation features include:

- Create detailed quotations
- Add company information
- Add client information
- Add multiple item/service rows
- Add item description
- Add quantity and unit price
- Automatic subtotal calculation
- Discount support
- Tax percentage support
- Grand total calculation
- Add payment terms
- Add payment method
- Add mobile payment information
- Add notes
- Add company logo
- Add authorized signature
- Load saved company preset
- Load saved client preset
- Load saved item catalog data
- Load saved payment preset
- Load saved mobile payment preset
- Load saved signature preset
- Load saved notes preset
- Validate quotation before preview/save/PDF
- Save incomplete quotation as draft
- Continue quotation draft editing
- Auto-save meaningful quotation draft when app goes background
- Protect unsaved quotation changes
- Preview quotation before saving
- Save quotation locally
- Update saved quotation
- Generate quotation PDF
- Share generated PDF
- View quotation history
- Edit saved quotations
- Delete saved quotations
- Export selected quotation PDFs
- Export multiple quotation PDFs as ZIP
- Export selected quotation CSV backup
- Export full quotation backup
- Export filtered quotation backup
- Import quotation CSV backup
- Conflict handling during import
- Search, filter, sort, and paginate quotation history
- Select quotation draft cards
- Delete selected quotation drafts
- Clear all quotation drafts

---

### 🧾 Invoice Generator

Invoice features include:

- Create detailed invoices
- Add company information
- Add client / bill-to information
- Add invoice number
- Add invoice date
- Add due date
- Add reference quotation number
- Add item/service rows
- Add item description
- Add quantity and unit price
- Automatic subtotal calculation
- Discount support
- Tax percentage support
- Grand total calculation
- Add payment terms
- Add payment method
- Add mobile payment information
- Add notes
- Add company logo
- Add authorized signature
- Add payment status
- Show payment status badge in invoice PDF
- Load saved company preset
- Load saved client preset
- Load saved item catalog data
- Load saved payment preset
- Load saved mobile payment preset
- Load saved signature preset
- Load saved notes preset
- Validate invoice before preview/save/PDF
- Save incomplete invoice as draft
- Continue invoice draft editing
- Auto-save meaningful invoice draft when app goes background
- Protect unsaved invoice changes
- Preview invoice before saving
- Save invoice locally
- Update saved invoice
- Generate invoice PDF
- Share generated PDF
- View invoice history
- Edit saved invoice
- Move invoice to draft when needed
- Delete invoice
- Export selected invoice PDFs
- Export multiple invoice PDFs as ZIP
- Export invoice CSV backup
- Import invoice CSV backup
- Preserve invoice drafts during CSV import
- Conflict handling during import
- Search, filter, sort, and paginate invoice history
- Select invoice draft cards
- Delete selected invoice drafts
- Clear all invoice drafts

---

## 🔁 Common Quotation & Invoice Flow

Quotation and Invoice follow a similar business document workflow.

### Create Screen Flow

```text
Create Screen
  ├── Fill company/client/items/payment data
  ├── Save as Draft
  ├── Go to Preview
  └── Update existing record when opened from History edit mode
```

### Preview Screen Flow

```text
Preview Screen
  ├── Edit / Go Back
  ├── Save final document
  ├── Update existing document
  └── Generate PDF
```

### History Screen Flow

```text
History Screen
  ├── Search
  ├── Reset
  ├── Filter
  ├── Sort
  ├── Select
  ├── Export selected PDFs
  ├── Export selected CSV
  ├── Full backup
  ├── Import CSV
  ├── Pagination
  └── Card actions:
      ├── View
      ├── Edit
      ├── PDF
      └── Delete
```

### Draft Screen Flow

```text
Draft Screen
  ├── Search
  ├── Reset / Refresh
  ├── Select
  ├── Delete selected
  ├── Clear all
  └── Card actions:
      ├── Continue Editing
      └── Delete
```

Draft pages intentionally avoid direct final preview actions. Users should continue editing first, then use the Create screen validation and Preview button.

---

## 🔢 Automatic Document Numbering

The app supports automatic document numbering.

### Quotation Number Format

Example format:

```text
DDMMYYQ1001
```

Example output:

```text
150426Q1001
```

Breakdown:

```text
150426Q1001
│ │ │ │   │
│ │ │ │   └── Daily serial number
│ │ │ └────── Q = Quotation
│ │ └──────── Year
│ └────────── Month
└──────────── Day
```

### Invoice Number Format

Example format:

```text
DDMMYYI1001
```

Example output:

```text
150426I1001
```

Breakdown:

```text
I = Invoice
```

Quotation and invoice numbering are kept separate.

---

## 👀 Preview System

Before saving or exporting, users can preview the full quotation or invoice inside the app.

Preview includes:

- Company information
- Client information
- Document number
- Date
- Validity / due date
- Reference quotation number for invoice
- Item/service list
- Subtotal
- Discount
- Tax
- Grand total
- Payment terms
- Payment method
- Mobile payment information
- Notes
- Logo
- Signature
- Payment status where applicable

Preview screens support different modes:

```text
Create preview mode
History view mode
History edit/update mode
Draft final save mode
```

---

## ✅ Validation System

Both Quotation and Invoice include validation before final save or PDF generation.

Validation checks include:

- Company name is required
- Client name or client company is required
- At least one valid item/service is required
- Item/service must have name or description
- Quantity must be greater than 0
- Price must be greater than 0
- Total amount must be greater than 0

Draft saving remains flexible:

```text
Empty form = draft blocked
Partial form = draft allowed
Complete form = preview/save/PDF allowed
```

This protects users from generating incomplete final business documents while still allowing unfinished work to be saved safely.

---

## 📝 Draft System

The app supports drafts for both quotations and invoices.

Draft features include:

- Save incomplete form as draft
- Prevent fully empty draft saving
- Continue editing saved drafts
- Update same draft instead of creating duplicates
- Select draft cards
- Delete selected drafts
- Clear all drafts
- Auto-save meaningful draft data when app goes background
- Unsaved leave protection
- Draft cleanup after successful final save

Draft rules:

```text
Empty form = draft will not be saved
Partial form = draft can be saved
Draft data = stored separately from final saved records
Final save from draft = draft cleanup after successful save
```

---

## 🗂️ History System

Saved quotations and invoices are stored locally and managed from their history screens.

History features include:

- View saved records
- Search records
- Filter records
- Sort records
- Pagination
- Show 10 / 20 / 50 / 100 items
- Compact cards
- View document
- Edit document
- Generate PDF
- Delete document
- Select mode
- Select current page
- Select all filtered/history records
- Mark clear
- Bulk delete
- Export selected PDFs
- Export multiple PDFs as ZIP
- Export selected CSV backup
- Export full CSV backup
- Export filtered CSV backup
- Import CSV backup
- Conflict handling during import

Import conflict options include:

```text
Skip Duplicates
Replace Existing
Keep Both
```

---

## 📄 PDF Generation

The app generates professional PDF documents using custom HTML templates.

PDF generation uses:

```text
expo-print
expo-sharing
expo-file-system
```

Quotation and Invoice PDF templates are separate.

PDF features include:

- A4-safe layout
- Compact item table
- Logo support
- Signature support
- Company information
- Client information
- Item/service table
- Discount and tax calculation
- Grand total section
- Payment details
- Mobile payment details
- Notes section
- Footer support
- Multi-item handling
- Multi-page support
- Invoice payment status badge
- Invoice reference quotation number support
- Share generated PDF
- Export selected PDFs
- Export multiple PDFs as ZIP

---

## ⚙️ Settings Module

The Settings module stores reusable information for faster document creation.

Settings sections include:

- Company Information
- Client Profiles
- Items Catalog
- Payment Terms & Method
- Mobile Payment Info
- Signature
- Notes
- Quotations Drafts
- Invoice Drafts

Reusable data from Settings can be loaded into both Quotation and Invoice forms.

### Settings Backup Features

The following settings pages support CSV export/import/backup:

```text
✅ Company Information
✅ Client Profiles
✅ Items Catalog
✅ Payment Terms & Method
✅ Mobile Payment Info
✅ Signature
✅ Notes
```

Each supported settings page includes:

- Export All
- Select mode
- Export Selected
- Single card export
- Import CSV
- Conflict handling
- Skip duplicates
- Replace existing
- Keep both
- Default preset handling

---

## 🧭 Home, Footer, and Floating Quick Button

### Home Screen

The Home screen provides quick access to major app areas:

- Create Quotation
- Quotation History
- Create Invoice
- Invoice History
- Drafts
- Settings
- About
- Terms & Conditions
- Privacy Policy

The Home footer menu includes compact links for:

- About
- Terms
- Privacy
- Settings

The app version is shown on the About page.

### Floating Quick Button

The app includes a floating quick action button.

Floating button features include:

- Quick navigation shortcuts
- Draggable position
- Scrollable menu
- Compact but readable menu items
- Isolated low-dependency structure
- Easy to remove or modify without affecting main flows

Important rule:

```text
FloatingQuickButton should remain isolated and low-dependency.
Changing or removing it should not affect Invoice, Quotation, Draft, History, or Settings logic.
```

---

## 📄 Static Information Pages

The app includes mobile-friendly information pages:

- About This App
- Terms & Conditions
- Privacy Policy

These pages use the same pink brand UI style and custom header.

---

## 💾 Local Storage

The app uses AsyncStorage to store data locally on the user's device.

Storage package:

```text
@react-native-async-storage/async-storage
```

Storage behavior:

- Offline-first
- Local device storage
- No automatic cloud sync
- User controls export/import/share actions
- Deleting the app may delete local data
- Users should export backups regularly

---

## 🗂️ Storage Keys

Core storage areas include:

```text
QUOTATIONS_HISTORY
QUOTATION_DRAFTS
INVOICES_HISTORY
INVOICE_DRAFTS
```

Settings preset storage includes separate keys for:

```text
Company Profiles
Client Profiles
Items Catalog
Payment Profiles
Mobile Payment Profiles
Signature Profiles
Note Templates
```

Important rule:

```text
Quotation data and invoice data must remain separate.
Draft data and final saved data must remain separate.
Settings presets must remain reusable for both quotation and invoice forms.
```

---

## 📤 Backup & Import

The app supports CSV-based backup and import.

Backup/import features include:

- Export all records
- Export filtered records
- Export selected records
- Export single preset record
- Import CSV backup
- Detect conflicts during import
- Skip duplicate records
- Replace existing records
- Keep both copies
- Preserve draft data during invoice import
- Preserve default preset when possible

Recommended practice:

```text
Export backups regularly before uninstalling, updating, resetting, or moving to another device.
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Expo | React Native development framework |
| React Native | Mobile app UI |
| React | Component-based UI logic |
| React Navigation | Screen navigation |
| AsyncStorage | Local data storage |
| Expo Print | PDF generation |
| Expo Sharing | PDF sharing |
| Expo FileSystem | File read/write support |
| Expo Document Picker | CSV import support |
| Expo Image Picker | Logo/signature image selection |
| Expo Image Manipulator | Image resize/compression |
| Expo Linear Gradient | UI gradient styling |
| Ionicons | App icons |
| JSZip | Multiple PDF export as ZIP |

---

## 📁 Project Structure

```text
invoice-quotation-generator/
│
├── App.js
├── index.js
├── app.json
├── eas.json
├── package.json
├── package-lock.json
├── README.md
│
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   ├── favicon.png
│   └── ...
│
└── src/
    │
    ├── navigation/
    │   └── AppNavigator.js
    │
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── HomeScreenStyles.js
    │   │
    │   ├── SettingsScreen.js
    │   ├── SettingsScreenStyle.js
    │   │
    │   ├── AboutUsScreen.js
    │   ├── TermsConditionsScreen.js
    │   ├── PrivacyPolicyScreen.js
    │   │
    │   ├── CompanySettingsScreen.js
    │   ├── CompanySettingsScreenStyle.js
    │   ├── ClientSettingsScreen.js
    │   ├── ClientSettingsScreenStyle.js
    │   ├── ItemsCatalogSettingsScreen.js
    │   ├── ItemsCatalogSettingsScreenStyle.js
    │   ├── PaymentSettingsScreen.js
    │   ├── PaymentSettingsScreenStyle.js
    │   ├── MobilePaymentSettingsScreen.js
    │   ├── MobilePaymentSettingsScreenStyle.js
    │   ├── SignatureSettingsScreen.js
    │   ├── SignatureSettingsScreenStyle.js
    │   ├── NotesSettingsScreen.js
    │   ├── NotesSettingsScreenStyle.js
    │   │
    │   ├── CreateQuotationScreen.js
    │   ├── CreateQuotationScreenStyle.js
    │   ├── PreviewScreen.js
    │   ├── PreviewScreenStyle.js
    │   ├── HistoryScreen.js
    │   ├── HistoryScreenStyle.js
    │   ├── DraftQuotationScreen.js
    │   ├── DraftQuotationScreenStyle.js
    │   │
    │   ├── CreateInvoiceScreen.js
    │   ├── CreateInvoiceScreenStyle.js
    │   ├── InvoicePreviewScreen.js
    │   ├── InvoicePreviewScreenStyle.js
    │   ├── InvoiceHistoryScreen.js
    │   ├── InvoiceHistoryScreenStyle.js
    │   ├── InvoiceDraftScreen.js
    │   └── InvoiceDraftScreenStyle.js
    │
    ├── services/
    │   ├── storageService.js
    │   ├── settingsService.js
    │   ├── presetBackupService.js
    │   ├── pdfService.js
    │   └── csvService.js
    │
    ├── templates/
    │   ├── quotationTemplate.js
    │   └── invoiceTemplate.js
    │
    ├── utils/
    │   ├── generateQuotationNumber.js
    │   ├── generateInvoiceNumber.js
    │   ├── formatCurrency.js
    │   ├── dateUtils.js
    │   ├── validationUtils.js
    │   └── htmlEscape.js
    │
    ├── constants/
    │   ├── colors.js
    │   ├── storageKeys.js
    │   └── appConstants.js
    │
    ├── components/
    │   ├── FloatingQuickButton.js
    │   ├── FloatingQuickButtonStyle.js
    │   └── PresetSelector.js
    │
    ├── context/
    ├── data/
    └── hooks/
```

---

## 🧭 App Navigation Flow

### Quotation Flow

```text
AppNavigator
  ↓
HomeScreen
  ├── CreateQuotationScreen
  │     └── PreviewScreen
  │
  ├── HistoryScreen
  │     ├── PreviewScreen
  │     └── CreateQuotationScreen
  │
  └── DraftQuotationScreen
        └── CreateQuotationScreen
```

### Invoice Flow

```text
AppNavigator
  ↓
HomeScreen
  ├── CreateInvoiceScreen
  │     └── InvoicePreviewScreen
  │
  ├── InvoiceHistoryScreen
  │     ├── InvoicePreviewScreen
  │     └── CreateInvoiceScreen
  │
  └── InvoiceDraftScreen
        └── CreateInvoiceScreen
```

### Settings Flow

```text
SettingsScreen
  ├── Company Information
  ├── Client Profiles
  ├── Items Catalog
  ├── Payment Terms & Method
  ├── Mobile Payment Info
  ├── Signature
  ├── Notes
  ├── Quotations Drafts
  └── Invoice Drafts
```

---

## 📌 Main Screens

### Home Screen

File:

```text
src/screens/HomeScreen.js
```

Purpose:

- Shows app landing page
- Provides quick access to quotation and invoice flows
- Provides footer links to About, Terms, Privacy, and Settings
- Keeps mobile UI compact

---

### Create Quotation Screen

File:

```text
src/screens/CreateQuotationScreen.js
```

Purpose:

- Main form for creating quotations
- Handles company information
- Handles client information
- Handles items/services
- Handles pricing
- Handles logo and signature
- Handles draft saving
- Handles validation
- Handles unsaved protection
- Sends quotation data to Preview screen

Important preserved naming:

```text
State variable: invoice
Item list key: services
```

Do not rename these without a careful migration plan.

---

### Quotation Preview Screen

File:

```text
src/screens/PreviewScreen.js
```

Purpose:

- Shows final quotation preview
- Allows saving new quotation
- Allows updating existing quotation
- Allows PDF generation
- Allows draft-to-final cleanup after successful save

---

### Quotation History Screen

File:

```text
src/screens/HistoryScreen.js
```

Purpose:

- Displays all saved quotations
- Supports search, sort, filter, pagination
- Supports view, edit, PDF, delete
- Supports selection, bulk PDF export, CSV export, and CSV import
- Supports full and filtered backup

---

### Draft Quotation Screen

File:

```text
src/screens/DraftQuotationScreen.js
```

Purpose:

- Displays saved quotation drafts
- Allows continuing draft editing
- Allows deleting drafts
- Allows selecting drafts
- Allows deleting selected drafts
- Allows clearing all drafts

Draft quotation cards intentionally use Continue Editing instead of direct Preview.

---

### Create Invoice Screen

File:

```text
src/screens/CreateInvoiceScreen.js
```

Purpose:

- Main form for creating invoices
- Handles company information
- Handles client information
- Handles invoice date and due date
- Handles reference quotation number
- Handles items/services
- Handles pricing
- Handles payment status
- Handles logo and signature
- Handles draft saving
- Handles validation
- Handles unsaved protection
- Handles edit invoice mode
- Handles Update Invoice from History edit mode

---

### Invoice Preview Screen

File:

```text
src/screens/InvoicePreviewScreen.js
```

Purpose:

- Shows final invoice preview
- Allows saving invoice
- Allows updating invoice
- Allows generating invoice PDF
- Allows sharing generated PDF
- Protects incomplete invoice from final save/PDF

---

### Invoice History Screen

File:

```text
src/screens/InvoiceHistoryScreen.js
```

Purpose:

- Displays saved invoices
- Supports search, sort, filter, pagination
- Supports view, edit, PDF, delete
- Supports selection, PDF export, CSV export, CSV import
- Supports move-to-draft lifecycle through edit mode

---

### Invoice Draft Screen

File:

```text
src/screens/InvoiceDraftScreen.js
```

Purpose:

- Displays invoice drafts
- Allows continuing draft editing
- Allows selecting drafts
- Allows deleting selected drafts
- Allows clearing all drafts
- Keeps draft actions focused on Continue Editing

---

## 🧩 Important Services

### Storage Service

File:

```text
src/services/storageService.js
```

Used for local data management.

Core functions include:

```text
Quotation:
- getQuotations()
- saveQuotation()
- updateQuotation()
- deleteQuotation()
- saveAllQuotations()
- clearQuotationData()

Quotation Drafts:
- getDraftQuotations()
- saveDraftQuotation()
- deleteDraftQuotation()
- clearDraftQuotations()

Invoice:
- getInvoices()
- saveInvoice()
- updateInvoice()
- deleteInvoice()
- saveAllInvoices()

Invoice Drafts:
- getInvoiceDrafts()
- saveInvoiceDraft()
- deleteInvoiceRecord()
- clearInvoiceDrafts()
```

---

### Settings Service

File:

```text
src/services/settingsService.js
```

Used for reusable preset data.

Settings data includes:

```text
Company Profiles
Client Profiles
Items Catalog
Payment Profiles
Mobile Payment Profiles
Signature Profiles
Note Templates
```

---

### Preset Backup Service

File:

```text
src/services/presetBackupService.js
```

Used for settings preset CSV export/import.

Features include:

- Smart CSV export
- Smart CSV import
- Conflict detection
- Skip duplicates
- Replace existing
- Keep both
- Default preset normalization

---

### PDF Service

File:

```text
src/services/pdfService.js
```

Used for generating PDF files from HTML templates.

PDF service supports:

```text
generatePDF()
generateInvoicePDF()
```

Quotation PDF uses:

```text
src/templates/quotationTemplate.js
```

Invoice PDF uses:

```text
src/templates/invoiceTemplate.js
```

---

## 🧮 Calculation Logic

Each item/service row includes:

```text
quantity × unit price = line total
```

Document summary includes:

```text
Subtotal = sum of all item totals
Taxable Amount = Subtotal - Discount
Tax Amount = Taxable Amount × Tax Percentage / 100
Grand Total = Taxable Amount + Tax Amount
```

Both quotation and invoice flows follow the same pricing calculation concept.

---

## 🖼️ Image Handling

The app supports:

- Company logo
- Authorized signature

Images may be selected using:

```text
expo-image-picker
```

Images may be compressed using:

```text
expo-image-manipulator
```

This helps reduce storage size and improve performance.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd invoice-quotation-generator
```

---

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

---

### 3. Start Development Server

```bash
npx expo start
```

Clear cache if needed:

```bash
npx expo start -c
```

---

### 4. Run on Android

```bash
npx expo run:android
```

Or scan the QR code using the Expo Go app.

---

### 5. Run on iOS

```bash
npx expo run:ios
```

> iOS build requires macOS and Xcode.

---

## 📦 Build

This project includes EAS configuration.

### Build Android APK Preview

```bash
eas build -p android --profile preview
```

---

### Build Android Production

```bash
eas build -p android --profile production
```

---

### Build iOS Production

```bash
eas build -p ios --profile production
```

---

## ⚙️ Expo Configuration

Main Expo configuration file:

```text
app.json
```

This file includes:

- App name
- App slug
- App icon
- Splash screen
- Android package name
- EAS project ID
- App version

The About page can display the app version dynamically from Expo config.

---

## 🔐 Data Storage Notes

All quotation and invoice data is stored locally on the user's device using AsyncStorage.

Important notes:

- Data is offline-first
- Data is not automatically synced to cloud
- Deleting the app may delete local data
- Clearing device storage may delete local data
- Users should export backup files regularly
- Quotation and invoice storage must remain separate
- Draft and final saved records must remain separate

---

## 🧪 Testing Checklist

### Quotation

- Create quotation
- Add company information
- Add client information
- Add multiple items/services
- Add item description
- Add discount
- Add tax percentage
- Add logo
- Add signature
- Preview quotation
- Validation blocks incomplete preview
- Save quotation
- Edit saved quotation
- Update quotation
- Save incomplete edit as draft when needed
- Delete quotation
- Search history
- Sort history
- Filter history
- Export PDF
- Share PDF
- Export selected PDFs
- Export ZIP
- Export CSV backup
- Export filtered CSV
- Import CSV backup
- Conflict handling
- Save draft
- Continue draft
- Delete draft
- Select draft
- Delete selected drafts
- Clear all drafts
- Draft final save cleanup

---

### Invoice

- Create invoice
- Add company information
- Add client information
- Add invoice items
- Add invoice date
- Add due date
- Add reference quotation number
- Add payment status
- Preview invoice
- Validation blocks incomplete preview
- Save invoice
- Generate invoice PDF
- Share PDF
- View invoice history
- View invoice
- Edit invoice
- Update invoice
- Save incomplete edit as draft when needed
- Move invoice to draft when needed
- Delete invoice
- Export selected PDFs
- Export ZIP
- Export CSV backup
- Import CSV backup
- Preserve drafts during import
- Save invoice draft
- Continue invoice draft
- Delete invoice draft
- Select invoice draft
- Delete selected drafts
- Clear all drafts

---

### Settings

- Company settings
- Client settings
- Items catalog
- Payment settings
- Mobile payment settings
- Signature settings
- Notes settings
- Export all preset CSV
- Export selected preset CSV
- Export single preset CSV
- Import preset CSV
- Conflict handling
- Default preset restore
- Preset load into Create Quotation
- Preset load into Create Invoice

---

### UI / Navigation

- Home footer menu
- Floating Quick Button
- Floating Quick Button scroll
- About page
- Terms & Conditions page
- Privacy Policy page
- Settings page bottom spacing
- Draft card select/delete behavior
- History card view/edit/PDF behavior

---

## 🛣️ Development Roadmap

### Completed

```text
✅ Project inspection
✅ Quotation core
✅ Quotation PDF
✅ Quotation history
✅ Quotation drafts
✅ Quotation validation
✅ Quotation unsaved protection
✅ Quotation auto draft
✅ Quotation draft cleanup
✅ Invoice storage
✅ Invoice create
✅ Invoice preview
✅ Invoice PDF
✅ Invoice history
✅ Invoice drafts
✅ Invoice validation
✅ Invoice unsaved protection
✅ Invoice auto draft
✅ Settings preset system
✅ Settings CSV backup/import
✅ Floating Quick Button
✅ About / Terms / Privacy pages
```

### Next Recommended Phases

```text
Phase Next-1:
Final full regression test

Phase Next-2:
Quotation Draft CSV Backup / Import

Phase Next-3:
Invoice Draft CSV Backup / Import

Phase Next-4:
Code cleanup and reusable component extraction

Phase Next-5:
Production build testing
```

---

## 🐞 Known Areas for Improvement

The project can be further improved by:

- Draft CSV backup/import for quotation drafts
- Draft CSV backup/import for invoice drafts
- Moving reusable UI blocks into `src/components`
- Moving more backup/import logic into reusable services
- Adding currency selector
- Adding cloud backup
- Adding authentication
- Adding multi-language support
- Adding dark mode
- Adding analytics/reporting
- Adding due date reminders
- Adding recurring invoice support
- Adding customer statement/reporting
- Adding business dashboard
- Adding print-friendly options

---

## 🧹 Code Quality Suggestions

Before releasing a production version, it is recommended to:

- Remove unused old helper functions carefully
- Clean unused styles only after testing
- Split large screen files into reusable components
- Keep quotation and invoice logic separate unless intentionally shared
- Keep PDF templates separate
- Validate all user input
- Improve error handling where needed
- Add loading indicators for large imports/exports
- Test PDF generation on real devices
- Test backup/import on real devices
- Test Android production build
- Retest quotation side after invoice changes
- Retest invoice side after quotation changes

---

## ⚠️ Important Development Rules

When modifying this project:

1. Do not break existing quotation functionality.
2. Do not break existing invoice functionality.
3. Do not mix quotation and invoice storage.
4. Do not rename existing stable data keys without a migration plan.
5. Keep quotation templates and invoice templates separate.
6. Keep quotation history and invoice history separate.
7. Keep quotation drafts and invoice drafts separate.
8. Preserve `invoice` state name and `services` item key in `CreateQuotationScreen.js`.
9. Use full file replacement for large changes to avoid missing code.
10. Use small old/new patch blocks for small changes.
11. Test each phase before moving to the next phase.
12. Preserve old working logic unless a change is explicitly planned.
13. Keep UI compact and mobile-friendly.
14. Keep PDF output A4-safe and clean.
15. Keep FloatingQuickButton isolated and low-dependency.

---

## 🧯 Troubleshooting

### Expo start issue

Try clearing cache:

```bash
npx expo start -c
```

---

### Android build issue

Make sure EAS CLI is installed:

```bash
npm install -g eas-cli
```

Then login:

```bash
eas login
```

---

### Dependency issue

Try reinstalling dependencies:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

### PDF sharing not working

Make sure the device supports file sharing. Some emulators may not handle sharing properly.

Test on a real Android device for best results.

---

### Image upload issue

Make sure media permissions are allowed on the device.

---

### CSV import issue

Check that the imported CSV file was exported from the app or follows the same expected structure.

Recommended:

```text
Export a fresh backup first.
Then test import with a small file.
```

---

### Local data missing

Possible reasons:

- App was uninstalled
- Device storage was cleared
- AsyncStorage data was reset
- Backup was not restored
- Wrong CSV file was imported

Recommended:

```text
Keep regular CSV backups of important app data.
```

---

## Notes for Future Continuation

If this project is continued in a new ChatGPT chat, upload:

1. Latest full project ZIP
2. This README.md
3. Any latest issue screenshots
4. A short note of what was last changed

Then ask:

```text
This is my latest Invoice & Quotation Generator project. First inspect the project structure and summarize the current state. Do not start coding yet. After inspection, provide a safe phase-wise plan for the next task while preserving all existing Invoice, Quotation, Draft, History, PDF, Settings, and Floating Button logic.
```

---

## 📄 License

This project is currently private/proprietary.

You may update this section if you want to publish it as open-source.

Example:

```text
MIT License
```

---

## 👤 Author

Developed by:

```text
Your Name / Company Name
```

Website:

```text
https://your-website.com
```

Support:

```text
support@your-email.com
```

---

## 🙌 Credits

Built with:

- Expo
- React Native
- React Navigation
- AsyncStorage
- Expo Print
- Expo Sharing
- Expo FileSystem
- Expo Document Picker
- Expo Image Picker
- Expo Image Manipulator
- Expo Linear Gradient
- Ionicons
- JSZip

---

## ⭐ Summary

This project is a mobile-first invoice and quotation generator app designed to help users create professional business documents quickly and efficiently.

The app now supports both quotation and invoice workflows, including create, preview, save, update, draft, history, PDF generation, backup, import, reusable settings presets, and mobile-friendly navigation.

The main focus of the project is:

```text
Safe development
Offline-first local storage
Reusable business data
Clean mobile UI
Separate quotation and invoice logic
Reliable draft/history/PDF workflows
```

Once final regression testing and optional draft backup/import features are completed, the app will be ready for broader real-world usage and production build testing.
```