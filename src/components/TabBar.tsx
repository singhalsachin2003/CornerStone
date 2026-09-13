import React, { forwardRef, type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TabTriggerSlotProps } from 'expo-router/ui';
import type { LucideProps } from 'lucide-react-native';
import { color } from '@/theme/tokens';
import { type } from '@/theme/type';

/**
 * A single tab item: an 18px glyph plus a 10px label, ink when active and
 * #9aa1af when not — per the handoff's shared tab-bar spec.
 *
 * The glyphs were squares and circles: the design's deliberate placeholders,
 * which then appeared in four of the seven store screenshots and in every video
 * cut from the app. They are Lucide icons now — the four the README named all
 * along — and the caller passes the component, so the icon set stays a decision
 * made once here rather than a string this file has to map.
 *
 * `strokeWidth` is 2 rather than the handoff's 1.5 on purpose: Lucide strokes
 * are expressed against a 24-unit viewBox, so at 18px a stroke of 2 renders at
 * exactly the 1.5px the spec asks for.
 */
export const TabButton = forwardRef<
  View,
  TabTriggerSlotProps & { label: string; icon: ComponentType<LucideProps> }
>(({ label, icon: Icon, isFocused, ...props }, ref) => {
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
      <Icon size={18} strokeWidth={isFocused ? 2.4 : 2} color={tint} />
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
