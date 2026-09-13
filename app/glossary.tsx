import React, { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { monoBlock, type } from '@/theme/type';
import {
  GLOSSARY,
  GlossaryExam,
  GlossaryTerm,
  examsFor,
  filterByExam,
  searchTerms,
  sectionise,
  sortTerms,
} from '@/content/glossary';
import { useStudyStore } from '@/store/useStudyStore';

/**
 * The glossary.
 *
 * **Free, for everybody, always.** There is deliberately no `useAccess` call on
 * this screen and no lock anywhere in it — see `src/content/glossary/types.ts`.
 *
 * One list, searched rather than browsed. An A–Z index is how a printed glossary
 * works because paper cannot filter; a phone can, so the search box is the
 * primary control and the letter sections exist for the case where somebody is
 * reading rather than looking something up.
 *
 * Definitions expand in place. Pushing a route per term would put a back-stack
 * entry between the candidate and the list they are scanning, which is the wrong
 * trade for content that is two sentences long.
 */
export default function Glossary() {
  const router = useRouter();
  const { term: initialTerm } = useLocalSearchParams<{ term?: string }>();
  const exam = useStudyStore((s) => s.exam);

  const [query, setQuery] = useState('');
  // Typing on a 260-row list re-filters on every keystroke. Deferring keeps the
  // input responsive and lets the list catch up a frame later.
  const deferredQuery = useDeferredValue(query);
  const [openKey, setOpenKey] = useState<string | null>(initialTerm ?? null);
  const [examFilter, setExamFilter] = useState<GlossaryExam | null>(
    exam === 'CFA' || exam === 'FRM' ? exam : null,
  );

  const results = useMemo(() => {
    const scoped = filterByExam(GLOSSARY, examFilter);
    const searched = searchTerms(scoped, deferredQuery);
    // Search returns best-match order, which must not be re-sorted away. With no
    // query there is no ranking to preserve, so alphabetical is the useful order.
    return deferredQuery.trim() ? searched : sortTerms(searched);
  }, [deferredQuery, examFilter]);

  const searching = deferredQuery.trim().length > 0;
  const sections = useMemo(() => (searching ? [] : sectionise(results)), [results, searching]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <View style={{ paddingHorizontal: gutter.screen, paddingTop: 20, paddingBottom: 8 }}>
        <BackLink label="← Profile" onPress={() => router.back()} />
        <Text style={[type.sectionTitle, { marginTop: 12 }]}>Glossary</Text>
        <Text style={[type.secondary, { marginTop: 4 }]}>
          {GLOSSARY.length} terms across CFA and FRM · free, always
        </Text>

        {/* search */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            paddingHorizontal: 12,
            height: 42,
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
            placeholder="Search a term or abbreviation"
            placeholderTextColor={color.meta}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search the glossary"
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

        {/* exam filter */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          {([null, 'CFA', 'FRM'] as const).map((option) => {
            const active = examFilter === option;
            return (
              <Pressable
                key={option ?? 'all'}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setExamFilter(option)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: radius.button,
                  borderWidth: 1,
                  borderColor: active ? color.ink : color.rule,
                  backgroundColor: active ? color.ink : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: font.sans,
                    fontSize: 12,
                    fontWeight: '600',
                    color: active ? color.onInk : color.inkBody,
                  }}
                >
                  {option ?? 'Both'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {results.length === 0 && (
          <View style={{ paddingHorizontal: gutter.screen, paddingTop: 28 }}>
            <Text style={[type.rowTitle]}>Nothing matches “{query.trim()}”</Text>
            <Text style={[type.meta, { marginTop: 6 }]}>
              Search matches the term and its abbreviations, not the definitions. Try a shorter
              word, or the abbreviation — “ES”, “OAS”, “WACC”.
            </Text>
          </View>
        )}

        {searching
          ? results.map((t) => (
              <Row
                key={t.key}
                term={t}
                open={openKey === t.key}
                onPress={() => setOpenKey(openKey === t.key ? null : t.key)}
              />
            ))
          : sections.map((section) => (
              <View key={section.letter}>
                <View
                  style={{
                    paddingHorizontal: gutter.screen,
                    paddingTop: 20,
                    paddingBottom: 6,
                    backgroundColor: color.paper,
                  }}
                >
                  <Eyebrow size={10} tracking={0.16} style={{ color: color.brass }}>
                    {section.letter}
                  </Eyebrow>
                </View>
                {section.terms.map((t) => (
                  <Row
                    key={t.key}
                    term={t}
                    open={openKey === t.key}
                    onPress={() => setOpenKey(openKey === t.key ? null : t.key)}
                  />
                ))}
              </View>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ term, open, onPress }: { term: GlossaryTerm; open: boolean; onPress: () => void }) {
  const exams = examsFor(term);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={term.term}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 14,
        paddingHorizontal: gutter.screen,
        borderBottomWidth: 1,
        borderBottomColor: color.ruleSoft,
        backgroundColor: pressed ? color.surface : 'transparent',
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={[type.rowTitle, { flex: 1 }]}>{term.term}</Text>
        <Eyebrow size={8.5} tracking={0.12} style={{ color: color.meta }}>
          {exams.join(' · ')}
        </Eyebrow>
      </View>

      {term.aka && term.aka.length > 0 && (
        <Text style={[type.tileMeta, { marginTop: 4, color: color.meta }]}>
          {term.aka.join(' · ')}
        </Text>
      )}

      {/* Collapsed rows show the first line so the list is scannable without
          tapping every row. Expanding reveals the rest. */}
      <Text style={[type.meta, { marginTop: 6 }]} numberOfLines={open ? undefined : 2}>
        {term.definition}
      </Text>

      {open && term.formula && (
        <View
          style={{
            marginTop: 12,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: color.rule,
            borderRadius: radius.card,
            backgroundColor: color.surface,
          }}
        >
          <Eyebrow size={8.5} tracking={0.14} style={{ color: color.muted }}>
            FORMULA
          </Eyebrow>
          <Text style={[monoBlock, { marginTop: 8 }]}>{term.formula}</Text>
        </View>
      )}

      {open && term.note && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: color.ruleSoft,
          }}
        >
          <Eyebrow size={8.5} tracking={0.14} style={{ color: color.brass }}>
            IN THE EXAM
          </Eyebrow>
          <Text style={[type.meta, { marginTop: 6, color: color.inkBody }]}>{term.note}</Text>
        </View>
      )}
    </Pressable>
  );
}
