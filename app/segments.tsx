import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, Rule } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { type } from '@/theme/type';
import { Segment, segmentsFor, topicByKey } from '@/content';
import { useAccess } from '@/access';

/**
 * The segments inside one topic area.
 *
 * This is the screen that makes the deal legible: the core segment is open and
 * says so, the paid ones are listed by name with the learning modules they cover,
 * and a locked row shows what is inside rather than hiding it. A paywall that
 * conceals what is behind it is asking to be bought on trust.
 */
export default function Segments() {
  const router = useRouter();
  const { topic: topicKey } = useLocalSearchParams<{ topic: string }>();
  const access = useAccess();

  const topic = topicKey ? topicByKey(topicKey) : undefined;
  const segments = useMemo(() => (topicKey ? segmentsFor(topicKey) : []), [topicKey]);

  if (!topic) return null;

  const open = (segment: Segment) => {
    if (segment.tier === 'premium' && !access.premium) {
      router.push('/paywall');
      return;
    }
    router.push({
      pathname: '/snapshot',
      params: { topic: topic.key, segment: segment.slug },
    });
  };

  const paidCount = segments.filter((s) => s.tier === 'premium').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <View style={{ paddingHorizontal: gutter.screen, paddingTop: 20, paddingBottom: 12 }}>
        <BackLink label="← Topics" onPress={() => router.push('/topics')} />
        <Text style={[type.sectionTitle, { marginTop: 12 }]}>{topic.name}</Text>
        <Text style={[type.secondary, { marginTop: 4 }]}>
          {topic.weight} of exam · {segments.length} segment{segments.length === 1 ? '' : 's'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {segments.map((segment) => {
          const locked = segment.tier === 'premium' && !access.premium;
          return (
            <Pressable
              key={segment.key}
              accessibilityRole="button"
              accessibilityState={{ disabled: false }}
              accessibilityHint={locked ? 'Opens the subscription screen' : undefined}
              onPress={() => open(segment)}
              style={({ pressed }) => ({
                paddingVertical: 16,
                paddingHorizontal: gutter.screen,
                borderBottomWidth: 1,
                borderBottomColor: color.ruleSoft,
                backgroundColor: pressed ? color.surface : 'transparent',
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={[type.rowTitle, { flex: 1 }]}>{segment.name}</Text>
                {segment.tier === 'free' ? (
                  <Eyebrow size={8.5} tracking={0.12} style={{ color: color.sage }}>
                    FREE
                  </Eyebrow>
                ) : locked ? (
                  <Lock size={13} color={color.brass} strokeWidth={2} />
                ) : (
                  <Eyebrow size={8.5} tracking={0.12} style={{ color: color.brass }}>
                    PLUS
                  </Eyebrow>
                )}
              </View>

              <Text style={[type.meta, { marginTop: 5 }]}>{segment.blurb}</Text>

              {/* The count is shown on a locked row too. Hiding what is inside the
                  paywall is how a subscription becomes a guess. */}
              <Text style={[type.tileMeta, { marginTop: 8 }]}>
                {segment.cards.length} cards · {segment.questions.length} questions
              </Text>

              {segment.modules.length > 0 && (
                <Text style={[type.tileMeta, { marginTop: 6, color: color.meta }]}>
                  {segment.modules.slice(0, 2).join(' · ')}
                  {segment.modules.length > 2 ? ` · +${segment.modules.length - 2} more` : ''}
                </Text>
              )}
            </Pressable>
          );
        })}

        {access.showUpsell && paidCount > 0 && (
          <View style={{ paddingHorizontal: gutter.screen, paddingTop: 22 }}>
            <Rule style={{ marginBottom: 18 }} />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/paywall')}
              style={({ pressed }) => ({
                borderWidth: 1,
                borderColor: pressed ? color.brass : color.brassTintBorder,
                backgroundColor: color.brassTintBg,
                borderRadius: radius.card,
                padding: 16,
              })}
            >
              <Text style={[type.rowLabel, { color: color.brassText }]}>
                Open the {paidCount} paid segment{paidCount === 1 ? '' : 's'} in this area
              </Text>
              <Text
                style={{
                  fontFamily: font.sans,
                  fontSize: 11.5,
                  lineHeight: 16,
                  color: color.brassBody,
                  marginTop: 5,
                }}
              >
                The core segment above stays free whatever you decide.
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
