import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { color } from '@/theme/tokens';
import { type } from '@/theme/type';

/**
 * A single tab item: an 18px 1.5px-border square/circle glyph plus a 10px label,
 * ink when active and #9aa1af when not — per the handoff's shared tab-bar spec.
 *
 * The glyphs are the design's deliberate placeholders. Swapping in a real icon set
 * (Lucide: home, layers, repeat, user) means changing only this component.
 */
export const TabButton = forwardRef<
  View,
  TabTriggerSlotProps & { label: string; shape: 'square' | 'circle' }
>(({ label, shape, isFocused, ...props }, ref) => {
  const tint = isFocused ? color.ink : color.tabInactive;

  return (
    <Pressable
      ref={ref}
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderWidth: 1.5,
          borderColor: tint,
          borderRadius: shape === 'circle' ? 9 : 3,
          backgroundColor: isFocused ? color.ink : 'transparent',
        }}
      />
      <Text style={[type.tabLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
});

TabButton.displayName = 'TabButton';

export const tabBarStyle = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: 'rgba(22,35,59,.13)',
    backgroundColor: color.paper,
  },
}).bar;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    paddingTop: 11,
    paddingBottom: 13,
    alignItems: 'center',
    gap: 6,
  },
});
