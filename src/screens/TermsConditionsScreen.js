import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TermsConditionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>
      <Text style={styles.description}>
        This is a demo Terms & Conditions page. You can add your app usage rules,
        service terms, and legal conditions here later.
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