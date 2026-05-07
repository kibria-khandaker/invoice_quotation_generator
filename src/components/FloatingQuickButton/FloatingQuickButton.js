// src/components/FloatingQuickButton/FloatingQuickButton.js

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles, {
  FLOATING_BUTTON_BRAND_COLOR,
} from './FloatingQuickButtonStyle';

import {
  FLOATING_QUICK_BUTTON_HIDDEN_ROUTES,
  FLOATING_QUICK_BUTTON_MENU_ITEMS,
} from './FloatingQuickButtonConfig';

import {
  DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS,
  getFloatingQuickButtonSettings,
  getFloatingQuickButtonPosition,
  saveFloatingQuickButtonPosition,
  subscribeFloatingQuickButtonSettingsChange,
} from './FloatingQuickButtonStorage';

// ======================================================
// FLOATING QUICK BUTTON MODULE
// Safe optional module.
// This component does not own any quotation/invoice logic.
// It only shows quick navigation shortcuts.
// ======================================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FLOATING_WRAP_WIDTH = 220;
const MIN_X = 8;
const MIN_Y = 70;
const MAX_X = Math.max(MIN_X, SCREEN_WIDTH - FLOATING_WRAP_WIDTH - 8);
const MAX_Y = Math.max(MIN_Y, SCREEN_HEIGHT - 150);

const INITIAL_POSITION = {
  x: MAX_X,
  y: Math.max(MIN_Y, SCREEN_HEIGHT - 230),
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const getSafePosition = (position) => {
  if (
    !position ||
    typeof position.x !== 'number' ||
    typeof position.y !== 'number'
  ) {
    return INITIAL_POSITION;
  }

  return {
    x: clamp(position.x, MIN_X, MAX_X),
    y: clamp(position.y, MIN_Y, MAX_Y),
  };
};

const getButtonIconSize = (buttonSize) => {
  if (buttonSize === 'small') return 20;
  if (buttonSize === 'large') return 28;
  return 24;
};

export default function FloatingQuickButton({
  navigationRef,
  currentRouteName,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState(
    DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS
  );
  const [isReady, setIsReady] = useState(false);

  const movedRef = useRef(false);
  const latestPositionRef = useRef({
    x: INITIAL_POSITION.x,
    y: INITIAL_POSITION.y,
  });

  const pan = useRef(
    new Animated.ValueXY({
      x: INITIAL_POSITION.x,
      y: INITIAL_POSITION.y,
    })
  ).current;

  // ======================================================
  // LOAD FLOATING BUTTON SETTINGS + SAVED POSITION
  // ======================================================
  useEffect(() => {
    let mounted = true;

    const loadFloatingButtonData = async () => {
      const savedSettings = await getFloatingQuickButtonSettings();
      const savedPosition = await getFloatingQuickButtonPosition();

      if (!mounted) return;

      const safePosition = getSafePosition(savedPosition);

      setSettings(savedSettings);
      latestPositionRef.current = safePosition;

      pan.setValue({
        x: safePosition.x,
        y: safePosition.y,
      });

      setIsReady(true);
    };

    loadFloatingButtonData();

    return () => {
      mounted = false;
    };
  }, [pan]);
  // ======================================================
  // LIVE SETTINGS UPDATE START
  // NEW: Listen only to this isolated module's settings changes.
  // If the user disables FloatingQuickButton from its settings
  // screen, this component hides without affecting app logic.
  // ======================================================
  useEffect(() => {
    const unsubscribe = subscribeFloatingQuickButtonSettingsChange(
      (updatedSettings) => {
        setSettings({
          ...DEFAULT_FLOATING_QUICK_BUTTON_SETTINGS,
          ...updatedSettings,
        });
      }
    );

    return unsubscribe;
  }, []);
  // ======================================================
  // LIVE SETTINGS UPDATE END
  // ======================================================

  const shouldHideButton =
    !isReady ||
    !settings?.isEnabled ||
    FLOATING_QUICK_BUTTON_HIDDEN_ROUTES.includes(currentRouteName);

  const visibleMenuItems = useMemo(() => {
    return FLOATING_QUICK_BUTTON_MENU_ITEMS.filter((item) => {
      if (!item?.route) return false;

      const shouldHideOnCurrentRoute =
        item.route === currentRouteName ||
        item.hideOnRoutes?.includes(currentRouteName);

      if (shouldHideOnCurrentRoute) {
        return false;
      }

      if (
        Array.isArray(settings.selectedMenuIds) &&
        settings.selectedMenuIds.length > 0 &&
        !item.alwaysVisible
      ) {
        return settings.selectedMenuIds.includes(item.id);
      }

      return true;
    });
  }, [currentRouteName, settings?.selectedMenuIds]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

const handleNavigate = (routeName) => {
  if (!routeName) return;

  if (navigationRef?.isReady?.()) {
    navigationRef.navigate(routeName);
  }
  requestAnimationFrame(() => {
    closeMenu();
  });
};


  const saveCurrentPosition = async (position) => {
    latestPositionRef.current = position;
    await saveFloatingQuickButtonPosition(position);
  };

  const moveToPosition = (position) => {
    Animated.spring(pan, {
      toValue: position,
      useNativeDriver: false,
      friction: 7,
      tension: 45,
    }).start();
  };

  const handlePanRelease = async (shouldToggleOnTap = false) => {
    pan.flattenOffset();

    pan.stopAnimation(async (value) => {
      const nextPosition = {
        x: clamp(value.x, MIN_X, MAX_X),
        y: clamp(value.y, MIN_Y, MAX_Y),
      };

      await saveCurrentPosition(nextPosition);
      moveToPosition(nextPosition);
    });

    if (shouldToggleOnTap && !movedRef.current) {
      toggleMenu();
    }
  };

  const createPanResponder = (options = {}) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 3 ||
          Math.abs(gestureState.dy) > 3
        );
      },

      onPanResponderGrant: () => {
        movedRef.current = false;

        pan.setOffset({
          x: latestPositionRef.current.x,
          y: latestPositionRef.current.y,
        });

        pan.setValue({
          x: 0,
          y: 0,
        });
      },

      onPanResponderMove: (_, gestureState) => {
        if (
          Math.abs(gestureState.dx) > 3 ||
          Math.abs(gestureState.dy) > 3
        ) {
          movedRef.current = true;
        }

        Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        )(_, gestureState);
      },

      onPanResponderRelease: () => {
        handlePanRelease(Boolean(options.toggleOnTap));
      },
    });

  const buttonPanResponder = useRef(
    createPanResponder({
      toggleOnTap: true,
    })
  ).current;

  const menuHeaderPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 3 ||
          Math.abs(gestureState.dy) > 3
        );
      },

      onPanResponderGrant: () => {
        movedRef.current = false;

        pan.setOffset({
          x: latestPositionRef.current.x,
          y: latestPositionRef.current.y,
        });

        pan.setValue({
          x: 0,
          y: 0,
        });
      },

      onPanResponderMove: (_, gestureState) => {
        if (
          Math.abs(gestureState.dx) > 3 ||
          Math.abs(gestureState.dy) > 3
        ) {
          movedRef.current = true;
        }

        Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        )(_, gestureState);
      },

      onPanResponderRelease: () => {
        handlePanRelease(false);
      },
    })
  ).current;

  if (shouldHideButton) {
    return null;
  }

  const buttonIconSize = getButtonIconSize(settings?.buttonSize);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.floatingRoot,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      {isMenuOpen && visibleMenuItems.length > 0 && (
        <View style={styles.menuPanel}>
          <View
            style={styles.menuHeaderRow}
            {...menuHeaderPanResponder.panHandlers}
          >
            <Ionicons
              name="move-outline"
              size={15}
              color="#98a2b3"
              style={styles.menuDragIcon}
            />

            <Text style={styles.menuTitle}>Quick Menu</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.menuCloseButton}
              onPress={closeMenu}
            >
              <Ionicons
                name="close"
                size={16}
                color={FLOATING_BUTTON_BRAND_COLOR}
              />
            </TouchableOpacity>
          </View>

          {visibleMenuItems.map((item, index) => {
            const isLast = index === visibleMenuItems.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.86}
                style={[
                  styles.menuItem,
                  isLast && styles.menuItemLast,
                ]}
                onPress={() => handleNavigate(item.route)}
              >
                <View style={styles.menuIconBox}>
                  <Ionicons
                    name={item.icon}
                    size={15}
                    color={FLOATING_BUTTON_BRAND_COLOR}
                  />
                </View>

                <Text style={styles.menuItemText} numberOfLines={1}>
                  {item.title}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color="#98a2b3"
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.buttonAlignRight}>
        <View
          style={[
            styles.floatButton,
            isMenuOpen && styles.floatButtonActive,
          ]}
          {...buttonPanResponder.panHandlers}
        >
          <View style={styles.floatButtonInnerRing}>
            <Ionicons
              name={isMenuOpen ? 'close' : 'apps-outline'}
              size={buttonIconSize}
              color="#ffffff"
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}