// src/screens/ItemsCatalogSettingsScreenStyle.js

import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';
const EDIT_COLOR = '#f97316';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
  },

  // ======================================================
  // ITEMS CATALOG CUSTOM HEADER
  // NEW:
  // Used after hiding native stack header for ItemsCatalogSettings.
  // ======================================================
  headerGradient: {
    minHeight: 88,
    paddingTop: 8,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIconButtonLight: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',

    elevation: 5,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  headerTitle: {
    fontSize: 22.5,
    lineHeight: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },

  headerSubtitle: {
    marginTop: 1,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fffafb',
    marginTop: -1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },

  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 5,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },

  formCardEdit: {
    borderColor: '#fed7aa',
    backgroundColor: '#fffaf5',
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  formIconBox: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  formTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    color: '#07142f',
  },

  formSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: '#667085',
    fontWeight: '500',
  },

  editModeBanner: {
    marginBottom: 12,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffedd5',
    borderWidth: 1,
    borderColor: '#fed7aa',
    flexDirection: 'row',
    alignItems: 'center',
  },

  editModeText: {
    marginLeft: 7,
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '800',
    color: EDIT_COLOR,
  },

  label: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#344054',
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#07142f',
  },

  textArea: {
    minHeight: 86,
  },

  twoColumnRow: {
    flexDirection: 'row',
  },

  twoColumnItem: {
    flex: 1,
  },

  saveButton: {
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },

  saveButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },

  savedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  savedTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  savedCount: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_COLOR,
    backgroundColor: '#ffeaf1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#fff0f4',
  },

  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '900',
    color: '#07142f',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#667085',
    textAlign: 'center',
  },

  // ======================================================
  // SAVED ITEM CARD - POLISHED
  // Same layout pattern as Client / Company cards.
  // ======================================================
  savedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 10,
    marginBottom: 9,

    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
  },

  savedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  savedIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  savedInfo: {
    flex: 1,
    paddingRight: 8,
  },

  savedName: {
    fontSize: 14.2,
    lineHeight: 17,
    fontWeight: '900',
    color: '#07142f',
  },

  savedSubText: {
    marginTop: 2,
    fontSize: 10.8,
    lineHeight: 13,
    color: '#667085',
    fontWeight: '700',
  },

  savedPriceText: {
    marginTop: 3,
    fontSize: 10.8,
    lineHeight: 13,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  savedRightTop: {
    minWidth: 68,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  pricePillTop: {
    backgroundColor: '#fff0f5',
    borderWidth: 1,
    borderColor: '#ffd0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    maxWidth: 74,
  },

  pricePillTopText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  selectCircleTouchable: {
    width: 32,
    height: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  selectCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e11d48',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectCircleActive: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  savedActionRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  savedActionButton: {
    flex: 1,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#fffafb',
    borderWidth: 1,
    borderColor: '#ffe1ea',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editListHiddenCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  editListHiddenTitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '900',
    color: '#07142f',
    textAlign: 'center',
  },

  editListHiddenText: {
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#667085',
    textAlign: 'center',
  },

  // ======================================================
  // ITEMS CATALOG BACKUP UI
  // Export/import/select UI for Items Catalog only.
  // ======================================================
  backupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 13,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 4,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.055,
    shadowRadius: 10,
  },

  backupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  backupIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  backupTitleArea: {
    flex: 1,
    paddingRight: 8,
  },

  backupTitle: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    color: '#07142f',
  },

  backupSubtitle: {
    marginTop: 2,
    fontSize: 11.2,
    lineHeight: 15,
    fontWeight: '600',
    color: '#667085',
  },

  backupButtonRow: {
    flexDirection: 'row',
    gap: 7,
  },

  backupButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe1ea',
    backgroundColor: '#fffafb',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },

  backupButtonPrimary: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },

  backupButtonText: {
    marginLeft: 4,
    fontSize: 10.8,
    lineHeight: 14,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  backupButtonPrimaryText: {
    marginLeft: 4,
    fontSize: 10.8,
    lineHeight: 14,
    fontWeight: '900',
    color: '#ffffff',
  },

  selectionBackupRow: {
    marginTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#fff0f4',
    paddingTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  selectedCountPill: {
    minHeight: 32,
    borderRadius: 999,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff0f5',
    borderWidth: 1,
    borderColor: '#ffe1ea',
  },

  selectedCountText: {
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  exportSelectedButton: {
    flex: 1,
    minHeight: 32,
    borderRadius: 11,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  exportSelectedText: {
    fontSize: 10.8,
    lineHeight: 14,
    fontWeight: '900',
    color: '#ffffff',
  },

  clearSelectionButton: {
    minHeight: 32,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#ef4444',
    backgroundColor: '#ffffff',
    paddingHorizontal: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearSelectionText: {
    fontSize: 10.8,
    lineHeight: 14,
    fontWeight: '900',
    color: '#ef4444',
  },
});

export default styles;