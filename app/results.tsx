import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eyebrow, OutlineButton, PrimaryButton } from '@/components/primitives';
import { Ring } from '@/components/Ring';
import { color, font, gutter, radius } from '@/theme/tokens';
import { type } from '@/theme/type';
import { EXAMS, topicByKey } from '@/content';
import { useStudyStore } from '@/store/useStudyStore';
import { useSessionStore } from '@/store/useSessionStore';
import { resultShareMessage, shareText } from '@/share';
import { maybeAskForReview } from '@/storeReview';

export default function Results() {
  const router = useRouter();
  const recordSession = useStudyStore((s) => s.recordSession);
  const setLevel = useStudyStore((s) => s.setLevel);
  const examKey = useStudyStore((s) => s.exam);

  const { mode, topicKey, title, questions, origins, answers, elapsed, restart } = useSessionStore();

  const [delta, setDelta] = useState<{ before: number; after: number } | null>(null);
  const committed = useRef(false);

  // Commit exactly once: mastery update and review-queue scheduling are side effects.
  useEffect(() => {
    if (committed.current || answers.length === 0) return;
    committed.current = true;

    if (mode === 'topic' && topicKey) {
      setDelta(recordSession(topicKey, answers));
    } else {
      // Placement and review runs touch several topics, so commit them per topic.
      const byTopic = new Map<string, typeof answers>();
      answers.forEach((a, i) => {
        const t = origins[i]?.topicKey;
        if (!t) return;
        byTopic.set(t, [...(byTopic.get(t) ?? []), a]);
      });
      for (const [t, group] of byTopic) recordSession(t, group);
    }
  }, [mode, topicKey, answers, origins, recordSession]);

  const correct = answers.filter((a) => a.ok).length;
  const total = questions.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const missed = answers.length - correct;
  const ringColor = pct >= 70 ? color.sage : pct >= 40 ? color.brass : color.rust;

  const topic = topicKey ? topicByKey(topicKey) : undefined;
  const shareTitle = topic?.name ?? title ?? 'a practice session';

  /**
   * Ask for a store review after a session that went well, and only then —
   * `maybeAskForReview` decides both halves of that. The delay is not
   * decoration: the sheet covers the screen, and appearing on the same frame as
   * the score would hide what the reader came to see. Leaving first cancels it.
   */
  useEffect(() => {
    if (answers.length === 0) return;
    const timer = setTimeout(() => {
      void maybeAskForReview(answers.filter((a) => a.ok).length, questions.length);
    }, 1200);
    return () => clearTimeout(timer);
  }, [answers, questions.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: gutter.screen, paddingTop: 22, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow size={9.5} tracking={0.14}>
          SESSION COMPLETE
        </Eyebrow>

        <Text style={[type.resultsTitle, { marginTop: 14, marginBottom: 6 }]}>{headline(pct)}</Text>
        <Text style={type.body}>{note(pct, mode)}</Text>

        {/* Placement runs recommend a level rather than reporting mastery. */}
        {mode === 'placement' && examKey && (
          <PlacementRecommendation
            pct={pct}
            examKey={examKey}
            onAccept={(levelKey) => {
              setLevel(levelKey);
              router.replace('/home');
            }}
          />
        )}

        {/* Score card */}
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            gap: 14,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(22,35,59,.12)',
            backgroundColor: color.surface,
            borderRadius: radius.card,
            padding: 18,
          }}
        >
          <Ring size={88} innerSize={69} pct={pct} fillColor={ringColor}>
            <Text style={{ fontFamily: font.serifSemi, fontSize: 21, color: color.ink }}>
              {correct}/{total}
            </Text>
            <Eyebrow size={8.5} tracking={0.04} style={{ marginTop: 4 }}>
              {pct}%
            </Eyebrow>
          </Ring>

          <View style={{ flex: 1, gap: 9 }}>
            <StatRow label="Time on task" value={mmss(elapsed)} />
            <StatRow
              label="Avg per question"
              value={answers.length ? mmss(Math.round(elapsed / answers.length)) : '0:00'}
            />
            {delta && (
              <StatRow
                label="Topic mastery"
                value={`${delta.after}% (${delta.after >= delta.before ? '+' : ''}${delta.after - delta.before})`}
                valueColor={color.brass}
              />
            )}
          </View>
        </View>

        {/* Breakdown */}
        <Eyebrow size={10} tracking={0.14} style={{ marginTop: 24, marginBottom: 10 }}>
          QUESTION BREAKDOWN
        </Eyebrow>
        <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(22,35,59,.12)' }}>
          {questions.map((q, i) => {
            const a = answers[i];
            const bg = a ? (a.ok ? color.sage : color.rust) : color.rule;
            const mark = a ? (a.ok ? '✓' : '✕') : '–';
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'flex-start',
                  paddingVertical: 13,
                  borderBottomWidth: 1,
                  borderBottomColor: color.ruleSoft,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: font.mono,
                      fontWeight: '600',
                      fontSize: 10,
                      color: a ? color.surface : color.muted,
                    }}
                  >
                    {mark}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: font.sans, fontSize: 13.5, lineHeight: 19, color: color.ink }}>
                    {truncate(q.text, 74)}
                  </Text>
                  <Text style={[type.meta, { marginTop: 4 }]}>
                    {a ? `${a.ok ? 'Correct' : 'Missed'} · ${q.ref}` : 'Not answered'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: font.mono,
                    fontWeight: '500',
                    fontSize: 10.5,
                    color: color.meta,
                    paddingTop: 3,
                  }}
                >
                  {a ? `${a.seconds}s` : '—'}
                </Text>
              </View>
            );
          })}
        </View>

        {missed > 0 && (
          <View
            style={{
              marginTop: 18,
              borderWidth: 1,
              borderColor: 'rgba(154,107,47,.38)',
              backgroundColor: color.brassTintBg,
              borderRadius: radius.row,
              paddingVertical: 15,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontFamily: font.sansSemi,
                fontSize: 13.5,
                lineHeight: 18,
                color: color.brassText,
              }}
            >
              {missed} {missed === 1 ? 'question' : 'questions'} added to your review queue
            </Text>
            <Text
              style={{
                fontFamily: font.sans,
                fontSize: 12,
                lineHeight: 18,
                color: color.brassBody,
                marginTop: 5,
              }}
            >
              They'll resurface tomorrow, then in four days, then in ten.
            </Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share this result"
          onPress={() => {
            void shareText(resultShareMessage(shareTitle, correct, total));
          }}
          hitSlop={12}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            gap: 8,
            marginTop: 18,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Share2 size={16} strokeWidth={2} color={color.meta} />
          <Text style={[type.meta, { color: color.meta }]}>Share this result</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <OutlineButton
            label="Retake"
            onPress={() => {
              committed.current = true; // a retake must not double-count mastery
              restart();
              router.replace('/quiz');
            }}
          />
          <PrimaryButton
            label={mode === 'topic' ? 'Next topic' : 'Done'}
            onPress={() => router.replace('/topics')}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PlacementRecommendation({
  pct,
  examKey,
  onAccept,
}: {
  pct: number;
  examKey: 'CFA' | 'FRM';
  onAccept: (levelKey: any) => void;
}) {
  const exam = EXAMS[examKey];
  // Below 50% start at the first level; above 80% the candidate can start higher.
  const idx = pct >= 80 ? Math.min(1, exam.levels.length - 1) : 0;
  const recommended = exam.levels[idx];

  return (
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
      <Eyebrow size={10} tracking={0.12} style={{ color: color.brass }}>
        WE RECOMMEND
      </Eyebrow>
      <Text style={[type.serif18, { marginTop: 8 }]}>Start at {recommended.name}</Text>
      <Text style={[type.secondary, { color: color.brassBody, marginTop: 5 }]}>
        {recommended.note}
      </Text>
      <PrimaryButton
        label={`Study ${exam.name} ${recommended.name}`}
        onPress={() => onAccept(recommended.key)}
        style={{ marginTop: 12 }}
      />
    </View>
  );
}

function StatRow({
  label,
  value,
  valueColor = color.ink,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: font.sans, fontSize: 12.5, color: color.bodyOnPaper }}>{label}</Text>
      <Text style={{ fontFamily: font.sansSemi, fontSize: 12.5, color: valueColor }}>{value}</Text>
    </View>
  );
}

function headline(pct: number): string {
  if (pct >= 80) return 'That topic is holding up well.';
  if (pct >= 50) return 'Solid — two ideas need another pass.';
  return 'Worth a second run at this one.';
}

function note(pct: number, mode: string): string {
  if (mode === 'placement') return "Here's where we'd suggest you begin.";
  if (pct >= 80) return 'You are ahead of the average candidate here. Keep it warm with the review queue.';
  return 'Nothing unusual — this is exactly what the review queue is for.';
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function mmss(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
