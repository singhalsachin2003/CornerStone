import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BackLink, Eyebrow, SegmentedBar } from '@/components/primitives';
import { color, font, gutter, radius, shadow } from '@/theme/tokens';
import { monoBlock, type } from '@/theme/type';
import { cardsFor, questionsFor, topicByKey } from '@/content';
import { TopicVariant, useStudyStore } from '@/store/useStudyStore';
import { buildTopicSession, useSessionStore } from '@/store/useSessionStore';

/** Release beyond ±70px commits the card, per the interaction spec. */
const COMMIT = 70;

export default function Snapshot() {
  const router = useRouter();
  const { topic: topicKey } = useLocalSearchParams<{ topic: string }>();
  const variant = useStudyStore((s) => s.variant);
  const markCardProgress = useStudyStore((s) => s.markCardProgress);
  const bookmarkedCards = useStudyStore((s) => s.bookmarkedCards);
  const toggleCardBookmark = useStudyStore((s) => s.toggleCardBookmark);
  const startSession = useSessionStore((s) => s.start);

  const topic = topicKey ? topicByKey(topicKey) : undefined;
  const cards = useMemo(() => (topicKey ? cardsFor(topicKey) : []), [topicKey]);

  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const dragX = useSharedValue(0);

  const t = tokensFor(variant);
  const card = cards[idx];
  const total = cards.length;
  const isLast = idx + 1 >= total;
  const bookmarked = !!bookmarkedCards[`${topicKey}#${idx}`];

  useEffect(() => {
    if (topicKey) markCardProgress(topicKey, idx);
  }, [topicKey, idx, markCardProgress]);

  const startQuiz = useCallback(() => {
    if (!topicKey) return;
    startSession(buildTopicSession(topicKey));
    router.push('/quiz');
  }, [topicKey, startSession, router]);

  const goNext = useCallback(() => {
    if (isLast) {
      startQuiz();
      return;
    }
    setIdx((i) => i + 1);
    setRevealed(false);
  }, [isLast, startQuiz]);

  const goPrev = useCallback(() => {
    setIdx((i) => Math.max(0, i - 1));
    setRevealed(false);
  }, []);

  const flip = useCallback(() => setRevealed((r) => !r), []);

  // Drag translates and rotates the card by dragX/40 degrees; a tap flips it.
  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-14, 14])
    .onUpdate((e) => {
      dragX.value = e.translationX;
    })
    .onEnd((e) => {
      const dx = e.translationX;
      dragX.value = withSpring(0, { damping: 18, stiffness: 180 });
      if (dx < -COMMIT) runOnJS(goNext)();
      else if (dx > COMMIT) runOnJS(goPrev)();
    });

  const tap = Gesture.Tap()
    .maxDistance(4)
    .onEnd(() => {
      runOnJS(flip)();
    });

  const gesture = Gesture.Exclusive(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value }, { rotate: `${dragX.value / 40}deg` }],
    opacity: interpolate(Math.abs(dragX.value), [0, 160], [1, 0.6], 'clamp'),
  }));

  if (!topic || !card) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }}>
        <View style={{ padding: gutter.screen }}>
          <BackLink label="← Topics" onPress={() => router.back()} />
          <Text style={[type.body, { marginTop: 20 }]}>That topic has no snapshot cards yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.screenBg }} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: gutter.screen,
            paddingTop: 18,
            paddingBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <BackLink label="← Topics" onPress={() => router.back()} tint={t.muted} />
          <Eyebrow size={9.5} tracking={0.12} style={{ color: t.muted }}>
            {`SNAPSHOT · ${idx + 1}/${total}`}
          </Eyebrow>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: bookmarked }}
            onPress={() => topicKey && toggleCardBookmark(topicKey, idx)}
            hitSlop={10}
          >
            <Text style={[type.navLink, { color: bookmarked ? color.brass : t.muted }]}>
              {bookmarked ? '★ Saved' : '☆ Save'}
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: gutter.screen, paddingBottom: 6 }}>
          <Text style={[type.serif21, { color: t.fg }]}>{topic.name}</Text>
          <SegmentedBar
            segments={total}
            colors={(i) => (i <= idx ? t.dotOn : t.dotOff)}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Card stack */}
        <View style={{ flex: 1, paddingHorizontal: gutter.screen, paddingTop: 18 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                top: 8,
                bottom: -8,
                borderWidth: 1,
                borderColor: t.stackBd,
                borderRadius: t.radius,
                backgroundColor: t.stackBg2,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 6,
                right: 6,
                top: 13,
                bottom: -13,
                borderWidth: 1,
                borderColor: t.stackBd,
                borderRadius: t.radius,
                backgroundColor: t.stackBg1,
              }}
            />

            <GestureDetector gesture={gesture}>
              <Animated.View
                style={[
                  {
                    flex: 1,
                    borderWidth: 1,
                    borderColor: t.cardBd,
                    backgroundColor: t.cardBg,
                    borderRadius: t.radius,
                    overflow: 'hidden',
                  },
                  variant === 'b' ? shadow.snapshotB : null,
                  cardStyle,
                ]}
              >
                <ScrollView
                  contentContainerStyle={{ padding: t.pad, flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Eyebrow size={9.5} tracking={0.12} style={{ color: t.kicker }}>
                      {card.kicker}
                    </Eyebrow>
                    <Text
                      style={{
                        fontFamily: font.serif,
                        fontSize: t.bigNum,
                        lineHeight: t.bigNum * 0.85,
                        color: t.bigNumFg,
                      }}
                    >
                      {idx + 1}
                    </Text>
                  </View>

                  <Text
                    style={[
                      type.cardTitle,
                      {
                        fontSize: t.titleSize,
                        lineHeight: t.titleSize * 1.15,
                        color: t.fg,
                        marginTop: 16,
                      },
                    ]}
                  >
                    {card.title}
                  </Text>

                  <Text style={[type.cardBody, { color: t.body, marginTop: 14 }]}>{card.body}</Text>

                  {card.formula && (
                    <View
                      style={{
                        marginTop: 16,
                        borderWidth: 1,
                        borderColor: t.formulaBd,
                        backgroundColor: t.formulaBg,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 3,
                      }}
                    >
                      <Eyebrow size={8.5} tracking={0.14} style={{ color: t.muted }}>
                        FORMULA
                      </Eyebrow>
                      <Text style={[monoBlock, { color: t.fg, marginTop: 8 }]}>{card.formula}</Text>
                    </View>
                  )}

                  {revealed && (
                    <View
                      style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTopWidth: 1,
                        borderTopColor: t.formulaBd,
                      }}
                    >
                      <Eyebrow size={8.5} tracking={0.14} style={{ color: color.brass }}>
                        IN THE EXAM
                      </Eyebrow>
                      <Text
                        style={{
                          fontFamily: font.sans,
                          fontSize: 14,
                          lineHeight: 22,
                          color: t.body,
                          marginTop: 8,
                        }}
                      >
                        {card.exam}
                      </Text>
                    </View>
                  )}

                  <View style={{ flex: 1, minHeight: 14 }} />

                  <Text
                    style={{
                      fontFamily: font.sansSemi,
                      fontSize: 11.5,
                      color: t.muted,
                      paddingTop: 14,
                    }}
                  >
                    {revealed ? 'Tap to hide · drag to move on' : 'Tap the card for the exam angle'}
                  </Text>
                </ScrollView>
              </Animated.View>
            </GestureDetector>
          </View>
        </View>

        {/* Controls */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            paddingHorizontal: gutter.screen,
            paddingTop: 14,
            paddingBottom: 18,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous card"
            onPress={goPrev}
            disabled={idx === 0}
            style={({ pressed }) => ({
              width: 46,
              height: 46,
              borderWidth: 1,
              borderColor: t.cardBd,
              borderRadius: radius.button,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: idx === 0 ? 0.4 : 1,
              backgroundColor: pressed ? 'rgba(22,35,59,.06)' : 'transparent',
            })}
          >
            <Text style={{ fontFamily: font.sans, fontSize: 17, color: t.fg }}>←</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={goNext}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 15,
              borderRadius: radius.button,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 46,
              backgroundColor: t.ctaBg,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text style={{ fontFamily: font.sansSemi, fontSize: 14.5, color: t.ctaFg }}>
              {isLast
                ? `Start the quiz → ${questionsFor(topicKey!).length} questions`
                : 'Next card'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/** Per-variant snapshot styling, straight from the handoff's variant table. */
function tokensFor(v: TopicVariant) {
  const dark = v === 'c';
  return {
    screenBg: dark ? color.darkScreenBg : v === 'a' ? color.paper : color.paperAlt,
    fg: dark ? color.darkFg : color.ink,
    body: dark ? color.darkBody : color.inkBody,
    muted: dark ? color.darkMuted : color.muted,
    cardBg: dark ? color.darkCardBg : color.surface,
    cardBd: dark ? color.darkRule : color.rule,
    stackBg1: dark ? color.darkStack1 : '#fbf8f2',
    stackBg2: dark ? color.darkStack2 : '#f7f3ea',
    stackBd: dark ? 'rgba(244,241,234,.1)' : 'rgba(22,35,59,.09)',
    radius: v === 'a' ? radius.snapA : v === 'b' ? radius.snapB : radius.snapC,
    pad: v === 'a' ? 20 : 24,
    kicker: dark ? color.brassOnDark : color.brass,
    bigNum: dark ? 52 : 30,
    bigNumFg: dark ? 'rgba(244,241,234,.22)' : 'rgba(22,35,59,.16)',
    titleSize: dark ? 27 : 24,
    formulaBd: dark ? color.darkRule : 'rgba(22,35,59,.12)',
    formulaBg: dark ? 'rgba(244,241,234,.05)' : '#f5f1e7',
    ctaBg: dark ? color.brassOnDark : color.ink,
    ctaFg: dark ? color.darkScreenBg : color.paper,
    dotOn: dark ? color.brassOnDark : color.ink,
    dotOff: dark ? 'rgba(247,244,238,.22)' : color.rule,
  };
}
