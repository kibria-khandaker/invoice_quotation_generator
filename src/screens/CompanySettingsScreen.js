import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import styles from './CompanySettingsScreenStyle';

import {
  getCompanyProfiles,
  upsertCompanyProfile,
  deleteCompanyProfile,
  setDefaultCompanyProfile,
} from '../services/settingsService';

const BRAND_COLOR = '#fd4475';
const SUCCESS_COLOR = '#16a34a';

const emptyForm = {
  id: null,
  title: '',
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  companyContact: '',
  logo: null,
  logoBase64: null,
  isDefault: false,
};

const normalizeCompanyProfile = (profile) => {
  if (!profile) return emptyForm;

  const oldContact = profile.companyContact || '';

  const emailMatch = oldContact.match(/Email:\s*([^\n]+)/i);
  const phoneMatch = oldContact.match(/Phone:\s*([^\n]+)/i);

  return {
    ...emptyForm,
    ...profile,
    companyEmail: profile.companyEmail || emailMatch?.[1]?.trim() || '',
    companyPhone: profile.companyPhone || phoneMatch?.[1]?.trim() || '',
    companyContact: profile.companyContact || '',
  };
};

const buildCompanyContact = (email, phone) => {
  const lines = [];

  if (email?.trim()) {
    lines.push(`Email: ${email.trim()}`);
  }

  if (phone?.trim()) {
    lines.push(`Phone: ${phone.trim()}`);
  }

  return lines.join('\n');
};

export default function CompanySettingsScreen() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const data = await getCompanyProfiles();
    setProfiles(data.map(normalizeCompanyProfile));
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const pickLogo = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow media permission.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        base64: true,
        quality: 0.7,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 300 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      updateForm('logo', manipulated.uri);
      updateForm('logoBase64', manipulated.base64);
    } catch (error) {
      Alert.alert('Error', 'Logo upload failed.');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a profile title.');
      return;
    }

    if (!form.companyName.trim()) {
      Alert.alert('Required', 'Please enter company name.');
      return;
    }

    const profileToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      companyContact: buildCompanyContact(form.companyEmail, form.companyPhone),
      isDefault: profiles.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = await upsertCompanyProfile(profileToSave);

    setProfiles(updatedProfiles.map(normalizeCompanyProfile));
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Company profile updated successfully.'
        : 'Company profile saved successfully.'
    );
  };

  const handleEdit = (item) => {
    setForm(normalizeCompanyProfile(item));
  };

  const handleView = (item) => {
    const normalizedItem = normalizeCompanyProfile(item);

    Alert.alert(
      normalizedItem.title || 'Company Profile',
      `Company Name:\n${normalizedItem.companyName || '-'}\n\nAddress:\n${
        normalizedItem.companyAddress || '-'
      }\n\nEmail:\n${normalizedItem.companyEmail || '-'}\n\nPhone:\n${
        normalizedItem.companyPhone || '-'
      }`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Company',
      'Are you sure you want to delete this company profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProfiles = await deleteCompanyProfile(id);
            setProfiles(updatedProfiles.map(normalizeCompanyProfile));

            if (form.id === id) {
              resetForm();
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id) => {
    const updatedProfiles = await setDefaultCompanyProfile(id);
    setProfiles(updatedProfiles.map(normalizeCompanyProfile));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.topInfoCard, isEditMode && styles.topInfoCardEdit]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>
              {isEditMode ? 'Edit Company' : 'Company Information'}
            </Text>

            <Text style={styles.pageSubtitle}>
              {isEditMode
                ? 'You are editing a saved company profile.'
                : 'Save company profiles and use them while creating quotations.'}
            </Text>
          </View>

          {isEditMode ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.cancelEditButton}
              onPress={resetForm}
            >
              <Ionicons name="close" size={16} color="#f97316" />
              <Text style={styles.cancelEditButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={[styles.formCard, isEditMode && styles.formCardEdit]}>
          <View style={styles.formHeader}>
            <View style={styles.formIconBox}>
              <Ionicons
                name={isEditMode ? 'create-outline' : 'business-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Company Profile' : 'Add New Company'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved company information.'
                  : 'This information can be reused in quotation forms.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Company'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Profile Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. Main Business"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Company Name</Text>
          <TextInput
            value={form.companyName}
            onChangeText={(t) => updateForm('companyName', t)}
            placeholder="e.g. ABC Trading Co."
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Company Address</Text>
          <TextInput
            value={form.companyAddress}
            onChangeText={(t) => updateForm('companyAddress', t)}
            placeholder="e.g. 123 Business Street, Dhaka"
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.twoColumnRow}>
            <View style={[styles.twoColumnItem, { marginRight: 10 }]}>
              <Text style={styles.label}>Company Email</Text>
              <TextInput
                value={form.companyEmail}
                onChangeText={(t) => updateForm('companyEmail', t)}
                placeholder="info@example.com"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Company Phone</Text>
              <TextInput
                value={form.companyPhone}
                onChangeText={(t) => updateForm('companyPhone', t)}
                placeholder="01XXXXXXXXX"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Upload Logo</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.uploadBox}
            onPress={pickLogo}
          >
            {form.logo ? (
              <Image
                source={{ uri: form.logo }}
                style={styles.logoPreview}
                resizeMode="contain"
              />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color={BRAND_COLOR}
                />
                <Text style={styles.uploadText}>Click to upload logo</Text>
                <Text style={styles.uploadSubText}>PNG, JPG recommended</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this company automatically for new quotations.
              </Text>
            </View>

            <Switch
              value={form.isDefault}
              onValueChange={(value) => updateForm('isDefault', value)}
              trackColor={{ false: '#e5e7eb', true: '#bbf7d0' }}
              thumbColor={form.isDefault ? SUCCESS_COLOR : '#ffffff'}
            />
          </View>

          <TouchableOpacity activeOpacity={0.88} onPress={handleSave}>
            <LinearGradient
              colors={
                isEditMode
                  ? ['#f97316', '#fb923c']
                  : [BRAND_COLOR, '#ff6b95']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <Ionicons
                name={isEditMode ? 'checkmark-circle-outline' : 'save-outline'}
                size={18}
                color="#ffffff"
              />
              <Text style={styles.saveButtonText}>
                {isEditMode ? 'Update Company' : 'Save Company'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {isEditMode ? (
          <View style={styles.editListHiddenCard}>
            <Ionicons
              name="information-circle-outline"
              size={26}
              color="#f97316"
            />
            <Text style={styles.editListHiddenTitle}>
              Saved list hidden while editing
            </Text>
            <Text style={styles.editListHiddenText}>
              Update or cancel editing to view saved companies again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Companies</Text>
              <Text style={styles.savedCount}>{profiles.length} Saved</Text>
            </View>

            {profiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No company saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first company profile from the form above.
                </Text>
              </View>
            ) : (
              profiles.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedIconBox}>
                    {item.logo ? (
                      <Image
                        source={{ uri: item.logo }}
                        style={styles.savedLogo}
                        resizeMode="contain"
                      />
                    ) : (
                      <Ionicons
                        name="business-outline"
                        size={24}
                        color={BRAND_COLOR}
                      />
                    )}
                  </View>

                  <View style={styles.savedInfo}>
                    <View style={styles.savedNameRow}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {item.title}
                      </Text>

                      {item.isDefault ? (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.savedSubText} numberOfLines={1}>
                      {item.companyName}
                    </Text>

                    {!item.isDefault ? (
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => handleSetDefault(item.id)}
                      >
                        <Text style={styles.setDefaultText}>Set as default</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.smallActionButton}
                      onPress={() => handleView(item)}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={16}
                        color={BRAND_COLOR}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.smallActionButton}
                      onPress={() => handleEdit(item)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color={BRAND_COLOR}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.smallActionButton}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}