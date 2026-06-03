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

          <Text style={styles.appTitle}>
            Invoice & Quotation Generator
          </Text>

          <Text style={styles.heroText}>
            A practical mobile app for creating, managing, exporting, and
            sharing professional quotations and invoices directly from your phone.
          </Text>

          <Text style={styles.heroText}>
            It is built for freelancers, small businesses, service providers,
            agencies, shops, contractors, and professionals who need a simple
            way to prepare business documents on mobile.
          </Text>
        </View>

        <Section
          icon="sparkles-outline"
          title="What the App Does"
          text="Invoice & Quotation Generator helps users create structured quotations and invoices, manage unfinished work, save final records, and prepare documents for business use from one mobile workflow."
        />

        <Section
          icon="layers-outline"
          title="Main Features"
          bullets={[
            'Create professional quotations and invoices.',
            'Save unfinished work as drafts and continue later.',
            'Preview documents before finalizing them.',
            'Store completed quotations and invoices in history.',
            'Generate and share professional PDF files.',
            'Package multiple selected PDFs into a ZIP file for sharing.',
            'Export and import supported backup data using CSV files.',
            'Reuse company, client, item, payment, note, and signature presets.',
          ]}
        />

        <Section
          icon="people-outline"
          title="Who This App Is For"
          text="The app is designed for individuals and businesses that need a faster way to prepare quotation and invoice documents without relying on a desktop system."
          bullets={[
            'Freelancers',
            'Small businesses',
            'Agencies',
            'Shops and service providers',
            'Contractors',
            'Independent professionals',
          ]}
        />

        <Section
          icon="time-outline"
          title="Built for Faster Business Document Work"
          text="The app helps reduce repeated typing by allowing users to save reusable information once and load it again while creating new quotations or invoices. This keeps document preparation faster, more consistent, and easier to manage."
        />

        <Section
          icon="business-outline"
          title="Reusable Presets"
          text="Users can save frequently used business information in Settings and reuse it whenever needed."
          bullets={[
            'Company information',
            'Client profiles',
            'Items or service catalog',
            'Payment terms and payment method details',
            'Mobile payment information',
            'Authorized signature presets',
            'Reusable note templates',
          ]}
        />

        <Section
          icon="archive-outline"
          title="Drafts and History"
          text="Drafts are used for incomplete or work-in-progress documents. History is used for final saved quotations and invoices. This separation helps users keep unfinished work and completed business records organized."
        />

        <Section
          icon="folder-open-outline"
          title="PDF, ZIP, CSV, Export, and Import"
          text="The app supports practical file workflows for real business use."
          bullets={[
            'Generate quotation PDFs.',
            'Generate invoice PDFs.',
            'Share individual PDFs directly.',
            'Create and share ZIP files from multiple selected PDFs.',
            'Export supported backup data as CSV.',
            'Import supported CSV backups when needed.',
          ]}
        />

        <Section
          icon="image-outline"
          title="Logo and Signature Support"
          text="Users may choose company logo images and authorized signature images from their own device to use in quotation and invoice documents."
        />

        <Section
          icon="lock-closed-outline"
          title="Local-First and User-Controlled"
          text="Quotations, invoices, drafts, presets, and history records are stored on the user’s own device. The app does not automatically upload business records to a developer-controlled server."
          bullets={[
            'Users control when to export files.',
            'Users control when to import backups.',
            'Users control when to generate or share documents.',
            'Local data may be removed if the app is uninstalled or storage is cleared.',
          ]}
        />

        <Section
          icon="alert-circle-outline"
          title="Important Reminder"
          text="Users should review all document information before final use or sharing. Company details, client details, prices, discounts, taxes, payment information, notes, and generated PDF content should be checked carefully."
        />

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Developer & App Information</Text>

          <Text style={styles.supportText}>
            Developed by Netkib for users who want a simple and mobile-friendly
            way to create and manage quotation and invoice documents.
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={16} color={BRAND_COLOR} />
            <Text style={styles.infoText}>Website: https://netkib.com</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={16} color={BRAND_COLOR} />
            <Text style={styles.infoText}>Email: netkib.apps@gmail.com</Text>
          </View>

          <View style={styles.versionPill}>
            <Ionicons name="checkmark-circle-outline" size={15} color="#16a34a" />
            <Text style={styles.versionText}>
              Version: {APP_VERSION}
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

  infoRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 12.8,
    lineHeight: 19,
    color: '#475467',
    fontWeight: '700',
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