# Invoice & Quotation Generator App

A mobile-first, offline-friendly business document management application for creating, previewing, saving, exporting, importing, and managing professional **quotations** and **invoices**.

Built with **Expo**, **React Native**, and **AsyncStorage**, this app is designed for:

- Freelancers
- Agencies
- Small businesses
- Shops
- Service providers
- Individuals who need fast and professional quotation/invoice workflows

---

## 📘 Master Project Documentation

For the complete product overview, system architecture, developer handoff guide, storage lifecycle, app flow diagrams, future AI continuation guide, and upgrade blueprint, see:

[Invoice & Quotation Generator Master Documentation](docs/Invoice_Quotation_Generator_Master_Project_Documentation.md)

---

## 📱 App Overview

The **Invoice & Quotation Generator App** helps users prepare professional business documents directly from a mobile device.

It supports the full lifecycle of both quotations and invoices:

```text
Create → Draft → Continue Editing → Preview → Save Final → PDF → History
```

The app also includes reusable settings presets, backup/import tools, history management, draft protection, and a floating quick action menu.

---

## ✅ Current Status

```text
Project Stage:
Feature-Complete Beta / Release Candidate

Core Quotation Flow:
Complete

Core Invoice Flow:
Complete

Settings Preset System:
Complete

Backup / Import:
Implemented

PDF Generation:
Implemented

Play Store Preparation:
Ready to begin final release checklist
```

---

## ✨ Main Features

### 🧾 Quotation Generator

- Create professional quotations
- Add company and client information
- Add multiple items/services
- Quantity, unit price, discount, tax, and total calculation
- Payment terms and payment method
- Mobile payment details
- Notes, logo, and signature
- Reuse saved presets from Settings
- Save incomplete quotation as draft
- Continue editing quotation drafts
- Auto-draft support
- Unsaved change protection
- Validation before final preview/save/PDF
- Preview quotation
- Save or update quotation
- Generate and share quotation PDF
- View, edit, delete, and export saved quotations

---

### 🧾 Invoice Generator

- Create professional invoices
- Add company and client information
- Invoice number, date, and due date
- Reference quotation number
- Add multiple items/services
- Quantity, unit price, discount, tax, and total calculation
- Payment terms and payment method
- Mobile payment details
- Notes, logo, and signature
- Payment status support
- Reuse saved presets from Settings
- Save incomplete invoice as draft
- Continue editing invoice drafts
- Auto-draft support
- Unsaved change protection
- Validation before final preview/save/PDF
- Preview invoice
- Save or update invoice
- Generate and share invoice PDF
- View, edit, delete, and export saved invoices

---

## 🔁 Core Workflow

### Quotation Flow

```text
Create Quotation
  ├── Save as Draft
  └── Go to Preview
          ├── Save Quotation
          └── Generate PDF
                  ↓
              History
```

### Invoice Flow

```text
Create Invoice
  ├── Save as Draft
  └── Go to Preview
          ├── Save Invoice
          └── Generate PDF
                  ↓
              History
```

---

## 📝 Draft Management

The app supports drafts for both quotations and invoices.

### Draft Features

- Save incomplete documents
- Prevent completely empty draft saving
- Continue editing later
- Select multiple drafts
- Delete selected drafts
- Clear all drafts
- Auto-save meaningful draft data when the app goes background
- Final save flow removes draft when appropriate

### Draft Rule

```text
Empty form = Draft blocked
Partial form = Draft allowed
Complete form = Preview / Save / PDF allowed
```

---

## 🗂️ History Management

Quotation and Invoice history screens include:

- Search
- Reset
- Filter
- Sort
- Pagination
- Item count selector
- Select mode
- Select current page
- Select all filtered items
- Mark clear
- View
- Edit
- Generate PDF
- Delete
- Export selected PDFs
- Export multiple PDFs as ZIP
- CSV backup/import

---

## 📄 PDF Generation

The app generates professional PDF documents using custom templates.

### PDF Features

- A4-friendly layout
- Logo support
- Signature support
- Company details
- Client details
- Items/service table
- Pricing summary
- Discount and tax
- Grand total
- Payment details
- Notes
- Invoice payment status
- Reference quotation support
- PDF sharing
- Bulk PDF ZIP export

---

## ⚙️ Settings & Reusable Presets

The Settings module stores reusable information so users do not need to type the same business data repeatedly.

### Supported Preset Sections

- Company Information
- Client Profiles
- Items Catalog
- Payment Terms & Method
- Mobile Payment Info
- Signature
- Notes

These presets can be loaded directly into Quotation and Invoice create screens.

---

## 📤 CSV Backup & Import

The app supports CSV-based backup and restore workflows.

### Supported Actions

- Export all data
- Export selected data
- Export single item/preset
- Import CSV
- Conflict detection

### Import Conflict Options

```text
Skip Duplicates
Replace Existing
Keep Both
```

CSV backup/import is available for major saved data and settings presets.

---

## 🧭 Navigation Areas

### Home Screen

Quick access to:

- Create Quotation
- Quotation History
- Create Invoice
- Invoice History
- Settings
- About
- Terms & Conditions
- Privacy Policy

### Floating Quick Button

A draggable, scrollable, isolated quick menu for faster navigation between important actions.

---

## 📄 Informational Pages

The app includes:

- About This App
- Terms & Conditions
- Privacy Policy

These pages are designed with the same mobile-friendly UI style as the rest of the app.

---

## 🔢 Automatic Numbering

### Quotation Number Format

```text
DDMMYYQ1001
```

Example:

```text
150426Q1001
```

### Invoice Number Format

```text
DDMMYYI1001
```

Example:

```text
150426I1001
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Expo | React Native framework |
| React Native | Mobile UI |
| React | Component-based logic |
| React Navigation | App navigation |
| AsyncStorage | Local data storage |
| Expo Print | PDF creation |
| Expo Sharing | PDF/file sharing |
| Expo FileSystem | File handling |
| Expo Document Picker | CSV import |
| Expo Image Picker | Logo/signature selection |
| Expo Image Manipulator | Image compression |
| Expo Linear Gradient | Gradient UI |
| Ionicons | Icons |
| JSZip | Bulk PDF ZIP export |

---

## 📁 Project Structure

```text
project-root/
│
├── App.js
├── app.json
├── eas.json
├── package.json
├── README.md
│
├── assets/
│
├── docs/
│   └── Invoice_Quotation_Generator_Master_Project_Documentation.md
│
└── src/
    ├── navigation/
    ├── screens/
    ├── services/
    ├── templates/
    ├── components/
    ├── utils/
    ├── constants/
    ├── hooks/
    ├── data/
    └── context/
```

---

## 🧩 Important Modules

### Screens

```text
HomeScreen
SettingsScreen
CreateQuotationScreen
PreviewScreen
HistoryScreen
DraftQuotationScreen
CreateInvoiceScreen
InvoicePreviewScreen
InvoiceHistoryScreen
InvoiceDraftScreen
AboutUsScreen
TermsConditionsScreen
PrivacyPolicyScreen
```

### Services

```text
storageService.js
settingsService.js
presetBackupService.js
pdfService.js
csvService.js
```

### Templates

```text
quotationTemplate.js
invoiceTemplate.js
```

---

## 💾 Local Storage Design

The app follows a local-first storage model.

Core storage areas include:

```text
QUOTATIONS_HISTORY
QUOTATION_DRAFTS
INVOICE_RECORDS
```

Invoice records internally support:

```text
invoiceLifecycle: draft | saved
```

Important rule:

```text
Quotation data and Invoice data remain separate.
Draft data and final saved records remain separated by lifecycle/storage rules.
```

---

## 🔐 Privacy & Local Data

The app is designed as an offline-first document management tool.

- User-created business data is stored locally on the device
- No automatic cloud sync is required
- Users manually export/import/share files
- Deleting the app or clearing storage may remove local data
- Regular backup is recommended

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Start Development Server

```bash
npx expo start
```

Clear Expo cache if needed:

```bash
npx expo start -c
```

---

### 3. Run on Android

```bash
npx expo run:android
```

Or use Expo Go during development.

---

### 4. Run on iOS

```bash
npx expo run:ios
```

> iOS native build requires macOS and Xcode.

---

## 📦 Build

### Android Preview APK

```bash
eas build -p android --profile preview
```

### Android Production Build

```bash
eas build -p android --profile production
```

### iOS Production Build

```bash
eas build -p ios --profile production
```

---

## 🧪 Recommended Testing Areas

Before release, test:

### Quotation

- Create quotation
- Draft save
- Draft continue
- Preview
- Final save
- PDF
- History edit/update
- CSV export/import

### Invoice

- Create invoice
- Draft save
- Draft continue
- Preview
- Final save
- PDF
- History edit/update
- Move to draft
- CSV export/import

### Settings

- Preset save/edit/delete
- Default preset loading
- CSV export/import
- Preset reuse in quotation/invoice

### UI

- Home footer layout
- Settings bottom spacing
- Floating quick button
- About / Terms / Privacy pages

---

## 🛣️ Roadmap

Potential future improvements:

- Quotation Draft CSV backup/import
- Invoice Draft CSV backup/import
- Currency selector
- Multi-language support
- Cloud backup
- User authentication
- Dark mode
- Reporting dashboard
- Due date reminder system
- Recurring invoice support

---

## ⚠️ Important Development Notes

When modifying this project:

1. Do not break existing Quotation flows.
2. Do not break existing Invoice flows.
3. Keep Quotation and Invoice storage separate.
4. Keep Draft and History logic safe.
5. Do not rename stable keys without a migration plan.
6. Keep PDF templates separate.
7. Preserve existing validation behavior.
8. Keep FloatingQuickButton isolated and low-dependency.
9. Use careful step-by-step edits.
10. Test every phase before moving forward.

Special preserved rule:

```text
CreateQuotationScreen.js uses:
- state variable: invoice
- item list key: services

Do not rename these without a full migration plan.
```

---

## 📚 Full Documentation

For full architecture, user flow diagrams, developer handoff notes, AI continuation instructions, file responsibilities, and future upgrade strategy, read:

[Master Project Documentation](docs/Invoice_Quotation_Generator_Master_Project_Documentation.md)

---

## 📄 License

This project is currently private/proprietary.

You may update this section if the project is published as open source.

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

The **Invoice & Quotation Generator App** is a mobile-first business document system for creating and managing quotations and invoices with reusable presets, offline storage, draft protection, PDF generation, history management, and backup/import tools.

It is designed to provide:

```text
Fast mobile workflow
Professional document output
Reusable business data
Safe draft/history management
Offline-first storage
Developer-friendly architecture
```