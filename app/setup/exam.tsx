import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, PrimaryButton, SelectableCard } from '@/components/primitives';
import { font, gutter } from '@/theme/tokens';
import { eyebrow } from '@/theme/type';
import { EXAMS, EXAM_KEYS, ExamKey, examTotals } from '@/content';
import { useStudyStore } from '@/store/useStudyStore';
import { useTheme } from '@/theme/useTheme';

export default function ExamPicker() {
  const { c: color, type } = useTheme();
  const router = useRouter();
  const exam = useStudyStore((s) => s.exam);
  const level = useStudyStore((s) => s.level);
  const levelByExam = useStudyStore((s) => s.levelByExam);
  const setExam = useStudyStore((s) => s.setExam);
  const onboarded = useStudyStore((s) => s.onboarded);

  // Reached from Home or Profile rather than first-run setup: it must be escapable,
  // and an exam already set up should not force the candidate back through step 2.
  const isSwitching = onboarded && Object.keys(levelByExam).length > 0;
  const knownLevel = exam ? levelByExam[exam] : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: gutter.setup, paddingTop: 22, paddingBottom: 24 }}>
        {isSwitching && (
          <BackLink label="← Back" onPress={() => router.back()} style={{ marginBottom: 18 }} />
        )}

        <Eyebrow size={10} tracking={0.16}>
          {isSwitching ? 'YOUR EXAMS' : 'STEP 1 OF 2'}
        </Eyebrow>

        <Text style={[type.screenTitle, { marginTop: 14, marginBottom: 8 }]}>
          {isSwitching ? 'Which exam are you studying?' : 'Which exam are you sitting?'}
        </Text>
        <Text style={[type.subtitle, { marginBottom: 22 }]}>
          {isSwitching
            ? 'Progress, bookmarks and review queues are kept separately for each.'
            : 'You can switch any time from your profile.'}
        </Text>

        <View style={{ gap: 14 }}>
          {EXAM_KEYS.map((key) => (
            <ExamCard
              key={key}
              examKey={key}
              selected={exam === key}
              startedLevel={levelByExam[key]}
              onSelect={() => setExam(key)}
            />
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* Both bodies enforce their marks actively. The full statement lives in
            About, but this is where a candidate first sees the marks used, so the
            non-affiliation has to be legible here too rather than only two taps away. */}
        <Text style={[type.meta, { marginBottom: 14 }]}>
          Not affiliated with, endorsed by or sponsored by CFA Institute or GARP. CFA® and Chartered
          Financial Analyst® are registered trademarks owned by CFA Institute. FRM® is a trademark
          owned by the Global Association of Risk Professionals.
        </Text>

        <PrimaryButton
          label={
            knownLevel
              ? `Continue to ${EXAMS[exam!].levels.find((l) => l.key === knownLevel)?.name}`
              : 'Continue'
          }
          disabled={!exam}
          onPress={() => {
            // Already set up: go straight back to studying. Level is changeable
            // from Profile, so there is no need to walk step 2 again.
            if (knownLevel && level === knownLevel) router.replace('/home');
            else router.push('/setup/level');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function ExamCard({
  examKey,
  selected,
  startedLevel,
  onSelect,
}: {
  examKey: ExamKey;
  selected: boolean;
  startedLevel?: string;
  onSelect: () => void;
}) {
  const { c: color, type } = useTheme();
  const e = EXAMS[examKey];
  const totals = examTotals(examKey);
  const levelName = startedLevel ? e.levels.find((l) => l.key === startedLevel)?.name : undefined;

  return (
    <SelectableCard selected={selected} onPress={onSelect}>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}
      >
        <Text
          style={{ fontFamily: font.serifSemi, fontSize: 22, lineHeight: 26, color: color.ink }}
        >
          {e.name}
        </Text>
        <Text style={[eyebrow(color, 10, 0.1), { color: color.brass }]}>{e.levelWord}</Text>
      </View>
      <Text style={[type.body, { marginTop: 8 }]}>{e.description}</Text>
      <Text
        style={{
          fontFamily: font.sansSemi,
          fontSize: 11.5,
          lineHeight: 14,
          color: color.muted,
          marginTop: 12,
        }}
      >
        {levelName
          ? `In progress · ${levelName}`
          : `${totals.areas} topic areas · ${totals.questions} practice questions`}
      </Text>
    </SelectableCard>
  );
}
