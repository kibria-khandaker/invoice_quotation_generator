import { StyleSheet } from 'react-native';

const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7fa',
  },

  screenGradient: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollContent: {
    // Extra bottom space keeps the last Settings menu visible
    // above Android navigation bar and floating quick button.
    paddingBottom: 120,
  },

  // ======================================================
  // COMPACT HEADER
  // ======================================================
  header: {
    minHeight: 162,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 4,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  headerTextArea: {
    marginTop: 18,
    paddingRight: 92,
  },

  headerTitle: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '900',
    color: '#07142f',
    letterSpacing: -0.35,
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 12.5,
    lineHeight: 17,
    color: '#667085',
    fontWeight: '600',
  },

  headerIconBox: {
    position: 'absolute',
    right: 20,
    top: 58,
    width: 72,
    height: 72,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 7,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },

  headerCircleOne: {
    position: 'absolute',
    width: 185,
    height: 185,
    borderRadius: 92.5,
    backgroundColor: 'rgba(253, 68, 117, 0.10)',
    right: -82,
    bottom: -78,
  },

  headerCircleTwo: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(253, 68, 117, 0.07)',
    left: -58,
    top: 72,
  },

  headerCircleThree: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(253, 68, 117, 0.08)',
    right: 104,
    top: 28,
  },

  // ======================================================
  // COMPACT PREMIUM LIST
  // ======================================================
  listArea: {
    paddingHorizontal: 12,
    marginTop: 10,
  },

  settingCard: {
    minHeight: 76,
    backgroundColor: '#ffffff',
    borderRadius: 17,
    marginBottom: 9,
    paddingLeft: 13,
    paddingRight: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 3,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.055,
    shadowRadius: 8,
  },

  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 13,
    bottom: 13,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },

  cardTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  cardTitle: {
    fontSize: 14.5,
    lineHeight: 18,
    fontWeight: '900',
    color: '#07142f',
  },

  cardSubtitle: {
    marginTop: 2,
    fontSize: 10.5,
    lineHeight: 13,
    color: '#667085',
    fontWeight: '600',
  },

  arrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff6f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffe3ed',
  },
});

export default styles;