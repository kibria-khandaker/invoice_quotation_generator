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
            Please read these Terms and Conditions carefully before using this
            application. By using the app, you agree to use it responsibly and
            only for lawful business or personal document management purposes.
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
          text="By accessing or using this application, you agree to these Terms and Conditions. If you do not agree with these terms, you should stop using the application."
        />

        <Section
          number="2"
          icon="phone-portrait-outline"
          title="Use of the Application"
          text="This app is provided to help users create, manage, save, preview, export, and share quotations and invoices. You agree to use the app only for lawful purposes and in a way that does not violate any applicable rules, business obligations, or rights of others."
        />

        <Section
          number="3"
          icon="person-outline"
          title="User Responsibility"
          text="You are fully responsible for all information entered into the app, including company details, client information, item descriptions, prices, taxes, discounts, payment details, notes, signatures, logos, and any generated PDF documents."
          bullets={[
            'Review all information before saving, exporting, or sharing.',
            'Make sure pricing, tax, discount, and payment details are correct.',
            'Do not use false, misleading, illegal, or unauthorized information.',
            'Keep your device and app data safe from unauthorized access.',
          ]}
        />

        <Section
          number="4"
          icon="document-attach-outline"
          title="Invoices, Quotations & PDF Files"
          text="The app can generate invoices and quotations based on the information provided by the user. Generated documents are only as accurate as the data entered by the user. The app does not verify business, legal, tax, or financial accuracy."
        />

        <Section
          number="5"
          icon="archive-outline"
          title="Drafts, History & Saved Data"
          text="The app allows users to save documents as drafts and final records. Drafts are intended for incomplete or work-in-progress documents, while history records are intended for completed invoices and quotations. Users are responsible for managing, deleting, exporting, and backing up their own data."
        />

        <Section
          number="6"
          icon="cloud-download-outline"
          title="Backup, Export & Import"
          text="The app may provide CSV backup, export, and import options. You are responsible for checking imported data and keeping backup files safe. Importing incorrect or duplicate data may affect saved records, depending on the selected import option."
          bullets={[
            'Keep backup files in a safe place.',
            'Review imported data after restoring.',
            'Use Replace, Skip, or Keep Both options carefully when conflicts appear.',
          ]}
        />

        <Section
          number="7"
          icon="image-outline"
          title="Logo, Signature & Uploaded Content"
          text="You may upload logos and signatures for use in invoices and quotations. You must only upload content that you own or have permission to use. The app is not responsible for unauthorized use of images, signatures, or branding."
        />

        <Section
          number="8"
          icon="calculator-outline"
          title="Calculation Accuracy"
          text="The app may calculate subtotals, discounts, taxes, and totals based on user input. You should always verify all calculations before sending or using a document. The app is not a substitute for accounting, tax, legal, or financial advice."
        />

        <Section
          number="9"
          icon="lock-closed-outline"
          title="Data Storage"
          text="The app is designed to store user-created data locally on the device unless the user chooses to export, import, share, or back up files. Data may be lost if the app is deleted, device storage is cleared, or the device is damaged without backup."
        />

        <Section
          number="10"
          icon="share-social-outline"
          title="Sharing Documents"
          text="When you share a PDF, CSV, or backup file, the sharing process is handled by your device and selected apps. You are responsible for choosing the correct recipient and checking the file before sharing."
        />

        <Section
          number="11"
          icon="ban-outline"
          title="Prohibited Use"
          text="You agree not to use this application for illegal, fraudulent, harmful, misleading, or unauthorized activities."
          bullets={[
            'Do not create fake or fraudulent invoices or quotations.',
            'Do not misuse another person’s company, client, signature, or payment details.',
            'Do not use the app to mislead customers, clients, or authorities.',
            'Do not attempt to damage, modify, reverse engineer, or misuse the application.',
          ]}
        />

        <Section
          number="12"
          icon="alert-circle-outline"
          title="No Professional Advice"
          text="This application is a document creation and management tool. It does not provide legal, tax, accounting, financial, or business advice. For professional requirements, you should consult a qualified expert."
        />

        <Section
          number="13"
          icon="construct-outline"
          title="Changes, Updates & Availability"
          text="The app may be updated, changed, improved, or modified over time. Some features may be added, removed, or changed to improve stability, security, user experience, or business functionality."
        />

        <Section
          number="14"
          icon="warning-outline"
          title="Limitation of Responsibility"
          text="The app developer or provider is not responsible for losses, mistakes, incorrect documents, missing data, business disputes, tax issues, payment issues, or damages caused by user-entered information, incorrect use, device problems, or failure to keep backups."
        />

        <Section
          number="15"
          icon="refresh-outline"
          title="Changes to These Terms"
          text="These Terms and Conditions may be updated from time to time. Continued use of the app after updates means you accept the revised terms."
        />

        <View style={styles.importantCard}>
          <View style={styles.importantHeader}>
            <Ionicons name="alert-circle-outline" size={22} color="#f97316" />
            <Text style={styles.importantTitle}>Important Reminder</Text>
          </View>

          <Text style={styles.importantText}>
            Always check every invoice or quotation before saving, exporting,
            printing, or sharing. Your business documents should be reviewed
            carefully to avoid mistakes.
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