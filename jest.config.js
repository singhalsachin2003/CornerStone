/**
 * Tests target the pure logic — scheduling, streaks, progress, mastery — not components.
 * That logic is what fails *silently*: a wrong interval or an off-by-one streak corrupts a
 * candidate's data without ever throwing, so it is the part worth pinning down.
 *
 * ts-jest with a node environment keeps this fast and avoids pulling in the React Native
 * preset, which none of these modules need.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: { jsx: 'react-jsx', esModuleInterop: true, types: ['jest', 'node'] } },
    ],
  },
  collectCoverageFrom: ['src/store/review.ts', 'src/content/syllabus.ts'],
};
