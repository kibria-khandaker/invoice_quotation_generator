// src/screens/DraftQuotationScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import styles, { BRAND_COLOR } from './DraftQuotationScreenStyle';

import {
  getDraftQuotations,
  deleteDraftQuotation,
  clearDraftQuotations,
} from '../services/storageService';

const parseAmount = (value) => {
  const amount = parseFloat(value);
  return Number.isNaN(amount) ? 0 : amount;
};

const formatAmount = (value) => {
  const amount = parseAmount(value);

  try {
    return amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  } catch {
    return String(amount);
  }
};

const formatDraftDate = (value) => {
  if (!value) return 'No Date';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
};

const safeText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const getDraftDisplayTitle = (item) => {
  return (
    safeText(item?.draftTitle).trim() ||
    safeText(item?.clientName).trim() ||
    safeText(item?.clientCompany).trim() ||
    safeText(item?.companyName).trim() ||
    safeText(item?.quotationNumber).trim() ||
    'Untitled Draft'
  );
};

const getFirstMeaningfulItemName = (item) => {
  const services = Array.isArray(item?.services) ? item.services : [];

  const found = services.find((service) => {
    const name = safeText(service?.name).trim();
    const description = safeText(service?.description).trim();
    const unitPrice = safeText(service?.unitPrice).trim();

    return name || description || unitPrice;
  });

  if (!found) return '';

  return safeText(found.name).trim() || safeText(found.description).trim();
};

export default function DraftQuotationScreen({ navigation }) {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // ======================================================
  // LOAD DRAFTS
  // ======================================================
  const loadDrafts = async () => {
    setLoading(true);
    const data = await getDraftQuotations();
    setDrafts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDrafts);
    return unsubscribe;
  }, [navigation]);

  // ======================================================
  // FILTERED DRAFTS
  // ======================================================
  const filteredDrafts = drafts.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    const searchableText = [
      item?.draftTitle,
      item?.clientName,
      item?.clientCompany,
      item?.companyName,
      item?.quotationNumber,
      item?.clientEmail,
      item?.clientPhone,
      getFirstMeaningfulItemName(item),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  // ======================================================
  // DELETE SINGLE DRAFT
  // ======================================================
  const handleDeleteDraft = (item) => {
    const draftId = item?.draftId || item?.id;

    if (!draftId) {
      Alert.alert('Error', 'Draft ID not found.');
      return;
    }

    Alert.alert(
      'Delete Draft',
      'Are you sure you want to delete this draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteDraftQuotation(draftId);

            if (success) {
              await loadDrafts();
            } else {
              Alert.alert('Error', 'Could not delete draft.');
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // CLEAR ALL DRAFTS
  // ======================================================
  const handleClearAllDrafts = () => {
    if (drafts.length === 0) {
      Alert.alert('No Drafts', 'There are no drafts to clear.');
      return;
    }

    Alert.alert(
      'Clear All Drafts',
      `Are you sure you want to delete all ${drafts.length} drafts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearDraftQuotations();

            if (success) {
              setDrafts([]);
            } else {
              Alert.alert('Error', 'Could not clear drafts.');
            }
          },
        },
      ]
    );
  };

  // ======================================================
  // CONTINUE DRAFT PLACEHOLDER
  // Phase D4 will connect this to CreateQuotationScreen.
  // ======================================================
  const handleContinueDraft = () => {
    Alert.alert(
      'Coming Next',
      'Continue/Edit Draft will be connected in Phase D4.'
    );
  };

  // ======================================================
  // RENDER DRAFT CARD
  // ======================================================
  const renderDraftItem = ({ item }) => {
    const title = getDraftDisplayTitle(item);
    const firstItemName = getFirstMeaningfulItemName(item);
    const updatedDate = item?.updatedAt || item?.createdAt;

    return (
      <View style={styles.draftCard}>
        <View style={styles.draftCardHeader}>
          <View style={styles.draftIconBox}>
            <Ionicons name="document-text-outline" size={20} color={BRAND_COLOR} />
          </View>

          <View style={styles.draftTitleWrap}>
            <Text style={styles.draftTitle} numberOfLines={1}>
              {title}
            </Text>

            <Text style={styles.draftSubTitle} numberOfLines={1}>
              {item?.clientCompany
                ? `Client Company: ${item.clientCompany}`
                : firstItemName
                  ? `Item: ${firstItemName}`
                  : 'Incomplete quotation draft'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.deleteButton}
            onPress={() => handleDeleteDraft(item)}
          >
            <Ionicons name="trash-outline" size={21} color="#dc3545" />
          </TouchableOpacity>
        </View>

        <View style={styles.draftInfoGrid}>
          <View style={styles.infoPill}>
            <Text style={styles.infoLabel}>Amount</Text>
            <Text style={styles.infoValue}>৳ {formatAmount(item?.grandTotal)}</Text>
          </View>

          <View style={styles.infoPill}>
            <Text style={styles.infoLabel}>QTN</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {item?.quotationNumber || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoPill}>
            <Text style={styles.infoLabel}>Updated</Text>
            <Text style={styles.infoValue}>{formatDraftDate(updatedDate)}</Text>
          </View>
        </View>

        {item?.companyName ? (
          <Text style={styles.fromCompanyText} numberOfLines={1}>
            From: {item.companyName}
          </Text>
        ) : null}

        <View style={styles.cardActions}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.cardActionButton, styles.continueButton]}
            onPress={handleContinueDraft}
          >
            <Ionicons name="create-outline" size={15} color="#ffffff" />
            <Text style={styles.cardActionButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.cardActionButton, styles.previewButton]}
            onPress={() =>
              Alert.alert(
                'Coming Next',
                'Draft preview will be connected after Continue/Edit draft flow.'
              )
            }
          >
            <Ionicons name="eye-outline" size={15} color="#6f42c1" />
            <Text style={styles.previewButtonText}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.topPanel}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Draft Quotations</Text>
            <Text style={styles.screenSubTitle}>
              Saved incomplete quotation drafts
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.refreshButton}
            onPress={loadDrafts}
          >
            <Ionicons name="refresh" size={19} color={BRAND_COLOR} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#98a2b3"
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Search draft..."
            placeholderTextColor="#98a2b3"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#98a2b3" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryPill}>
            <Ionicons name="layers-outline" size={14} color={BRAND_COLOR} />
            <Text style={styles.summaryText}>
              Showing {filteredDrafts.length} / {drafts.length}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.clearAllButton}
            onPress={handleClearAllDrafts}
          >
            <Ionicons name="trash-bin-outline" size={14} color="#dc3545" />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredDrafts}
        keyExtractor={(item, index) => String(item?.draftId || item?.id || index)}
        renderItem={renderDraftItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <Ionicons name="folder-open-outline" size={44} color="#f3a4bb" />

            <Text style={styles.emptyTitle}>
              {loading ? 'Loading drafts...' : 'No drafts found'}
            </Text>

            <Text style={styles.emptyText}>
              Save an incomplete quotation as draft and it will appear here.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.createButton}
              onPress={() => navigation.navigate('Create')}
            >
              <Ionicons name="add-circle-outline" size={17} color="#ffffff" />
              <Text style={styles.createButtonText}>Create New Quotation</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {filteredDrafts.length > 0 && (
        <View style={styles.footerAction}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.createFullButton}
            onPress={() => navigation.navigate('Create')}
          >
            <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
            <Text style={styles.createFullButtonText}>Create New Quotation</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}