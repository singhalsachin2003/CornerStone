import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, Rule } from '@/components/primitives';
import { font, gutter, radius } from '@/theme/tokens';
import { ALL_TOPICS, cardsFor, questionsFor } from '@/content';
import { useTheme } from '@/theme/useTheme';

/**
 * About / Legal.
 *
 * CFA Institute and GARP both enforce their marks actively, so the disclaimer needs to
 * be in the product itself, not only in the store listing. The curriculum caveat is
 * here for the same reason: exam weights are revised annually and a candidate should
 * never take this app's figures as authoritative over the official outline.
 */
export default function About() {
  const { c: color, type } = useTheme();
  const router = useRouter();

  const cards = ALL_TOPICS.reduce((n, t) => n + cardsFor(t.key).length, 0);
  const questions = ALL_TOPICS.reduce((n, t) => n + questionsFor(t.key).length, 0);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: gutter.setup, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <BackLink label="← Profile" onPress={() => router.back()} />

        <View
          style={{
            width: 52,
            height: 52,
            borderWidth: 2,
            borderColor: color.ink,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <Text style={{ fontFamily: font.serifBold, fontSize: 22, color: color.ink }}>C</Text>
        </View>

        <Text style={[type.screenTitle, { marginTop: 16 }]}>Cornerstone</Text>
        <Text style={[type.secondary, { marginTop: 6 }]}>
          Version {version} · {ALL_TOPICS.length} topic areas · {cards} snapshot cards · {questions}{' '}
          questions
        </Text>

        <Section title="WHAT THIS IS">
          <Body>
            A study companion for candidates preparing for the CFA® Program or the FRM®
            certification. Pick a topic, read the snapshot cards, answer five questions. Anything
            you miss returns on a spaced-repetition schedule.
          </Body>
          <Body>
            Everything is stored on your device and the app works fully offline. An account is
            optional — without one, no study data leaves your phone.
          </Body>
        </Section>

        <Section title="NOT AFFILIATED OR ENDORSED">
          <Body>
            Cornerstone is an independent study aid. It is not affiliated with, authorised by,
            endorsed by, or sponsored by CFA Institute or the Global Association of Risk
            Professionals (GARP).
          </Body>
          <Body>
            CFA®, Chartered Financial Analyst® and GIPS® are registered trademarks owned by CFA
            Institute. FRM®, Financial Risk Manager® and GARP® are trademarks owned by the Global
            Association of Risk Professionals. All marks are used here for identification and
            descriptive purposes only, and remain the property of their respective owners.
          </Body>
        </Section>

        <Section title="ON THE CURRICULUM">
          <Body>
            Topic areas, exam weight bands and learning modules are summarised from published
            outlines — the CFA Program 2027 outlines (Level II from the 2026 outline, the newest
            published at the time of writing) and the 2026 FRM curriculum.
          </Body>
          <Body>
            Both bodies revise their curricula annually: CFA Institute typically mid-year, GARP each
            December. This app is a planning map, not the curriculum. Always confirm weights and
            readings against the official documents for your own exam window before building a study
            plan.
          </Body>
          <Callout>
            Questions here are written to practise the reasoning the exams reward. They are not past
            papers and are not drawn from any official question bank.
          </Callout>
        </Section>

        <Section title="OFFICIAL SOURCES">
          <LinkRow label="CFA Institute" url="https://www.cfainstitute.org" />
          <LinkRow label="GARP" url="https://www.garp.org" />
        </Section>

        <Text style={[type.meta, { marginTop: 28 }]}>
          © {new Date().getFullYear()} Cornerstone. Built with Expo and React Native.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { c: color } = useTheme();
  return (
    <View style={{ marginTop: 26 }}>
      <Eyebrow size={10} tracking={0.14} style={{ marginBottom: 10 }}>
        {title}
      </Eyebrow>
      <Rule tone={color.hairline} />
      <View style={{ gap: 12, marginTop: 12 }}>{children}</View>
    </View>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  const { c: color, type } = useTheme();
  return <Text style={[type.body, { color: color.inkBody }]}>{children}</Text>;
}

function Callout({ children }: { children: React.ReactNode }) {
  const { c: color, type } = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color.brassTintBorder,
        backgroundColor: color.brassTintBg,
        borderRadius: radius.row,
        padding: 14,
      }}
    >
      <Text style={[type.body, { color: color.brassBody }]}>{children}</Text>
    </View>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  const { c: color, type } = useTheme();
  return (
    <Text
      accessibilityRole="link"
      onPress={() => Linking.openURL(url).catch(() => {})}
      style={[type.body, { color: color.brass, fontFamily: font.sansSemi }]}
    >
      {label} ↗
    </Text>
  );
}
