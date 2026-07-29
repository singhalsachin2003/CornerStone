/**
 * Design tokens — transcribed verbatim from the handoff README's token table.
 * Do not invent values here; every colour, size and radius below appears in the spec.
 */

export const color = {
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
  brassOnDark: '#e0b26a',
  sage: '#3f6b57',
  rust: '#9b3b34',
  tabInactive: '#9aa1af',

  // hairlines
  rule: 'rgba(22,35,59,.14)',
  ruleSoft: 'rgba(22,35,59,.10)',
  ruleStrong: 'rgba(22,35,59,.16)',
  track: 'rgba(22,35,59,.10)',
  disabledBg: 'rgba(22,35,59,.14)',

  // paragraph copy used on the setup screens
  bodyOnPaper: '#5c6478',

  // variant C — dark snapshot
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

  // on the ink resume card
  onInk: '#f7f4ee',
  onInkMuted: 'rgba(247,244,238,.72)',
  onInkFaint: 'rgba(247,244,238,.6)',
  onInkTrack: 'rgba(247,244,238,.22)',
} as const;

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

/** Mastery thresholds drive ring colour, percentage colour and the mastery word. */
export function masteryColor(pct: number): string {
  return pct >= 70 ? color.sage : pct >= 35 ? color.brass : 'rgba(22,35,59,.45)';
}

export function masteryTextColor(pct: number): string {
  return pct >= 70 ? color.sage : pct >= 35 ? color.brass : color.muted;
}

export function masteryWord(pct: number): string {
  return pct >= 70 ? 'strong' : pct >= 35 ? 'building' : pct > 0 ? 'shaky' : 'not started';
}
