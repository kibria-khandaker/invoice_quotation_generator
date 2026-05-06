import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import styles from './ItemsCatalogSettingsScreenStyle';

import {
  getCatalogItems,
  upsertCatalogItemProfile,
  deleteCatalogItemProfile,
} from '../services/settingsService';

const BRAND_COLOR = '#fd4475';

const emptyForm = {
  id: null,
  title: '',
  itemName: '',
  description: '',
  quantity: '1',
  price: '',
};

export default function ItemsCatalogSettingsScreen() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const isEditMode = Boolean(form.id);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getCatalogItems();
    setItems(data);
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
      Alert.alert('Required', 'Please enter an item title.');
      return;
    }

    if (!form.itemName.trim()) {
      Alert.alert('Required', 'Please enter item name.');
      return;
    }

    if (!form.price.trim()) {
      Alert.alert('Required', 'Please enter unit price.');
      return;
    }

    const itemToSave = {
      ...form,
      id: form.id || Date.now().toString(),
      quantity: form.quantity?.trim() || '1',
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = await upsertCatalogItemProfile(itemToSave);

    setItems(updatedItems);
    resetForm();

    Alert.alert(
      'Success',
      isEditMode
        ? 'Item updated successfully.'
        : 'Item saved successfully.'
    );
  };

  const handleEdit = (item) => {
    setForm(item);
  };

  const handleView = (item) => {
    Alert.alert(
      item.title || 'Catalog Item',
      `Item Name:\n${item.itemName || '-'}\n\nDescription:\n${
        item.description || '-'
      }\n\nQuantity:\n${item.quantity || '1'}\n\nUnit Price:\n${
        item.price || '-'
      }`
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this catalog item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = await deleteCatalogItemProfile(id);
            setItems(updatedItems);

            if (form.id === id) {
              resetForm();
            }
          },
        },
      ]
    );
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
              {isEditMode ? 'Edit Item' : 'Items Catalog'}
            </Text>

            <Text style={styles.pageSubtitle}>
              {isEditMode
                ? 'You are editing a saved catalog item.'
                : 'Save reusable products, services, or quotation items.'}
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
                name={isEditMode ? 'create-outline' : 'cube-outline'}
                size={24}
                color={isEditMode ? '#f97316' : BRAND_COLOR}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.formTitle}>
                {isEditMode ? 'Edit Catalog Item' : 'Add New Item'}
              </Text>

              <Text style={styles.formSubtitle}>
                {isEditMode
                  ? 'Update this saved item information.'
                  : 'This item can be selected while creating quotations.'}
              </Text>
            </View>
          </View>

          {isEditMode ? (
            <View style={styles.editModeBanner}>
              <Ionicons name="create-outline" size={17} color="#f97316" />
              <Text style={styles.editModeText}>
                Editing: {form.title || 'Selected Item'}
              </Text>
            </View>
          ) : null}

          <Text style={styles.label}>Item Title</Text>
          <TextInput
            value={form.title}
            onChangeText={(t) => updateForm('title', t)}
            placeholder="e.g. Web Design Package"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Item Name</Text>
          <TextInput
            value={form.itemName}
            onChangeText={(t) => updateForm('itemName', t)}
            placeholder="e.g. Web Design / Wireless Mouse"
            placeholderTextColor="#9aa4b5"
            style={styles.input}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(t) => updateForm('description', t)}
            placeholder="e.g. Responsive website design or product details"
            placeholderTextColor="#9aa4b5"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.twoColumnRow}>
            <View style={[styles.twoColumnItem, { marginRight: 10 }]}>
              <Text style={styles.label}>Default Quantity</Text>
              <TextInput
                value={form.quantity}
                onChangeText={(t) => updateForm('quantity', t)}
                placeholder="1"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.twoColumnItem}>
              <Text style={styles.label}>Unit Price</Text>
              <TextInput
                value={form.price}
                onChangeText={(t) => updateForm('price', t)}
                placeholder="15000"
                placeholderTextColor="#9aa4b5"
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
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
                {isEditMode ? 'Update Item' : 'Save Item'}
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
              Update or cancel editing to view saved items again.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.savedHeaderRow}>
              <Text style={styles.savedTitle}>Saved Items</Text>
              <Text style={styles.savedCount}>{items.length} Saved</Text>
            </View>

            {items.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyTitle}>No item saved yet</Text>
                <Text style={styles.emptyText}>
                  Add your first product, service, or quotation item from the
                  form above.
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedIconBox}>
                    <Ionicons
                      name="cube-outline"
                      size={24}
                      color={BRAND_COLOR}
                    />
                  </View>

                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName} numberOfLines={1}>
                      {item.title}
                    </Text>

                    <Text style={styles.savedSubText} numberOfLines={1}>
                      {item.itemName}
                    </Text>

                    <Text style={styles.savedPriceText} numberOfLines={1}>
                      Qty: {item.quantity || '1'} • Price: {item.price || '0'}
                    </Text>
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