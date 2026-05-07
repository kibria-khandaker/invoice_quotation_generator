// src/components/FloatingQuickButton/FloatingQuickButtonStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// ======================================================
// FLOATING QUICK BUTTON STORAGE MODULE
// Fully isolated storage for FloatingQuickButton only.
// This file does not touch quotation/invoice/history data.
// ======================================================

const FLOATING_QUICK_BUTTON_SETTINGS_KEY =
  'FLOATING_QUICK_BUTTON_SETTINGS';

const FLOATING_QUICK_BUTTON_POSITION_KEY =
  'FLOATING_QUICK_BUTTON_POSITION';

// ======================================================
// SETTINGS CHANGE LISTENER START
// NEW: Tiny in-module publish/subscribe helper so the
// FloatingQuickButton can react immediately when its own
// settings screen changes isEnabled. No project-wide state
// or quotation/invoice logic is touched.
// ======================================================
const floatingQuickButtonSettingsListeners = new Set();

export const subscribeFloatingQuickButtonSettingsChange = (listener) => {
  if (typeof listener !== 'function') {
    return () => {};
  }

  floatingQuickButtonSettingsListeners.add(listener);

  return () => {
    floatingQuickButtonSettingsListeners.delete(listener);
  };
};

const notifyFloatingQuickButtonSettingsChange = (settings) => {
  floatingQuickButtonSettingsListeners.forEach((listener) => {
    try {
      listener(settings);
    } catch (error) {
      console.log('Floating Quick Button Settings Listener Error:', error);
    }
  });
};
// ======================================================
// SETTINGS CHANGE LISTENER END
// ======================================================

export const DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS = {
  isEnabled: true,

  // Supported values for future settings page:
  // small | medium | large
  buttonSize: 'medium',

  // null means show all configured menu items.
  // Future settings page can save selected menu item ids here.
  selectedMenuIds: null,
};

// ======================================================
// GET SETTINGS
// ======================================================
export const getFloatingQuickButtonSettings = async () => {
  try {
    const savedData = await AsyncStorage.getItem(
      FLOATING_QUICK_BUTTON_SETTINGS_KEY
    );

    if (!savedData) {
      return DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS;
    }

    const parsedData = JSON.parse(savedData);

    return {
      ...DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS,
      ...parsedData,
    };
  } catch (error) {
    console.log('Floating Quick Button Settings Load Error:', error);
    return DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS;
  }
};

// ======================================================
// SAVE SETTINGS
// ======================================================
export const saveFloatingQuickButtonSettings = async (settings) => {
  try {
    const currentSettings = await getFloatingQuickButtonSettings();

    const updatedSettings = {
      ...currentSettings,
      ...settings,
    };

    await AsyncStorage.setItem(
      FLOATING_QUICK_BUTTON_SETTINGS_KEY,
      JSON.stringify(updatedSettings)
    );

    // NEW: Notify only FloatingQuickButton module listeners so
    // the button can hide/show instantly after settings changes.
    notifyFloatingQuickButtonSettingsChange(updatedSettings);

    return true;
  } catch (error) {
    console.log('Floating Quick Button Settings Save Error:', error);
    return false;
  }
};

// ======================================================
// GET POSITION
// ======================================================
export const getFloatingQuickButtonPosition = async () => {
  try {
    const savedData = await AsyncStorage.getItem(
      FLOATING_QUICK_BUTTON_POSITION_KEY
    );

    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.log('Floating Quick Button Position Load Error:', error);
    return null;
  }
};

// ======================================================
// SAVE POSITION
// ======================================================
export const saveFloatingQuickButtonPosition = async (position) => {
  try {
    if (
      !position ||
      typeof position.x !== 'number' ||
      typeof position.y !== 'number'
    ) {
      return false;
    }

    await AsyncStorage.setItem(
      FLOATING_QUICK_BUTTON_POSITION_KEY,
      JSON.stringify(position)
    );

    return true;
  } catch (error) {
    console.log('Floating Quick Button Position Save Error:', error);
    return false;
  }
};

// ======================================================
// RESET POSITION
// Future settings page can use this.
// ======================================================
export const resetFloatingQuickButtonPosition = async () => {
  try {
    await AsyncStorage.removeItem(FLOATING_QUICK_BUTTON_POSITION_KEY);
    return true;
  } catch (error) {
    console.log('Floating Quick Button Position Reset Error:', error);
    return false;
  }
};