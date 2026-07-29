import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, PrimaryButton, SegmentedBar } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { monoGiven, type } from '@/theme/type';
import { useStudyStore } from '@/store/useStudyStore';
import { useSessionStore } from '@/store/useSessionStore';

export default function Quiz() {
  const router = useRouter();
  const timedQuizzes = useStudyStore((s) => s.settings.timedQuizzes);
  const bookmarked = useStudyStore((s) => s.bookmarkedQuestions);
  const toggleBookmark = useStudyStore((s) => s.toggleQuestionBookmark);

  const {
    questions,
    origins,
    qIdx,
    chosen,
    answers,
    elapsed,
    title,
    choose,
    next,
    tick,
  } = useSessionStore();

  // The session clock ticks while this screen is mounted.
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  const q = questions[qIdx];
  const origin = origins[qIdx];

  if (!q) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }}>
        <View style={{ padding: gutter.screen }}>
          <BackLink label="← Back" onPress={() => router.back()} />
          <Text style={[type.body, { marginTop: 20 }]}>This session has no questions.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const total = questions.length;
  const isLast = qIdx + 1 >= total;
  const bmId = origin ? `${origin.topicKey}#${origin.qIdx}` : '';
  const isBookmarked = !!bookmarked[bmId];
  const correct = chosen !== null && chosen === q.a;

  const advance = () => {
    if (chosen === null) return;
    const finished = next();
    if (finished) router.replace('/results');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: gutter.screen, paddingTop: 18, paddingBottom: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <BackLink label="← Back" onPress={() => router.back()} />
          {timedQuizzes && (
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
              <Eyebrow size={9} tracking={0.12}>
                SESSION
              </Eyebrow>
              <Text
                style={{
                  fontFamily: font.mono,
                  fontWeight: '600',
                  fontSize: 12,
                  color: elapsed > 300 ? color.rust : color.muted,
                }}
              >
                {mmss(elapsed)}
              </Text>
            </View>
          )}
        </View>

        <SegmentedBar
          segments={total}
          colors={(i) => {
            if (i < answers.length) return answers[i].ok ? color.sage : color.rust;
            return i === qIdx ? color.ink : color.rule;
          }}
          style={{ marginTop: 14 }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: 14,
            gap: 12,
          }}
        >
          <Eyebrow size={9.5} tracking={0.12} style={{ flex: 1 }} numberOfLines={1}>
            {`QUESTION ${qIdx + 1} OF ${total} · ${title.toUpperCase()}`}
          </Eyebrow>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isBookmarked }}
            onPress={() => origin && toggleBookmark(origin.topicKey, origin.qIdx)}
            hitSlop={10}
          >
            <Text
              style={{
                fontFamily: font.sansSemi,
                fontSize: 12,
                color: isBookmarked ? color.brass : color.muted,
              }}
            >
              {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1, marginTop: 12 }}
          contentContainerStyle={{ paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={type.stem}>{q.text}</Text>

          {q.given && (
            <View
              style={{
                marginTop: 12,
                borderLeftWidth: 2,
                borderLeftColor: color.brass,
                paddingLeft: 12,
                paddingVertical: 2,
              }}
            >
              <Text style={monoGiven}>{q.given}</Text>
            </View>
          )}

          <View style={{ gap: 9, marginTop: 18 }}>
            {q.opts.map((text, i) => (
              <Option
                key={i}
                index={i}
                text={text}
                answered={chosen !== null}
                isPick={chosen === i}
                isAnswer={q.a === i}
                onPress={() => choose(i)}
              />
            ))}
          </View>

          {chosen !== null && (
            <View
              style={{
                marginTop: 16,
                borderWidth: 1,
                borderColor: correct ? color.sageBorder : color.rustBorder,
                backgroundColor: correct ? color.sageFillSoft : color.rustFillSoft,
                borderRadius: radius.row,
                padding: 16,
              }}
            >
              <Eyebrow size={10} tracking={0.12} style={{ color: correct ? color.sage : color.rust }}>
                {correct ? 'CORRECT — NICE WORK' : 'NOT QUITE'}
              </Eyebrow>
              <Text
                style={{
                  fontFamily: font.sans,
                  fontSize: 13.5,
                  lineHeight: 22,
                  color: color.inkHover,
                  marginTop: 9,
                }}
              >
                {q.why}
              </Text>
              <Text style={[type.secondary, { marginTop: 10 }]}>Reading: {q.ref}</Text>
            </View>
          )}
        </ScrollView>

        <PrimaryButton
          label={chosen === null ? 'Choose an answer' : isLast ? 'See results' : 'Next question'}
          disabled={chosen === null}
          onPress={advance}
          style={{ marginTop: 14 }}
        />
      </View>
    </SafeAreaView>
  );
}

function Option({
  index,
  text,
  answered,
  isPick,
  isAnswer,
  onPress,
}: {
  index: number;
  text: string;
  answered: boolean;
  isPick: boolean;
  isAnswer: boolean;
  onPress: () => void;
}) {
  const showCorrect = answered && isAnswer;
  const showWrong = answered && isPick && !isAnswer;

  const borderColor = showCorrect ? color.sage : showWrong ? color.rust : color.ruleStrong;
  const background = showCorrect ? color.sageFill : showWrong ? color.rustFill : color.surface;
  const markBg = showCorrect ? color.sage : showWrong ? color.rust : 'transparent';
  const markFg = showCorrect || showWrong ? color.surface : color.muted;
  const mark = showCorrect ? '✓' : showWrong ? '✕' : String.fromCharCode(65 + index);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: isPick, disabled: answered }}
      accessibilityLabel={`Option ${String.fromCharCode(65 + index)}: ${text}`}
      disabled={answered}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
        padding: 14,
        borderWidth: 1,
        borderColor: !answered && pressed ? color.ink : borderColor,
        backgroundColor: background,
        borderRadius: radius.row,
        minHeight: 44,
      })}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 1,
          borderColor: showCorrect ? color.sage : showWrong ? color.rust : 'rgba(22,35,59,.2)',
          backgroundColor: markBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: font.mono, fontWeight: '600', fontSize: 10.5, color: markFg }}>
          {mark}
        </Text>
      </View>
      <Text style={[type.option, { flex: 1 }]}>{text}</Text>
    </Pressable>
  );
}

function mmss(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
