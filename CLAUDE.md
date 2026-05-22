# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Marketing and lead-management tooling for **Shero Home Food**, a pure-veg catering business based in India. The repo contains:

- `google_sheets_setup/` — a Google Apps Script hub that receives leads, syncs them to a Supabase ERP, and aggregates ad performance data from Google Ads and Meta Ads.
- `shero_new_keywords.csv` — Google Ads keyword upload file (Campaign / Ad Group / Keyword / Match Type).
- `shero_negative_keywords.csv` — Negative keyword upload file (Action / Campaign / Keyword / Match Type).

There is no build system, package manager, or test runner. All logic runs inside Google Apps Script.

## Architecture

### Google Sheets Hub (`google_sheets_setup/Code.gs`)

The Apps Script file is deployed as a **Web App** (Execute as Me, Anyone can access) and acts as the central integration point:

```
Inbound lead (POST)
  └─► doPost()
        ├─► pushToERP()  →  Supabase webhook (mulhcroxptxcadkveiuu.supabase.co)
        └─► Appends row to "Leads" tab → col M = "Synced" / "Failed: …"

Manual edit to Leads tab
  └─► onLeadEdit() trigger  →  pushToERP() if col M is empty

Retry job (manual or timed trigger every 15 min)
  └─► retryFailedSyncs()  →  re-pushes any row where col M starts with "Failed"

Daily 8 AM trigger
  └─► sendDailyDigest()  →  email to maniraj@shero.in
```

**Sheet tabs and their column layout:**

| Tab | Key columns |
|-----|-------------|
| Leads | A=Timestamp, B=Name, C=Phone, D=Email, E=Pincode, F=City, G=Vertical, H=Source, I=Campaign, J=Ad Group/Ad Set, K=Status, L=Notes, M=ERP Sync |
| Google_Ads | A=Date (yyyy-mm-dd), C=Impressions, D=Clicks, F=Cost(₹), H=Conversions |
| Meta_Ads | A=Date, D=Impressions, E=Reach, G=Link Clicks, I=Spend(₹), L=Results |
| Dashboard | SUMIF/SUMPRODUCT formulas — today / this week / this month |

**Supabase ERP payload fields** (what `pushToERP` sends):
`name`, `phone`, `vertical`, `source`, `city`, `pincode`
(email, campaign, adGroup are stored in Sheets but not forwarded to ERP)

### Data ingest

Ads data (Google_Ads and Meta_Ads tabs) is populated by **Supermetrics** add-on, scheduled daily at 7 AM, writing from cell A2 downwards. Dates must be `yyyy-mm-dd` strings for Dashboard formulas to work.

Leads arrive via:
1. POST to the deployed Web App URL.
2. Manual entry directly in the Leads tab (triggers `onLeadEdit`).

### Keyword CSVs

Formatted for direct Google Ads Editor bulk upload. `shero_new_keywords.csv` adds keywords; `shero_negative_keywords.csv` adds negatives. Do not change the column headers — Ads Editor expects them verbatim.

## Deployment

### Initial setup (run once)
1. Create a Google Sheet, open **Extensions → Apps Script**, paste `Code.gs`.
2. Run `setupSheets()` — creates all tabs with headers and dashboard formulas, registers the `onLeadEdit` trigger.
3. Deploy as Web App (Execute as: Me, Access: Anyone) — copy the URL for use in landing pages and Lovable ERP.
4. Set a time-driven trigger for `sendDailyDigest` at 8 AM.
5. Optionally set a time-driven trigger for `retryFailedSyncs` every 15 minutes.

### Updating the script
Edit `Code.gs` in Apps Script, then **Deploy → Manage deployments → Edit → New version → Deploy**. The Web App URL stays the same.

### Testing the webhook
```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"9999999999","pincode":"500081","city":"Hyderabad","vertical":"party","source":"google","campaign":"Test_Campaign","adGroup":"Test_Group"}'
# Expected: {"status":"ok","row":N,"erp":"Synced"}
```

Health check: `GET YOUR_WEB_APP_URL` → `{"status":"ok","service":"Shero Home Food Lead Sheet"}`

## Key constants to update when things change

| What | Where |
|------|-------|
| Supabase ERP endpoint | `LOVABLE_WEBHOOK_URL` at top of `Code.gs` |
| Daily digest recipient | hardcoded `"maniraj@shero.in"` in `sendDailyDigest()` |
| ERP retry count / backoff | `attempts = 3`, `delay = 1000` ms in `pushToERP()` |
