# Existing Keyword Audit — DST - Bulk/Party (FINAL v2)

**Date:** 2026-05-23
**Campaign:** `DST - Bulk/Party` (id 23276220898, ENABLED, ₹3000/day)

## Final cleanup plan

| | Count |
|---|---:|
| Existing keywords today | **704** |
| To remove | **401** |
| **Remaining after cleanup** | **303** |
| Preserved despite removal flag (top performers) | 19 |
| Remaining duplicates after cleanup | 0 ✅ |

## Override applied: "preserve top performers"

After running 90-day performance data per keyword, the original 420-row removal list was filtered: any keyword with **≥50 clicks in 90 days** (or ≥30 clicks + ≥₹500 spend) is preserved, even if it was originally flagged for removal.

This reduced removals from 420 → 401 and preserved 19 keywords carrying ₹30,729 of 90-day spend.

## Removals by category (after override)

| Category | Originally flagged | Preserved | Final removals |
|---|---:|---:|---:|
| Wedding/marriage terms | 79 | 7 | 72 |
| Cross-ad-group duplicates | 332 | 9 | 323 |
| Ad-group-name Exact keywords | 6 | 2 | 4 |
| Misdirected in Naming Ceremony | 3 | 1 | 2 |
| **Total** | **420** | **19** | **401** |

## Conversion impact of removal (90-day data)

| Bucket | Final removals | 90d spend | Expected real-lead loss |
|---|---:|---:|---|
| Wedding (low-perf tail) | 72 | ₹1,170 | ~0 |
| Cross-AG dedup (low-perf tail) | 323 | ₹1,288 | ~0 (keyword still serves from one ad group) |
| Ad-group-name (low-perf tail) | 4 | ₹81 | ~0 |
| Misdirected | 2 | ₹10 | ~0 |
| **Total spend cleaned up** | **401** | **₹2,956** | **~0 real leads** |

The ₹30K in preserved spend continues to drive 4,000+ clicks/quarter — kept intact.
The ₹2,956 in actual removal spend was almost-zero-click waste anyway.

## Settings change

**Turn off Display network** — confirmed by data: 90-day Display spend ₹6,628, real leads from Display = **0**. All 911 "conversions" from Display were Landing Page Views, no form fills, no calls, no WhatsApp clicks.

## Combined apply plan

1. **Remove** 401 keywords (`keywords_to_remove.csv`)
2. **Add** 116 truly-new keywords (`keywords_dst_bulk_party_ALL.csv` — 12 of 128 already exist, auto-skip)
3. **Add** additional negatives (`negatives_additional.csv`)
4. **Disable Display network** on campaign (campaign_update)
5. **Held**: ad copy push (placeholders need filling first — phone known: 8609666666; need {{FAMILIES}}, {{PRICE}}, {{LP_URL}})

## Files

| File | Purpose |
|---|---|
| `keywords_existing_inventory.csv` | Full 704-row dump of current state (reference) |
| `keywords_to_remove.csv` | **401 final removals** with 90d perf annotations |
| `keywords_preserved_from_removal.csv` | **19 preserved performers** — audit trail |
| `keywords_dst_bulk_party_ALL.csv` | 128 new keywords (12 will auto-skip as dupes) |
| `negatives_additional.csv` | Extra negatives |
| `ad_copy_drafts.csv` | New RSA drafts |
| `keyword_audit_2026-05.md` | This document |
| `keyword_research_2026-05.md` | Volume + strategy analysis |

## Open issue (flagged earlier, separate from this plan)

**Primary conversion action is `Landing Page View`** — 99% of campaign "conversions." This is misleading the bid strategy (MAXIMIZE_CONVERSIONS is currently optimizing for page loads, not leads). Real CPA across the whole campaign is **₹1,289 per actual lead** (form + call + WhatsApp), not the ₹7 the dashboard shows.

Recommended separately: change primary conversion to `Submit Lead Form` + Calls + WhatsApp Click. This is a higher-stakes change (resets bid learning for ~2 weeks) and is best done in the Google Ads UI after a focused conversation.
