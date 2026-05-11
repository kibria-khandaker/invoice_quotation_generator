# Invoice & Quotation Generator App

A professional mobile application for creating, previewing, saving, exporting, and managing quotations and invoices.

Built with **Expo**, **React Native**, and **AsyncStorage**, this app is designed for freelancers, agencies, small businesses, shops, service providers, and individuals who need a fast, mobile-friendly, and offline-first business document generator.

---

## 📱 App Overview

The **Invoice & Quotation Generator App** helps users create professional business documents directly from a mobile device.

The app currently has a mostly completed and stable **Quotation Generator** module. The next major development goal is to build the **Invoice Generator** module using the same workflow, structure, and design approach while keeping the existing quotation system safe and unchanged.

The application is designed to support:

- Quotation creation
- Quotation preview
- Quotation PDF generation
- Quotation history management
- Draft quotation management
- Settings/preset management
- Invoice creation
- Invoice preview
- Invoice PDF generation
- Invoice history management

---

## ✨ Main Features

### 🧾 Quotation Generator

The quotation generator module is the main completed part of the application.

Current quotation features include:

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
- Preview quotation before saving
- Save quotation locally
- Generate professional quotation PDF
- Share generated PDF
- View saved quotation history
- Edit saved quotations
- Delete saved quotations
- Export selected quotations
- Backup and import quotation data

---

### 🧾 Planned Invoice Generator

The invoice generator module will follow the same structure and workflow as the quotation generator module.

Planned invoice features include:

- Create invoices
- Add company information
- Add client / bill-to information
- Add invoice items
- Add invoice date
- Add due date
- Add payment information
- Add notes
- Add signature
- Preview invoice
- Save invoice
- Generate invoice PDF
- View invoice history
- Edit saved invoice
- Delete saved invoice
- Export invoice PDF

---

## 🔢 Automatic Document Numbering

The app supports automatic quotation numbering using a date-based format.

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

Planned invoice number format can follow the same idea:

```text
DDMMYYI1001
```

Example:

```text
150426I1001
```

Where:

```text
I = Invoice
```

---

## 👀 Quotation Preview

Before saving or exporting, users can preview the full quotation inside the app.

Preview includes:

- Company information
- Client information
- Quotation number
- Date
- Validity
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

The preview screen supports different modes such as:

- Create mode
- History view mode
- History edit/update mode
- Draft preview mode

---

## 📄 PDF Generation

The app generates professional PDF documents using custom HTML templates.

PDF generation is handled using:

```text
expo-print
expo-sharing
expo-file-system
```

Quotation PDF features include:

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
- Notes section
- Footer support
- Multi-item handling
- Multi-page support for larger quotations

---

## 🗂️ Quotation History

Saved quotations are stored locally and managed from the History screen.

History features include:

- View saved quotations
- Search quotations
- Filter quotations
- Sort quotations
- Pagination
- Show 10 / 20 / 50 / 100 items
- Compact quotation cards
- View quotation
- Edit quotation
- Delete quotation
- Generate quotation PDF
- Export selected quotations
- Export multiple quotations as ZIP
- CSV backup
- CSV import
- Conflict handling during import
- Selection mode
- Bulk delete support

---

## 📝 Draft Quotations

The app supports saving incomplete quotations as drafts.

Draft quotation features include:

- Save partial quotation as draft
- Prevent saving fully empty draft forms
- Show saved draft list
- Search drafts
- Continue draft editing
- Preview draft
- Delete single draft
- Clear all drafts

Draft rules:

```text
Empty form = draft will not be saved
Partial form = draft can be saved
Draft data = stored separately from final quotation history
```

Draft storage key:

```text
QUOTATION_DRAFTS
```

Final quotation storage key:

```text
QUOTATIONS_HISTORY
```

---

## ⚙️ Settings Module

The Settings module stores reusable information for faster document creation.

Current settings sections include:

- Company Information
- Client Profiles
- Items Catalog
- Payment Terms & Method
- Mobile Payment Info
- Signature
- Notes
- Quotation Drafts

The Settings UI has been improved with a compact premium card style using soft gradients, smaller spacing, and mobile-friendly layout.

---

## 💾 Local Storage

The app uses AsyncStorage to store data locally on the user's device.

Storage system currently includes:

- Save quotation
- Update quotation
- Delete quotation
- Get all quotations
- Save quotation drafts
- Update quotation drafts
- Delete quotation drafts
- Clear quotation drafts
- Save imported quotations
- Clear quotation data

Storage package:

```text
@react-native-async-storage/async-storage
```

---

## 📤 Backup & Import

The app supports CSV-based backup and import for quotation data.

Backup/import features include:

- Export all quotation data as CSV
- Export selected quotation data
- Import saved backup CSV
- Detect conflicts during import
- Merge imported quotations
- Replace existing quotations
- Keep both copies
- Skip duplicates

Recommended practice:

```text
Export backup regularly before uninstalling, updating, or resetting the app.
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
| Expo Linear Gradient | UI gradient styling |
| Ionicons | App icons |
| JSZip | Multiple PDF export as ZIP |

---

## 📁 Project Structure

Recommended project structure:

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
    │   ├── HomeScreenStyle.js
    │   │
    │   ├── SettingsScreen.js
    │   ├── SettingsScreenStyle.js
    │   │
    │   ├── CompanySettingsScreen.js
    │   ├── ClientSettingsScreen.js
    │   ├── ItemsCatalogSettingsScreen.js
    │   ├── PaymentSettingsScreen.js
    │   ├── MobilePaymentSettingsScreen.js
    │   ├── SignatureSettingsScreen.js
    │   ├── NotesSettingsScreen.js
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
    │   └── InvoiceHistoryScreenStyle.js
    │
    ├── services/
    │   ├── storageService.js
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
    ├── context/
    ├── data/
    └── hooks/
```

---

## 🧭 App Navigation Flow

Current quotation flow:

```text
App.js
  ↓
AppNavigator.js
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
        ├── CreateQuotationScreen
        └── PreviewScreen
```

Planned invoice flow:

```text
App.js
  ↓
AppNavigator.js
  ↓
HomeScreen
  ├── CreateInvoiceScreen
  │     └── InvoicePreviewScreen
  │
  └── InvoiceHistoryScreen
        ├── InvoicePreviewScreen
        └── CreateInvoiceScreen
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
- Provides navigation to create quotation
- Provides navigation to quotation history
- Provides navigation to create invoice
- Provides navigation to invoice history

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
- Sends quotation data to preview screen

---

### Preview Screen

File:

```text
src/screens/PreviewScreen.js
```

Purpose:

- Shows final quotation preview
- Allows saving new quotation
- Allows updating existing quotation
- Allows PDF generation
- Allows sharing generated PDF

---

### History Screen

File:

```text
src/screens/HistoryScreen.js
```

Purpose:

- Displays all saved quotations
- Supports search, sort, filter, pagination
- Allows opening quotation preview
- Allows editing saved quotation
- Allows deleting quotation
- Supports backup and import

---

### Draft Quotation Screen

File:

```text
src/screens/DraftQuotationScreen.js
```

Purpose:

- Displays saved quotation drafts
- Allows continuing drafts
- Allows previewing drafts
- Allows deleting drafts
- Allows clearing all drafts

---

### Create Invoice Screen

File:

```text
src/screens/CreateInvoiceScreen.js
```

Purpose:

- Planned main form for creating invoices
- Should follow the Create Quotation screen structure
- Should remain separate from quotation logic

---

### Invoice Preview Screen

File:

```text
src/screens/InvoicePreviewScreen.js
```

Purpose:

- Planned screen for invoice preview
- Should allow saving invoice
- Should allow invoice PDF generation
- Should support view/edit modes

---

### Invoice History Screen

File:

```text
src/screens/InvoiceHistoryScreen.js
```

Purpose:

- Planned screen for saved invoices
- Should allow view, edit, PDF export, and delete

---

## 🧩 Important Services

### Storage Service

File:

```text
src/services/storageService.js
```

Used for local data management.

Current quotation functions include:

- Get all quotations
- Save quotation
- Update quotation
- Delete quotation
- Save all quotations
- Clear quotation data
- Get draft quotations
- Save draft quotation
- Update draft quotation
- Delete draft quotation
- Clear draft quotations

Planned invoice functions:

- Get all invoices
- Save invoice
- Update invoice
- Delete invoice
- Clear invoice data

---

### PDF Service

File:

```text
src/services/pdfService.js
```

Used for generating PDF files from HTML templates.

Quotation PDF generation uses:

```text
quotationTemplate.js
```

Planned invoice PDF generation should use:

```text
invoiceTemplate.js
```

---

### Quotation Template

File:

```text
src/templates/quotationTemplate.js
```

Used to generate the final HTML layout for quotation PDF.

---

### Invoice Template

File:

```text
src/templates/invoiceTemplate.js
```

Planned template for generating invoice PDF layout.

---

## 🗂️ Storage Keys

Current implemented storage keys:

```text
QUOTATIONS_HISTORY
QUOTATION_DRAFTS
```

Planned invoice storage keys:

```text
INVOICES_HISTORY
INVOICE_DRAFTS
```

Important rule:

```text
Quotation data and invoice data should never be mixed.
Draft data and final saved data should never be mixed.
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

This logic should be shared carefully or duplicated safely between quotation and invoice modules without breaking existing quotation behavior.

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

---

## 🔐 Data Storage Notes

All quotation and invoice data should be stored locally on the user's device using AsyncStorage.

Important notes:

- Data is offline-first
- Data is not automatically synced to cloud
- Deleting the app may delete local data
- Users should export backup files regularly
- Quotation and invoice storage must remain separate

---

## 🧪 Testing Checklist

### Quotation

- Create quotation
- Add multiple items/services
- Add item description
- Add discount
- Add tax percentage
- Add logo
- Add signature
- Preview quotation
- Save quotation
- Edit saved quotation
- Update quotation
- Delete quotation
- Search history
- Sort history
- Filter history
- Export PDF
- Share PDF
- Export selected PDFs
- Export ZIP
- Export CSV backup
- Import CSV backup
- Save draft
- Continue draft
- Preview draft
- Delete draft

---

### Invoice

- Create invoice
- Add invoice items
- Add invoice date
- Add due date
- Preview invoice
- Save invoice
- Generate invoice PDF
- View invoice history
- View invoice
- Edit invoice
- Delete invoice
- Export invoice PDF

---

### Settings

- Company settings
- Client settings
- Items catalog
- Payment settings
- Mobile payment settings
- Signature settings
- Notes settings
- Draft quotations

---

## 🛣️ Development Roadmap

### Phase I0 — Project Inspection

Before starting invoice development:

- Inspect current project structure
- Identify existing quotation files
- Identify existing invoice placeholder files
- Confirm navigation routes
- Confirm storage service structure
- Confirm PDF service structure
- Plan a safe invoice implementation

---

### Phase I1 — Invoice Storage + Navigation

Add invoice storage functions:

```text
getInvoices()
saveInvoice()
updateInvoice()
deleteInvoice()
clearAllInvoices()
```

Add invoice storage key:

```text
INVOICES_HISTORY
```

Confirm navigation routes:

```text
CreateInvoice
InvoicePreview
InvoiceHistory
```

---

### Phase I2 — Create Invoice

Build or update:

```text
CreateInvoiceScreen.js
CreateInvoiceScreenStyle.js
```

Required invoice fields:

- Invoice number
- Invoice date
- Due date
- Company information
- Client / Bill To information
- Items
- Discount
- Tax
- Total
- Payment information
- Notes
- Signature

---

### Phase I3 — Invoice Preview

Build:

```text
InvoicePreviewScreen.js
InvoicePreviewScreenStyle.js
```

Invoice preview should support:

- Save Invoice
- Generate PDF
- View mode
- Edit mode

---

### Phase I4 — Invoice PDF

Build:

```text
invoiceTemplate.js
```

Update:

```text
pdfService.js
```

Invoice PDF generation must not break quotation PDF generation.

---

### Phase I5 — Invoice History

Build:

```text
InvoiceHistoryScreen.js
InvoiceHistoryScreenStyle.js
```

Invoice history should support:

- Search
- Pagination
- View
- Edit
- PDF
- Delete

---

### Phase I6 — Final Testing

Test full invoice flow:

- Create Invoice
- Preview Invoice
- Save Invoice
- Generate PDF
- Invoice History
- View Invoice
- Edit Invoice
- Delete Invoice

Also retest quotation side to make sure existing features still work.

---

## 🐞 Known Areas for Improvement

The project can be further improved by:

- Building the full invoice generator module
- Adding invoice history
- Adding invoice PDF template
- Adding invoice drafts
- Moving reusable UI blocks into `src/components`
- Moving backup/import logic into a separate service
- Adding currency support
- Adding cloud backup
- Adding authentication
- Adding multi-language support
- Adding dark mode
- Adding payment status tracking
- Adding due date reminders
- Adding analytics/reporting

---

## 🧹 Code Quality Suggestions

Before releasing a production version, it is recommended to:

- Remove unused old files
- Clean unused folders
- Split large screen files into reusable components
- Validate all user input
- Improve error handling
- Add loading indicators
- Add form validation
- Add confirmation dialogs
- Test PDF generation on real devices
- Test backup/import on real devices
- Test Android production build
- Retest quotation side after adding invoice side

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

## ⚠️ Important Development Rules

When modifying this project:

1. Do not break existing quotation functionality.
2. Do not mix quotation and invoice storage.
3. Do not rename existing stable data keys without a migration plan.
4. Keep quotation templates and invoice templates separate.
5. Keep quotation history and invoice history separate.
6. Use full file replacement for large changes to avoid missing code.
7. Test each phase before moving to the next phase.
8. Preserve old logic unless a change is explicitly planned.
9. Keep UI compact and mobile-friendly.
10. Keep PDF output A4-safe and clean.

---

## Notes for Future Continuation

If this project is continued in a new ChatGPT chat, upload:

1. Latest project ZIP
2. Project handoff/context PDF
3. This README.md

Then ask:

```text
This is my latest Invoice & Quotation Generator project. First inspect the project structure and summarize the current state. Do not start coding yet. After inspection, provide a safe phase-wise plan to build the Invoice Generator side while preserving the existing Quotation Generator logic.
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
- Expo Linear Gradient
- Ionicons
- JSZip

---

## 📌 Project Status

Current status:

```text
Active Development
```

Completed:

```text
Quotation Generator Core
Quotation Preview
Quotation PDF
Quotation History
Quotation Drafts
Settings UI
Backup / Import
```

Pending:

```text
Invoice Generator
Invoice Preview
Invoice PDF
Invoice History
Invoice Storage
```

---

## ⭐ Summary

This project is a mobile-first invoice and quotation generator app designed to help users create professional business documents quickly and efficiently.

The quotation side is mostly complete and stable. The next major development goal is to build the invoice side using the same safe, structured, and phase-by-phase approach.

Once the invoice generator module is complete, this app will become a complete mobile business document generator for both quotations and invoices.
```
