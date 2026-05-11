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

          <Text style={styles.appTitle}>Your Data & Privacy</Text>

          <Text style={styles.heroText}>
            This Privacy Policy explains how this application handles the
            information you create, save, import, export, and share while using
            the app.
          </Text>

          <View style={styles.noticePill}>
            <Ionicons name="information-circle-outline" size={15} color={BRAND_COLOR} />
            <Text style={styles.noticePillText}>Last updated: May 2026</Text>
          </View>
        </View>

        <Section
          number="1"
          icon="document-text-outline"
          title="Information You Enter"
          text="The app allows you to enter business and document-related information for creating invoices and quotations. This may include company details, client profiles, item details, payment information, mobile payment details, notes, logos, and signatures."
        />

        <Section
          number="2"
          icon="save-outline"
          title="Local Data Storage"
          text="The app is designed to store user-created data locally on your device. Saved invoices, quotations, drafts, settings presets, and backup-related data are stored inside the app’s local storage unless you choose to export, share, or import files."
        />

        <Section
          number="3"
          icon="cloud-offline-outline"
          title="No Automatic Cloud Upload"
          text="The app does not automatically upload your invoices, quotations, drafts, client profiles, company profiles, signatures, logos, or payment information to a cloud server from this screen or by default. Your data stays on your device unless you manually share or export it."
        />

        <Section
          number="4"
          icon="folder-open-outline"
          title="Drafts and History"
          text="Drafts are used for incomplete documents, and History is used for final saved invoices and quotations. These records are kept in local app storage so you can continue editing, view past documents, generate PDFs, or manage saved records."
        />

        <Section
          number="5"
          icon="cloud-download-outline"
          title="Export, Backup and Import"
          text="The app may allow you to export and import CSV backup files or PDF documents. When you export data, the generated file may contain the information you entered in the app. You are responsible for storing and sharing these files safely."
          bullets={[
            'Only share backup or PDF files with trusted people or services.',
            'Check exported files before sending them to anyone.',
            'Imported files may restore or add data inside the app.',
            'Keep backup files secure because they may contain business or client information.',
          ]}
        />

        <Section
          number="6"
          icon="share-social-outline"
          title="Sharing Files"
          text="When you share a PDF, CSV, or backup file, the sharing process is handled by your device and the apps you choose, such as email, messaging, cloud storage, or file manager apps. You should confirm the correct recipient and destination before sharing."
        />

        <Section
          number="7"
          icon="image-outline"
          title="Logo and Signature Images"
          text="If you upload a company logo or signature image, the app may store that image or its encoded data locally so it can be reused in invoices, quotations, previews, and PDF files. You should only upload images you own or have permission to use."
        />

        <Section
          number="8"
          icon="person-outline"
          title="Client and Company Information"
          text="Client profiles and company profiles are saved to help you reuse information and reduce repeated typing. These records may include names, addresses, phone numbers, email addresses, and company information entered by you."
        />

        <Section
          number="9"
          icon="card-outline"
          title="Payment Information"
          text="Payment terms, payment methods, mobile payment information, bank details, or similar information may be saved if you enter them into the app. You should avoid saving sensitive information that you do not want stored on your device."
        />

        <Section
          number="10"
          icon="trash-outline"
          title="Deleting Data"
          text="You can delete saved records, drafts, presets, and other app data using the available delete or clear options inside the app. If the app is uninstalled or device storage is cleared, local app data may be removed permanently."
        />

        <Section
          number="11"
          icon="phone-portrait-outline"
          title="Device and App Permissions"
          text="The app may request access to device features such as files, media library, or sharing tools so you can upload logos/signatures, import CSV files, export backups, or share generated PDFs. These permissions are used only for the actions you choose."
        />

        <Section
          number="12"
          icon="analytics-outline"
          title="Analytics and Tracking"
          text="This policy page is written for the app’s current local-first behavior. If analytics, crash reporting, cloud sync, account login, or online services are added in the future, this Privacy Policy should be updated to clearly explain what data is collected and how it is used."
        />

        <Section
          number="13"
          icon="warning-outline"
          title="Data Loss and Backups"
          text="Because the app stores data locally, your data may be lost if your device is damaged, reset, storage is cleared, or the app is removed. You should export backups regularly if your invoices, quotations, clients, or business data are important."
        />

        <Section
          number="14"
          icon="people-outline"
          title="Third-Party Apps"
          text="If you choose to share files through third-party apps or save files to external services, those apps and services may handle your data according to their own privacy policies. This app cannot control how third-party apps manage shared files."
        />

        <Section
          number="15"
          icon="shield-outline"
          title="User Responsibility"
          text="You are responsible for protecting your device, exported files, client information, business information, payment details, signatures, and generated documents. Use a device lock, keep backups secure, and avoid sharing sensitive files with untrusted recipients."
        />

        <Section
          number="16"
          icon="refresh-outline"
          title="Changes to This Privacy Policy"
          text="This Privacy Policy may be updated from time to time to reflect app changes, new features, or improved privacy information. Continued use of the app after updates means you accept the revised policy."
        />

        <View style={styles.importantCard}>
          <View style={styles.importantHeader}>
            <Ionicons name="lock-closed-outline" size={22} color="#f97316" />
            <Text style={styles.importantTitle}>Privacy Reminder</Text>
          </View>

          <Text style={styles.importantText}>
            Invoices, quotations, backups, logos, signatures, and client details
            may contain sensitive business information. Review and protect your
            data before exporting, importing, or sharing files.
          </Text>
        </View>

        <Text style={styles.footerText}>
          By using this app, you acknowledge this Privacy Policy.
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