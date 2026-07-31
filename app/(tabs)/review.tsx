import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eyebrow, PrimaryButton, Rule } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { type } from '@/theme/type';
import { questionsFor, topicByKey } from '@/content';
import { useStudyStore } from '@/store/useStudyStore';
import { BASE_INTERVALS, dayKey, dueItems, intervalForStep } from '@/store/review';
import { buildReviewSession, useSessionStore } from '@/store/useSessionStore';

export default function Review() {
  const router = useRouter();
  const queue = useStudyStore((s) => s.reviewQueue);
  const spacedRepetition = useStudyStore((s) => s.settings.spacedRepetition);
  const startSession = useSessionStore((s) => s.start);

  const today = dayKey();
  const due = useMemo(() => dueItems(queue, today), [queue, today]);
  const upcoming = useMemo(
    () => queue.filter((i) => i.dueOn > today).sort((a, b) => a.dueOn.localeCompare(b.dueOn)),
    [queue, today],
  );

  const start = () => {
    startSession(buildReviewSession(due));
    router.push('/quiz');
  };

  // buildReviewSession takes the 10 earliest, so the button promises that many.
  const dueThisSession = Math.min(due.length, 10);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: gutter.screen, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow size={9.5} tracking={0.14}>
          SPACED REPETITION
        </Eyebrow>
        <Text style={[type.sectionTitle, { marginTop: 12, marginBottom: 4 }]}>Review queue</Text>
        <Text style={type.secondary}>
          Missed questions resurface after {BASE_INTERVALS.join(', then ')} days, then less often as
          they stick.
        </Text>

        {!spacedRepetition && (
          <View
            style={{
              marginTop: 18,
              borderWidth: 1,
              borderColor: color.brassTintBorder,
              backgroundColor: color.brassTintBg,
              borderRadius: radius.row,
              padding: 16,
            }}
          >
            <Text style={[type.rowLabel, { color: color.brassText }]}>Spaced repetition is off</Text>
            <Text style={[type.secondary, { color: color.brassBody, marginTop: 5 }]}>
              Turn it on in Profile → Study to start collecting missed questions here.
            </Text>
          </View>
        )}

        {queue.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <View
              style={{
                marginTop: 20,
                borderWidth: 1,
                borderColor: 'rgba(22,35,59,.12)',
                backgroundColor: color.surface,
                borderRadius: radius.card,
                padding: 18,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 14 }}>
                <View>
                  <Text style={{ fontFamily: font.serifSemi, fontSize: 26, color: color.brass }}>
                    {due.length}
                  </Text>
                  <Eyebrow size={9.5} tracking={0.06} style={{ marginTop: 4 }}>
                    DUE TODAY
                  </Eyebrow>
                </View>
                <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(22,35,59,.12)' }} />
                <View>
                  <Text style={{ fontFamily: font.serifSemi, fontSize: 26, color: color.ink }}>
                    {upcoming.length}
                  </Text>
                  <Eyebrow size={9.5} tracking={0.06} style={{ marginTop: 4 }}>
                    SCHEDULED
                  </Eyebrow>
                </View>
              </View>

              <PrimaryButton
                label={
                  dueThisSession > 0
                    ? `Review ${dueThisSession} ${dueThisSession === 1 ? 'question' : 'questions'}`
                    : 'Nothing due today'
                }
                disabled={due.length === 0}
                onPress={start}
                style={{ marginTop: 16 }}
              />
            </View>

            {due.length > 0 && (
              <Section title="DUE NOW" items={due} today={today} />
            )}
            {upcoming.length > 0 && (
              <Section title="COMING UP" items={upcoming.slice(0, 12)} today={today} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  items,
  today,
}: {
  title: string;
  items: { id: string; topicKey: string; qIdx: number; step: number; dueOn: string }[];
  today: string;
}) {
  return (
    <>
      <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 10 }}>
        {title}
      </Eyebrow>
      <Rule tone="rgba(22,35,59,.12)" />
      {items.map((item) => {
        const topic = topicByKey(item.topicKey);
        const q = questionsFor(item.topicKey)[item.qIdx];
        if (!q) return null;
        return (
          <View
            key={item.id}
            style={{
              paddingVertical: 13,
              borderBottomWidth: 1,
              borderBottomColor: color.ruleSoft,
              flexDirection: 'row',
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font.sans, fontSize: 13.5, lineHeight: 19, color: color.ink }}>
                {q.text.length > 74 ? `${q.text.slice(0, 74)}…` : q.text}
              </Text>
              <Text style={[type.meta, { marginTop: 4 }]}>
                {topic?.name ?? 'Topic'} · interval {intervalForStep(item.step)}d
              </Text>
            </View>
            <Text
              style={{
                fontFamily: font.mono,
                fontWeight: '500',
                fontSize: 10.5,
                color: item.dueOn <= today ? color.brass : color.meta,
                paddingTop: 3,
              }}
            >
              {item.dueOn <= today ? 'DUE' : item.dueOn.slice(5)}
            </Text>
          </View>
        );
      })}
    </>
  );
}

function EmptyState() {
  return (
    <View
      style={{
        marginTop: 24,
        borderWidth: 1,
        borderColor: color.rule,
        backgroundColor: color.surface,
        borderRadius: radius.card,
        padding: 22,
        alignItems: 'center',
      }}
    >
      <Text style={[type.serif19, { textAlign: 'center' }]}>Nothing to review yet</Text>
      <Text style={[type.secondary, { textAlign: 'center', marginTop: 8 }]}>
        Answer a quiz and anything you miss will appear here tomorrow.
      </Text>
    </View>
  );
}
