import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DraftQuotationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Draft Quotation</Text>
      <Text style={styles.description}>
        This is a demo Draft feature coming soon ....
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },

  description: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
  },
});