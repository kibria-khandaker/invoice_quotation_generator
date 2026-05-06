import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import styles from './SignatureSettingsScreenStyle';

import {
  getSignatureProfiles,
  upsertSignatureProfile,
  deleteSignatureProfile,
  setDefaultSignatureProfile,
} from '../services/settingsService';

const BRAND_COLOR = '#fd4475';
const SUCCESS_COLOR = '#16a34a';

const emptyForm = {
  id: null,
  title: '',
  signatureImage: null,
  signatureBase64: null,
  isDefault: false,
};

export default function SignatureSettingsScreen() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const data = await getSignatureProfiles();
    setProfiles(data);
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

  const pickSignature = async () => {
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

      updateForm('signatureImage', manipulated.uri);
      updateForm('signatureBase64', manipulated.base64);
    } catch (error) {
      Alert.alert('Error', 'Signature upload failed.');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a profile title.');
      return;
    }

    if (!form.signatureImage || !form.signatureBase64) {
      Alert.alert('Required', 'Please upload a signature image.');
      return;
    }

    const profileToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      isDefault: profiles.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = await upsertSignatureProfile(profileToSave);

    setProfiles(updatedProfiles);
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Signature profile updated successfully.'
        : 'Signature profile saved successfully.'
    );
  };

  const handleEdit = (item) => {
    setForm(item);
  };

  const handleView = (item) => {
    Alert.alert(
      item.title || 'Signature Profile',
      `This signature profile is saved successfully.\n\nDefault: ${
        item.isDefault ? 'Yes' : 'No'
      }`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Signature',
      'Are you sure you want to delete this signature profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProfiles = await deleteSignatureProfile(id);
            setProfiles(updatedProfiles);

            if (form.id === id) {
              resetForm();
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id) => {
    const updatedProfiles = await setDefaultSignatureProfile(id);
    setProfiles(updatedProfiles);
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
              {isEditMode ? 'Edit Signature' : 'Signature'}
            </Text>

            <Text style={styles.pageSubtitle}>
              {isEditMode
                ? 'You are editing a saved signature profile.'
                : 'Save signatures and use them while creating quotations.'}
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
                name={isEditMode ? 'create-outline' : 'pencil-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode
                  ? 'Edit Signature Profile'
                  : 'Add New Signature'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved signature image.'
                  : 'This signature can be reused in quotation forms.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Signature'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Profile Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. Main Signature"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Upload Signature</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.uploadBox}
            onPress={pickSignature}
          >
            {form.signatureImage ? (
              <Image
                source={{ uri: form.signatureImage }}
                style={styles.signaturePreview}
                resizeMode="contain"
              />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color={BRAND_COLOR}
                />
                <Text style={styles.uploadText}>Click to upload signature</Text>
                <Text style={styles.uploadSubText}>PNG, JPG recommended</Text>
              </>
            )}
          </TouchableOpacity>

          {form.signatureImage ? (
            <View style={styles.signatureLinePreview}>
              <Text style={styles.signatureLine}>________________________</Text>
              <Text style={styles.signatureLabel}>Authorized Signature</Text>
            </View>
          ) : null}

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this signature automatically for new quotations.
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
                {isEditMode ? 'Update Signature' : 'Save Signature'}
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
              Update or cancel editing to view saved signatures again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Signatures</Text>
              <Text style={styles.savedCount}>{profiles.length} Saved</Text>
            </View>

            {profiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No signature saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first signature profile from the form above.
                </Text>
              </View>
            ) : (
              profiles.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedIconBox}>
                    {item.signatureImage ? (
                      <Image
                        source={{ uri: item.signatureImage }}
                        style={styles.savedSignatureImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Ionicons
                        name="pencil-outline"
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
                      Signature profile
                    </Text>

                    {!item.isDefault ? (
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => handleSetDefault(item.id)}
                      >
                        <Text style={styles.setDefaultText}>
                          Set as default
                        </Text>
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