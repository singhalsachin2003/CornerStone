import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, Toggle } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { type } from '@/theme/type';
import { EXAMS, PATHWAYS, formatExamDate, topicsFor } from '@/content';
import { Settings, TopicVariant, currentStreak, useStudyStore } from '@/store/useStudyStore';

const SETTING_ROWS: { key: keyof Settings; name: string; note: string }[] = [
  { key: 'spacedRepetition', name: 'Spaced repetition', note: 'Resurface missed questions on a schedule' },
  { key: 'dailyReminder', name: 'Daily reminder', note: '19:30 — after work, before dinner' },
  { key: 'timedQuizzes', name: 'Timed quizzes', note: 'Show a per-session clock while answering' },
  { key: 'wifiOnly', name: 'Download over Wi-Fi only', note: 'Keeps snapshots available offline' },
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
  const initials = useStudyStore((s) => s.initials);
  const settings = useStudyStore((s) => s.settings);
  const toggleSetting = useStudyStore((s) => s.toggleSetting);
  const variant = useStudyStore((s) => s.variant);
  const setVariant = useStudyStore((s) => s.setVariant);
  const studyDays = useStudyStore((s) => s.studyDays);
  const answered = useStudyStore((s) => s.questionsAnswered);
  const correct = useStudyStore((s) => s.questionsCorrect);
  const bookmarkedQuestions = useStudyStore((s) => s.bookmarkedQuestions);
  const bookmarkedCards = useStudyStore((s) => s.bookmarkedCards);

  const topics = useMemo(
    () => (examKey && levelKey ? topicsFor(examKey, levelKey, pathway) : []),
    [examKey, levelKey, pathway],
  );

  if (!examKey || !levelKey) return null;
  const exam = EXAMS[examKey];
  const level = exam.levels.find((l) => l.key === levelKey);
  const streak = currentStreak(studyDays);
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const bookmarks =
    Object.keys(bookmarkedQuestions).length + Object.keys(bookmarkedCards).length;
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
            <Text style={{ fontFamily: font.sansSemi, fontSize: 18, color: color.paper }}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={type.serif22}>{name}</Text>
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
                <Text style={[type.meta, { marginTop: 3 }]}>{row.note}</Text>
              </View>
              <Toggle value={settings[row.key]} onToggle={() => toggleSetting(row.key)} />
            </View>
          ))}
        </View>

        {/* APPEARANCE — the three topic treatments from the handoff */}
        <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 8 }}>
          APPEARANCE
        </Eyebrow>
        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(22,35,59,.12)', paddingVertical: 15 }}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatTile({ value, label, tint = color.ink }: { value: string; label: string; tint?: string }) {
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
