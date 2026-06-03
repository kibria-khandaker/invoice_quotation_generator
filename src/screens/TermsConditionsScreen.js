// src/screens/TermsConditionsScreen.js

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

export default function TermsConditionsScreen({ navigation }) {
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
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>
            Invoice & Quotation Generator
          </Text>
        </View>

        <View style={styles.headerIconBox}>
          <Ionicons name="document-text-outline" size={24} color={BRAND_COLOR} />
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

          <Text style={styles.appTitle}>Terms of Use</Text>

          <Text style={styles.heroText}>
            These Terms and Conditions explain the basic rules for using
            Invoice & Quotation Generator. By using the app, you agree to use
            it responsibly, lawfully, and with care when creating business
            documents.
          </Text>

          <View style={styles.noticePill}>
            <Ionicons name="information-circle-outline" size={15} color={BRAND_COLOR} />
            <Text style={styles.noticePillText}>Last updated: May 2026</Text>
          </View>
        </View>

        <Section
          number="1"
          icon="checkmark-circle-outline"
          title="Acceptance of Terms"
          text="By accessing or using Invoice & Quotation Generator, you agree to these Terms and Conditions. If you do not agree with them, you should stop using the app."
        />

        <Section
          number="2"
          icon="phone-portrait-outline"
          title="Purpose of the App"
          text="The app is designed to help users create, manage, preview, save, export, import, and share quotations and invoices from their own device. It is a document creation and management tool for personal, freelance, and business use."
        />

        <Section
          number="3"
          icon="person-outline"
          title="User Responsibility"
          text="You are responsible for the information you enter, save, export, import, or share through the app. This includes all business, client, pricing, tax, payment, branding, and signature-related content."
          bullets={[
            'Review each quotation or invoice before saving, exporting, or sharing.',
            'Check company, client, pricing, discount, tax, and payment information carefully.',
            'Use only information, logos, signatures, and content you are authorized to use.',
            'Protect your device and any exported files from unauthorized access.',
          ]}
        />

        <Section
          number="4"
          icon="document-text-outline"
          title="Quotations, Invoices, and Generated Documents"
          text="The app generates quotations, invoices, and related document files based on information provided by the user. The correctness, completeness, and suitability of each document depend on the data entered by the user."
          bullets={[
            'Generated documents should be reviewed before business use.',
            'The app does not independently verify document accuracy.',
            'The app does not confirm legal, tax, accounting, or payment compliance.',
          ]}
        />

        <Section
          number="5"
          icon="archive-outline"
          title="Drafts, History, and Local Records"
          text="The app may store drafts, saved quotation history, saved invoice history, reusable presets, and related records locally on the user’s device to support its features."
          bullets={[
            'Drafts are intended for unfinished or work-in-progress documents.',
            'History records are intended for saved quotations and invoices.',
            'Users are responsible for reviewing, managing, deleting, or backing up their own records.',
            'Locally stored data may be removed if the app is uninstalled or app storage is cleared.',
          ]}
        />

        <Section
          number="6"
          icon="folder-open-outline"
          title="PDF, ZIP, CSV, Export, Import, and Sharing"
          text="The app may allow users to create quotation PDFs, invoice PDFs, package multiple selected PDFs into a ZIP file, export supported data as CSV, import supported CSV backups, and share files using device-supported sharing tools."
          bullets={[
            'These actions occur only when initiated by the user.',
            'Users should check every PDF, ZIP, or CSV file before sharing or storing it.',
            'Imported data should be reviewed after restore.',
            'Conflict options such as Skip, Replace, or Keep Both should be used carefully where available.',
          ]}
        />

        <Section
          number="7"
          icon="share-social-outline"
          title="Sharing and Third-Party Apps"
          text="When you share PDF, ZIP, CSV, or other files from the app, the sharing process is handled by your device and the app or service you choose. You are responsible for selecting the correct recipient, storage location, or third-party service."
          bullets={[
            'The developer does not control how third-party apps handle shared files.',
            'Files sent outside the app may remain in the destination chosen by the user.',
            'Review files carefully before sending them through messaging, email, cloud storage, or other services.',
          ]}
        />

        <Section
          number="8"
          icon="image-outline"
          title="Logos, Signatures, and Uploaded Images"
          text="Users may select company logo images and authorized signature images from their own device for use in quotations, invoices, and saved presets."
          bullets={[
            'Only upload or use images you own or are authorized to use.',
            'Do not misuse another person’s signature, company logo, or branding.',
            'You remain responsible for the lawful use of any uploaded image content.',
          ]}
        />

        <Section
          number="9"
          icon="calculator-outline"
          title="Calculations and Financial Review"
          text="The app may calculate subtotals, discounts, tax amounts, grand totals, paid amounts, due amounts, or other values based on user input. You should verify all amounts before relying on or sharing a document."
          bullets={[
            'Check calculations before issuing a quotation or invoice.',
            'Confirm tax, pricing, and payment details for your own situation.',
            'The app is not a substitute for professional accounting, tax, legal, or financial advice.',
          ]}
        />

        <Section
          number="10"
          icon="lock-closed-outline"
          title="Local Data and Backup Responsibility"
          text="The app is designed around local device storage. User-created data is not automatically backed up to the developer’s server. Users should create their own exports or backups when needed."
          bullets={[
            'Uninstalling the app or clearing storage may remove local app data.',
            'Exported files should be stored safely if the user wants long-term copies.',
            'The developer is not responsible for data loss caused by device issues, accidental deletion, or failure to maintain backups.',
          ]}
        />

        <Section
          number="11"
          icon="ban-outline"
          title="Prohibited Use"
          text="You agree not to use the app for illegal, fraudulent, deceptive, abusive, or unauthorized activities."
          bullets={[
            'Do not create fake, misleading, or fraudulent invoices or quotations.',
            'Do not misuse another person’s business details, payment details, signature, or logo.',
            'Do not use the app to misrepresent transactions or deceive clients, customers, or authorities.',
            'Do not attempt to damage, interfere with, reverse engineer, or misuse the app.',
          ]}
        />

        <Section
          number="12"
          icon="alert-circle-outline"
          title="No Professional Advice"
          text="Invoice & Quotation Generator is a document creation tool. It does not provide legal advice, tax advice, accounting advice, financial advice, or business compliance advice. Users should consult qualified professionals where appropriate."
        />

        <Section
          number="13"
          icon="construct-outline"
          title="Changes, Updates, and Availability"
          text="The app may be updated, changed, improved, or modified over time. Features, layouts, supported file flows, and available options may be adjusted to improve stability, usability, compatibility, or security."
        />

        <Section
          number="14"
          icon="warning-outline"
          title="Limitation of Responsibility"
          text="To the extent permitted by applicable law, the developer is not responsible for losses, disputes, incorrect documents, user-entered mistakes, tax or payment issues, data loss, or damages resulting from how the app is used, how files are shared, or how users manage their own records and backups."
        />

        <Section
          number="15"
          icon="refresh-outline"
          title="Changes to These Terms"
          text="These Terms and Conditions may be revised from time to time to reflect app updates, policy changes, or operational improvements. Continued use of the app after an update means you accept the revised Terms."
        />

        <Section
          number="16"
          icon="mail-outline"
          title="Contact"
          text="For questions related to these Terms and Conditions, users may contact the developer at:"
          bullets={[
            'Email: netkib.apps@gmail.com',
            'Website: https://netkib.com',
          ]}
        />

        <View style={styles.importantCard}>
          <View style={styles.importantHeader}>
            <Ionicons name="alert-circle-outline" size={22} color="#f97316" />
            <Text style={styles.importantTitle}>Important Reminder</Text>
          </View>

          <Text style={styles.importantText}>
            Always review quotations, invoices, totals, payment details,
            exports, and shared files before using them for business purposes.
            The app helps create documents, but final responsibility remains
            with the user.
          </Text>
        </View>

        <Text style={styles.footerText}>
          By using this app, you agree to these Terms and Conditions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ number, icon, title, text, bullets }) {
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