// src/components/FloatingQuickButton/FloatingQuickButtonStyle.js

import { StyleSheet } from 'react-native';

export const FLOATING_BUTTON_BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  floatingRoot: {
    position: 'absolute',
    width: 220,
    zIndex: 99999,
    elevation: 99999,
  },

  menuPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 7,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f7d3df',

    elevation: 8,
    shadowColor: '#111827',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },

  menuHeaderRow: {
    minHeight: 30,
    borderRadius: 11,
    backgroundColor: '#fff7fa',
    paddingHorizontal: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuDragIcon: {
    marginRight: 6,
  },

  menuTitle: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '900',
    color: '#667085',
  },

  menuCloseButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f7d3df',
  },

  menuItem: {
    minHeight: 34,
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7fa',
    marginBottom: 5,
  },

  menuItemLast: {
    marginBottom: 0,
  },

  menuIconBox: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  menuItemText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '900',
    color: '#111827',
  },

  buttonAlignRight: {
    alignItems: 'flex-end',
  },

  floatButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: FLOATING_BUTTON_BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 3,
    borderColor: '#ffffff',

    elevation: 9,
    shadowColor: FLOATING_BUTTON_BRAND_COLOR,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.32,
    shadowRadius: 12,
  },

  floatButtonActive: {
    backgroundColor: '#111827',
  },

  floatButtonInnerRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
});

export default styles;