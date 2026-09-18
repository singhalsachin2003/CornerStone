/**
 * Has a local Android build mutated `node_modules`? Run with `npm run check:pristine`.
 *
 * **This is not hygiene — it breaks EAS builds.** `runtimeVersion.policy` is
 * `fingerprint`, so the runtime version is a hash over the project *including*
 * dependency sources. A local `./gradlew assembleRelease` edits files inside
 * `node_modules` in place: AGP 8 forbids the `package` attribute in a library
 * manifest, so the build strips it from every dependency that still declares one.
 *
 * That is a real change to a real fingerprint input. EAS then computes a different
 * runtime version from its own clean install and fails the build outright with
 * "Runtime version calculated on local machine not equal to runtime version
 * calculated during build" — correctly, because updates published from this machine
 * would never reach that binary.
 *
 * Measured on EAS build `5d2e32d8` (2026-09-12): a one-package fingerprint diff in
 * `@react-native-masked-view/masked-view`, caused by exactly this. `npm ci` restored
 * the tree and the local fingerprint then matched EAS byte for byte.
 *
 * The fix is always `npm ci`. It cannot be solved with `.fingerprintignore`, because
 * the mutated file is a legitimate input — it is the dependency's own manifest.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const MODULES = join(ROOT, 'node_modules');

const strippedManifests: string[] = [];
const buildOutputs: string[] = [];

/** node_modules is two levels deep for scoped packages, one for the rest. */
function packageDirs(): string[] {
  if (!existsSync(MODULES)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(MODULES)) {
    if (entry.startsWith('.')) continue;
    const path = join(MODULES, entry);
    if (!statSync(path).isDirectory()) continue;
    if (entry.startsWith('@')) {
      for (const scoped of readdirSync(path)) out.push(join(path, scoped));
    } else {
      out.push(path);
    }
  }
  return out;
}

for (const pkg of packageDirs()) {
  const manifest = join(pkg, 'android/src/main/AndroidManifest.xml');
  if (existsSync(manifest)) {
    const xml = readFileSync(manifest, 'utf8');
    // The signature of the in-place edit: `<manifest` followed by the double space
    // left behind where `package="..."` used to be.
    if (/<manifest\s\s/.test(xml) && !/<manifest[^>]*\spackage=/.test(xml)) {
      strippedManifests.push(pkg.replace(`${ROOT}/`, ''));
    }
  }
  if (existsSync(join(pkg, 'android/build'))) buildOutputs.push(pkg.replace(`${ROOT}/`, ''));
}

if (strippedManifests.length === 0 && buildOutputs.length === 0) {
  console.log('node_modules is pristine — safe to run an EAS build');
  process.exit(0);
}

console.error('node_modules has been mutated by a local Android build.\n');
if (strippedManifests.length > 0) {
  console.error(
    `  ${strippedManifests.length} package(s) had the "package" attribute stripped from their ` +
      'AndroidManifest.xml, which CHANGES THE FINGERPRINT and will fail an EAS build:',
  );
  strippedManifests.slice(0, 8).forEach((p) => console.error(`    ${p}`));
  if (strippedManifests.length > 8) console.error(`    …and ${strippedManifests.length - 8} more`);
}
if (buildOutputs.length > 0) {
  console.error(`\n  ${buildOutputs.length} package(s) contain android/build output directories.`);
}
console.error('\nRun `npm ci` before building on EAS. See scripts/check-node-modules-pristine.ts.');
process.exit(1);
