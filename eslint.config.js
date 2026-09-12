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
    },
  },
];
