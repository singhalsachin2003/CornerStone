import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, OutlineButton, PrimaryButton, Rule } from '@/components/primitives';
import { font, gutter, radius } from '@/theme/tokens';
import { isSyncConfigured } from '@/sync/client';
import {
  deleteAccount,
  describePasswordProblem,
  looksLikeEmail,
  signIn,
  signOut,
  signUp,
} from '@/sync/auth';
import { useSyncStore } from '@/store/useSyncStore';
import { useTheme } from '@/theme/useTheme';

/**
 * Signing in, and backing progress up.
 *
 * The copy calls this a **backup**, never "sync everywhere", and that is a
 * factual choice rather than modesty: on Supabase's free plan a project pauses
 * after a week of inactivity, so there are stretches where nothing uploads at
 * all. Promising continuous sync and delivering a weekly pause would be worse
 * than promising a backup and delivering one.
 */
export default function Account() {
  const { c: color, type } = useTheme();
  const router = useRouter();
  const configured = isSyncConfigured();

  const email = useSyncStore((s) => s.email);
  const status = useSyncStore((s) => s.status);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  const syncMessage = useSyncStore((s) => s.message);
  const refreshSession = useSyncStore((s) => s.refreshSession);
  const sync = useSyncStore((s) => s.sync);
  const clearAfterSignOut = useSyncStore((s) => s.clearAfterSignOut);

  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const submit = useCallback(async () => {
    setNotice(null);
    if (!looksLikeEmail(emailInput)) {
      setNotice('That does not look like an email address.');
      return;
    }
    const passwordProblem = describePasswordProblem(password);
    if (passwordProblem) {
      setNotice(passwordProblem);
      return;
    }

    setBusy(true);
    const outcome =
      mode === 'in' ? await signIn(emailInput, password) : await signUp(emailInput, password);
    setBusy(false);

    if (outcome.kind === 'ok') {
      setPassword('');
      await refreshSession();
      // Fired, not awaited — the screen must not wait on a network to become
      // usable, and a paused project would hold it indefinitely.
      sync();
      return;
    }
    if (outcome.kind === 'confirm-email') {
      setPassword('');
      setNotice('Account created. Check your email for a confirmation link, then sign in.');
      return;
    }
    if (outcome.kind === 'not-configured') {
      setNotice('This build has no account service configured.');
      return;
    }
    setNotice(outcome.message);
  }, [mode, emailInput, password, refreshSession, sync]);

  const onSignOut = useCallback(async () => {
    setBusy(true);
    await signOut();
    clearAfterSignOut();
    setBusy(false);
    setNotice(null);
  }, [clearAfterSignOut]);

  /**
   * Two taps, and the second names what it does rather than saying "OK".
   *
   * The body spells out the two things a candidate will otherwise assume
   * wrongly: that their studying goes with it, and that their subscription
   * gets cancelled. Neither is true, and being wrong about the second costs
   * them money.
   */
  const onDelete = useCallback(() => {
    Alert.alert(
      'Delete your account?',
      'Your account and everything backed up to it are permanently deleted from the server. This cannot be undone.\n\nStudying already on this phone is kept, and Cornerstone keeps working without an account. Your subscription is separate — it belongs to your Google Play account and is not affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              setBusy(true);
              setNotice(null);
              const outcome = await deleteAccount();
              setBusy(false);

              if (outcome.kind === 'ok') {
                clearAfterSignOut();
                setNotice('Your account has been deleted.');
                return;
              }

              // A deletion that quietly did not happen is the one failure here
              // a candidate must not be left believing succeeded.
              setNotice(
                outcome.kind === 'failed'
                  ? outcome.message
                  : 'This build has no account system configured.',
              );
            })();
          },
        },
      ],
      { cancelable: true },
    );
  }, [clearAfterSignOut]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: gutter.screen, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackLink label="← Back" onPress={() => router.back()} />
        <Eyebrow size={9.5} tracking={0.14} style={{ marginTop: 18 }}>
          ACCOUNT
        </Eyebrow>

        {!configured && <NotConfigured />}

        {configured && !email && (
          <>
            <Text style={[type.sectionTitle, { marginTop: 12 }]}>Back up your progress</Text>
            <Text style={[type.body, { marginTop: 10 }]}>
              An account keeps a copy of your mastery, review queue and streak, so a new phone or a
              reinstall does not start you over. Studying works exactly the same without one.
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
              <ModeTab label="Sign in" active={mode === 'in'} onPress={() => setMode('in')} />
              <ModeTab
                label="Create account"
                active={mode === 'up'}
                onPress={() => setMode('up')}
              />
            </View>

            <Field
              label="EMAIL"
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="you@example.com"
              autoComplete="email"
              keyboardType="email-address"
            />
            <Field
              label="PASSWORD"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
            />

            <PrimaryButton
              label={mode === 'in' ? 'Sign in' : 'Create account'}
              onPress={submit}
              disabled={busy}
              style={{ marginTop: 18 }}
            />
            {busy && <ActivityIndicator color={color.ink} style={{ marginTop: 12 }} />}
          </>
        )}

        {configured && email && (
          <>
            <Text style={[type.sectionTitle, { marginTop: 12 }]}>Signed in</Text>
            <Text style={[type.body, { marginTop: 10 }]}>{email}</Text>

            <View
              style={{
                marginTop: 18,
                borderWidth: 1,
                borderColor: color.ruleStrong,
                borderRadius: radius.card,
                backgroundColor: color.surface,
                padding: 16,
              }}
            >
              <Eyebrow size={9} tracking={0.12}>
                BACKUP
              </Eyebrow>
              <Text style={[type.rowLabel, { marginTop: 6 }]}>
                {describeLastSync(lastSyncedAt)}
              </Text>
              <Text style={[type.meta, { marginTop: 5 }]}>
                Your progress lives on this device and is copied up when the app can reach the
                server. It is a backup, not a live mirror.
              </Text>
              <OutlineButton
                label={status === 'syncing' ? 'Backing up…' : 'Back up now'}
                onPress={sync}
                style={{ marginTop: 14 }}
              />
            </View>

            {!!syncMessage && (
              <Text style={[type.body, { marginTop: 14, color: color.inkBody }]}>
                {syncMessage}
              </Text>
            )}

            <Rule style={{ marginTop: 26, marginBottom: 18 }} />
            <OutlineButton label="Sign out" onPress={onSignOut} />
            <Text style={[type.meta, { marginTop: 10 }]}>
              Signing out leaves everything on this device exactly as it is. Nothing is deleted.
            </Text>

            {/* Below its own rule rather than beside Sign out: a destructive
                action sitting next to a harmless one is a mis-tap waiting to
                happen, and the two are not peers. */}
            <Rule style={{ marginTop: 26, marginBottom: 18 }} />
            <Eyebrow size={9.5} tracking={0.14}>
              DELETE ACCOUNT
            </Eyebrow>
            <Text style={[type.body, { marginTop: 10, color: color.inkBody }]}>
              Permanently deletes your account and everything backed up to it. Studying already on
              this phone is kept, and your subscription is not affected.
            </Text>
            <OutlineButton
              label={busy ? 'Working…' : 'Delete account'}
              onPress={onDelete}
              style={{ marginTop: 14, borderColor: color.rust }}
              labelStyle={{ color: color.rust }}
            />
          </>
        )}

        {!!notice && (
          <Text style={[type.body, { marginTop: 16, color: color.inkBody }]}>{notice}</Text>
        )}

        {configured && (
          <Text style={[type.meta, { marginTop: 26 }]}>
            Your subscription is not part of this. It follows your Google Play account, so it is
            already available on any device you sign into Play with.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function describeLastSync(at: number | null): string {
  if (at === null) return 'Not backed up yet';
  const days = Math.floor((Date.now() - at) / 86_400_000);
  if (days === 0) return 'Backed up today';
  if (days === 1) return 'Backed up yesterday';
  return `Backed up ${days} days ago`;
}

function NotConfigured() {
  const { type } = useTheme();
  return (
    <>
      <Text style={[type.sectionTitle, { marginTop: 12 }]}>Accounts are not in this build</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        There is nothing to sign in to. Everything you study is stored on this device, which is
        exactly how the app has always worked.
      </Text>
    </>
  );
}

function ModeTab({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { c: color, type } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: active ? color.ink : color.ruleStrong,
        backgroundColor: active ? color.ink : 'transparent',
      }}
    >
      <Text style={[type.rowLabel, { color: active ? color.onInk : color.ink }]}>{label}</Text>
    </Pressable>
  );
}

function Field({ label, ...rest }: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { c: color } = useTheme();
  return (
    <View style={{ marginTop: 16 }}>
      <Eyebrow size={9} tracking={0.12}>
        {label}
      </Eyebrow>
      <TextInput
        {...rest}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={color.meta}
        style={{
          marginTop: 8,
          borderWidth: 1,
          borderColor: color.ruleStrong,
          borderRadius: radius.button,
          paddingHorizontal: 12,
          paddingVertical: 11,
          fontFamily: font.sans,
          fontSize: 14.5,
          color: color.ink,
          backgroundColor: color.surface,
        }}
      />
    </View>
  );
}
