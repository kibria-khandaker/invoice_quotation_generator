// src/screens/AboutUsScreen.js

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
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const BRAND_COLOR = '#fd4475';

const APP_VERSION = Constants.expoConfig?.version || '1.0.0';
const BUILD_VERSION = Constants.expoConfig?.android?.versionCode || '1';

export default function AboutUsScreen({ navigation }) {
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
          <Text style={styles.headerTitle}>About This App</Text>
          <Text style={styles.headerSubtitle}>
            Invoice & Quotation Generator
          </Text>
        </View>

        <View style={styles.headerIconBox}>
          <Ionicons name="information-circle-outline" size={24} color={BRAND_COLOR} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="document-text-outline" size={34} color={BRAND_COLOR} />
          </View>

          <Text style={styles.appTitle}>Invoice & Quotation Generator</Text>

          <Text style={styles.heroText}>
            This application is designed to help users create, manage, preview,
            export, and share professional quotations and invoices easily from a
            mobile device.
          </Text>
        </View>

        <Section
          icon="bulb-outline"
          title="Purpose of the App"
          text="The main purpose of this app is to save time and reduce repeated typing when preparing quotations and invoices. Users can create business documents, reuse saved company/client/item/payment information, save incomplete work as drafts, and generate PDF files when the document is ready."
        />

        <Section
          icon="layers-outline"
          title="Main Features"
          bullets={[
            'Create professional quotations and invoices.',
            'Save incomplete quotations and invoices as drafts.',
            'Continue editing drafts later.',
            'Preview documents before final saving.',
            'Generate and share PDF files.',
            'Manage saved history of quotations and invoices.',
            'Search, filter, select, export, import, and backup data.',
            'Reuse saved company, client, item, payment, mobile payment, signature, and notes presets.',
          ]}
        />

        <Section
          icon="business-outline"
          title="Reusable Settings Data"
          text="The Settings section allows users to save frequently used business data so that the same information can be loaded quickly while creating a quotation or invoice."
          bullets={[
            'Company Information',
            'Client Profiles',
            'Items Catalog',
            'Payment Terms & Method',
            'Mobile Payment Info',
            'Signature',
            'Notes',
          ]}
        />

        <Section
          icon="archive-outline"
          title="Draft & History System"
          text="Drafts are used for incomplete or work-in-progress documents. History is used for final saved quotations and invoices. This separation helps users keep unfinished work and completed business records organized."
        />

        <Section
          icon="cloud-download-outline"
          title="Backup & Restore"
          text="The app includes CSV export and import options for important reusable data and document records. This helps users keep a backup and restore data when needed."
        />

        <Section
          icon="document-attach-outline"
          title="PDF Generation"
          text="When a quotation or invoice is complete, the app can generate a PDF file. The PDF may include company information, client information, item details, pricing summary, payment details, logo, signature, notes, and status information where applicable."
        />

        <Section
          icon="phone-portrait-outline"
          title="Designed for Mobile Use"
          text="The app is designed with a mobile-friendly interface, compact cards, quick actions, clear forms, draft protection, and simple navigation so users can work comfortably on a phone."
        />

        <Section
          icon="lock-closed-outline"
          title="Data & Privacy"
          text="The app is built to keep user-created business data inside the app’s local storage on the device. When users export, share, or import files, those actions are controlled by the user through the device sharing and file selection system."
        />

        <Section
          icon="alert-circle-outline"
          title="Important Note"
          text="Users should review all quotation and invoice information before sending or sharing any generated PDF. Business details, pricing, taxes, discounts, payment information, and client information should be checked carefully before final use."
        />

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Support & Development</Text>
          <Text style={styles.supportText}>
            This app is created to support small businesses, freelancers,
            service providers, and professionals who need a simple way to manage
            quotations and invoices.
          </Text>

          <View style={styles.versionPill}>
            <Ionicons name="checkmark-circle-outline" size={15} color="#16a34a" />
            <Text style={styles.versionText}>
              Version: {APP_VERSION}
              {/*  • Build {BUILD_VERSION} */}
            </Text>
          </View>
        </View>

        <Text style={styles.footerText}>
          Thank you for using Invoice & Quotation Generator.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ icon, title, text, bullets }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconBox}>
          <Ionicons name={icon} size={20} color={BRAND_COLOR} />
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
    fontSize: 22,
    lineHeight: 27,
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

  sectionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 15.5,
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

  supportCard: {
    backgroundColor: '#fff0f5',
    borderRadius: 20,
    padding: 16,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#ffd3df',
  },

  supportTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    color: '#07142f',
  },

  supportText: {
    marginTop: 6,
    fontSize: 12.8,
    lineHeight: 20,
    color: '#667085',
    fontWeight: '600',
  },

  versionPill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    flexDirection: 'row',
    alignItems: 'center',
  },

  versionText: {
    marginLeft: 5,
    fontSize: 12,
    lineHeight: 15,
    color: '#16a34a',
    fontWeight: '900',
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