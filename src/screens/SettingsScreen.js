import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from './SettingsScreenStyle';

const BRAND_COLOR = '#fd4475';

const SETTING_ITEMS = [
  {
    id: 'company',
    title: 'Company Information',
    subtitle: 'Add and manage your company details and branding.',
    icon: 'business-outline',
    route: 'CompanySettings',
  },
  {
  id: 'client',
  title: 'Client Profiles',
  subtitle: 'Add and manage your saved client details.',
  icon: 'people-outline',
  route: 'ClientSettings',
},
{
  id: 'items',
  title: 'Items Catalog',
  subtitle: 'Save reusable products, services, or quotation items.',
  icon: 'cube-outline',
  route: 'ItemsCatalogSettings',
},
  {
    id: 'payment',
    title: 'Payment Terms & Method',
    subtitle: 'Set payment terms and preferred payment methods.',
    icon: 'card-outline',
    route: 'PaymentSettings',
  },
  {
    id: 'mobile-payment',
    title: 'Mobile Payment Info',
    subtitle: 'Configure your mobile payment accounts and details.',
    icon: 'phone-portrait-outline',
    route: 'MobilePaymentSettings',
  },
  {
    id: 'signature',
    title: 'Signature',
    subtitle: 'Add or update your signature for quotations and invoices.',
    icon: 'create-outline',
    route: 'SignatureSettings',
  },
  {
    id: 'notes',
    title: 'Notes',
    subtitle: 'Set default notes to appear on your quotations and invoices.',
    icon: 'document-text-outline',
    route: 'NotesSettings',
  },
  {
    id: 'drafts',
    title: 'Quotations Drafts',
    subtitle: 'This is Drafts to appear on your quotations.',
    icon: 'create-outline',
    route: 'DraftQuotation',
  },
];

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff0f5" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#fff0f5', '#fff7fa', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={BRAND_COLOR} />
          </TouchableOpacity>

          <View style={styles.headerTextArea}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your saved presets</Text>
          </View>

          <View style={styles.headerIconBox}>
            <Ionicons name="settings-outline" size={34} color={BRAND_COLOR} />
          </View>

          <View style={styles.headerCircleOne} />
          <View style={styles.headerCircleTwo} />
        </LinearGradient>

        <View style={styles.listArea}>
          {SETTING_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.86}
              style={styles.settingCard}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={30} color={BRAND_COLOR} />
              </View>

              <View style={styles.cardTextArea}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color={BRAND_COLOR}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}