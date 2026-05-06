import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './PresetSelectorStyle';

const BRAND_COLOR = '#fd4475';

export default function PresetSelector({
  label = 'Select Preset',
  selectedLabel = '',
  items = [],
  icon = 'albums-outline',
  emptyText = 'No saved presets found.',
  onSelect,
}) {
  const [visible, setVisible] = useState(false);

  const displayLabel = selectedLabel || label;

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
  }, [items]);

  const handleSelect = (item) => {
    setVisible(false);

    if (typeof onSelect === 'function') {
      onSelect(item);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.82}
        style={styles.selectorButton}
        onPress={() => setVisible(true)}
      >
        <Ionicons name={icon} size={15} color={BRAND_COLOR} />

        <Text style={styles.selectorText} numberOfLines={1}>
          {displayLabel}
        </Text>

        <Ionicons name="chevron-down" size={15} color={BRAND_COLOR} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{label}</Text>
                <Text style={styles.modalSubtitle}>
                  Choose one saved preset
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.closeButton}
                onPress={() => setVisible(false)}
              >
                <Ionicons name="close" size={20} color="#344054" />
              </TouchableOpacity>
            </View>

            {sortedItems.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons
                  name="folder-open-outline"
                  size={34}
                  color={BRAND_COLOR}
                />
                <Text style={styles.emptyText}>{emptyText}</Text>
              </View>
            ) : (
              <FlatList
                data={sortedItems}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.optionCard}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.optionIconBox}>
                      <Ionicons name={icon} size={21} color={BRAND_COLOR} />
                    </View>

                    <View style={styles.optionInfo}>
                      <View style={styles.optionTitleRow}>
                        <Text style={styles.optionTitle} numberOfLines={1}>
                          {item.title || item.itemName || 'Saved Preset'}
                        </Text>

                        {item.isDefault ? (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Default</Text>
                          </View>
                        ) : null}
                      </View>

                      <Text style={styles.optionSubtitle} numberOfLines={2}>
                        {item.companyName ||
                          item.clientName ||
                          item.paymentMethod ||
                          item.mobilePaymentInfo ||
                          item.itemName ||
                          item.notes ||
                          'Tap to use this preset'}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#98a2b3"
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}