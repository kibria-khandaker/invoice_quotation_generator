// src/screens/InvoiceDraftScreenStyle.js

// ======================================================
// INVOICE SIDE DRAFT STYLE
// PHASE: QUOTATION-LIKE DRAFT UI FOR INVOICE - COMPACT
//
// IMPORTANT:
// - This style file belongs only to InvoiceDraftScreen.
// - Quotation Draft styles are not edited.
// - Invoice card includes compact Total / Paid / Due boxes.
// - Vertical spacing/font sizes are reduced to show more cards.
// ======================================================

import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  // ======================================================
  // HEADER - MORE COMPACT
  // EDIT:
  // Reduces subtitle bottom empty space.
  // ======================================================
  headerGradient: {
    minHeight: 86,
    paddingTop: 7,
    paddingHorizontal: 18,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  headerTitle: {
    fontSize: 23,
    lineHeight: 27,
    fontWeight: '900',
    color: '#ffffff',
  },

  headerSubtitle: {
    marginTop: 1,
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff7fa',
    marginTop: -8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  // ======================================================
  // FIXED TOP CONTROLS - COMPACT
  // ======================================================
  topControls: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 12,
    marginTop: 7,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 3,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  searchBox: {
    flex: 1,
    height: 38,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#f3c8d4',
    backgroundColor: '#fffafd',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
  },

  searchIcon: {
    marginRight: 5,
  },

  searchInput: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 16,
    color: '#111827',
    fontWeight: '700',
    paddingVertical: 0,
  },

  clearSearchButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
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
  },

  summaryPill: {
    minHeight: 29,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f3c8d4',
    backgroundColor: '#fffafd',
  },

  summaryText: {
    marginLeft: 4,
    color: BRAND_COLOR,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
  },

  clearAllButton: {
    minHeight: 29,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f3c8d4',
    backgroundColor: '#fffafd',
  },

  clearAllText: {
    marginLeft: 4,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    color: '#b42318',
  },

  // ======================================================
  // LIST
  // ======================================================
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 2,
  },

  // ======================================================
  // DRAFT CARD - MORE COMPACT
  // EDIT:
  // Reduced padding, margin, font sizes and action height
  // to show more invoice draft cards vertically.
  // ======================================================
  draftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 9,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 3,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
  },

  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  cardLeftBlock: {
    flex: 1,
    paddingRight: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  draftIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#fff1f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f5d3dd',
  },

  titleTextBlock: {
    flex: 1,
  },

  clientName: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  clientCompany: {
    marginTop: 1,
    fontSize: 11,
    lineHeight: 14,
    color: '#667085',
    fontWeight: '700',
  },

  amountMainText: {
    marginTop: 6,
    fontSize: 12.8,
    lineHeight: 16,
    color: '#344054',
    fontWeight: '900',
  },

  cardRightBlock: {
    width: 132,
    alignItems: 'flex-end',
    paddingTop: 2,
  },

  rightInfoText: {
    maxWidth: '100%',
    fontSize: 11.2,
    lineHeight: 14,
    color: '#475467',
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 1,
  },

  rightInfoLabel: {
    color: '#667085',
    fontWeight: '800',
  },

  // ======================================================
  // COMPACT AMOUNT BOXES
  // ======================================================
  amountGrid: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 8,
  },

  amountBox: {
    flex: 1,
    minHeight: 32,
    borderRadius: 12,
    backgroundColor: '#fff7fa',
    borderWidth: 1,
    borderColor: '#ffe3ed',
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },

  amountLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    color: '#667085',
    marginRight: 3,
  },

  amountValue: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '800',
    color: '#667085',
  },

  dueValue: {
    flex: 1,
    fontSize: 11.2,
    lineHeight: 14,
    fontWeight: '900',
    color: '#dc2626',
  },

  // ======================================================
  // ACTIONS - COMPACT
  // ======================================================
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  cardActionButton: {
    flex: 1,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  continueButton: {
    backgroundColor: BRAND_COLOR,
  },

  deleteButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1.1,
    borderColor: '#f3c8d4',
  },

  continueButtonText: {
    marginLeft: 6,
    color: '#ffffff',
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '900',
  },

  deleteButtonText: {
    marginLeft: 6,
    color: '#b42318',
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '900',
  },

  // ======================================================
  // EMPTY STATE
  // ======================================================
  emptyBox: {
    marginTop: 18,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f5d3dd',

    elevation: 2,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: '#07142f',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: '#667085',
    textAlign: 'center',
    fontWeight: '600',
  },

  // ======================================================
  // FIXED FOOTER BUTTON
  // EDIT:
  // Wrapper/button made smaller. Position is controlled from
  // InvoiceDraftScreen.js using bottom: Math.max(insets.bottom, 10).
  // ======================================================
  footerFloating: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,247,250,0.96)',
    borderRadius: 18,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ffe3ed',

    elevation: 6,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  createNewButton: {
    height: 46,
    borderRadius: 15,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',

    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },

  createNewButtonText: {
    marginLeft: 7,
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
});

export default styles;