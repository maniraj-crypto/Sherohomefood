# Shero Home Food — Google Ads Keyword Research

**Date:** 2026-05-23
**Account:** Shero Home Food (4083467754)
**Target campaign:** `DST - Bulk/Party` (id 23276220898, ENABLED, ₹3000/day, MAXIMIZE_CONVERSIONS)
**Source:** Google Ads Keyword Planner (via Supermetrics MCP), location=India, language=en
**Status:** Draft — for review before pushing to live account

## Search volume analysis (all 129 keywords)

Volume data was pulled from Google's Keyword Planner for every keyword in `keywords_dst_bulk_party_ALL.csv`. The CSV has been annotated with `Avg Monthly Searches`, `Competition`, `Low CPC (INR)`, `High CPC (INR)`.

### Top 25 by search volume

| Volume | Comp | CPC range (₹) | Keyword | Ad Group |
|---:|---|---|---|---|
| 3600 | HIGH | 9.46 – 160.37 | food for birthday party | Birthday Event |
| 1600 | MEDIUM | 89.12 – 389.49 | catering for 50 people | Anniversary Event |
| 720 | LOW | 433.55 – 2019.48 | corporate lunch catering | Office Party |
| 390 | MEDIUM | 7.01 – 187.86 | food for birthday party at home | Birthday Event |
| 390 | MEDIUM | 7.01 – 187.86 | menu for birthday party at home | Birthday Event |
| 390 | MEDIUM | 66.99 – 288.41 | catering for birthday party near me | Birthday Event |
| 170 | MEDIUM | 100.83 – 310.09 | home party catering | Home Party |
| 170 | MEDIUM | 100.83 – 310.09 | catering for home party | Home Party |
| 140 | LOW | 77.88 – 640.97 | food for 50 people | Anniversary Event |
| 110 | MEDIUM | 51.67 – 272.19 | birthday party food catering | Birthday Event |
| 90 | MEDIUM | 102.34 – 307.43 | birthday catering ideas | Birthday Event |
| 50 | MEDIUM | 5.78 – 177.05 | party food for 50 people | Anniversary Event |
| 50 | HIGH | 3.53 – 9.57 | food for anniversary party | Anniversary Event |
| 50 | LOW | — | caterers in chennai | Chennai Localities |
| 50 | HIGH | 77.64 – 311.00 | party food order near me | Home Party |
| 40 | MEDIUM | 63.00 – 322.49 | best food to cater for birthday party | Birthday Event |
| 40 | LOW | — | office event catering | Office Party |
| 40 | LOW | — | veg catering services | Pure Veg Catering |
| 30 | LOW | 861.24 – 3203.91 | team lunch catering | Office Party |
| 30 | LOW | — | pure veg caterers | Pure Veg Catering |
| 20 | LOW | — | homemade party food | Home Party |
| 20 | LOW | — | jain catering | Pure Veg Catering |
| 20 | LOW | — | veg catering near me | Pure Veg Catering |
| 20 | LOW | — | veg biryani full tray price | Veg Biryani |
| 10 | — | — | (many long-tail terms — see CSV) |

### Volume distribution

- **>= 100/mo searches:** 10 keywords (highest-priority bid)
- **20–99/mo searches:** 10 keywords (solid value)
- **10/mo searches:** ~55 keywords (long-tail backbone, low CPC)
- **0 / no data:** ~54 keywords (speculative — many city localities + brand composites)

### Headline takeaways from volume data

1. **The ad group with the most upside is Anniversary Event, not Birthday or Office.** `catering for 50 people` at **1600/mo, MEDIUM comp, ₹89-389 CPC** is by far the highest-value addition. The ad group also picks up `food for 50 people` (140/mo) and `party food for 50 people` (50/mo). This is the single biggest finding — and the existing campaign wasn't bidding on "for 50 people" at all.

2. **Birthday Event has the highest absolute volume** but `food for birthday party` is HIGH competition (₹9-160 CPC). Better long-tail bets in same ad group: `food for birthday party at home` and `menu for birthday party at home` (both 390/mo, MEDIUM, only ₹7-188).

3. **Office Party is the premium B2B segment.** `corporate lunch catering` is 720/mo with LOW competition but ₹433-2019 CPC — meaning few competitors but high-intent buyers willing to pay. `team lunch catering` CPC tops ₹3200. Consider higher TCPA for this ad group.

4. **Chennai locality terms are mostly 0-10/mo.** They still get traffic via match-type expansion, but don't expect locality-only volume to move the needle. Keep them in but with low priority.

5. **Many ad groups (House Warming, Naming Ceremony, Home Pooja, Baby Shower) show "no data" or 0 for most keywords.** Either Google has no signal (terms are too vernacular/niche) or volume is below display threshold. They may still drive small numbers of impressions, but probably <5/month each.

## Strategic recommendations from the volume data

### Priority 1 — bid aggressively
- `catering for 50 people` (Exact) — 1600/mo, MEDIUM comp
- `food for birthday party at home` (Exact) — 390/mo, low CPC
- `menu for birthday party at home` (Exact) — 390/mo, low CPC
- `catering for birthday party near me` (Phrase) — 390/mo
- `corporate lunch catering` (Phrase) — 720/mo, premium

### Priority 2 — solid mid-tier
- `home party catering` / `catering for home party` — 170/mo each
- `food for 50 people` — 140/mo
- `birthday party food catering` — 110/mo
- `birthday catering ideas` — 90/mo

### Priority 3 — let them run as long-tail
- All 10/mo Exact terms — low spend, decent intent at low CPC
- Locality Phrase match terms — discovery layer

### Consider dropping or moving to a lower-priority ad group
- All "no data" Exact-only terms in Naming Ceremony, Baby Shower, Home Pooja, House Warming. They cost nothing if they don't trigger, but consider downgrading to Phrase to widen reach, OR removing if you want a tighter account.

## Ad group structure (after applying)

| Ad Group | Volume (sum of keywords with data) | Status |
|---|---:|---|
| Birthday Event | 5,000+ | existing |
| Anniversary Event | 1,840+ | existing |
| Office Party | 810+ | existing |
| Home Party | 410+ | existing |
| Chennai Localities | 220+ | **new** |
| Pure Veg Catering | 130+ | **new** |
| Veg Biryani | 70+ | **new** |
| Naming Ceremony | ~0 (no data) | existing |
| Baby Shower | ~10 | existing |
| House Warming | ~10 | existing |
| Home Pooja | ~40 | existing |

## Gaps in current account

The live `DST - Bulk/Party` has 8 ad groups but **0 keywords on any ad group** per `campaign_and_resource_get`. Either keywords were never added, or they live elsewhere. Applying `keywords_dst_bulk_party_ALL.csv` would be a net new addition.

## Negative keyword expansion

See `negatives_additional.csv`. Adds DIY/recipe/employment/US-theme blockers on top of the existing `shero_negative_keywords.csv` (which is non-veg blocking — keep).

## Ad copy recommendations

See `ad_copy_drafts.md` and `ad_copy_drafts.csv` — new RSAs per ad group with placeholders for trust signals, geo proof, pricing, and CTA.

## Caveats

- "No data" means Google Keyword Planner has no published volume — the keyword may still get impressions, especially via phrase/broad match expansion. Don't read it as "zero searches happen".
- All volume figures are India-level. Chennai-only volume will be a fraction of these but the location targeting on your campaign filters anyway.
- Semrush MCP is not available on your current plan (would have given competitor SERP overlap / KD score). Google's data is the actual auction data, so directionally sound.

## Next steps

1. **Review** `keywords_dst_bulk_party_ALL.csv` — drop anything you don't want.
2. Decide on **Competitor Conquest** (`keywords_competitor_conquest.csv`) — yes/no.
3. Fill placeholders in `ad_copy_drafts.csv` (`{{PRICE}}`, `{{FAMILIES}}`, `{{PHONE}}`, `{{LP_URL}}`).
4. Tell me to push — I'll apply via `campaign_update` MCP into the live campaign.
