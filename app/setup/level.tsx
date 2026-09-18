import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, PrimaryButton } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { type } from '@/theme/type';
import { EXAMS, PATHWAYS, PathwayKey, topicsFor } from '@/content';
import { useStudyStore } from '@/store/useStudyStore';
import { buildPlacementSession, useSessionStore } from '@/store/useSessionStore';

export default function LevelPicker() {
  const router = useRouter();
  const examKey = useStudyStore((s) => s.exam);
  const level = useStudyStore((s) => s.level);
  const pathway = useStudyStore((s) => s.pathway);
  const setLevel = useStudyStore((s) => s.setLevel);
  const setPathway = useStudyStore((s) => s.setPathway);
  const startSession = useSessionStore((s) => s.start);

  if (!examKey) {
    router.replace('/setup/exam');
    return null;
  }
  const exam = EXAMS[examKey];
  const selectedLevel = exam.levels.find((l) => l.key === level);

  const startPlacement = () => {
    // Provisionally set the first level so the placement bank has a syllabus to draw on.
    const provisional = level ?? exam.levels[0].key;
    setLevel(provisional);
    const topics = topicsFor(examKey, provisional, pathway);
    startSession(buildPlacementSession(topics, exam.name));
    router.push('/quiz');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: gutter.setup, paddingTop: 22, paddingBottom: 24 }}>
        <BackLink label="← Change exam" onPress={() => router.back()} />

        <Eyebrow size={10} tracking={0.16} style={{ marginTop: 18 }}>
          {`STEP 2 OF 2 · ${exam.name}`}
        </Eyebrow>

        <Text style={[type.screenTitle, { marginTop: 14, marginBottom: 22 }]}>
          Where are you in the programme?
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {exam.levels.map((l) => {
            const active = level === l.key;
            return (
              <Pressable
                key={l.key}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setLevel(l.key)}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  paddingVertical: 16,
                  paddingHorizontal: 18,
                  borderWidth: 1,
                  borderRadius: radius.row,
                  borderColor: active || pressed ? color.ink : color.ruleStrong,
                  backgroundColor: active ? color.surface : 'transparent',
                })}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    borderWidth: 1,
                    borderColor: active ? color.ink : 'rgba(22,35,59,.2)',
                    backgroundColor: active ? color.ink : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: font.mono,
                      fontWeight: '600',
                      fontSize: 12,
                      color: active ? color.paper : color.muted,
                    }}
                  >
                    {l.short}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={type.rowTitle}>{l.name}</Text>
                  <Text style={[type.secondary, { marginTop: 3, fontSize: 12.5 }]}>{l.note}</Text>
                </View>
              </Pressable>
            );
          })}

          {/* Level III requires a pathway choice — 30–35% of the exam. */}
          {selectedLevel?.hasPathway && (
            <View style={{ marginTop: 6 }}>
              <Eyebrow size={9.5} tracking={0.12} style={{ marginBottom: 8 }}>
                CHOOSE YOUR PATHWAY · 30–35% OF THE EXAM
              </Eyebrow>
              <View style={{ gap: 8 }}>
                {PATHWAYS.map((p) => (
                  <PathwayRow
                    key={p.key}
                    pathwayKey={p.key}
                    name={p.name}
                    blurb={p.blurb}
                    active={pathway === p.key}
                    onPress={() => setPathway(p.key)}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          onPress={startPlacement}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: pressed ? color.brass : color.brassTintBorder,
            backgroundColor: color.brassTintBg,
            padding: 16,
            borderRadius: radius.row,
            marginTop: 14,
          })}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Eyebrow size={10} tracking={0.12} style={{ color: color.brass }}>
              NOT SURE WHERE TO START?
            </Eyebrow>
            <Eyebrow size={10} tracking={0.06} style={{ color: color.brassBody }}>
              6 MIN
            </Eyebrow>
          </View>
          <Text style={[type.serif18, { marginTop: 9 }]}>Take the placement quiz</Text>
          <Text style={[type.secondary, { color: color.brassBody, marginTop: 5 }]}>
            Five questions across the {exam.name} syllabus. We'll recommend a level and pre-fill
            your topic progress.
          </Text>
        </Pressable>

        <PrimaryButton
          label="Start studying"
          disabled={!level}
          onPress={() => router.replace('/home')}
          style={{ marginTop: 14 }}
        />
      </View>
    </SafeAreaView>
  );
}

function PathwayRow({
  pathwayKey,
  name,
  blurb,
  active,
  onPress,
}: {
  pathwayKey: PathwayKey;
  name: string;
  blurb: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderRadius: radius.row,
        borderColor: active || pressed ? color.ink : color.ruleStrong,
        backgroundColor: active ? color.surface : 'transparent',
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 1,
            borderColor: active ? color.ink : 'rgba(22,35,59,.28)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {active && (
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color.ink }} />
          )}
        </View>
        <Text style={[type.rowLabel, { flex: 1 }]}>{name}</Text>
      </View>
      <Text style={[type.meta, { marginTop: 5, marginLeft: 24 }]}>{blurb}</Text>
    </Pressable>
  );
}
