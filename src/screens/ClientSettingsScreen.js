import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from './ClientSettingsScreenStyle';

import {
  getClientProfiles,
  upsertClientProfile,
  deleteClientProfile,
  setDefaultClientProfile,
} from '../services/settingsService';

const BRAND_COLOR = '#fd4475';
const SUCCESS_COLOR = '#16a34a';

const emptyForm = {
  id: null,
  title: '',
  clientName: '',
  clientCompany: '',
  clientEmail: '',
  clientPhone: '',
  clientAddress: '',
  isDefault: false,
};

export default function ClientSettingsScreen() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const data = await getClientProfiles();
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

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert('Required', 'Please enter a profile title.');
      return;
    }

    if (!form.clientName.trim()) {
      Alert.alert('Required', 'Please enter client name.');
      return;
    }

    const profileToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      isDefault: profiles.length === 0 ? true : form.isDefault,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfiles = await upsertClientProfile(profileToSave);

    setProfiles(updatedProfiles);
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Client profile updated successfully.'
        : 'Client profile saved successfully.'
    );
  };

  const handleEdit = (item) => {
    setForm(item);
  };

  const handleView = (item) => {
    Alert.alert(
      item.title || 'Client Profile',
      `Client Name:\n${item.clientName || '-'}\n\nCompany:\n${
        item.clientCompany || '-'
      }\n\nEmail:\n${item.clientEmail || '-'}\n\nPhone:\n${
        item.clientPhone || '-'
      }\n\nAddress:\n${item.clientAddress || '-'}`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this client profile?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedProfiles = await deleteClientProfile(id);
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
    const updatedProfiles = await setDefaultClientProfile(id);
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
              {isEditMode ? 'Edit Client' : 'Client Profiles'}
            </Text>

            <Text style={styles.pageSubtitle}>
              {isEditMode
                ? 'You are editing a saved client profile.'
                : 'Save client details and reuse them in quotations.'}
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
                name={isEditMode ? 'create-outline' : 'people-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Client Profile' : 'Add New Client'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved client information.'
                  : 'This client can be selected while creating quotations.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Client'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Profile Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. ABC Trading Client"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Client Name</Text>
          <TextInput
            value={form.clientName}
            onChangeText={(t) => updateForm('clientName', t)}
            placeholder="e.g. Mr. Rahim Ahmed"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Client Company</Text>
          <TextInput
            value={form.clientCompany}
            onChangeText={(t) => updateForm('clientCompany', t)}
            placeholder="e.g. ABC Trading Ltd."
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <View style={styles.twoColumnRow}>
            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Client Email</Text>
              <TextInput
                value={form.clientEmail}
                onChangeText={(t) => updateForm('clientEmail', t)}
                placeholder="client@example.com"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Client Phone</Text>
              <TextInput
                value={form.clientPhone}
                onChangeText={(t) => updateForm('clientPhone', t)}
                placeholder="01XXXXXXXXX"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Client Address</Text>
          <TextInput
            value={form.clientAddress}
            onChangeText={(t) => updateForm('clientAddress', t)}
            placeholder="e.g. House 12, Road 5, Dhaka"
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.defaultRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.defaultTitle}>Set as Default</Text>
              <Text style={styles.defaultSubtitle}>
                Use this client automatically for new quotations.
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
                {isEditMode ? 'Update Client' : 'Save Client'}
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
              Update or cancel editing to view saved clients again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Clients</Text>
              <Text style={styles.savedCount}>{profiles.length} Saved</Text>
            </View>

            {profiles.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No client saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first client profile from the form above.
                </Text>
              </View>
            ) : (
              profiles.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedIconBox}>
                    <Ionicons
                      name="person-outline"
                      size={24}
                      color={BRAND_COLOR}
                    />
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
                      {item.clientName}
                      {item.clientCompany ? ` • ${item.clientCompany}` : ''}
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