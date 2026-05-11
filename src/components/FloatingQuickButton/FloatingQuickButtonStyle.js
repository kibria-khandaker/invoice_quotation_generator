// src/components/FloatingQuickButton/FloatingQuickButtonStyle.js

import { StyleSheet } from 'react-native';

export const FLOATING_BUTTON_BRAND_COLOR = '#fd4475';

const styles = StyleSheet.create({
  floatingRoot: {
    position: 'absolute',
    width: 245,
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
    minHeight: 36,
    borderRadius: 12,
    backgroundColor: '#fff7fa',
    paddingHorizontal: 10,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  menuListScroll: {
    maxHeight: 360,
  },

  menuListContent: {
    paddingBottom: 0,
  },

  menuDragIcon: {
    marginRight: 6,
  },

  menuTitle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    color: '#667085',
  },

  menuCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f7d3df',
  },

  menuItem: {
    minHeight: 42,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7fa',
    marginBottom: 6,
  },

  menuItemLast: {
    marginBottom: 0,
  },

  menuIconBox: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: '#fff0f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  menuItemText: {
    flex: 1,
    fontSize: 13.2,
    lineHeight: 17,
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