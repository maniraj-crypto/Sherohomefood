# google_ads/

Drafts for the Shero Home Food Google Ads account (4083467754). Generated 2026-05-23.

**All keywords now scoped to the single live campaign: `DST - Bulk/Party`.**

**Nothing here is live yet.** All files are review drafts.

## Files

| File | Purpose |
|------|---------|
| `keyword_research_2026-05.md` | Synthesis & strategy — read this first |
| **`keywords_dst_bulk_party_ALL.csv`** | **Master file — all ~125 keywords across 10 ad groups, single import** |
| `keywords_new_chennai_localities.csv` | Subset: locality keywords only (new "Chennai Localities" ad group) |
| `keywords_new_occasions.csv` | Subset: occasion keywords by existing ad group |
| `keywords_competitor_conquest.csv` | Optional conquest bids on competitor names — needs explicit approval |
| `negatives_additional.csv` | Additional campaign-level negatives |
| `ad_copy_drafts.md` | Human-readable RSA drafts with placeholders explained |
| `ad_copy_drafts.csv` | Google Ads Editor-importable RSA file |

## Ad group structure (after applying)

`DST - Bulk/Party` currently has 8 ad groups. The keywords add to existing ad groups plus **two new ad groups**:

| Ad Group | Status | Keyword theme |
|---|---|---|
| Office Party | existing | Corporate / team lunch / office event catering |
| Birthday Event | existing | Birthday party food & catering |
| Naming Ceremony | existing | Namakaranam / naming day |
| Anniversary Event | existing | Anniversary food / 50-people catering |
| Home Party | existing | Generic home party food orders |
| Baby Shower | existing | Seemantham / valaikappu / baby shower |
| House Warming | existing | Griha pravesh / housewarming |
| Home Pooja | existing | Pooja food / prasadam / sattvik |
| **Chennai Localities** | **new** | Anna Nagar, Velachery, Porur, Ambattur, Tambaram, Mylapore, etc. |
| **Veg Biryani** | **new** | Veg/paneer/mushroom biryani for party + bulk |
| **Pure Veg Catering** | **new** | Pure veg / jain / sattvik / general veg catering |

## Placeholders to fill in ad copy before push

- `{{YEARS}}` — years Shero has been operating
- `{{FAMILIES}}` — verified customer count (e.g. `5000`)
- `{{PRICE}}` — starting INR/plate (e.g. `199`)
- `{{PHONE}}` — call extension number
- `{{LP_URL}}` — base landing page URL

## How to apply

After review, tell the assistant which CSVs to push. The assistant will use the
Google Ads MCP (`campaign_update`) to add everything to `DST - Bulk/Party`.
Existing ad groups stay as-is. New ad groups will be created.

## Note on existing root-level CSVs

`shero_new_keywords.csv` and `shero_negative_keywords.csv` at repo root reference
the other campaigns (`DST - Catering - Jan9`, `DST - Leads - Subscription - Oct 10`)
which are PAUSED. They are NOT applicable since you're only running
`DST - Bulk/Party`. The keyword content in those files (Pure Veg Catering, Veg
Biryani, etc.) has been re-routed into `keywords_dst_bulk_party_ALL.csv` so
nothing useful is lost.
