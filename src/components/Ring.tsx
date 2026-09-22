import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/theme/useTheme';

interface Props {
  size: number;
  /** Diameter of the paper-filled inner circle. */
  innerSize: number;
  pct: number;
  trackColor?: string;
  fillColor: string;
  innerColor?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * The design specifies a conic-gradient ring. React Native has no conic gradient,
 * so this draws the equivalent with a stroked SVG arc — same visual result, and it
 * animates and anti-aliases better than a gradient would.
 */
export function Ring({
  size,
  innerSize,
  pct,
  trackColor,
  fillColor,
  innerColor,
  children,
  style,
}: Props) {
  const { c: color } = useTheme();
  const stroke = (size - innerSize) / 2;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const dash = (clamped / 100) * circumference;

  return (
    <View
      style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor ?? color.track}
          strokeWidth={stroke}
          fill="none"
        />
        {clamped > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={fillColor}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${circumference - dash}`}
            // Start the arc at 12 o'clock, matching the conic gradient's origin.
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </Svg>
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: innerColor ?? color.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  );
}
