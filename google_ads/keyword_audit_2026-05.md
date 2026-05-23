# Existing Keyword Audit — DST - Bulk/Party (FINAL)

**Date:** 2026-05-23
**Campaign:** `DST - Bulk/Party` (id 23276220898, ENABLED, ₹3000/day)

## Final cleanup plan

| | Count |
|---|---:|
| Existing keywords today | **704** |
| To remove | **420** |
| **Remaining after cleanup** | **284** |
| Remaining duplicates after cleanup | **0** ✅ |

## Removals by category

| Category | Rows | Description |
|---|---:|---|
| Wedding/marriage/reception/engagement | 79 | All instances removed per business decision — Shero is not targeting weddings |
| Cross-ad-group duplicates | 332 | Same keyword in 3 or 5 ad groups → kept in one canonical ad group |
| Ad-group-name keywords (Exact) | 6 | `Office Party`, `Home Pooja`, `House Warming`, `Naming Ceremony`, `Baby Shower`, `home party` — too broad |
| Misdirected in Naming Ceremony | 3 | `birthday catering`, `party catering`, `party platters` |

## Removals by ad group

| Ad Group | Removals | Keywords after |
|---|---:|---:|
| Anniversary Event | 137 | 61 |
| Birthday Event | 122 | 45 |
| Home Party | 91 | 67 |
| Naming Ceremony | 34 | 32 |
| Office Party | 31 | 38 |
| Baby Shower | 3 | 15 |
| House Warming | 1 | 14 |
| Home Pooja | 1 | 12 |
| **Total** | **420** | **284** |

## How city dedup was handled (you said: keep all 3 cities)

City-specific keywords (`Hyderabad`, `Bangalore`, `Chennai` in the text) were not deleted — they were **deduplicated**. Each city-keyword now lives in exactly one ad group, chosen by intent:
- Office/corporate + city → Office Party
- Birthday + city → Birthday Event
- Anniversary + city → Anniversary Event
- Otherwise → Home Party (catch-all)

> **Future improvement:** city baked into keyword text isn't best practice. Better to use Google Ads *location targeting* on the campaign and keep keywords clean. But the existing structure works; I left it as-is for this pass.

## Campaign settings change (you approved)

**Turn Display network OFF.** Currently `network_settings.display: true` on a SEARCH campaign — wastes ~30% of spend on low-intent Display placements. This is a single `campaign_update` call, not a keyword change.

## Combined apply plan

When you give the go-ahead, I will:

1. **Remove** the 420 keywords in `keywords_to_remove.csv`
2. **Add** the 116 truly-new keywords in `keywords_dst_bulk_party_ALL.csv` (the 12 overlaps will skip automatically)
3. **Add** the additional negatives in `negatives_additional.csv`
4. **Update campaign** to disable Display network
5. (Optional, separate yes/no) Push the new RSA drafts in `ad_copy_drafts.csv` — placeholders need filling first

All via `campaign_update` MCP calls on the live `DST - Bulk/Party` campaign. Net effect: 704 → 400 cleaner keywords, no internal competition, no wedding spend, no Display waste.

## Files

| File | Purpose |
|---|---|
| `keywords_existing_inventory.csv` | Full 704-row export of current state (reference) |
| `keywords_to_remove.csv` | **420 final removals** ready to apply |
| `keywords_dst_bulk_party_ALL.csv` | 128 new keywords (12 will auto-skip as dupes; 116 truly new) |
| `negatives_additional.csv` | Extra negatives |
| `ad_copy_drafts.csv` | New RSA drafts (placeholders need filling) |
| `keyword_audit_2026-05.md` | This document |
| `keyword_research_2026-05.md` | Volume + strategy analysis |
