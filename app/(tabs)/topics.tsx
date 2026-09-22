import React, { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, ProgressTrack } from '@/components/primitives';
import { Search, X } from 'lucide-react-native';
import { Ring } from '@/components/Ring';
import { font, gutter, masteryColor, masteryTextColor, masteryWord, radius } from '@/theme/tokens';
import {
  EXAMS,
  TopicArea,
  accessibleCardsFor,
  accessibleQuestionEntries,
  premiumSegmentsFor,
  topicsFor,
} from '@/content';
import { TopicVariant, useStudyStore } from '@/store/useStudyStore';
import { useAccess } from '@/access';
import { useTheme } from '@/theme/useTheme';

const VARIANT_TAG: Record<TopicVariant, string> = {
  a: 'LEDGER',
  b: 'RING TILES',
  c: 'INDEX',
};

export default function Topics() {
  const { c: color, type } = useTheme();
  const router = useRouter();
  const examKey = useStudyStore((s) => s.exam);
  const levelKey = useStudyStore((s) => s.level);
  const pathway = useStudyStore((s) => s.pathway);
  const mastery = useStudyStore((s) => s.mastery);
  const variant = useStudyStore((s) => s.variant);
  const access = useAccess();

  const topics = useMemo(
    () => (examKey && levelKey ? topicsFor(examKey, levelKey, pathway) : []),
    [examKey, levelKey, pathway],
  );

  const [query, setQuery] = useState('');
  // Deferred for the same reason the glossary defers: typing re-filters on every
  // keystroke, and the list is the expensive half of this screen.
  const deferredQuery = useDeferredValue(query);

  /**
   * Thirty-eight areas across five levels, and until now the only way to reach
   * one was to know which area it lived in. That is a fine assumption for a
   * candidate three months in and a bad one for somebody who has just been told
   * to revise Value at Risk.
   *
   * Matching runs over the area name and its segment names, because the segment
   * is where the searchable words actually are — "Value at Risk" is a segment of
   * "Valuation and Risk Models", and searching only area names would find
   * nothing for it.
   */
  const visible = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    if (needle === '') return topics;
    return topics.filter((t) => {
      if (t.name.toLowerCase().includes(needle)) return true;
      return premiumSegmentsFor(t.key).some((segment) =>
        segment.name.toLowerCase().includes(needle),
      );
    });
  }, [topics, deferredQuery]);

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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: color.rule,
            borderRadius: radius.row,
            backgroundColor: color.surface,
          }}
        >
          <Search size={15} color={color.muted} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search a topic or segment"
            placeholderTextColor={color.meta}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search topics"
            style={{
              flex: 1,
              fontFamily: font.sans,
              fontSize: 14,
              color: color.ink,
              // Android centres poorly without this and the text sits high.
              paddingVertical: 0,
            }}
          />
          {query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={10}
              onPress={() => setQuery('')}
            >
              <X size={15} color={color.muted} strokeWidth={2} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {visible.length === 0 ? (
          <Text
            style={[
              type.secondary,
              { paddingHorizontal: gutter.screen, paddingTop: 24, textAlign: 'center' },
            ]}
          >
            Nothing matches “{query.trim()}”. The glossary may have it — it covers both programmes
            and is always free.
          </Text>
        ) : (
          <>
            {variant === 'a' && (
              <LedgerList
                topics={visible}
                mastery={mastery}
                onOpen={open}
                premium={access.premium}
              />
            )}
            {variant === 'b' && (
              <TileGrid topics={visible} mastery={mastery} onOpen={open} premium={access.premium} />
            )}
            {variant === 'c' && (
              <IndexList
                topics={visible}
                mastery={mastery}
                onOpen={open}
                premium={access.premium}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface ListProps {
  topics: TopicArea[];
  mastery: Record<string, number>;
  onOpen: (t: TopicArea) => void;
  /** Whether the paid segments count toward what this install can actually study. */
  premium: boolean;
}

/** Counts shown on a row are always the counts this install can open. */
function countsFor(topicKey: string, premium: boolean) {
  return {
    cards: accessibleCardsFor(topicKey, premium).length,
    questions: accessibleQuestionEntries(topicKey, premium).length,
    lockedSegments: premium ? 0 : premiumSegmentsFor(topicKey).length,
  };
}

// --- A · Ledger --------------------------------------------------------------

function LedgerList({ topics, mastery, onOpen, premium }: ListProps) {
  const { c: color, type } = useTheme();
  return (
    <View style={{ borderTopWidth: 1, borderTopColor: color.rule }}>
      {topics.map((t, i) => {
        const pct = mastery[t.key] ?? 0;
        const counts = countsFor(t.key, premium);
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
                  {t.weight} of exam · {counts.cards} cards · {counts.questions} questions
                  {counts.lockedSegments > 0 ? ` · +${counts.lockedSegments} locked` : ''}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: font.mono,
                  fontWeight: '600',
                  fontSize: 11.5,
                  lineHeight: 16,
                  color: masteryTextColor(pct, color),
                }}
              >
                {pct}%
              </Text>
            </View>
            <ProgressTrack
              pct={pct}
              height={2}
              fillColor={masteryColor(pct, color)}
              style={{ marginTop: 11 }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

// --- B · Ring tiles (default) ------------------------------------------------

function TileGrid({ topics, mastery, onOpen, premium }: ListProps) {
  const { c: color, type } = useTheme();
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
        const counts = countsFor(t.key, premium);
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
              borderColor: pressed ? color.ink : color.tabRule,
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
              <Ring size={40} innerSize={31} pct={pct} fillColor={masteryColor(pct, color)}>
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
              {counts.cards} cards · {masteryWord(pct)}
              {counts.lockedSegments > 0 ? ` · +${counts.lockedSegments} locked` : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// --- C · Index ---------------------------------------------------------------

function IndexList({ topics, mastery, onOpen, premium }: ListProps) {
  const { c: color, type } = useTheme();
  return (
    <View style={{ paddingHorizontal: gutter.screen, paddingTop: 4 }}>
      {topics.map((t, i) => {
        const pct = mastery[t.key] ?? 0;
        const filled = Math.round(pct / 10);
        const counts = countsFor(t.key, premium);
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
              borderBottomColor: color.hairline,
              opacity: pressed ? 0.72 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: font.serif,
                fontSize: 40,
                lineHeight: 34,
                width: 52,
                color: pct > 0 ? color.brass : color.faintFg,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={type.serif19}>{t.name}</Text>
              <Text style={[type.meta, { marginTop: 6 }]}>{t.blurb}</Text>
              <Text style={[type.tileMeta, { marginTop: 6 }]}>
                {counts.questions} questions
                {counts.lockedSegments > 0 ? ` · +${counts.lockedSegments} locked` : ''}
              </Text>
              <View style={{ flexDirection: 'row', gap: 3, marginTop: 10 }}>
                {Array.from({ length: 10 }, (_, k) => (
                  <View
                    key={k}
                    style={{
                      width: 12,
                      height: 5,
                      backgroundColor: k < filled ? color.ink : color.trackStrong,
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
