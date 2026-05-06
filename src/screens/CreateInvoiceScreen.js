import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CreateInvoiceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Invoice</Text>
      <Text style={styles.description}>
        This is a demo Create Invoice page. Later you can build a full invoice
        form here, similar to the quotation creation form.
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