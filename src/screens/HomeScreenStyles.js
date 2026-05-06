import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContent: {
    paddingBottom: 10,
  },

  header: {
    minHeight: 245,
    paddingTop: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  softCircleLeft: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(253, 68, 117, 0.10)',
    left: -108,
    top: 76,
  },

  softCircleRight: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(253, 68, 117, 0.11)',
    right: -116,
    top: 66,
  },

  sparkle: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 20,
    opacity: 0.95,
  },

  sparkleLeft: {
    left: 42,
    top: 82,
  },

  sparkleRight: {
    right: 46,
    top: 82,
  },

  logoWrapper: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,

    elevation: 6,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },

  appTitle: {
    marginTop: 10,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900',
    color: '#07142f',
    textAlign: 'center',
    letterSpacing: -0.25,
  },

  appSubtitle: {
    marginTop: 6,
    fontSize: 12.8,
    lineHeight: 18,
    color: '#647084',
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 14,
  },

  dividerRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dividerLine: {
    width: 42,
    height: 1.2,
    backgroundColor: 'rgba(253, 68, 117, 0.42)',
  },

  dividerDiamond: {
    color: BRAND_COLOR,
    fontSize: 10,
    marginHorizontal: 8,
  },

  waveBack: {
    position: 'absolute',
    left: -55,
    right: -55,
    bottom: -48,
    height: 88,
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    backgroundColor: 'rgba(253, 68, 117, 0.13)',
    transform: [{ rotate: '-3deg' }],
  },

  waveFront: {
    position: 'absolute',
    left: -65,
    right: -65,
    bottom: -72,
    height: 110,
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    backgroundColor: 'rgba(253, 68, 117, 0.20)',
    transform: [{ rotate: '3deg' }],
  },

  menuList: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  menuCard: {
    minHeight: 86,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#fff0f4',

    elevation: 5,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },

  iconArea: {
    width: 66,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  iconBlob: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(253, 68, 117, 0.08)',
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#fffafb',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 3,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  plusBadge: {
    position: 'absolute',
    right: -7,
    bottom: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 4,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 7,
  },

  menuTextArea: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },

  menuTitle: {
    fontSize: 15.5,
    lineHeight: 20,
    fontWeight: '900',
    color: '#07142f',
    letterSpacing: -0.1,
  },

  menuSubtitle: {
    marginTop: 3,
    fontSize: 11.8,
    lineHeight: 16,
    color: '#667085',
    fontWeight: '500',
  },

  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 5,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  quickLinksWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 4,
    marginTop: 0,
  },

  quickLink: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 6,
  },

  quickLinkText: {
    marginTop: 4,
    fontSize: 10.8,
    lineHeight: 14,
    color: '#6b7280',
    fontWeight: '700',
    textAlign: 'center',
  },

  footer: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 3,
  },

  footerLine: {
    width: 38,
    height: 2.5,
    borderRadius: 3,
    backgroundColor: BRAND_COLOR,
    opacity: 0.9,
    marginBottom: 5,
  },

  versionText: {
    fontSize: 10.5,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default styles;