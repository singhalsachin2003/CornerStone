import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ExternalLink, LineChart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, Toggle } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { type } from '@/theme/type';
import { EXAMS, PATHWAYS, formatExamDate, topicsFor } from '@/content';
import {
  GUEST_NAME,
  bookmarkCount,
  Settings,
  TopicVariant,
  currentStreak,
  useStudyStore,
} from '@/store/useStudyStore';
import { OTC_LEARN_PLAY_URL } from '@/links';
import { useAccess } from '@/access';
import { isSyncConfigured } from '@/sync/client';
import { useSyncStore } from '@/store/useSyncStore';
import { premiumTotals } from '@/content';
import { openExternal } from '@/share';
import {
  cancelDailyReminder,
  reminderTimeLabel,
  scheduleDailyReminder,
  syncDailyReminder,
} from '@/notifications';

const SETTING_ROWS: { key: keyof Settings; name: string; note: string }[] = [
  {
    key: 'spacedRepetition',
    name: 'Spaced repetition',
    note: 'Resurface missed questions on a schedule',
  },
  {
    key: 'dailyReminder',
    name: 'Daily reminder',
    note: `${reminderTimeLabel()} — after work, before dinner`,
  },
  { key: 'timedQuizzes', name: 'Timed quizzes', note: 'Show a per-session clock while answering' },
];

const VARIANTS: { key: TopicVariant; label: string }[] = [
  { key: 'a', label: 'Ledger' },
  { key: 'b', label: 'Tiles' },
  { key: 'c', label: 'Index' },
];

export default function Profile() {
  const router = useRouter();
  const examKey = useStudyStore((s) => s.exam);
  const levelKey = useStudyStore((s) => s.level);
  const pathway = useStudyStore((s) => s.pathway);
  const levelByExam = useStudyStore((s) => s.levelByExam);
  const name = useStudyStore((s) => s.name);
  const setName = useStudyStore((s) => s.setName);
  const initials = useStudyStore((s) => s.initials);
  const settings = useStudyStore((s) => s.settings);
  const toggleSetting = useStudyStore((s) => s.toggleSetting);
  const variant = useStudyStore((s) => s.variant);
  const setVariant = useStudyStore((s) => s.setVariant);
  const access = useAccess();
  const syncEmail = useSyncStore((s) => s.email);
  const studyDays = useStudyStore((s) => s.studyDays);
  const answered = useStudyStore((s) => s.questionsAnswered);
  const correct = useStudyStore((s) => s.questionsCorrect);
  const bookmarkedQuestions = useStudyStore((s) => s.bookmarkedQuestions);
  const bookmarkedCards = useStudyStore((s) => s.bookmarkedCards);

  const topics = useMemo(
    () => (examKey && levelKey ? topicsFor(examKey, levelKey, pathway) : []),
    [examKey, levelKey, pathway],
  );

  // Every hook in this component runs before the `!examKey` early return below.
  // Switching exam clears the level whenever that exam has never been opened, so
  // this screen really can re-render with no level after having had one — and a
  // hook called only on the first of those renders is the "rendered fewer hooks
  // than expected" crash, not a hypothetical.

  // The OS is the source of truth for notifications: the candidate can revoke
  // permission in system settings at any time, and the toggle must not claim
  // otherwise. If scheduling fails we leave the switch off.
  const [reminderBlocked, setReminderBlocked] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');

  const commitName = useCallback(() => {
    const trimmed = draftName.trim();
    setName(trimmed || GUEST_NAME);
    setEditingName(false);
  }, [draftName, setName]);

  const onToggleReminder = useCallback(async () => {
    if (settings.dailyReminder) {
      await cancelDailyReminder();
      setReminderBlocked(false);
      toggleSetting('dailyReminder');
      return;
    }
    const ok = await scheduleDailyReminder();
    setReminderBlocked(!ok);
    if (ok) toggleSetting('dailyReminder');
  }, [settings.dailyReminder, toggleSetting]);

  // Reconcile on mount — a reinstall or a revoked permission desyncs the two.
  useEffect(() => {
    let cancelled = false;
    syncDailyReminder(settings.dailyReminder).then((active) => {
      if (cancelled) return;
      if (settings.dailyReminder && !active) {
        setReminderBlocked(true);
        toggleSetting('dailyReminder');
      }
    });
    return () => {
      cancelled = true;
    };
    // Intentionally mount-only: this reconciles persisted state with the OS once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!examKey || !levelKey) return null;
  const exam = EXAMS[examKey];
  const level = exam.levels.find((l) => l.key === levelKey);
  const streak = currentStreak(studyDays);
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  // Counts only live bookmarks: a removed one keeps its entry so the removal can
  // survive a cross-device merge, and counting entries would count those too.
  const bookmarks = bookmarkCount(bookmarkedQuestions) + bookmarkCount(bookmarkedCards);

  // Until the candidate names themselves the store holds the guest placeholder,
  // which is a prompt rather than a value: the field opens empty so they type over
  // nothing, and clearing the field puts them back to guest.
  const isGuest = name === GUEST_NAME;
  // The other programme, if it has been started — surfaced so switching is discoverable.
  const otherExam = (Object.keys(levelByExam) as (keyof typeof levelByExam)[]).find(
    (k) => k !== examKey,
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: gutter.screen, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <BackLink label="← Home" onPress={() => router.push('/home')} />

        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginTop: 18 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: color.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: font.sansSemi, fontSize: 18, color: color.paper }}>
              {initials}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            {editingName ? (
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                onBlur={commitName}
                onSubmitEditing={commitName}
                autoFocus
                selectTextOnFocus
                maxLength={40}
                returnKeyType="done"
                placeholder="Your name"
                placeholderTextColor={color.muted}
                accessibilityLabel="Your name"
                style={[
                  type.serif22,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: color.brass,
                    paddingBottom: 2,
                    padding: 0,
                  },
                ]}
              />
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isGuest ? 'Add your name.' : `Your name is ${name}. Tap to edit.`
                }
                onPress={() => {
                  setDraftName(isGuest ? '' : name);
                  setEditingName(true);
                }}
              >
                <Text style={[type.serif22, isGuest && { color: color.muted }]}>{name}</Text>
              </Pressable>
            )}
            <Text style={[type.secondary, { marginTop: 4 }]}>
              {exam.name} {level?.name} · sitting {formatExamDate(exam.date)}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
          <StatTile value={String(streak)} label="DAY STREAK" tint={color.brass} />
          <StatTile value={String(answered)} label="QUESTIONS" />
          <StatTile value={`${accuracy}%`} label="ACCURACY" />
        </View>

        {/* ACCESS — shown only when there is something true to say. A build with
            nothing for sale says nothing rather than advertising an empty shop. */}
        {access.gating && (
          <>
            <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 8 }}>
              ACCESS
            </Eyebrow>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/paywall')}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderColor: pressed ? color.brass : color.brassTintBorder,
                backgroundColor: color.brassTintBg,
                borderRadius: radius.card,
                padding: 16,
              })}
            >
              <Text style={[type.rowLabel, { color: color.brassText }]}>
                {accessHeadline(access)}
              </Text>
              <Text style={[type.meta, { marginTop: 5, color: color.brassBody }]}>
                {accessDetail(access)}
              </Text>
            </Pressable>
          </>
        )}

        {/* ACCOUNT — hidden entirely in a build with no sync credentials, the same
            way the access row is hidden when nothing is for sale. */}
        {isSyncConfigured() && (
          <>
            <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 8 }}>
              ACCOUNT
            </Eyebrow>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/account')}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderColor: pressed ? color.ink : color.ruleStrong,
                backgroundColor: color.surface,
                borderRadius: radius.card,
                padding: 16,
              })}
            >
              <Text style={type.rowLabel}>{syncEmail ?? 'Back up your progress'}</Text>
              <Text style={[type.meta, { marginTop: 5 }]}>
                {syncEmail
                  ? 'Signed in — your progress is copied up when the app can reach the server.'
                  : 'Optional. An account survives a reinstall or a new phone.'}
              </Text>
            </Pressable>
          </>
        )}

        {/* STUDY */}
        <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 8 }}>
          STUDY
        </Eyebrow>
        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(22,35,59,.12)' }}>
          {SETTING_ROWS.map((row) => (
            <View
              key={row.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: color.ruleSoft,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={type.rowLabel}>{row.name}</Text>
                <Text style={[type.meta, { marginTop: 3 }]}>
                  {row.key === 'dailyReminder' && reminderBlocked
                    ? 'Notifications are off for Cornerstone in system settings'
                    : row.note}
                </Text>
              </View>
              <Toggle
                value={settings[row.key]}
                onToggle={() =>
                  row.key === 'dailyReminder' ? onToggleReminder() : toggleSetting(row.key)
                }
              />
            </View>
          ))}
        </View>

        {/* APPEARANCE — the three topic treatments from the handoff */}
        <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 8 }}>
          APPEARANCE
        </Eyebrow>
        <View
          style={{ borderTopWidth: 1, borderTopColor: 'rgba(22,35,59,.12)', paddingVertical: 15 }}
        >
          <Text style={type.rowLabel}>Topic list style</Text>
          <Text style={[type.meta, { marginTop: 3 }]}>
            Index also switches snapshot cards to the dark treatment.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {VARIANTS.map((v) => {
              const active = variant === v.key;
              return (
                <Pressable
                  key={v.key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  onPress={() => setVariant(v.key)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderRadius: radius.button,
                    borderColor: active ? color.ink : color.ruleStrong,
                    backgroundColor: active ? color.ink : 'transparent',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: font.sansSemi,
                      fontSize: 12.5,
                      color: active ? color.paper : color.ink,
                    }}
                  >
                    {v.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ACCOUNT */}
        <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 8 }}>
          ACCOUNT
        </Eyebrow>
        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(22,35,59,.12)' }}>
          <DisclosureRow
            label="Switch exam or level"
            value={`${otherExam ? `${exam.name} · ${otherExam} also started` : `${exam.name} ${level?.name}`} →`}
            onPress={() => router.push('/switch')}
          />
          {level?.hasPathway && (
            <DisclosureRow
              label="Pathway"
              value={`${PATHWAYS.find((p) => p.key === pathway)?.short} →`}
              onPress={() => router.push('/setup/level')}
            />
          )}
          <DisclosureRow label="Topics in this level" value={`${topics.length} areas`} />
          <DisclosureRow label="Bookmarks" value={`${bookmarks} saved`} />
          <DisclosureRow label="About & legal" value="→" onPress={() => router.push('/about')} />
        </View>

        <Eyebrow size={10} tracking={0.14} style={{ marginTop: 26, marginBottom: 10 }}>
          MORE FROM US
        </Eyebrow>
        <MoreFromUs />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * The other app on the same developer account.
 *
 * Derivatives are a syllabus topic here rather than a different subject, so the
 * two audiences are close to the same people — and until now neither app had
 * ever mentioned the other. It sits at the bottom of Profile rather than
 * anywhere on the study path: an advertisement between a card set and a quiz
 * would cost more than the install it might win.
 */
function MoreFromUs() {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel="OTC Learn on Google Play"
      onPress={() => void openExternal(OTC_LEARN_PLAY_URL)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        borderWidth: 1,
        borderColor: 'rgba(22,35,59,.12)',
        backgroundColor: color.surface,
        borderRadius: radius.card,
        padding: 15,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.row,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color.paper,
        }}
      >
        <LineChart size={20} strokeWidth={2} color={color.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: font.sansSemi, fontSize: 13.5, color: color.ink }}>
          OTC Learn
        </Text>
        <Text style={[type.meta, { marginTop: 3 }]}>
          Our app for over-the-counter derivatives — 36 products, each with a lesson, a worked
          example and a question bank.
        </Text>
      </View>
      <ExternalLink size={16} strokeWidth={2} color={color.muted} />
    </Pressable>
  );
}

function StatTile({
  value,
  label,
  tint = color.ink,
}: {
  value: string;
  label: string;
  tint?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: 'rgba(22,35,59,.12)',
        backgroundColor: color.surface,
        borderRadius: radius.row,
        padding: 13,
      }}
    >
      <Text style={{ fontFamily: font.serifSemi, fontSize: 19, color: tint }}>{value}</Text>
      <Eyebrow size={9} tracking={0.04} style={{ marginTop: 5 }}>
        {label}
      </Eyebrow>
    </View>
  );
}

function DisclosureRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      disabled={!onPress}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: color.ruleSoft,
        minHeight: 44,
      }}
    >
      <Text style={{ fontFamily: font.sans, fontSize: 14, color: color.ink }}>{label}</Text>
      <Text style={{ fontFamily: font.sans, fontSize: 14, color: color.muted }}>{value}</Text>
    </Pressable>
  );
}

/**
 * One line per access state, all of them true.
 *
 * `not-gating` never reaches here — the block is rendered only when gating is on —
 * but it is handled rather than defaulted, so adding a state to the rule fails the
 * typecheck instead of quietly showing the wrong sentence.
 */
function accessHeadline(access: ReturnType<typeof useAccess>): string {
  switch (access.reason) {
    case 'grandfathered':
      return 'You have everything, permanently';
    case 'subscribed':
      return 'Cornerstone Plus is active';
    case 'promo':
      return access.promoDaysRemaining === 1
        ? 'One day of full access left'
        : `${access.promoDaysRemaining} days of full access left`;
    case 'locked':
      return 'Cornerstone Plus';
    case 'not-gating':
      return 'Everything is open';
  }
}

function accessDetail(access: ReturnType<typeof useAccess>): string {
  const totals = premiumTotals();
  switch (access.reason) {
    case 'grandfathered':
      return 'You were here before the subscription existed, so every segment is yours.';
    case 'subscribed':
      return 'Manage or cancel through Google Play.';
    case 'promo':
      return 'The core of every topic area stays free when it runs out.';
    case 'locked':
      return `${totals.segments} further segments · ${totals.questions} questions`;
    case 'not-gating':
      return 'Nothing in this build is behind a paywall.';
  }
}
