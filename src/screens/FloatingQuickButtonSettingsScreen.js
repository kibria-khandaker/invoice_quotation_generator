// src/screens/FloatingQuickButtonSettingsScreen.js

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from './FloatingQuickButtonSettingsScreenStyle';

import {
  DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS,
  getFloatingQuickButtonSettings,
  saveFloatingQuickButtonSettings,
} from '../components/FloatingQuickButton/FloatingQuickButtonStorage';

const BRAND_COLOR = '#fd4475';

// ======================================================
// FLOATING QUICK BUTTON SETTINGS SCREEN START
// NEW: Dedicated settings screen for the isolated optional
// FloatingQuickButton module only. This screen does not read
// or modify quotation/invoice/history/settings preset data.
// ======================================================
export default function FloatingQuickButtonSettingsScreen() {
  const [settings, setSettings] = useState(
    DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await getFloatingQuickButtonSettings();

    setSettings({
      ...DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS,
      ...savedSettings,
    });

    setIsLoading(false);
  };

  const handleToggleFloatingButton = async (nextValue) => {
    if (isSaving) return;

    const previousSettings = settings;

    const updatedSettings = {
      ...settings,
      isEnabled: nextValue,
    };

    // NEW: Optimistic UI update for smooth settings interaction.
    // The save helper notifies FloatingQuickButton inside its own module.
    setSettings(updatedSettings);
    setIsSaving(true);

    const isSaved = await saveFloatingQuickButtonSettings({
      isEnabled: nextValue,
    });

    setIsSaving(false);

    if (!isSaved) {
      setSettings(previousSettings);
      Alert.alert(
        'Settings Not Saved',
        'Floating Quick Button setting could not be updated. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff7fa" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={BRAND_COLOR} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff7fa" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#fff0f5', '#fff7fa', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topInfoCard}
        >
          <View style={styles.headerIconBox}>
            <Ionicons name="options-outline" size={28} color={BRAND_COLOR} />
          </View>

          <View style={styles.headerTextArea}>
            <Text style={styles.pageTitle}>Floating Quick Button</Text>
            <Text style={styles.pageSubtitle}>
              Control only the optional quick navigation button. Turning this
              off will not affect quotation, invoice, history, draft, or other
              app features.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <View style={styles.cardLeftArea}>
            <View style={styles.cardIconBox}>
              <Ionicons
                name={settings.isEnabled ? 'eye-outline' : 'eye-off-outline'}
                size={23}
                color={BRAND_COLOR}
              />
            </View>

            <View style={styles.cardTextArea}>
              <Text style={styles.cardTitle}>Show Floating Quick Button</Text>
              <Text style={styles.cardSubtitle}>
                Enable or disable the floating shortcut button across the app.
              </Text>
            </View>
          </View>

          <Switch
            value={Boolean(settings.isEnabled)}
            onValueChange={handleToggleFloatingButton}
            disabled={isSaving}
            trackColor={{ false: '#e5e7eb', true: '#ffd0e0' }}
            thumbColor={settings.isEnabled ? BRAND_COLOR : '#ffffff'}
            ios_backgroundColor="#e5e7eb"
          />
        </View>

        <View style={styles.noteCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#16a34a" />
          <Text style={styles.noteText}>
            This setting is stored inside the FloatingQuickButton module only,
            so the feature stays removable and low-dependency.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// ======================================================
// FLOATING QUICK BUTTON SETTINGS SCREEN END
// ======================================================