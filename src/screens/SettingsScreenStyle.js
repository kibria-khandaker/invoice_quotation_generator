import { StyleSheet } from 'react-native';

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
    paddingBottom: 30,
  },

  header: {
    minHeight: 210,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 26,
    overflow: 'hidden',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    marginTop: 28,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#07142f',
    letterSpacing: -0.4,
  },

  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#667085',
    fontWeight: '500',
  },

  headerIconBox: {
    position: 'absolute',
    right: 26,
    top: 76,
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 8,
    shadowColor: BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 14,
  },

  headerCircleOne: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(253, 68, 117, 0.10)',
    right: -90,
    bottom: -80,
  },

  headerCircleTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(253, 68, 117, 0.08)',
    left: -70,
    top: 80,
  },

  listArea: {
    paddingHorizontal: 16,
    marginTop: 18,
  },

  settingCard: {
    minHeight: 112,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
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

  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#ffeaf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  cardTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    color: '#07142f',
  },

  cardSubtitle: {
    marginTop: 5,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#667085',
    fontWeight: '500',
  },
});

export default styles;