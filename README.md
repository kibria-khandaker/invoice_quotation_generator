# Invoice & Quotation Generator App

A professional mobile application for creating, previewing, saving, exporting, and managing quotations/invoices.  
Built with **Expo**, **React Native**, and **AsyncStorage**, this app is designed for freelancers, agencies, small businesses, and service providers who need a fast and offline-friendly quotation management solution.

---

## 📱 App Overview

This application allows users to create professional quotations with company details, client details, service items, pricing, discount, tax, payment terms, logo, signature, and notes. Users can preview quotations, generate PDF files, share them, save them locally, and manage quotation history.

---

## ✨ Features

### 🧾 Quotation Creation

- Create detailed quotations
- Add company information
- Add client information
- Add multiple service items
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

---

### 🔢 Automatic Quotation Number

The app automatically generates quotation numbers using a date-based format.

Example:

```text
DDMMYYQ1001
```

Example output:

```text
150426Q1001
```

This helps keep quotations organized and easier to track.

---

### 👀 Quotation Preview

Before saving or exporting, users can preview the full quotation inside the app.

Preview includes:

- Company information
- Client information
- Quotation number
- Date
- Validity
- Service list
- Subtotal
- Discount
- Tax
- Grand total
- Payment terms
- Payment method
- Notes
- Logo
- Signature

---

### 📄 PDF Generation

The app can generate a professional PDF quotation using a custom HTML template.

PDF features:

- Clean layout
- Logo support
- Signature support
- Service table
- Pricing summary
- Payment details
- Notes section
- Shareable PDF output

PDF generation is handled using:

```text
expo-print
expo-sharing
```

---

### 🗂️ Quotation History

Saved quotations are stored locally and can be managed from the History screen.

History features:

- View saved quotations
- Search quotations
- Filter quotations
- Sort quotations
- Open quotation preview
- Edit saved quotation
- Delete quotation
- Bulk delete support
- Export quotation PDF
- Export multiple quotations

---

### 💾 Local Storage

The app uses AsyncStorage to save quotation data locally on the device.

Storage system includes:

- Save quotation
- Update quotation
- Delete quotation
- Get all quotations
- Save imported quotations
- Clear quotation data

Storage package:

```text
@react-native-async-storage/async-storage
```

---

### 📤 Backup & Import

The app supports CSV-based backup and import.

Backup/import features:

- Export all quotation data as CSV
- Export selected quotation data
- Import saved backup CSV
- Conflict handling during import
- Merge imported quotations
- Replace existing quotations
- Keep both copies
- Skip duplicates

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
| Expo Image Picker | Logo/signature selection |
| Expo Image Manipulator | Image compression and resize |
| Expo File System | File read/write support |
| Expo Document Picker | CSV import support |
| JSZip | Multiple PDF export as ZIP |

---

## 📁 Project Structure

```text
Full_Project_Main_Folder/
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
│   ├── logo.png
│   ├── playstore.png
│   │
│   └── images/
│       ├── logo.png
│       ├── logo.jpeg
│       └── sing.jpeg
│
└── src/
    │
    ├── navigation/
    │   └── AppNavigator.js
    │
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── Old-HomeScreen.js
    │   ├── CreateQuotationScreen.js
    │   ├── CreateQuotationScreenStyle.js
    │   ├── PreviewScreen.js
    │   ├── HistoryScreen.js
    │   └── HistoryScreenStyle.js
    │
    ├── services/
    │   ├── storageService.js
    │   ├── Old-storageService.js
    │   └── pdfService.js
    │
    ├── templates/
    │   ├── quotationTemplate.js
    │   └── old-quotationTemplate.js
    │
    ├── utils/
    │   └── generateQuotationNumber.js
    │
    ├── components/
    ├── constants/
    ├── context/
    ├── data/
    └── hooks/
```

---

## 🧭 App Navigation Flow

```text
App.js
  ↓
AppNavigator.js
  ↓
HomeScreen
  ├── CreateQuotationScreen
  │     └── PreviewScreen
  │
  └── HistoryScreen
        ├── PreviewScreen
        └── CreateQuotationScreen
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
- Handles services
- Handles pricing
- Handles logo and signature upload
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
- Allows searching, sorting, filtering
- Allows opening quotation preview
- Allows editing saved quotation
- Allows deleting quotation
- Supports backup and import

---

## 🧩 Important Services

### Storage Service

File:

```text
src/services/storageService.js
```

Used for local quotation data management.

Functions include:

- Get all quotations
- Save quotation
- Update quotation
- Delete quotation
- Save all quotations
- Clear quotation data

---

### PDF Service

File:

```text
src/services/pdfService.js
```

Used for generating PDF files from quotation HTML.

PDF generation uses:

```text
expo-print
```

PDF sharing uses:

```text
expo-sharing
```

---

### Quotation Template

File:

```text
src/templates/quotationTemplate.js
```

Used to generate the final HTML layout for quotation PDF.

---

### Quotation Number Generator

File:

```text
src/utils/generateQuotationNumber.js
```

Used to generate automatic quotation numbers.

Format:

```text
DDMMYYQ1001
```

🧾 Smart Sequential Invoice Number Generator (Date-based + Daily reset)
Format (Perfect): 

```text
DDMMYYQ1001: 150426Q1001

150426Q1001
│ │ │ │   │
│ │ │ │   └── daily serial (1001, 1002...)
│ │ │ └────── Q (quotation separator)
│ │ └──────── year (2026 → 26)
│ └────────── month (04) April
└──────────── day (15)

logic:
- Today date
- Daily reset logic
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Full_Project_Main_Folder
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
 #or
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

## 🔐 Data Storage

All quotation data is stored locally on the user's device using AsyncStorage.

Important note:

- Data is offline-first
- Data is not automatically synced to cloud
- Deleting the app may delete local data
- Users should export backup files regularly

---

## 🧮 Calculation Logic

Each service item includes:

```text
quantity × unit price = line total
```

Quotation summary includes:

```text
Subtotal = sum of all service totals
Taxable Amount = Subtotal - Discount
Tax Amount = Taxable Amount × Tax Percentage / 100
Grand Total = Taxable Amount + Tax Amount
```

---

## 🖼️ Image Handling

The app supports:

- Company logo
- Authorized signature

Images are selected using:

```text
expo-image-picker
```

Images are compressed using:

```text
expo-image-manipulator
```

This helps reduce storage size and improve app performance.

---

## 📤 Backup System

CSV backup contains saved quotation data.

Backup is useful for:

- Data safety
- Moving data to another device
- Restoring saved quotations
- Keeping a record outside the app

Recommended practice:

```text
Export backup regularly before uninstalling or updating the app.
```

---

## 🧪 Dependency Check

The project includes a dependency checking script:

```text
check-deps.js
```

This script helps detect whether installed dependencies are used inside the project.

Run it with:

```bash
node check-deps.js
```

---

## 🐞 Known Areas for Improvement

The project can be further improved by:

- Moving reusable UI blocks into `src/components`
- Moving backup/import logic into a separate service
- Improving PDF template design
- Adding currency support
- Adding client database
- Adding company profile settings
- Adding cloud backup
- Adding authentication
- Adding multi-language support
- Adding dark mode
- Adding invoice mode and quotation mode separately
- Adding payment status tracking
- Adding due date reminders

---

## ✅ Recommended Future Folder Structure

```text
src/
│
├── components/
│   ├── QuotationForm/
│   ├── ServiceTable/
│   ├── PriceSummary/
│   ├── HistoryCard/
│   └── HistoryToolbar/
│
├── constants/
│   ├── storageKeys.js
│   └── appConfig.js
│
├── hooks/
│   ├── useQuotationForm.js
│   └── useQuotationHistory.js
│
├── services/
│   ├── storageService.js
│   ├── pdfService.js
│   ├── backupService.js
│   └── quotationNumberService.js
│
├── templates/
│   └── quotationTemplate.js
│
├── utils/
│   ├── calculateTotals.js
│   ├── escapeHTML.js
│   ├── dateUtils.js
│   └── csvBackupUtils.js
│
├── navigation/
│   └── AppNavigator.js
│
└── screens/
    ├── HomeScreen.js
    ├── CreateQuotationScreen.js
    ├── PreviewScreen.js
    └── HistoryScreen.js
```

---

## 🧑‍💻 Development Notes

### Recommended Node Version

Use a stable LTS version of Node.js.

Recommended:

```text
Node.js 18+
```

---

### Recommended Package Manager

Use one package manager consistently.

Recommended:

```text
npm
```

If using npm, keep:

```text
package-lock.json
```

If using yarn, keep:

```text
yarn.lock
```

Do not use both lock files together.

---

## 🧹 Code Quality Suggestions

Before releasing a production version, it is recommended to:

- Remove unused old files
- Clean unused folders
- Split large screen files into components
- Validate all user input
- Improve error handling
- Add loading indicators
- Add form validation
- Add confirmation dialogs
- Test PDF generation on real devices
- Test backup/import on real devices
- Test Android production build

---

## 📱 Testing Checklist

Before publishing the app, test the following:

- Create new quotation
- Add multiple services
- Add service description
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
- Export PDF
- Share PDF
- Export CSV backup
- Import CSV backup
- Build Android APK
- Install APK on real device

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

---

## 📌 Project Status

Current status:

```text
Active Development
```

The app is functional and includes the core quotation creation, preview, PDF export, local history, backup, and import features.

---

## ⭐ Summary

This project is a mobile-first quotation/invoice generator app designed to help users create professional business quotations quickly and efficiently. It supports offline storage, PDF generation, quotation history, and data backup, making it suitable for real-world small business usage.
