import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from './HomeScreenStyles';

const BRAND_COLOR = '#fd4475';


const MAIN_MENU_ITEMS = [
  {
    id: 'create-quotation',
    title: 'Create Quotation',
    subtitle: 'Create professional quotations',
    route: 'Create',
    icon: 'document-text-outline',
    showPlus: true,
  },
  {
    id: 'quotation-history',
    title: 'Quotation History',
    subtitle: 'View and manage quotations',
    route: 'History',
    icon: 'time-outline',
    showPlus: false,
  },
  {
    id: 'create-invoice',
    title: 'Create Invoice',
    subtitle: 'Create professional invoices',
    route: 'CreateInvoice',
    icon: 'receipt-outline',
    showPlus: true,
  },
  {
    id: 'invoice-history',
    title: 'Invoice History',
    subtitle: 'View and manage invoices',
    route: 'InvoiceHistory',
    icon: 'briefcase-outline',
    showPlus: false,
  },
];

const QUICK_LINKS = [
  {
    id: 'about',
    title: 'About',
    route: 'About',
    icon: 'person-outline',
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    route: 'TermsConditions',
    icon: 'document-text-outline',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    route: 'PrivacyPolicy',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'settings',
    title: 'Settings',
    route: 'Settings',
    icon: 'settings-outline',
  },
];

export default function HomeScreen({ navigation }) {
  const handleNavigate = (route) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff0f5" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#fff0f5', '#fff7fa', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.softCircleLeft} />
          <View style={styles.softCircleRight} />

          <Text style={[styles.sparkle, styles.sparkleLeft]}>✦</Text>
          <Text style={[styles.sparkle, styles.sparkleRight]}>✦</Text>

          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appTitle}>
            Invoice & Quotation{'\n'}Generator
          </Text>

          <Text style={styles.appSubtitle}>
            Fast, smart quotation and invoice management
          </Text>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerDiamond}>◆</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.waveBack} />
          <View style={styles.waveFront} />
        </LinearGradient>

        {/* Main Menu Cards */}
        <View style={styles.menuList}>
          {MAIN_MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.88}
              style={styles.menuCard}
              onPress={() => handleNavigate(item.route)}
            >
              <View style={styles.iconArea}>
                <View style={styles.iconBlob} />

                <View style={styles.iconBox}>
                  <Ionicons name={item.icon} size={28} color={BRAND_COLOR} />

                  {item.showPlus && (
                    <LinearGradient
                      colors={[BRAND_COLOR, '#ff6c96']}
                      style={styles.plusBadge}
                    >
                      <Ionicons name="add" size={20} color="#ffffff" />
                    </LinearGradient>
                  )}
                </View>
              </View>

              <View style={styles.menuTextArea}>
                <Text style={styles.menuTitle} numberOfLines={1}>
                  {item.title}
                </Text>

                <Text style={styles.menuSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>

              <LinearGradient
                colors={[BRAND_COLOR, '#ff6c96']}
                style={styles.arrowCircle}
              >
                <Ionicons name="chevron-forward" size={22} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plain Bottom Links */}
        <View style={styles.quickLinksWrapper}>
          {QUICK_LINKS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={styles.quickLink}
              onPress={() => handleNavigate(item.route)}
            >
              <Ionicons name={item.icon} size={19} color={BRAND_COLOR} />
              <Text
                style={styles.quickLinkText}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.82}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Version text moved to AboutUsScreen. */}
      </ScrollView>
    </SafeAreaView>
  );
}