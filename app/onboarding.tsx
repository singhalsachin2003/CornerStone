import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eyebrow, PrimaryButton } from '@/components/primitives';
import { color, font, gutter } from '@/theme/tokens';
import { type } from '@/theme/type';
import { useStudyStore } from '@/store/useStudyStore';

const POINTS = [
  'Snapshots are swipeable cards — front concept, back detail.',
  'Missed questions land in your review queue automatically.',
  'Bookmark anything you want to see again before exam day.',
];

export default function Onboarding() {
  const router = useRouter();
  const completeOnboarding = useStudyStore((s) => s.completeOnboarding);

  const start = () => {
    completeOnboarding();
    router.replace('/setup/exam');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: gutter.setup, paddingTop: 26, paddingBottom: 24 }}>
        <Eyebrow size={10} tracking={0.16} style={{ color: color.brass }}>
          CORNERSTONE
        </Eyebrow>

        <View
          style={{ flex: 1, justifyContent: 'center', gap: 18, paddingTop: 20, paddingBottom: 40 }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderWidth: 2,
              borderColor: color.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ fontFamily: font.serifBold, fontSize: 26, lineHeight: 32, color: color.ink }}
            >
              C
            </Text>
          </View>

          <Text style={type.hero}>Fifteen honest minutes beats three distracted hours.</Text>

          <Text style={[type.lede, { maxWidth: 320 }]}>
            Choose a topic, read the snapshot, then answer five questions. That's a session. We'll
            keep the streak for you.
          </Text>

          <View style={{ gap: 12, marginTop: 6 }}>
            {POINTS.map((point, i) => (
              <View key={point} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <Text
                  style={{
                    fontFamily: font.mono,
                    fontWeight: '600',
                    fontSize: 10,
                    lineHeight: 20,
                    color: color.brass,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text style={[type.body, { color: color.ink, flex: 1, fontSize: 13.5 }]}>
                  {point}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <PrimaryButton label="Get started" onPress={start} />

        {/* No "Sign in" here: there is no account to sign into, and the mock's link
            went to the same place as Get started. Offering it promised returning
            candidates that their progress could be restored, which it cannot be. */}
        <View style={{ alignItems: 'center', paddingTop: 14 }}>
          <Text
            style={{
              fontFamily: font.sans,
              fontSize: 12,
              lineHeight: 16,
              color: color.meta,
              textAlign: 'center',
            }}
          >
            No account needed. Everything stays on your device.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
