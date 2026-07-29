import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eyebrow, ProgressTrack } from '@/components/primitives';
import { Ring } from '@/components/Ring';
import { color, font, gutter, radius } from '@/theme/tokens';
import { eyebrow, type } from '@/theme/type';
import { EXAMS, cardsFor, topicsFor } from '@/content';
import {
  currentStreak,
  daysToExam,
  dueCount,
  useStudyStore,
  weekStrip,
  weightedProgress,
} from '@/store/useStudyStore';

export default function Home() {
  const router = useRouter();
  const examKey = useStudyStore((s) => s.exam);
  const levelKey = useStudyStore((s) => s.level);
  const pathway = useStudyStore((s) => s.pathway);
  const mastery = useStudyStore((s) => s.mastery);
  const cardProgress = useStudyStore((s) => s.cardProgress);
  const studyDays = useStudyStore((s) => s.studyDays);
  const reviewQueue = useStudyStore((s) => s.reviewQueue);
  const name = useStudyStore((s) => s.name);
  const initials = useStudyStore((s) => s.initials);

  const topics = useMemo(
    () => (examKey && levelKey ? topicsFor(examKey, levelKey, pathway) : []),
    [examKey, levelKey, pathway],
  );

  if (!examKey || !levelKey) return null;

  const exam = EXAMS[examKey];
  const level = exam.levels.find((l) => l.key === levelKey);
  const overall = weightedProgress(topics, mastery);
  const streak = currentStreak(studyDays);
  const due = dueCount(reviewQueue);
  const days = daysToExam(examKey);
  const week = weekStrip(studyDays);

  // The resume card picks the first partially studied topic, else the first untouched one.
  const resume = topics.find((t) => {
    const m = mastery[t.key] ?? 0;
    return m > 0 && m < 60;
  }) ?? topics.find((t) => (mastery[t.key] ?? 0) === 0) ?? topics[0];
  const resumePct = resume ? mastery[resume.key] ?? 0 : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = name.split(/\s+/)[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: gutter.screen, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Tapping the title opens the exam + level switcher. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Studying ${exam.name} ${level?.name}. Tap to switch exam or level.`}
            onPress={() => router.push('/switch')}
            style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={{ fontFamily: font.sans, fontSize: 13, lineHeight: 16, color: color.muted }}>
              {greeting}, {firstName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 }}>
              <Text style={type.homeTitle}>
                {exam.name} · {level?.name}
              </Text>
              <Text style={{ fontFamily: font.sans, fontSize: 15, color: color.brass, paddingTop: 4 }}>
                ⌄
              </Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={() => router.push('/profile')}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: color.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: font.sansSemi, fontSize: 13, color: color.paper }}>{initials}</Text>
          </Pressable>
        </View>

        {/* Progress card */}
        <View
          style={{
            marginTop: 18,
            borderWidth: 1,
            borderColor: 'rgba(22,35,59,.12)',
            backgroundColor: color.surface,
            borderRadius: radius.card,
            padding: 18,
            flexDirection: 'row',
            gap: 18,
            alignItems: 'center',
          }}
        >
          <Ring size={82} innerSize={64} pct={overall} fillColor={color.brass}>
            <Text style={{ fontFamily: font.serifSemi, fontSize: 19, color: color.ink }}>{overall}%</Text>
            <Eyebrow size={8.5} tracking={0.08} style={{ marginTop: 3 }}>
              SYLLABUS
            </Eyebrow>
          </Ring>

          <View style={{ flex: 1 }}>
            <Text style={type.statLead}>{days} days to exam day</Text>
            <Text style={[type.secondary, { marginTop: 4 }]}>{pacingLine(overall, days, topics.length)}</Text>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 12 }}>
              <View>
                <Text style={{ fontFamily: font.serifSemi, fontSize: 17, color: color.brass }}>{streak}</Text>
                <Eyebrow size={9.5} tracking={0.06} style={{ marginTop: 4 }}>
                  DAY STREAK
                </Eyebrow>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(22,35,59,.12)' }} />
              <View>
                <Text style={{ fontFamily: font.serifSemi, fontSize: 17, color: color.ink }}>{due}</Text>
                <Eyebrow size={9.5} tracking={0.06} style={{ marginTop: 4 }}>
                  CARDS DUE
                </Eyebrow>
              </View>
            </View>
          </View>
        </View>

        {/* Week strip */}
        <View style={{ flexDirection: 'row', gap: 5, marginTop: 14 }}>
          {week.map((d, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <View
                style={{
                  height: 30,
                  alignSelf: 'stretch',
                  borderRadius: 3,
                  backgroundColor: d.studied
                    ? color.brass
                    : d.isToday
                      ? 'rgba(154,107,47,.35)'
                      : 'transparent',
                  borderWidth: d.isFuture ? 1 : 0,
                  borderColor: color.ruleStrong,
                }}
              />
              <Eyebrow size={9.5} tracking={0.02} style={{ marginTop: 5 }}>
                {d.label}
              </Eyebrow>
            </View>
          ))}
        </View>

        {/* Resume card */}
        {resume && (
          <>
            <Eyebrow size={10} tracking={0.14} style={{ marginTop: 26, marginBottom: 10 }}>
              PICK UP WHERE YOU LEFT OFF
            </Eyebrow>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/snapshot', params: { topic: resume.key } })}
              style={({ pressed }) => ({
                backgroundColor: pressed ? color.inkHover : color.ink,
                borderRadius: radius.card,
                padding: 18,
              })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Eyebrow size={9.5} tracking={0.12} style={{ color: color.onInkFaint }}>
                  {resumePct > 0 ? 'IN PROGRESS' : 'START HERE'}
                </Eyebrow>
                <Text style={{ fontFamily: font.sansSemi, fontSize: 11, color: 'rgba(247,244,238,.75)' }}>
                  {resumePct}%
                </Text>
              </View>
              <Text style={[type.serif20, { color: color.onInk, marginTop: 8 }]}>{resume.name}</Text>
              <Text style={[type.secondary, { color: color.onInkMuted, marginTop: 6 }]}>
                {cardsFor(resume.key).length} snapshot cards ·{' '}
                {(cardProgress[resume.key] ?? 0) > 0 ? 'quiz unlocked' : `${resume.weight} of the exam`}
              </Text>
              <ProgressTrack
                pct={resumePct}
                height={3}
                trackColor={color.onInkTrack}
                fillColor={color.brassOnDark}
                style={{ marginTop: 14 }}
              />
            </Pressable>
          </>
        )}

        {/* Two half-width cards */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/topics')}
            style={({ pressed }) => ({
              flex: 1,
              borderWidth: 1,
              borderColor: pressed ? color.ink : color.rule,
              backgroundColor: color.surface,
              borderRadius: radius.card,
              padding: 14,
            })}
          >
            <Text style={type.rowLabel}>All topics</Text>
            <Text style={[type.tileMeta, { marginTop: 4 }]}>{topics.length} areas</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/review')}
            style={({ pressed }) => ({
              flex: 1,
              borderWidth: 1,
              borderColor: pressed ? color.brass : 'rgba(154,107,47,.4)',
              backgroundColor: color.brassTintBg,
              borderRadius: radius.card,
              padding: 14,
            })}
          >
            <Text style={[type.rowLabel, { color: color.brassText }]}>Review queue</Text>
            <Text style={[type.tileMeta, { color: color.brassBody, marginTop: 4 }]}>
              {due} due today
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Honest pacing copy derived from actual progress, not a fixed string. */
function pacingLine(overall: number, days: number, topicCount: number): string {
  if (topicCount === 0) return 'Pick a level to start tracking progress.';
  if (overall === 0) return 'Nothing studied yet. One topic today is a good start.';
  const expected = days > 0 ? Math.round(100 - (days / (days + 120)) * 100) : 100;
  const remaining = topicCount - Math.round((overall / 100) * topicCount);
  if (overall >= expected) {
    return `You're pacing ahead of plan. ${remaining} ${remaining === 1 ? 'topic' : 'topics'} left to bring up.`;
  }
  return `${remaining} ${remaining === 1 ? 'topic' : 'topics'} still need a first pass.`;
}
