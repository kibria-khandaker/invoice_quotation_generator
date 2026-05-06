import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';
const EDIT_COLOR = '#f97316';
const SUCCESS_COLOR = '#16a34a';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fffafb',
  },

  container: {
    flex: 1,
    backgroundColor: '#fffafb',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },

  topInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
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

  topInfoCardEdit: {
    borderColor: '#fed7aa',
    backgroundColor: '#fff7ed',
  },

  pageTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: '#07142f',
  },

  pageSubtitle: {
    marginTop: 5,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#667085',
    fontWeight: '500',
    paddingRight: 12,
  },

  cancelEditButton: {
    height: 38,
    borderRadius: 999,
    backgroundColor: '#ffedd5',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  cancelEditButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '900',
    color: EDIT_COLOR,
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

  uploadBox: {
    minHeight: 130,
    borderWidth: 1.2,
    borderColor: '#ff9bb6',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#fffafb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },

  signaturePreview: {
    width: '100%',
    height: 100,
  },

  uploadText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '800',
    color: '#07142f',
  },

  uploadSubText: {
    marginTop: 2,
    fontSize: 11.5,
    color: '#667085',
  },

  signatureLinePreview: {
    marginTop: 12,
    alignItems: 'flex-end',
  },

  signatureLine: {
    color: BRAND_COLOR,
    fontSize: 13,
  },

  signatureLabel: {
    marginTop: 2,
    color: BRAND_COLOR,
    fontSize: 12,
    fontWeight: '700',
  },

  defaultRow: {
    marginTop: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  defaultTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#07142f',
  },

  defaultSubtitle: {
    marginTop: 2,
    fontSize: 11.5,
    lineHeight: 16,
    color: '#667085',
  },

  saveButton: {
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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

  savedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 3,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  savedIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },

  savedSignatureImage: {
    width: 46,
    height: 36,
  },

  savedInfo: {
    flex: 1,
    paddingRight: 8,
  },

  savedNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  savedName: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
    color: '#07142f',
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

  savedSubText: {
    marginTop: 3,
    fontSize: 11.5,
    color: '#667085',
  },

  setDefaultText: {
    marginTop: 4,
    fontSize: 11.5,
    fontWeight: '800',
    color: BRAND_COLOR,
  },

  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallActionButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#fffafb',
    borderWidth: 1,
    borderColor: '#ffe1ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
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
});

export default styles;