import { TextStyle } from 'react-native';
import { color, font } from './tokens';

/**
 * The type scale from the handoff, expressed as named styles.
 * Sizes and line-heights are the spec's px/line-height pairs resolved to absolute
 * line-heights (RN has no unitless lineHeight).
 */
const lh = (size: number, ratio: number) => Math.round(size * ratio);

export const type = {
  /** 38/1.1 serif — onboarding hero */
  hero: {
    fontFamily: font.serif,
    fontSize: 38,
    lineHeight: lh(38, 1.1),
    letterSpacing: -0.38,
    color: color.ink,
  } as TextStyle,

  /** 30/1.15 serif — exam & level screen titles */
  screenTitle: {
    fontFamily: font.serif,
    fontSize: 30,
    lineHeight: lh(30, 1.15),
    color: color.ink,
  } as TextStyle,

  /** 29/1.15 serif — results headline */
  resultsTitle: {
    fontFamily: font.serif,
    fontSize: 29,
    lineHeight: lh(29, 1.15),
    color: color.ink,
  } as TextStyle,

  /** 27/1.15 serif — Topics title */
  sectionTitle: {
    fontFamily: font.serif,
    fontSize: 27,
    lineHeight: lh(27, 1.15),
    color: color.ink,
  } as TextStyle,

  /** 25/1.2 serif — home "{exam} · {level}" */
  homeTitle: {
    fontFamily: font.serif,
    fontSize: 25,
    lineHeight: lh(25, 1.2),
    color: color.ink,
  } as TextStyle,

  /** 24/1.15 serif — snapshot card title (27 on dark) */
  cardTitle: {
    fontFamily: font.serif,
    fontSize: 24,
    lineHeight: lh(24, 1.15),
    color: color.ink,
  } as TextStyle,

  /** 22/1.2 serif — profile name, exam card title */
  serif22: {
    fontFamily: font.serifSemi,
    fontSize: 22,
    lineHeight: lh(22, 1.2),
    color: color.ink,
  } as TextStyle,

  /** 21/1.2 serif — snapshot topic name, results score */
  serif21: {
    fontFamily: font.serif,
    fontSize: 21,
    lineHeight: lh(21, 1.2),
    color: color.ink,
  } as TextStyle,

  /** 20.5/1.35 serif — quiz stem */
  stem: {
    fontFamily: font.serif,
    fontSize: 20.5,
    lineHeight: lh(20.5, 1.35),
    color: color.ink,
  } as TextStyle,

  /** 20/1.25 serif — resume card topic */
  serif20: {
    fontFamily: font.serif,
    fontSize: 20,
    lineHeight: lh(20, 1.25),
    color: color.ink,
  } as TextStyle,

  /** 19/1.2 serif — index-variant topic name, placement callout */
  serif19: {
    fontFamily: font.serif,
    fontSize: 19,
    lineHeight: lh(19, 1.2),
    color: color.ink,
  } as TextStyle,

  /** 18/1.25 serif — placement quiz callout title */
  serif18: {
    fontFamily: font.serif,
    fontSize: 18,
    lineHeight: lh(18, 1.25),
    color: color.ink,
  } as TextStyle,

  /** 15.5/1.25 Archivo 500 — list row title */
  rowTitle: {
    fontFamily: font.sansSemi,
    fontSize: 15.5,
    lineHeight: lh(15.5, 1.25),
    color: color.ink,
  } as TextStyle,

  /** 15/1 Archivo 600 — primary buttons */
  button: {
    fontFamily: font.sansSemi,
    fontSize: 15,
    lineHeight: 18,
    color: color.onInk,
  } as TextStyle,

  /** 15/1.3 Archivo 600 — "112 days to exam day" */
  statLead: {
    fontFamily: font.sansSemi,
    fontSize: 15,
    lineHeight: lh(15, 1.3),
    color: color.ink,
  } as TextStyle,

  /** 15/1.6 Archivo — onboarding paragraph */
  lede: {
    fontFamily: font.sans,
    fontSize: 15,
    lineHeight: lh(15, 1.6),
    color: color.bodyOnPaper,
  } as TextStyle,

  /** 14.5/1.6 Archivo — snapshot card body */
  cardBody: {
    fontFamily: font.sans,
    fontSize: 14.5,
    lineHeight: lh(14.5, 1.6),
    color: color.inkBody,
  } as TextStyle,

  /** 14/1.45 Archivo — quiz options */
  option: {
    fontFamily: font.sans,
    fontSize: 14,
    lineHeight: lh(14, 1.45),
    color: color.ink,
  } as TextStyle,

  /** 14/1.55 Archivo — exam picker subtitle */
  subtitle: {
    fontFamily: font.sans,
    fontSize: 14,
    lineHeight: lh(14, 1.55),
    color: color.bodyOnPaper,
  } as TextStyle,

  /** 14/1.25 Archivo 500 — settings row name, half-card title */
  rowLabel: {
    fontFamily: font.sansSemi,
    fontSize: 14,
    lineHeight: lh(14, 1.25),
    color: color.ink,
  } as TextStyle,

  /** 13.5/1.5 Archivo — card descriptions, feedback copy */
  body: {
    fontFamily: font.sans,
    fontSize: 13.5,
    lineHeight: lh(13.5, 1.55),
    color: color.bodyOnPaper,
  } as TextStyle,

  /** 12.5/1.5 Archivo — secondary copy, nav links */
  secondary: {
    fontFamily: font.sans,
    fontSize: 12.5,
    lineHeight: lh(12.5, 1.5),
    color: color.muted,
  } as TextStyle,

  /** 12.5/1 Archivo 500 — back links */
  navLink: {
    fontFamily: font.sansSemi,
    fontSize: 12.5,
    lineHeight: 15,
    color: color.muted,
  } as TextStyle,

  /** 11.5/1.4 Archivo — meta line under a row title */
  meta: {
    fontFamily: font.sans,
    fontSize: 11.5,
    lineHeight: lh(11.5, 1.4),
    color: color.muted,
  } as TextStyle,

  /** 11/1.35 Archivo — tile footer */
  tileMeta: {
    fontFamily: font.sans,
    fontSize: 11,
    lineHeight: lh(11, 1.35),
    color: color.muted,
  } as TextStyle,

  /** 10px Archivo 500 — tab labels */
  tabLabel: {
    fontFamily: font.sansSemi,
    fontSize: 10,
    lineHeight: 12,
  } as TextStyle,
} as const;

/**
 * Monospace eyebrows: 9–12px, uppercase, letter-spacing .06–.16em.
 * RN letterSpacing is absolute px, so em values are multiplied by the size.
 */
export function eyebrow(size = 10, tracking = 0.14, weight: 'semi' = 'semi'): TextStyle {
  return {
    fontFamily: font.mono,
    fontSize: size,
    lineHeight: Math.round(size * 1.2),
    letterSpacing: size * tracking,
    fontWeight: weight === 'semi' ? '600' : '500',
    color: color.meta,
  };
}

/** Formula blocks and given-data blocks share the monospace treatment. */
export const monoBlock = {
  fontFamily: font.mono,
  fontSize: 15.5,
  lineHeight: lh(15.5, 1.5),
  color: color.ink,
} as TextStyle;

export const monoGiven = {
  fontFamily: font.mono,
  fontSize: 13.5,
  lineHeight: lh(13.5, 1.6),
  color: color.bodyOnPaper,
} as TextStyle;
