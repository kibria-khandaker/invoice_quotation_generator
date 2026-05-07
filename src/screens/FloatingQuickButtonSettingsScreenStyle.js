// src/screens/FloatingQuickButtonSettingsScreenStyle.js

import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';

// ======================================================
// FLOATING QUICK BUTTON SETTINGS STYLE START
// NEW: Isolated styles for FloatingQuickButtonSettingsScreen.
// No existing screen styles are edited for this feature page.
// ======================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 34,
  },

  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff7fa',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#667085',
  },

  topInfoCard: {
    minHeight: 130,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },

  headerIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ffe3ed',
  },

  headerTextArea: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    color: '#07142f',
  },

  pageSubtitle: {
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#667085',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.055,
    shadowRadius: 10,
  },

  cardLeftArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },

  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    borderWidth: 1,
    borderColor: '#ffe3ed',
  },

  cardTextArea: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    color: '#07142f',
  },

  cardSubtitle: {
    marginTop: 3,
    fontSize: 11.2,
    lineHeight: 15,
    color: '#667085',
    fontWeight: '600',
  },

  noteCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },

  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#166534',
    fontWeight: '700',
  },
});
// ======================================================
// FLOATING QUICK BUTTON SETTINGS STYLE END
// ======================================================

export default styles;