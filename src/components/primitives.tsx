import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { radius, shadow } from '@/theme/tokens';
import { eyebrow } from '@/theme/type';
import { useTheme } from '@/theme/useTheme';

// ---------------------------------------------------------------------------

export function Eyebrow({
  children,
  size = 10,
  tracking = 0.14,
  style,
  ...rest
}: React.ComponentProps<typeof Text> & {
  children: React.ReactNode;
  size?: number;
  tracking?: number;
  style?: StyleProp<TextStyle>;
}) {
  const { c: color } = useTheme();

  return (
    <Text {...rest} style={[eyebrow(color, size, tracking), style]}>
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------

/** Full-width ink primary button. Disabled state is the spec's grey fill. */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { c: color, type } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primary,
        { backgroundColor: disabled ? color.disabledBg : pressed ? color.inkHover : color.ink },
        style,
      ]}
    >
      <Text style={[type.button, { color: disabled ? color.meta : color.onInk }]}>{label}</Text>
    </Pressable>
  );
}

/** Outlined secondary button — used for "Retake" on results. */
export function OutlineButton({
  label,
  onPress,
  style,
  labelStyle,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  /** For the one caller that is destructive and has to look it. */
  labelStyle?: StyleProp<TextStyle>;
  accessibilityHint?: string;
}) {
  const { c: color, type } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.outline,
        { borderColor: pressed ? color.ink : color.outlineRule },
        style,
      ]}
    >
      <Text style={[type.button, { color: color.ink, fontSize: 14 }, labelStyle]}>{label}</Text>
    </Pressable>
  );
}

/** 12.5px Archivo 500 back link in muted, per the spec's nav-link rule. */
export function BackLink({
  label,
  onPress,
  tint,
  style,
}: {
  label: string;
  onPress: () => void;
  tint?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { c: color, type } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={12}
      style={[{ alignSelf: 'flex-start' }, style]}
    >
      <Text style={[type.navLink, { color: tint ?? color.muted }]}>{label}</Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------

/** Card / row surface with the 1px rule border. Turns ink when selected. */
export function SelectableCard({
  selected,
  onPress,
  children,
  style,
  radiusValue = radius.row,
}: {
  selected?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radiusValue?: number;
}) {
  const { c: color } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        {
          padding: 20,
          borderRadius: radiusValue,
          borderWidth: 1,
          borderColor: selected || pressed ? color.ink : color.ruleStrong,
          backgroundColor: selected ? color.surface : 'transparent',
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------

/** 44×26 pill toggle; knob animates left 3 → 21 over 180ms. */
export function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const reducedMotion = useReducedMotion();
  const { c: color } = useTheme();

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: reducedMotion ? 0 : 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim, reducedMotion]);

  const left = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 21] });
  const track = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [color.ring, color.sage],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={onToggle}
      hitSlop={8}
    >
      <Animated.View
        style={{
          width: 44,
          height: 26,
          borderRadius: radius.toggle,
          backgroundColor: track as unknown as string,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 3,
              left,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: color.surface,
            },
            shadow.toggleKnob,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------

/** Segmented progress bar — one 3px segment per card or question. */
export function SegmentedBar({
  segments,
  colors,
  gap = 4,
  height = 3,
  style,
}: {
  segments: number;
  colors: (i: number) => string;
  gap?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: 'row', gap }, style]}>
      {Array.from({ length: segments }, (_, i) => (
        <View key={i} style={{ flex: 1, height, backgroundColor: colors(i) }} />
      ))}
    </View>
  );
}

/** Thin progress track with a filled portion. */
export function ProgressTrack({
  pct,
  height = 2,
  trackColor,
  fillColor,
  style,
}: {
  pct: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { c: color } = useTheme();

  return (
    <View style={[{ height, backgroundColor: trackColor ?? color.track }, style]}>
      <View
        style={{
          height,
          width: `${Math.max(0, Math.min(100, pct))}%`,
          backgroundColor: fillColor ?? color.ink,
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------

/** Hairline divider. */
export function Rule({ style, tone }: { style?: StyleProp<ViewStyle>; tone?: string }) {
  const { c: color } = useTheme();

  return (
    <View
      style={[
        { height: StyleSheet.hairlineWidth * 2, backgroundColor: tone ?? color.ruleSoft },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  primary: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  outline: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});
