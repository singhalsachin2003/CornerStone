import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, ProgressTrack } from '@/components/primitives';
import { Ring } from '@/components/Ring';
import {
  color,
  font,
  gutter,
  masteryColor,
  masteryTextColor,
  masteryWord,
  radius,
} from '@/theme/tokens';
import { type } from '@/theme/type';
import { EXAMS, TopicArea, cardsFor, questionsFor, topicsFor } from '@/content';
import { TopicVariant, useStudyStore } from '@/store/useStudyStore';

const VARIANT_TAG: Record<TopicVariant, string> = {
  a: 'LEDGER',
  b: 'RING TILES',
  c: 'INDEX',
};

export default function Topics() {
  const router = useRouter();
  const examKey = useStudyStore((s) => s.exam);
  const levelKey = useStudyStore((s) => s.level);
  const pathway = useStudyStore((s) => s.pathway);
  const mastery = useStudyStore((s) => s.mastery);
  const variant = useStudyStore((s) => s.variant);

  const topics = useMemo(
    () => (examKey && levelKey ? topicsFor(examKey, levelKey, pathway) : []),
    [examKey, levelKey, pathway],
  );

  if (!examKey || !levelKey) return null;
  const exam = EXAMS[examKey];
  const level = exam.levels.find((l) => l.key === levelKey);

  const open = (t: TopicArea) => router.push({ pathname: '/snapshot', params: { topic: t.key } });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <View style={{ paddingHorizontal: gutter.screen, paddingTop: 20, paddingBottom: 14 }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <BackLink label="← Home" onPress={() => router.push('/home')} />
          <Eyebrow size={9.5} tracking={0.12}>
            {VARIANT_TAG[variant]}
          </Eyebrow>
        </View>
        <Text style={[type.sectionTitle, { marginTop: 12, marginBottom: 4 }]}>Topics</Text>
        <Text style={type.secondary}>
          {exam.name} {level?.name} · {topics.length} areas, weighted as in the real exam
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {variant === 'a' && <LedgerList topics={topics} mastery={mastery} onOpen={open} />}
        {variant === 'b' && <TileGrid topics={topics} mastery={mastery} onOpen={open} />}
        {variant === 'c' && <IndexList topics={topics} mastery={mastery} onOpen={open} />}
      </ScrollView>
    </SafeAreaView>
  );
}

interface ListProps {
  topics: TopicArea[];
  mastery: Record<string, number>;
  onOpen: (t: TopicArea) => void;
}

// --- A · Ledger --------------------------------------------------------------

function LedgerList({ topics, mastery, onOpen }: ListProps) {
  return (
    <View style={{ borderTopWidth: 1, borderTopColor: color.rule }}>
      {topics.map((t, i) => {
        const pct = mastery[t.key] ?? 0;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="button"
            onPress={() => onOpen(t)}
            style={({ pressed }) => ({
              paddingVertical: 15,
              paddingHorizontal: gutter.screen,
              borderBottomWidth: 1,
              borderBottomColor: color.ruleSoft,
              backgroundColor: pressed ? color.surface : 'transparent',
            })}
          >
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
              <Text
                style={{
                  fontFamily: font.mono,
                  fontWeight: '600',
                  fontSize: 10,
                  lineHeight: 16,
                  color: color.brass,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={type.rowTitle}>{t.name}</Text>
                <Text style={[type.meta, { marginTop: 4 }]}>
                  {t.weight} of exam · {cardsFor(t.key).length} cards · {questionsFor(t.key).length}{' '}
                  questions
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: font.mono,
                  fontWeight: '600',
                  fontSize: 11.5,
                  lineHeight: 16,
                  color: masteryTextColor(pct),
                }}
              >
                {pct}%
              </Text>
            </View>
            <ProgressTrack
              pct={pct}
              height={2}
              fillColor={masteryColor(pct)}
              style={{ marginTop: 11 }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

// --- B · Ring tiles (default) ------------------------------------------------

function TileGrid({ topics, mastery, onOpen }: ListProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: gutter.screen,
        paddingTop: 6,
      }}
    >
      {topics.map((t) => {
        const pct = mastery[t.key] ?? 0;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="button"
            onPress={() => onOpen(t)}
            style={({ pressed }) => ({
              // Two columns with a 10px gutter between them.
              width: '48%',
              flexGrow: 1,
              flexBasis: '46%',
              borderWidth: 1,
              borderColor: pressed ? color.ink : 'rgba(22,35,59,.13)',
              backgroundColor: color.surface,
              borderRadius: radius.card,
              padding: 14,
              gap: 10,
            })}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Ring size={40} innerSize={31} pct={pct} fillColor={masteryColor(pct)}>
                <Text
                  style={{
                    fontFamily: font.mono,
                    fontWeight: '600',
                    fontSize: 10.5,
                    color: color.ink,
                  }}
                >
                  {pct}
                </Text>
              </Ring>
              <Eyebrow size={9} tracking={0.08} style={{ color: color.brass, paddingTop: 5 }}>
                {t.weight}
              </Eyebrow>
            </View>
            <Text style={[type.rowLabel, { fontFamily: font.sansMedium }]}>{t.name}</Text>
            <Text style={[type.tileMeta, { marginTop: 'auto' }]}>
              {cardsFor(t.key).length} cards · {masteryWord(pct)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// --- C · Index ---------------------------------------------------------------

function IndexList({ topics, mastery, onOpen }: ListProps) {
  return (
    <View style={{ paddingHorizontal: gutter.screen, paddingTop: 4 }}>
      {topics.map((t, i) => {
        const pct = mastery[t.key] ?? 0;
        const filled = Math.round(pct / 10);
        return (
          <Pressable
            key={t.key}
            accessibilityRole="button"
            onPress={() => onOpen(t)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              gap: 16,
              alignItems: 'flex-start',
              paddingVertical: 18,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(22,35,59,.12)',
              opacity: pressed ? 0.72 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: font.serif,
                fontSize: 40,
                lineHeight: 34,
                width: 52,
                color: pct > 0 ? color.brass : 'rgba(22,35,59,.22)',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={type.serif19}>{t.name}</Text>
              <Text style={[type.meta, { marginTop: 6 }]}>{t.blurb}</Text>
              <View style={{ flexDirection: 'row', gap: 3, marginTop: 10 }}>
                {Array.from({ length: 10 }, (_, k) => (
                  <View
                    key={k}
                    style={{
                      width: 12,
                      height: 5,
                      backgroundColor: k < filled ? color.ink : 'rgba(22,35,59,.14)',
                    }}
                  />
                ))}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
