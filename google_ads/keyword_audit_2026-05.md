# Existing Keyword Audit — DST - Bulk/Party

**Date:** 2026-05-23
**Campaign:** `DST - Bulk/Party` (id 23276220898, ENABLED, ₹3000/day)

## The big picture

| Metric | Count |
|---|---:|
| Total existing keywords | **704** |
| ...spread across | 8 ad groups |
| Unique keyword texts | 376 |
| Keywords appearing in 1 ad group | 199 |
| Keywords appearing in 3 ad groups | 117 (= 351 dup rows) |
| Keywords appearing in 5 ad groups | 30 (= 150 dup rows) |
| Negative keywords | 1,288 (non-veg blocking, good) |

**Existing keywords per ad group:**

| Ad Group | Existing keywords |
|---|---:|
| Anniversary Event | 198 |
| Birthday Event | 167 |
| Home Party | 158 |
| Office Party | 69 |
| Naming Ceremony | 66 |
| Baby Shower | 18 |
| House Warming | 15 |
| Home Pooja | 13 |

## Findings

### 1. Massive cross-ad-group duplication
**30 keywords are added to all 5 of Anniversary / Birthday / Home Party / Naming Ceremony / Office Party.** Examples (each in 5 ad groups):
- `catering for 50 people`
- `catering for 20/25/30/40 people`
- `food for 20/30/50 guests`
- `small wedding catering`
- `home party catering`
- `intimate dinner catering`
- `mini catering service`
- `office catering service` (in Anniversary, Birthday, Home Party, Naming Ceremony AND Office Party)

**Why this is bad:** Google picks one ad group per auction, so the other 4 just create reporting noise and dilute Quality Score history. Best practice: each keyword lives in exactly ONE ad group.

### 2. Ad-group-name keywords are too broad
Five keywords match the ad group name literally as Exact/Phrase. These capture research intent ("what is a baby shower", "how to do home pooja") not buyers.

| Ad Group | Keyword | Match | Why remove |
|---|---|---|---|
| Office Party | `Office Party` | EXACT | Generic 2-word term, low intent |
| Home Pooja | `Home Pooja` | EXACT | Captures religious research |
| House Warming | `House Warming` | EXACT | Captures Pinterest-style intent |
| Naming Ceremony | `Naming Ceremony` | EXACT | Captures research, not orders |
| Baby Shower | `Baby Shower` | PHRASE | Way too broad |
| Home Party | `home party` | EXACT | Generic 2-word — party hosts, not buyers |

### 3. Misdirected keywords
| Ad Group | Keyword | Why misdirected |
|---|---|---|
| Naming Ceremony | `birthday catering` (Phrase) | Birthday term in Naming ad group |
| Naming Ceremony | `party catering` (Phrase) | Generic, will trigger any party intent |
| Naming Ceremony | `party platters` (Phrase) | Snacks/platters not core to sacred naming ceremony |

### 4. City targeting bleed
**286 keyword instances target Hyderabad or Bangalore** (e.g. `wedding catering Hyderabad`, `best caterers in Bangalore`, `corporate catering Bangalore`). These exist in multiple ad groups too.

**Question for you:** Does Shero serve Hyderabad / Bangalore, or is the operation Chennai-only?
- If Chennai-only → remove all 286 city-bleed rows.
- If multi-city → split into 3 sub-campaigns or use location targeting properly (don't bake city names into keywords).

### 5. Unresolved duplicates needing your call
**355 instances are duplicated across Anniversary / Birthday / Home Party** with no obvious "winning" ad group (mostly wedding-related terms — Shero's `DST - Bulk/Party` campaign doesn't have a Wedding ad group). Examples:
- `wedding catering`, `wedding catering services`, `wedding reception catering`
- `marriage function catering`
- `engagement catering`

**Question for you:** Do you want a separate "Wedding" ad group, or should these terms all consolidate into Anniversary Event (closest existing fit)?

## Recommended removals — autoclassified (129 rows)

Saved to `keywords_to_remove.csv`. Distribution:

| Ad Group | Removals |
|---|---:|
| Naming Ceremony | 34 |
| Office Party | 31 |
| Birthday Event | 29 |
| Anniversary Event | 19 |
| Home Party | 13 |
| Home Pooja | 1 |
| House Warming | 1 |
| Baby Shower | 1 |

Removal categories:
- 123 cross-ad-group duplicates (kept one canonical instance per keyword)
- 3 misdirected keywords in Naming Ceremony
- 6 ad-group-name keywords (too broad)

## Items pending your decision (641 rows)

Saved to `keywords_to_review.csv`. Two questions resolve all of it:

1. **Service cities?** Chennai only, or Chennai + Hyderabad + Bangalore? (drives 286 rows)
2. **Wedding terms?** Where should they live? (drives 355 rows)

## Files

| File | Purpose |
|---|---|
| `keywords_existing_inventory.csv` | Full 704-row export of what's currently in the campaign |
| `keywords_to_remove.csv` | 129 definitive removals (no decision needed) |
| `keywords_to_review.csv` | 641 rows pending your two answers above |
| `keyword_audit_2026-05.md` | This document |

## What about the proposed new keywords?

Of the 128 new keywords I proposed in `keywords_dst_bulk_party_ALL.csv`, **12 already exist** in the campaign — they'll be silently skipped on push. **116 are truly new** additions. List of overlaps (already exist):

- catering for 50 people
- food for anniversary party
- food for birthday party
- food for naming ceremony
- griha pravesh catering
- home party catering
- homemade food for birthday party
- housewarming catering chennai
- naming ceremony catering
- party food order near me
- small party caterers in chennai
- team lunch catering

## Bonus finding — campaign settings

While inspecting the campaign:

- **Display network is ON** for this SEARCH campaign (`network_settings.display: true`). This is almost always a bad setting for catering — display traffic is cheap but converts poorly. **Recommend turning off** for ~30% spend efficiency improvement.
- Ad schedule is 7am–10pm all 7 days — that's fine.
- Lead form, sitelinks, callouts, calls (8609666666), images extensions all healthy.
