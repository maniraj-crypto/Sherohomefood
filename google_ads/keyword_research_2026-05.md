# Shero Home Food — Google Ads Keyword Research

**Date:** 2026-05-23
**Account:** Shero Home Food (4083467754)
**Source:** Google Ads Keyword Planner (via Supermetrics MCP)
**Status:** Draft — for review before pushing to live account

## Headline takeaways

1. **India catering search is hyper-long-tail.** Almost every relevant term sits at 10–50 avg monthly searches. Don't expect Semrush-style volumes — expect breadth across many specific terms.
2. **Locality search dominates Chennai.** "Catering services anna nagar / velachery / ambattur / porur / tambaram / mylapore / thiruvanmiyur / kolathur" all return real volume. The single biggest gap in the current account is **per-locality coverage**.
3. **Competitor names show up everywhere.** Annapoorna, Balaji, Arusuvai, Ambi, Annalakshmi, Angel, etc. — these are conquest opportunities (separate ad group with low bids + branded landing message) but flagged as optional.
4. **Pure-veg framing is right.** "Pure veg catering / pure vegetarian catering" all show low-but-real intent. The non-veg negatives in `shero_negative_keywords.csv` are essential — keep them.
5. **Birthday + housewarming = strongest occasion intent.** "food for birthday party at home" (390/mo, MEDIUM comp) and "veg housewarming catering" variants are realistic conversion drivers.
6. **Office/corporate is small but premium.** "Office party food catering / delivery" has HIGH competition and CPC bids 5-10x higher — premium segment worth a separate ad group with higher TCPA.

## Gaps in current account

The live `DST - Bulk/Party` campaign has 8 ad groups (Office Party, Naming Ceremony, Birthday, Anniversary, Home Party, Baby Shower, House Warming, Home Pooja) — but **0 keywords on any ad group** (per `campaign_and_resource_get`). Either keywords were never added, or they live elsewhere. Recommend either:
   - Apply the existing `shero_new_keywords.csv` (designed for `DST - Catering - Jan9` + `DST - Bulk/Party`), AND
   - Add the new locality + occasion keywords below.

## New keyword recommendations

See `keywords_new_chennai_localities.csv` and `keywords_new_occasions.csv` for Editor-importable lists.

### Chennai locality (highest leverage)
All ~10/mo each but cumulatively meaningful, low competition:
- catering services anna nagar
- catering services velachery
- catering services porur
- catering services ambattur
- catering services tambaram
- catering services adyar (add via expansion)
- catering services mylapore
- catering services thiruvanmiyur
- catering services kolathur
- best catering services in chennai

### Occasion-specific (existing CSV is good but missing these)
- food for birthday party at home (390/mo, MEDIUM) — **highest-volume relevant term found**
- menu for birthday party at home (390/mo)
- birthday catering ideas (90/mo, MEDIUM)
- food for 50 people (140/mo, LOW)
- catering for 50 people (50/mo, MEDIUM)
- party food for 50 people (50/mo)
- veg biryani full tray price (20/mo, LOW)
- veg biryani for 30 persons price
- pure vegetarian catering near me
- best brahmin caterers in chennai
- best brahmin catering services in chennai

### Office/corporate (premium ad group)
- office party food catering (HIGH comp, ₹192-670 high CPC)
- office party food delivery (HIGH comp)
- office food platters (LOW comp)
- team lunch catering (add)
- corporate catering chennai (add)

### Competitor conquest (optional — flagged)
See `keywords_competitor_conquest.csv`. **Do not apply without explicit approval** — bidding on competitor names is allowed but reputation-sensitive.

## Negative keyword expansion

The existing `shero_negative_keywords.csv` is solid (non-veg blocking). Add these from the research signal:
- recipe / recipes (recipe-seekers, not buyers)
- ideas (research intent, not purchase intent — risky to add as full negative; consider only in Exact ad groups)
- diy
- how to make
- cake (cake-only intent, not full catering)
- decorations
- balloons
- theme (party theme intent, not catering)

See `negatives_additional.csv`.

## Ad copy recommendations

See `ad_copy_drafts.md` and `ad_copy_drafts.csv` for new RSAs (per ad group). Current ads are good but missing:
- Trust signals ("Trusted by 1000+ families")
- Pricing clarity ("Plans from ₹X / Catering from ₹X per plate")
- Geo proof ("Serving Chennai since YYYY")
- Strong, single CTA

## Next steps

1. **Review** these drafts.
2. Approve which CSVs to apply (Chennai localities? Occasions? Office? Conquest?).
3. Approve which RSAs to push (will be created as PAUSED so nothing spends until you toggle).
4. Once approved, I'll apply via `campaign_update`.
