import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, ProgressTrack } from '@/components/primitives';
import { color, font, gutter, masteryColor, masteryTextColor, radius } from '@/theme/tokens';
import { type } from '@/theme/type';
import { EXAMS, EXAM_KEYS, ExamKey, Level, PATHWAYS, topicsFor } from '@/content';
import { useStudyStore, weightedProgress } from '@/store/useStudyStore';

/**
 * One switcher for exam *and* level. Candidates sitting both programmes — or moving
 * between CFA levels — should not have to walk the two-step setup flow again, so every
 * level of every exam is one tap from here. Presented as a modal from the Home title.
 */
export default function Switcher() {
  const router = useRouter();
  const exam = useStudyStore((s) => s.exam);
  const level = useStudyStore((s) => s.level);
  const pathway = useStudyStore((s) => s.pathway);
  const levelByExam = useStudyStore((s) => s.levelByExam);
  const mastery = useStudyStore((s) => s.mastery);
  const setExamLevel = useStudyStore((s) => s.setExamLevel);

  const choose = (e: ExamKey, l: Level) => {
    setExamLevel(e, l.key);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: gutter.setup, paddingTop: 22, paddingBottom: 20 }}>
        <BackLink label="← Back" onPress={() => router.back()} />

        <Eyebrow size={10} tracking={0.16} style={{ marginTop: 18 }}>
          YOUR PROGRAMMES
        </Eyebrow>
        <Text style={[type.screenTitle, { marginTop: 14, marginBottom: 8 }]}>
          Switch exam or level
        </Text>
        <Text style={[type.subtitle, { marginBottom: 20 }]}>
          Progress, bookmarks and review queues are kept separately for each.
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          {EXAM_KEYS.map((examKey, i) => {
            const e = EXAMS[examKey];
            const started = levelByExam[examKey];
            return (
              <View key={examKey} style={{ marginTop: i === 0 ? 0 : 26 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontFamily: font.serifSemi, fontSize: 20, color: color.ink }}>
                    {e.name}
                  </Text>
                  <Eyebrow
                    size={9.5}
                    tracking={0.1}
                    style={{ color: started ? color.brass : color.meta }}
                  >
                    {started ? 'IN PROGRESS' : e.levelWord}
                  </Eyebrow>
                </View>

                <View style={{ gap: 8 }}>
                  {e.levels.map((l) => (
                    <LevelRow
                      key={l.key}
                      exam={examKey}
                      level={l}
                      current={exam === examKey && level === l.key}
                      pct={weightedProgress(topicsFor(examKey, l.key, pathway), mastery)}
                      pathwayNote={
                        l.hasPathway ? PATHWAYS.find((p) => p.key === pathway)?.short : undefined
                      }
                      onPress={() => choose(examKey, l)}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function LevelRow({
  exam,
  level,
  current,
  pct,
  pathwayNote,
  onPress,
}: {
  exam: ExamKey;
  level: Level;
  current: boolean;
  pct: number;
  pathwayNote?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: current }}
      accessibilityLabel={`${exam} ${level.name}, ${pct}% complete${current ? ', currently studying' : ''}`}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: radius.row,
        borderColor: current || pressed ? color.ink : color.ruleStrong,
        backgroundColor: current ? color.surface : 'transparent',
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: current ? color.ink : 'rgba(22,35,59,.2)',
            backgroundColor: current ? color.ink : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: font.mono,
              fontWeight: '600',
              fontSize: 11.5,
              color: current ? color.paper : color.muted,
            }}
          >
            {level.short}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={type.rowTitle}>{level.name}</Text>
          <Text style={[type.meta, { marginTop: 3 }]} numberOfLines={1}>
            {pathwayNote ? `${pathwayNote} pathway · ${level.note}` : level.note}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: font.mono,
            fontWeight: '600',
            fontSize: 11.5,
            color: masteryTextColor(pct),
          }}
        >
          {pct}%
        </Text>
      </View>

      <ProgressTrack pct={pct} height={2} fillColor={masteryColor(pct)} style={{ marginTop: 11 }} />
    </Pressable>
  );
}
