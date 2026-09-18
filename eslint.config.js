/**
 * Flat config. `eslint-config-expo` brings the React, React Hooks and React Native
 * rules that matter here; `eslint-config-prettier` goes last so formatting is
 * Prettier's job alone and the two never disagree about where a brace goes.
 */
const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  ...expo,
  prettier,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'android/**',
      'ios/**',
      '.expo/**',
      '.expo-web/**',
      'design_handoff_frm_cfa_study_flow/**',
      'store/**',
      'marketing/**',
    ],
  },
  {
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      // Unused *arguments* are how a callback documents the signature it is given;
      // unused locals are dead code. Only the second is worth failing a build over.
      // The base rule cannot see TypeScript types, so it duplicates every finding —
      // the typescript-eslint one is the only one switched on.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      // An apostrophe inside JSX text is an HTML-entity concern. React Native has no
      // HTML, renders the character correctly, and `&apos;` would ship literally in
      // some contexts — so the rule is wrong for this project rather than unheeded.
      'react/no-unescaped-entities': 'off',

      // ----------------------------------------------------------------------
      // React Compiler rules, arrived with eslint-config-expo on the SDK 57.0.24
      // upgrade (18 Sept 2026). Warnings, not errors, and NOT because the findings
      // are wrong — each one is real and each is listed in TODO.md. They are
      // demoted so that a security patch is not coupled to refactoring three
      // pieces of working, shipped UI and state code. Promote them back to
      // 'error' as the call sites are dealt with.
      //
      // `refs` — src/components/primitives.tsx calls anim.interpolate() during
      //   render on an Animated.Value held in a ref. That is how React Native's
      //   own documentation uses Animated; the rule models the React Compiler,
      //   which does not know about it. Lowest priority of the three.
      // `purity` — src/access/useAccess.ts passes now: Date.now() into the access
      //   rules inside a useMemo. Deliberate: `now` is injected so the rules stay
      //   pure and testable. The real consequence is that a promo grant expiring
      //   mid-session does not flip until something re-renders, which is
      //   acceptable and arguably kinder than content vanishing mid-session.
      // `set-state-in-effect` — app/results.tsx commits mastery and the review
      //   queue once, guarded by a ref. The guard is correct; the shape is what
      //   the rule objects to.
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
