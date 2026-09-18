# Pricing

What is settled, what is not, and the exact shape of the Play product so that
creating it is mechanical rather than a series of judgement calls made in a form.

Read `npm run check:play` first — it says which of the steps below is actually next.

## Settled

One subscription, `cornerstone_premium`, with two auto-renewing base plans:

| Base plan | Billing period | India price |
| --------- | -------------- | ----------- |
| `monthly` | `P1M`          | INR 29      |
| `yearly`  | `P1Y`          | INR 199     |

RevenueCat reads these as `cornerstone_premium:monthly` and
`cornerstone_premium:yearly`. No free trial, no introductory offer, no lifetime
tier. Grace period `P7D` and account hold `P30D` — Play's defaults, and what
OTC Learn uses.

These amounts mirror `otc_learn_pro`, read from the live product through the
Android Publisher API rather than taken from memory. **The yearly price is a 43%
discount on twelve months** (INR 348 → 199); keep that ratio if the amounts ever
move, because it is what makes the annual plan the obvious choice.

## Settled 2026-09-18: India only, deliberately

**`IN` alone — INR 29/month, INR 199/year — and everywhere else treated as not
yet launched.** Sachin chose this on 2026-09-18, presented against the two-band
alternative below. Recording it here is the point: the failure mode this section
was written to prevent is _arriving_ at India-only by copying `otc_learn_pro`'s
config and never noticing that the rest of the world cannot buy. That is not what
happened — the other option was on the table and this one was picked.

**Why it is a safe place to start.** Adding regions to a live subscription is
allowed and does not disturb existing subscribers. Raising a price in a region
that already has one is the part Play makes hard. **Starting narrow is
reversible; starting cheap is not** — so India-only costs a delay, while
auto-converting INR outward would have cost the price itself.

**What to watch.** Play makes the subscription **unavailable in every region it
has no price for**, so from launch until regions are added, a CFA or FRM
candidate in Toronto, London, Lagos or Dubai sees no purchase option at all —
not an error, just an app that never offers the upgrade. Guard 2 handles this
correctly (no product, no gating, everything open), so they get the free tier
rather than a broken screen. **Revisit once there is any evidence of demand
outside India** — the two-band table below is kept for exactly that moment.

### Kept for later: the two-band alternative

Not chosen, and preserved because adding regions is the expected next move. Set
the price in USD and let Play convert outward from that anchor, then override a
short list of markets downward. The anchor must be USD: converting from INR
outward gives the $2.30-a-year problem, converting from USD inward gives prices
nobody in South Asia will pay.

| Band                            | Monthly  | Yearly    |
| ------------------------------- | -------- | --------- |
| **Anchor** — US, auto-converted | USD 3.99 | USD 24.99 |
| **Override** — see list below   | INR 29   | INR 199   |

USD 24.99/year is a 48% discount on twelve months, which holds the same shape as
the INR pair. It is also priced against what it is: a question bank and a card
deck, not a prep course. Kaplan and Wiley charge several hundred dollars for the
course; a supplementary app that charges like one does not get bought.

**Override band** — markets where INR 29/199 or the local equivalent is the real
price, chosen for CFA/FRM candidate populations rather than for GDP alone:

```
IN  PK  BD  LK  NP  NG  KE  GH  EG  VN  PH  ID
```

Mainland China is deliberately absent: it is the largest CFA candidate
population in the world and Google Play does not operate there, so it costs
nothing to leave out.

**The mistake to keep avoiding**, whichever way this goes: entering INR 199 and
letting Play auto-convert it outward publishes a **$2.30-a-year** subscription to
the United States. It reads as a broken product, and Play will not let you raise
an existing subscriber's price freely afterwards.

## Order of operations, which Play forces

1. ~~**Upload an AAB of versionCode 7 or later to any track.**~~ **DONE
   2026-09-18** — versionCode 9 is on `internal`; production stays on 5. Play
   would not create a subscription until a binary declaring
   `com.android.vending.BILLING` was on a track, and versionCode 5 does not
   declare it. The permission comes from the Play Billing library, not from the
   RevenueCat key, so even a keyless build unblocks this.
2. **Create `cornerstone_premium`** with the two base plans, priced `IN` only.
   `npm run create:subscription` does it from this spec; it prints the plan and
   changes nothing unless passed `--commit`.
3. **Add both base plans to an offering in RevenueCat**, attached to the
   `premium` entitlement.
4. **Rebuild.** Nothing in the app changes.

Until step 3 lands the offering is empty, the `productAvailable` guard is false,
gating is off and every segment is open to everyone. **That is the intended
behaviour, not a bug** — the app refuses to lock content it cannot sell, and it
was verified on a device against the real versionCode 9 build.

## Store listing text for the product

`otc_learn_pro` carries a title and three benefit lines. The equivalent, kept
honest about what the subscription actually buys — everything shipped in
versionCode 5 stays free permanently, and a subscription buys what is added
afterwards:

- **Title:** Cornerstone Plus
- **Benefits:**
  - Every practice segment, across all 38 topic areas
  - 417 cards and 834 questions beyond the free core
  - New segments added for each exam cycle

**The name is "Cornerstone Plus", not "Premium".** That is what `profile.tsx` puts on
screen, and the Play listing title is what a buyer reads on the purchase sheet — the two
must agree. The RevenueCat _entitlement_ is `premium`, which is an internal id and fine;
its display name there was renamed to "Cornerstone Plus" on 2026-09-13, so nothing in
the dashboard disagrees with the app.

**Do not list progress backup or the glossary as benefits.** Both are free and
stay free — the account is optional for everyone and the glossary says "free,
always" on its own screen. A benefit line that claims something the free tier
already gives is the kind of thing Play's reviewers read, and it would be untrue.
