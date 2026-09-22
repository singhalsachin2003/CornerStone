import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackLink, Eyebrow, OutlineButton, PrimaryButton, Rule } from '@/components/primitives';
import { font, gutter, radius } from '@/theme/tokens';
import { premiumTotals } from '@/content';
import { redeem, redeemMessage, useAccess } from '@/access';
import { MANAGE_SUBSCRIPTION_URL, purchasePackage } from '@/purchases';
import { useAccessStore } from '@/store/useAccessStore';
import { openExternal } from '@/share';
import { useTheme } from '@/theme/useTheme';

/**
 * The paywall, which has to be honest in five states.
 *
 * That is the whole reason `paywallState` returns a state rather than a boolean.
 * "There is nothing on sale yet", "you already have this because you were here
 * first" and "your code runs out in nine days" are three different sentences, and
 * a screen that renders a Subscribe button in all three is lying in two of them.
 */
export default function Paywall() {
  const { c: color, type } = useTheme();
  const router = useRouter();
  const access = useAccess();
  const products = useAccessStore((s) => s.products);
  const applySnapshot = useAccessStore((s) => s.applySnapshot);
  const grantPromo = useAccessStore((s) => s.grantPromo);
  const promoGrantUntil = useAccessStore((s) => s.promoGrantUntil);
  const restore = useAccessStore((s) => s.restore);

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const totals = useMemo(() => premiumTotals(), []);

  const buy = useCallback(
    async (packageId: string) => {
      setBusy(true);
      setNotice(null);
      const outcome = await purchasePackage(packageId);
      setBusy(false);
      // A cancellation is somebody changing their mind, which is most taps. Saying
      // anything at all about it would read as an error.
      if (outcome.kind === 'cancelled') return;
      if (outcome.kind === 'purchased') {
        applySnapshot(outcome.snapshot);
        router.back();
        return;
      }
      setNotice(
        outcome.kind === 'unavailable'
          ? 'The store is not reachable right now. Nothing has been charged.'
          : 'That did not go through. Nothing has been charged.',
      );
    },
    [applySnapshot, router],
  );

  const onRestore = useCallback(async () => {
    setBusy(true);
    setNotice(null);
    const snapshot = await restore();
    setBusy(false);
    setNotice(
      snapshot.active
        ? 'Restored — your subscription is active on this device.'
        : 'No previous purchase was found for this store account.',
    );
  }, [restore]);

  const onRedeem = useCallback(() => {
    const outcome = redeem({
      input: code,
      now: Date.now(),
      currentGrantUntil: promoGrantUntil,
      premiumContentExists: access.input.premiumContentExists,
    });
    setNotice(redeemMessage(outcome));
    if (outcome.kind === 'granted') {
      // The campaign, never the code. A store of live codes is a published list of
      // ways to get the paid segments for nothing.
      grantPromo(outcome.until, outcome.code.campaign);
      setCode('');
    }
  }, [code, promoGrantUntil, access.input.premiumContentExists, grantPromo]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: gutter.screen, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackLink label="← Back" onPress={() => router.back()} />

        <Eyebrow size={9.5} tracking={0.14} style={{ marginTop: 18 }}>
          CORNERSTONE PLUS
        </Eyebrow>

        {access.paywall === 'unavailable' && <Unavailable />}
        {access.paywall === 'grandfathered' && <Grandfathered />}
        {access.paywall === 'subscribed' && <Subscribed />}
        {access.paywall === 'promo' && <PromoHeld days={access.promoDaysRemaining} />}
        {access.paywall === 'offer' && <Offer totals={totals} />}

        {access.paywall === 'offer' && (
          <View style={{ marginTop: 22, gap: 10 }}>
            {products.length === 0 && <Text style={type.meta}>Loading plans…</Text>}
            {products.map((p) => (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                disabled={busy}
                onPress={() => buy(p.id)}
                style={({ pressed }) => ({
                  borderWidth: 1,
                  borderColor: pressed ? color.ink : color.ruleStrong,
                  borderRadius: radius.card,
                  backgroundColor: color.surface,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: busy ? 0.6 : 1,
                })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={type.rowTitle}>{p.periodLabel || p.title}</Text>
                  {!!p.description && (
                    <Text style={[type.meta, { marginTop: 4 }]}>{p.description}</Text>
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: font.mono,
                    fontWeight: '600',
                    fontSize: 14,
                    color: color.brassText,
                  }}
                >
                  {p.priceLabel}
                </Text>
              </Pressable>
            ))}
            {busy && <ActivityIndicator color={color.ink} />}
            <OutlineButton label="Restore a purchase" onPress={onRestore} />
          </View>
        )}

        {access.paywall === 'subscribed' && (
          <PrimaryButton
            label="Manage subscription"
            onPress={() => openExternal(MANAGE_SUBSCRIPTION_URL)}
            style={{ marginTop: 22 }}
          />
        )}

        {/* The code field is offered in every state except the one where there is
            nothing to unlock — including to a subscriber, who may be redeeming on
            behalf of somebody else's device and should not be told it is missing. */}
        {access.paywall !== 'unavailable' && (
          <>
            <Rule style={{ marginTop: 28, marginBottom: 20 }} />
            <Eyebrow size={9} tracking={0.12}>
              HAVE A CODE?
            </Eyebrow>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, alignItems: 'center' }}>
              <TextInput
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="CODE"
                placeholderTextColor={color.meta}
                onSubmitEditing={onRedeem}
                returnKeyType="done"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: color.ruleStrong,
                  borderRadius: radius.button,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontFamily: font.mono,
                  fontSize: 14,
                  letterSpacing: 1.2,
                  color: color.ink,
                  backgroundColor: color.surface,
                }}
              />
              <OutlineButton label="Redeem" onPress={onRedeem} />
            </View>
          </>
        )}

        {!!notice && (
          <Text style={[type.body, { marginTop: 16, color: color.inkBody }]}>{notice}</Text>
        )}

        <Text style={[type.meta, { marginTop: 26 }]}>
          Everything Cornerstone shipped before this subscription existed stays free, permanently. A
          subscription buys the segments added since — and the ones added next.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// One block per honest state
// ---------------------------------------------------------------------------

function Offer({ totals }: { totals: ReturnType<typeof premiumTotals> }) {
  const { type } = useTheme();
  return (
    <>
      <Text style={[type.sectionTitle, { marginTop: 12 }]}>Go deeper than the core</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        {totals.segments} extra segments across {totals.areas} topic areas — {totals.questions}{' '}
        further questions and {totals.cards} snapshot cards, each drawn along a named cluster of the
        official learning modules.
      </Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        New segments are added to the same subscription as they are written. That is what you are
        subscribing to: the ones after these.
      </Text>
    </>
  );
}

function Grandfathered() {
  const { type } = useTheme();
  return (
    <>
      <Text style={[type.sectionTitle, { marginTop: 12 }]}>You already have all of it</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        You were using Cornerstone before any of it was paid for. Every segment is open to you,
        permanently, including the ones written after today. There is nothing to buy.
      </Text>
    </>
  );
}

function Subscribed() {
  const { type } = useTheme();
  return (
    <>
      <Text style={[type.sectionTitle, { marginTop: 12 }]}>Your subscription is active</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        Every segment is open, and new ones appear as they are written. Billing and cancellation are
        handled by Google Play, not here.
      </Text>
    </>
  );
}

function PromoHeld({ days }: { days: number }) {
  const { type } = useTheme();
  return (
    <>
      <Text style={[type.sectionTitle, { marginTop: 12 }]}>
        {days === 1 ? 'One day left' : `${days} days left`}
      </Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        A code has opened every segment for you. When it runs out the core of each topic area stays
        free — you will not lose anything you had before.
      </Text>
    </>
  );
}

function Unavailable() {
  const { type } = useTheme();
  return (
    <>
      <Text style={[type.sectionTitle, { marginTop: 12 }]}>Nothing is for sale here yet</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        This build has no subscription to offer, so every segment in it is open. If you are seeing
        this screen at all, it is because you went looking for it.
      </Text>
    </>
  );
}
