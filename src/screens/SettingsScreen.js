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
    accentColor: '#fd4475',
    iconGradient: ['#ffe2ec', '#ffd0e0'],
  },
  {
    id: 'client',
    title: 'Client Profiles',
    subtitle: 'Add and manage your saved client details.',
    icon: 'people-outline',
    route: 'ClientSettings',
    accentColor: '#ff7b54',
    iconGradient: ['#ffe8df', '#ffd8ca'],
  },
  {
    id: 'items',
    title: 'Items Catalog',
    subtitle: 'Save reusable products, services, or quotation items.',
    icon: 'cube-outline',
    route: 'ItemsCatalogSettings',
    accentColor: '#8b5cf6',
    iconGradient: ['#efe7ff', '#e4d8ff'],
  },
  {
    id: 'payment',
    title: 'Payment Terms & Method',
    subtitle: 'Set payment terms and preferred payment methods.',
    icon: 'card-outline',
    route: 'PaymentSettings',
    accentColor: '#f59e0b',
    iconGradient: ['#fff1d9', '#ffe6bb'],
  },
  {
    id: 'mobile-payment',
    title: 'Mobile Payment Info',
    subtitle: 'Configure your mobile payment accounts and details.',
    icon: 'phone-portrait-outline',
    route: 'MobilePaymentSettings',
    accentColor: '#0ea5e9',
    iconGradient: ['#dff4ff', '#cceeff'],
  },
  {
    id: 'signature',
    title: 'Signature',
    subtitle: 'Add or update your signature for quotations and invoices.',
    icon: 'create-outline',
    route: 'SignatureSettings',
    accentColor: '#10b981',
    iconGradient: ['#ddfbf0', '#c9f6e7'],
  },
  {
    id: 'notes',
    title: 'Notes',
    subtitle: 'Set default notes to appear on your quotations and invoices.',
    icon: 'document-text-outline',
    route: 'NotesSettings',
    accentColor: '#6366f1',
    iconGradient: ['#e8e9ff', '#dfe1ff'],
  },
  {
    id: 'drafts',
    title: 'Quotations Drafts',
    subtitle: 'This is Drafts to appear on your quotations.',
    icon: 'create-outline',
    route: 'DraftQuotation',
    accentColor: '#ec4899',
    iconGradient: ['#ffe3f2', '#ffd5eb'],
  },
  {
    id: 'floating-quick-button',
    title: 'Floating Quick Button',
    subtitle: 'Turn the quick navigation button on or off.',
    icon: 'options-outline',
    route: 'FloatingQuickButtonSettings',
    accentColor: '#14b8a6',
    iconGradient: ['#ddfffa', '#c9fff7'],
  },
];

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff5f8" />

      <LinearGradient
        colors={['#fff7fa', '#fffafc', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.screenGradient}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['#fff0f5', '#fff6fa', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color={BRAND_COLOR} />
            </TouchableOpacity>

            <View style={styles.headerTextArea}>
              <Text style={styles.headerTitle}>Settings</Text>
              <Text style={styles.headerSubtitle}>
                Manage your saved presets
              </Text>
            </View>

            <LinearGradient
              colors={['#ffffff', '#fff7fa']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerIconBox}
            >
              <Ionicons name="settings-outline" size={28} color={BRAND_COLOR} />
            </LinearGradient>

            <View style={styles.headerCircleOne} />
            <View style={styles.headerCircleTwo} />
            <View style={styles.headerCircleThree} />
          </LinearGradient>

          <View style={styles.listArea}>
            {SETTING_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                style={styles.settingCard}
                onPress={() => navigation.navigate(item.route)}
              >
                <View
                  style={[
                    styles.cardAccentBar,
                    { backgroundColor: item.accentColor },
                  ]}
                />

                <LinearGradient
                  colors={item.iconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconBox}
                >
                  <Ionicons
                    name={item.icon}
                    size={23}
                    color={item.accentColor}
                  />
                </LinearGradient>

                <View style={styles.cardTextArea}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>

                <View style={styles.arrowWrap}>
                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={item.accentColor}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}