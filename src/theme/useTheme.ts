import { useColorScheme } from 'react-native';
import { useStudyStore } from '@/store/useStudyStore';
import { ColorTokens, darkColor, lightColor } from './tokens';
import { TypeScale, makeType } from './type';

export type ThemePreference = 'system' | 'light' | 'dark';

export interface Theme {
  scheme: 'light' | 'dark';
  /** The palette. Named `c` because it is destructured in every screen. */
  c: ColorTokens;
  /** The type scale, already built against `c`. */
  type: TypeScale;
}

/**
 * Both themes are built once, at module load, and handed out by identity. A
 * screen can therefore put `c` and `type` straight into inline styles or a
 * `useMemo` dependency list without either causing a re-render it did not need.
 */
export const lightTheme: Theme = {
  scheme: 'light',
  c: lightColor,
  type: makeType(lightColor),
};

export const darkTheme: Theme = {
  scheme: 'dark',
  c: darkColor,
  type: makeType(darkColor),
};

/**
 * The theme for right now: the candidate's preference, falling back to the OS.
 *
 * This is a hook rather than a context on purpose. There is exactly one source
 * for each half — `useColorScheme()` and the persisted store — and both are
 * already global, so a provider would add an ordering constraint (`_layout`
 * paints a background *before* the tree mounts) without adding a capability.
 *
 * `useColorScheme()` returns null while the OS value is unknown, which is the
 * same thing as "no preference": light.
 */
export function useTheme(): Theme {
  const preference = useStudyStore((s) => s.themePreference);
  const system = useColorScheme();
  const scheme = preference === 'system' ? (system ?? 'light') : preference;
  return scheme === 'dark' ? darkTheme : lightTheme;
}

/** For the components that need the palette and not the type scale. */
export function useColors(): ColorTokens {
  return useTheme().c;
}
