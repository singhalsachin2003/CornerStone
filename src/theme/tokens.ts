/**
 * Design tokens — the light palette is transcribed verbatim from the handoff
 * README's token table. Do not invent values there; every colour, size and
 * radius in `light` appears in the spec.
 *
 * The dark palette is not in the handoff and is derived here. Two rules held
 * while deriving it:
 *
 *   1. **Not an inversion.** Brass on cream is the identity, and `brass
 *      #9a6b2f` on a dark ground is unreadable (2.0:1 on `#131c2e`). Every
 *      pigment — brass, sage, rust — is lifted to the value it already had on
 *      dark in the variant-C snapshot card, which was designed against this
 *      exact navy.
 *   2. **Re-derived contrast, not eyeballed.** Every dark text colour below
 *      carries its measured ratio against `paper #131c2e`; all clear WCAG AA
 *      for body text (4.5:1), which is the same bar the light palette was
 *      checked against.
 */

const light = {
  paper: '#f7f4ee',
  paperAlt: '#f2eee5',
  surface: '#fffdfa',
  ink: '#16233b',
  inkHover: '#26365a',
  inkBody: '#3d4a63',
  muted: '#6f7a90',
  meta: '#8c8578',
  brass: '#9a6b2f',
  brassText: '#7d5620',
  brassBody: '#8a6a3c',
  brassTintBg: '#f3ead9',
  brassTintBorder: 'rgba(154,107,47,.42)',
  brassRule: 'rgba(154,107,47,.4)',
  brassRuleSoft: 'rgba(154,107,47,.35)',
  brassOnDark: '#e0b26a',
  sage: '#3f6b57',
  rust: '#9b3b34',
  tabInactive: '#9aa1af',

  // hairlines
  rule: 'rgba(22,35,59,.14)',
  ruleSoft: 'rgba(22,35,59,.10)',
  ruleStrong: 'rgba(22,35,59,.16)',
  hairline: 'rgba(22,35,59,.12)',
  ring: 'rgba(22,35,59,.2)',
  ringStrong: 'rgba(22,35,59,.28)',
  outlineRule: 'rgba(22,35,59,.22)',
  track: 'rgba(22,35,59,.10)',
  trackStrong: 'rgba(22,35,59,.14)',
  disabledBg: 'rgba(22,35,59,.14)',
  faintFg: 'rgba(22,35,59,.22)',
  ghostFg: 'rgba(22,35,59,.45)',
  pressWash: 'rgba(22,35,59,.06)',
  tabRule: 'rgba(22,35,59,.13)',

  // paragraph copy used on the setup screens
  bodyOnPaper: '#5c6478',

  /**
   * The ink feature card — Home's resume card, the profile avatar. A dark card
   * in a light UI, and in dark mode a *raised* card rather than a cream slab:
   * inverting it would put the brightest block on the screen exactly where the
   * eye lands first, which is the thing dark mode exists to avoid.
   */
  emphasis: '#16233b',
  emphasisHover: '#26365a',
  onEmphasis: '#f7f4ee',
  onEmphasisMuted: 'rgba(247,244,238,.72)',
  onEmphasisFaint: 'rgba(247,244,238,.6)',
  onEmphasisTrack: 'rgba(247,244,238,.22)',

  // variant C — dark snapshot. A *card style*, not a theme: these are identical
  // in both palettes on purpose, so the Index treatment looks the same at 11pm
  // as it does at noon.
  darkCardBg: '#1c2740',
  darkScreenBg: '#131c2e',
  darkStack1: '#182238',
  darkStack2: '#151e32',
  darkFg: '#f4f1ea',
  darkBody: 'rgba(244,241,234,.78)',
  darkMuted: 'rgba(244,241,234,.5)',
  darkRule: 'rgba(244,241,234,.16)',

  // feedback fills
  sageFill: 'rgba(63,107,87,.08)',
  sageFillSoft: 'rgba(63,107,87,.07)',
  sageBorder: 'rgba(63,107,87,.35)',
  rustFill: 'rgba(155,59,52,.07)',
  rustFillSoft: 'rgba(155,59,52,.06)',
  rustBorder: 'rgba(155,59,52,.3)',

  // the snapshot card's own surfaces, for the variants that are not the dark one
  cardStack1: '#fbf8f2',
  cardStack2: '#f7f3ea',
  cardStackRule: 'rgba(22,35,59,.09)',
  cardBigNum: 'rgba(22,35,59,.16)',
  formulaBg: '#f5f1e7',

  // on an `ink` fill — the primary button, an active filter chip
  onInk: '#f7f4ee',
} as const;

export type ColorTokens = { readonly [K in keyof typeof light]: string };

export const lightColor: ColorTokens = light;

export const darkColor: ColorTokens = {
  paper: '#131c2e',
  paperAlt: '#182238',
  surface: '#1c2740',
  /** 15.1:1 — the primary text colour, and the fill behind `onInk`. */
  ink: '#f4f1ea',
  inkHover: '#fffdf8',
  /** 11.3:1 */
  inkBody: '#d5d2c9',
  /** 6.9:1 */
  muted: '#9aa6bd',
  /** 6.5:1 — the warm grey of the eyebrows, kept warm rather than neutralised. */
  meta: '#a89f8d',
  /** 8.7:1 — brass lifted to the value the snapshot card already used on dark. */
  brass: '#e0b26a',
  brassText: '#e8c07e',
  brassBody: '#d4ab72',
  brassTintBg: 'rgba(224,178,106,.13)',
  brassTintBorder: 'rgba(224,178,106,.42)',
  brassRule: 'rgba(224,178,106,.4)',
  brassRuleSoft: 'rgba(224,178,106,.32)',
  brassOnDark: '#e0b26a',
  /** 7.6:1 */
  sage: '#79bb9c',
  /** 6.6:1 */
  rust: '#e3897f',
  /** 4.7:1 — the 10px tab label is small text, so it has to clear 4.5. */
  tabInactive: '#7d8798',

  rule: 'rgba(244,241,234,.16)',
  ruleSoft: 'rgba(244,241,234,.10)',
  ruleStrong: 'rgba(244,241,234,.22)',
  hairline: 'rgba(244,241,234,.14)',
  ring: 'rgba(244,241,234,.26)',
  ringStrong: 'rgba(244,241,234,.34)',
  outlineRule: 'rgba(244,241,234,.28)',
  track: 'rgba(244,241,234,.13)',
  trackStrong: 'rgba(244,241,234,.18)',
  disabledBg: 'rgba(244,241,234,.16)',
  faintFg: 'rgba(244,241,234,.26)',
  ghostFg: 'rgba(244,241,234,.5)',
  pressWash: 'rgba(244,241,234,.07)',
  tabRule: 'rgba(244,241,234,.14)',

  /** 10.0:1 */
  bodyOnPaper: '#c2c6d0',

  emphasis: '#2a3a5c',
  emphasisHover: '#33466e',
  onEmphasis: '#f4f1ea',
  onEmphasisMuted: 'rgba(244,241,234,.74)',
  onEmphasisFaint: 'rgba(244,241,234,.62)',
  onEmphasisTrack: 'rgba(244,241,234,.22)',

  darkCardBg: '#1c2740',
  darkScreenBg: '#131c2e',
  darkStack1: '#182238',
  darkStack2: '#151e32',
  darkFg: '#f4f1ea',
  darkBody: 'rgba(244,241,234,.78)',
  darkMuted: 'rgba(244,241,234,.5)',
  darkRule: 'rgba(244,241,234,.16)',

  sageFill: 'rgba(121,187,156,.12)',
  sageFillSoft: 'rgba(121,187,156,.10)',
  sageBorder: 'rgba(121,187,156,.38)',
  rustFill: 'rgba(227,137,127,.12)',
  rustFillSoft: 'rgba(227,137,127,.10)',
  rustBorder: 'rgba(227,137,127,.34)',

  cardStack1: '#1a2338',
  cardStack2: '#161f33',
  cardStackRule: 'rgba(244,241,234,.09)',
  cardBigNum: 'rgba(244,241,234,.18)',
  formulaBg: 'rgba(244,241,234,.05)',

  /** Navy *on* the cream `ink` fill — the primary button inverts in dark mode. */
  onInk: '#16233b',
};

/**
 * The light palette, for the handful of places that cannot hold a hook: the
 * splash colour in `app.config.js`'s sibling files, the store-graphic scripts,
 * and tests. Anything that renders should use `useTheme()` instead.
 */
export const color = lightColor;

export const font = {
  serif: 'SourceSerif4_400Regular',
  serifSemi: 'SourceSerif4_600SemiBold',
  serifBold: 'SourceSerif4_700Bold',
  sans: 'Archivo_400Regular',
  sansMedium: 'Archivo_500Medium',
  sansSemi: 'Archivo_600SemiBold',
  sansBold: 'Archivo_700Bold',
  // React Native has no `ui-monospace` keyword; Menlo is the spec's named fallback.
  mono: 'Menlo',
} as const;

/** 20px screen gutter; 24px on onboarding / exam / level. */
export const gutter = { screen: 20, setup: 24 } as const;

export const radius = {
  button: 4,
  row: 5,
  card: 6,
  snapA: 2,
  snapB: 10,
  snapC: 6,
  toggle: 13,
  pill: 999,
} as const;

/** Only variant B's snapshot card carries a shadow. */
export const shadow = {
  snapshotB: {
    shadowColor: '#16233b',
    shadowOpacity: 0.12,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  toggleKnob: {
    shadowColor: '#16233b',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
} as const;

/**
 * Mastery thresholds drive ring colour, percentage colour and the mastery word.
 * The palette is a required argument rather than a defaulted one: a default is
 * exactly how a light-palette brass ends up drawn on a dark screen, and the
 * compiler is the only thing that catches a missed call site.
 */
export function masteryColor(pct: number, c: ColorTokens): string {
  return pct >= 70 ? c.sage : pct >= 35 ? c.brass : c.ghostFg;
}

export function masteryTextColor(pct: number, c: ColorTokens): string {
  return pct >= 70 ? c.sage : pct >= 35 ? c.brass : c.muted;
}

export function masteryWord(pct: number): string {
  return pct >= 70 ? 'strong' : pct >= 35 ? 'building' : pct > 0 ? 'shaky' : 'not started';
}
