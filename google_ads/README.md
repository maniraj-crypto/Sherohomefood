# google_ads/

Drafts for the Shero Home Food Google Ads account (4083467754). Generated 2026-05-23.

**Nothing here is live yet.** All files are review drafts.

## Files

| File | Purpose |
|------|---------|
| `keyword_research_2026-05.md` | Synthesis & strategy — read this first |
| `keywords_new_chennai_localities.csv` | New Exact/Phrase keywords by Chennai locality (Anna Nagar, Velachery, Porur, etc.) — for `DST - Catering - Jan9` |
| `keywords_new_occasions.csv` | New keywords per ad group in `DST - Bulk/Party` (Birthday, Office Party, Housewarming, etc.) |
| `keywords_competitor_conquest.csv` | Optional conquest bids on competitor names — needs explicit approval |
| `negatives_additional.csv` | Additional negatives (recipe-seekers, US theme leaks, employment intent) |
| `ad_copy_drafts.md` | Human-readable RSA drafts with placeholders explained |
| `ad_copy_drafts.csv` | Google Ads Editor-importable RSA file |

## Placeholders to fill before push

In the ad copy files:
- `{{YEARS}}` — years Shero has been operating
- `{{FAMILIES}}` — verified customer count (e.g. `5000`, `1000`)
- `{{PRICE}}` — starting INR/plate (e.g. `199`)
- `{{PHONE}}` — call extension number
- `{{LP_URL}}` — base landing page URL (e.g. `https://www.sherohomefood.com`)

## How to apply

After review, tell the assistant which CSVs to push. The assistant will use the
Google Ads MCP (`campaign_update`) to create everything as **PAUSED** in the live
account, so nothing spends until you toggle it on.

Existing CSVs at the repo root (`shero_new_keywords.csv`, `shero_negative_keywords.csv`)
look like they were prepped but never applied. Decide whether to apply those too.

## Items intentionally NOT done (per user direction)

- Landing page changes (deferred)
- Google Ads conversion tracking audit (deferred)
- Live changes to the Google Ads account (drafts only, will apply after approval)
