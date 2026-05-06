import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';
const SUCCESS_COLOR = '#16a34a';

const styles = StyleSheet.create({
  selectorButton: {
    minHeight: 34,
    maxWidth: 170,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ffd1dd',
    backgroundColor: '#fff7fa',
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectorText: {
    flex: 1,
    marginHorizontal: 5,
    fontSize: 11.2,
    lineHeight: 15,
    fontWeight: '900',
    color: BRAND_COLOR,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    maxHeight: '78%',
    backgroundColor: '#fffafb',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 26,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    color: '#07142f',
  },

  modalSubtitle: {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#667085',
    fontWeight: '500',
  },

  closeButton: {
    marginLeft: 'auto',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 3,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  listContent: {
    paddingBottom: 8,
  },

  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fff0f4',
    flexDirection: 'row',
    alignItems: 'center',

    elevation: 3,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  optionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  optionInfo: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionTitle: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    color: '#07142f',
  },

  optionSubtitle: {
    marginTop: 3,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#667085',
    fontWeight: '500',
  },

  defaultBadge: {
    marginLeft: 7,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },

  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: SUCCESS_COLOR,
  },

  emptyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff0f4',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#667085',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;