// src/screens/PrivacyPolicyScreen.js

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const BRAND_COLOR = '#fd4475';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_COLOR} />

      <LinearGradient
        colors={[BRAND_COLOR, '#ff6b95', '#ffe7ef']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>
            Invoice & Quotation Generator
          </Text>
        </View>

        <View style={styles.headerIconBox}>
          <Ionicons name="lock-closed-outline" size={24} color={BRAND_COLOR} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark-outline" size={34} color={BRAND_COLOR} />
          </View>

          <Text style={styles.appTitle}>
            Invoice & Quotation Generator
          </Text>

          <Text style={styles.heroText}>
            Invoice & Quotation Generator is designed to help users create,
            manage, export, and share quotations and invoices directly from
            their own device.
          </Text>

          <Text style={styles.heroText}>
            This Privacy Policy explains how the App handles information, what
            data may be stored locally, and how user-controlled export and
            sharing features work.
          </Text>

          <View style={styles.noticePill}>
            <Ionicons name="information-circle-outline" size={15} color={BRAND_COLOR} />
            <Text style={styles.noticePillText}>
              Effective Date: May 13, 2026
            </Text>
          </View>
        </View>

        <Section
          number="1"
          icon="briefcase-outline"
          title="Developer Information"
          text="App Name: Invoice & Quotation Generator"
          bullets={[
            'Developer Website: https://netkib.com',
            'Privacy Contact Email: netkib.apps@gmail.com',
            'For privacy-related questions, users may contact us at the email address above.',
          ]}
        />

        <Section
          number="2"
          icon="ban-outline"
          title="Information We Do Not Collect"
          text="Invoice & Quotation Generator does not require account registration, login, or sign-in. We do not collect, upload, sell, rent, or transmit users’ quotation, invoice, draft, client, company, signature, or document data to our servers."
          bullets={[
            'No advertising trackers',
            'No user profiling for ads',
            'No cloud synchronization of user documents',
            'No remote storage of quotations, invoices, or business records',
          ]}
        />

        <Section
          number="3"
          icon="create-outline"
          title="Information Users May Enter in the App"
          text="To use the App’s features, users may choose to enter or save information such as:"
          bullets={[
            'Company name, address, email, and phone number',
            'Client or customer details',
            'Quotation and invoice numbers',
            'Item or service descriptions',
            'Prices, discounts, tax values, and totals',
            'Payment terms and payment method notes',
            'Mobile payment information entered by the user',
            'Notes and document footer text',
            'Company logo image',
            'Authorized signature image',
          ]}
          extraText="This information is provided voluntarily by the user for document creation and management."
        />

        <Section
          number="4"
          icon="save-outline"
          title="Local Device Storage"
          text="The App stores user-created content locally on the user’s own device so that features such as drafts, history, presets, and saved records can work properly."
          bullets={[
            'Saved quotations',
            'Saved invoices',
            'Draft quotations',
            'Draft invoices',
            'Company profiles',
            'Client profiles',
            'Item or service presets',
            'Payment-related presets',
            'Notes and signature presets',
            'Local document history',
          ]}
          extraText="This data remains on the user’s device unless the user chooses to export, share, delete, clear app data, or uninstall the App."
        />

        <Section
          number="5"
          icon="image-outline"
          title="Images Selected by the User"
          text="The App allows users to select images from their device for limited document-related purposes, such as company logos and authorized signature images."
          bullets={[
            'Images are selected only when the user chooses to upload them inside the App.',
            'The App does not upload these images to our servers.',
          ]}
        />

        <Section
          number="6"
          icon="folder-open-outline"
          title="PDF, ZIP, CSV, Export, Import, and Sharing Features"
          text="The App includes user-controlled file features, including:"
          bullets={[
            'Generating quotation PDFs',
            'Generating invoice PDFs',
            'Sharing generated PDF files',
            'Packaging multiple selected PDFs into a ZIP file for sharing',
            'Exporting supported data as CSV backup files',
            'Importing supported CSV backup files back into the App',
          ]}
          extraText="These actions happen only when initiated by the user. When a user chooses to share a PDF, ZIP, or CSV file through another app, platform, cloud service, messaging app, or email client, that transfer is controlled by the user and may be subject to the privacy practices of the selected third-party service. The App does not automatically send exported or shared files to the developer."
        />

        <Section
          number="7"
          icon="share-social-outline"
          title="Data Sharing"
          text="We do not sell or share user-entered quotation, invoice, client, company, draft, history, logo, or signature data with third parties."
          bullets={[
            'Content may leave the device only when the user chooses to share a generated document.',
            'Content may leave the device only when the user chooses to export a backup file.',
            'Content may leave the device only when the user saves a file using device or third-party tools.',
            'Content may leave the device only when the user imports a file from a location selected by the user.',
          ]}
          extraText="These are user-directed actions."
        />

        <Section
          number="8"
          icon="trash-outline"
          title="Data Retention and Deletion"
          text="Because the App stores working data locally on the user’s device:"
          bullets={[
            'Data remains available until the user deletes it, clears app storage, or uninstalls the App.',
            'Uninstalling the App may remove locally stored in-app data from the device.',
            'Exported files, shared files, or backup files saved outside the App may remain wherever the user chose to store or send them.',
            'The developer does not maintain server-side copies of user-generated quotations, invoices, drafts, or backups.',
          ]}
          extraText="Users are responsible for keeping backup copies of any exported files they wish to retain."
        />

        <Section
          number="9"
          icon="shield-outline"
          title="Data Security"
          text="The App is designed around a local-first workflow. User-created business records are stored on the user’s device rather than being uploaded to a developer-controlled server."
          extraText="Users should also take reasonable steps to protect their own device, exported files, and any files they share through external apps or services."
        />

        <Section
          number="10"
          icon="phone-portrait-outline"
          title="Permissions and Device Access"
          text="The App may request or use device capabilities only as needed for its features, such as:"
          bullets={[
            'Selecting user-chosen logo or signature images',
            'Creating, exporting, importing, or sharing user-initiated files',
          ]}
          extraText="The App does not use microphone recording for its core features. Any permission request, where applicable, is used only to support the related user-facing function."
        />

        <Section
          number="11"
          icon="people-outline"
          title="Children’s Privacy"
          text="Invoice & Quotation Generator is intended for general users, freelancers, small businesses, service providers, and professionals."
          bullets={[
            'The App is not specifically directed to children.',
            'We do not knowingly collect personal information from children through the App.',
          ]}
        />

        <Section
          number="12"
          icon="apps-outline"
          title="Third-Party Services"
          text="The App may rely on standard operating system or device-level features for actions such as file selection, file sharing, and document handling."
          extraText="If a user shares files using third-party apps or services, those services operate under their own privacy policies and terms."
        />

        <Section
          number="13"
          icon="refresh-outline"
          title="Changes to This Privacy Policy"
          text="We may update this Privacy Policy from time to time to reflect changes in the App, legal requirements, or policy expectations."
          extraText="When updates are made, the revised version will be posted on the official Privacy Policy page."
        />

        <Section
          number="14"
          icon="mail-outline"
          title="Contact Us"
          text="For questions about this Privacy Policy or privacy-related matters, contact:"
          bullets={[
            'Email: netkib.apps@gmail.com',
            'Website: https://netkib.com',
          ]}
        />

        <View style={styles.importantCard}>
          <View style={styles.importantHeader}>
            <Ionicons name="lock-closed-outline" size={22} color="#f97316" />
            <Text style={styles.importantTitle}>Privacy Reminder</Text>
          </View>

          <Text style={styles.importantText}>
            Quotations, invoices, exported files, logos, signatures, and
            business records may contain information you consider important.
            Review and protect your device and shared files carefully.
          </Text>
        </View>

        <Text style={styles.footerText}>
          This page presents the App’s current Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ number, icon, title, text, bullets, extraText }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.numberBox}>
          <Text style={styles.numberText}>{number}</Text>
        </View>

        <View style={styles.sectionIconBox}>
          <Ionicons name={icon} size={19} color={BRAND_COLOR} />
        </View>

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {!!text && <Text style={styles.sectionText}>{text}</Text>}

      {Array.isArray(bullets) && bullets.length > 0 ? (
        <View style={styles.bulletWrap}>
          {bullets.map((item, index) => (
            <View key={`${title}-${index}`} style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={15} color="#16a34a" />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {!!extraText && <Text style={styles.extraText}>{extraText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
  },

  header: {
    minHeight: 92,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  headerTitle: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },

  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fffafb',
  },

  content: {
    padding: 16,
    paddingBottom: 36,
  },

  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fff0f4',
    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },

  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  appTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    color: '#07142f',
    textAlign: 'center',
  },

  heroText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#667085',
    textAlign: 'center',
    fontWeight: '600',
  },

  noticePill: {
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fff0f5',
    borderWidth: 1,
    borderColor: '#ffd3df',
    flexDirection: 'row',
    alignItems: 'center',
  },

  noticePillText: {
    marginLeft: 5,
    fontSize: 12,
    lineHeight: 15,
    color: BRAND_COLOR,
    fontWeight: '900',
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fff0f4',
    elevation: 2,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  numberBox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  numberText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#ffffff',
    fontWeight: '900',
  },

  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 13,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    color: '#07142f',
  },

  sectionText: {
    fontSize: 12.8,
    lineHeight: 20,
    color: '#667085',
    fontWeight: '600',
  },

  extraText: {
    marginTop: 9,
    fontSize: 12.8,
    lineHeight: 20,
    color: '#667085',
    fontWeight: '600',
  },

  bulletWrap: {
    marginTop: 8,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 7,
  },

  bulletText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#475467',
    fontWeight: '700',
  },

  importantCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    padding: 16,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  importantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  importantTitle: {
    marginLeft: 7,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    color: '#07142f',
  },

  importantText: {
    fontSize: 12.8,
    lineHeight: 20,
    color: '#667085',
    fontWeight: '600',
  },

  footerText: {
    marginTop: 14,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#98a2b3',
    textAlign: 'center',
    fontWeight: '700',
  },
});