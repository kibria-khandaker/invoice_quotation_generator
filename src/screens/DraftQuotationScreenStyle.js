// src/screens/DraftQuotationScreenStyle.js

import { StyleSheet } from 'react-native';

export const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  // ======================================================
  // HEADER - COMPACT
  // ======================================================
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    marginHorizontal: 8,
  },

  headerRightSpacer: {
    width: 36,
    height: 36,
  },

  // ======================================================
  // TOP CONTROLS - SUPER COMPACT
  // ======================================================
  topControls: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 3,
  },

  helperText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#667085',
    marginBottom: 6,
    fontWeight: '600',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  searchBox: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3c8d4',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
  },

  searchIcon: {
    marginRight: 5,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    lineHeight: 16,
    color: '#111827',
    paddingVertical: 0,
  },

  clearSearchButton: {
    marginLeft: 4,
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3c8d4',
    backgroundColor: '#fff3f7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },

  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f3c8d4',
    backgroundColor: '#fffafd',
  },

  summaryText: {
    marginLeft: 4,
    color: BRAND_COLOR,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '800',
  },

  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f3c8d4',
    backgroundColor: '#fffafd',
  },

  clearAllText: {
    marginLeft: 4,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '800',
    color: '#dc3545',
  },

  // ======================================================
  // LIST
  // ======================================================
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 2,
  },

  // ======================================================
  // DRAFT CARD - MAX COMPACT
  // ======================================================
  draftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 7,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#f5d3dd',
    shadowColor: '#e58ea7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  cardTitleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 7,
  },

  draftIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#fff1f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    borderWidth: 1,
    borderColor: '#f5d3dd',
  },

  cardTextArea: {
    flex: 1,
  },

  draftTitle: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900',
    color: '#111827',
  },

  draftSubTitle: {
    marginTop: 1,
    fontSize: 10.8,
    lineHeight: 13,
    color: '#667085',
    fontWeight: '700',
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#fff4f5',
    borderWidth: 1,
    borderColor: '#f5d3dd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 1,
  },

  infoText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 13,
    color: '#111827',
    fontWeight: '700',
    marginRight: 5,
  },

  infoTextRight: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 13,
    color: '#4b5563',
    fontWeight: '700',
    textAlign: 'right',
    marginLeft: 5,
  },

  infoLabel: {
    color: '#6b7280',
    fontWeight: '800',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#f1d9e0',
    marginTop: 5,
    marginBottom: 6,
  },

  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardActionButton: {
    flex: 1,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  continueButton: {
    backgroundColor: BRAND_COLOR,
    marginRight: 6,
  },

  previewButton: {
    backgroundColor: '#f3ebff',
    borderWidth: 1,
    borderColor: '#eadbff',
    marginLeft: 6,
  },

  cardActionButtonText: {
    marginLeft: 4,
    color: '#ffffff',
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '900',
  },

  previewButtonText: {
    marginLeft: 4,
    color: '#7b4cc2',
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '900',
  },

  // ======================================================
  // EMPTY STATE
  // ======================================================
  emptyBox: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5d3dd',
  },

  emptyTitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    color: '#111827',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 11.5,
    lineHeight: 17,
    color: '#667085',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },

  emptyCreateButton: {
    height: 38,
    borderRadius: 11,
    paddingHorizontal: 14,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  emptyCreateButtonText: {
    marginLeft: 5,
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '900',
  },

  // ======================================================
  // FIXED FOOTER BUTTON - COMPACT FLOATING
  // ======================================================
  footerFloating: {
    position: 'absolute',
    left: 10,
    right: 10,
  },

  createNewButton: {
    height: 42,
    borderRadius: 13,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 4,
  },

  createNewButtonText: {
    marginLeft: 6,
    color: '#ffffff',
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '900',
  },
});

export default styles;