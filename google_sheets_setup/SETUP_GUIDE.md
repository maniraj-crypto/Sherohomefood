# Shero Home Food — Google Sheets Hub Setup Guide

## Sheet structure

| Tab | Colour | Purpose |
|-----|--------|---------|
| **Leads** | Green | Every lead — from Google, Meta, or website forms |
| **Google_Ads** | Blue | Daily Google Ads data via Supermetrics |
| **Meta_Ads** | Pink | Daily Meta (Facebook/Instagram) Ads data via Supermetrics |
| **Dashboard** | Yellow | Auto-summary: today / this week / this month for both platforms + leads |

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet
2. Name it **"Shero Home Food Hub"**
3. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/**SHEET_ID_HERE**/edit`

---

## Step 2 — Add the Apps Script

1. In the sheet, go to **Extensions → Apps Script**
2. Delete all existing code in `Code.gs`
3. Paste the full contents of `Code.gs` from this folder
4. The line `var SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();` auto-detects your sheet — no manual change needed
5. Click **Save**

---

## Step 3 — Run Setup

1. In Apps Script, select `setupSheets` from the function dropdown
2. Click **Run**
3. Approve permissions when prompted (needs Sheets + Gmail access)
4. All 4 tabs are created instantly with correct headers and dashboard formulas

---

## Step 4 — Deploy as Web App (lead webhook)

1. In Apps Script → **Deploy → New deployment**
2. Click the gear icon → select **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → copy the **Web App URL**

> This is your lead webhook URL — use it in your website, Lovable ERP, and ad landing pages.

---

## Step 5 — Connect Supermetrics: Google Ads

1. Open the **Google_Ads** tab
2. **Extensions → Supermetrics → Launch sidebar**
3. Configure:
   - Data source: **Google Ads**
   - Account: your Shero Google Ads account
   - Date range: **Yesterday**
   - **Metrics:** Impressions, Clicks, CTR, Cost, Avg. CPC, Conversions, Cost/conv., Conv. rate
   - **Dimensions:** Date, Campaign name
   - Destination: cell **A2** of **Google_Ads** tab
4. Scheduling: **Daily at 7:00 AM**
5. Click **Get data**

---

## Step 6 — Connect Supermetrics: Meta Ads

1. Open the **Meta_Ads** tab
2. **Extensions → Supermetrics → Launch sidebar**
3. Configure:
   - Data source: **Facebook Ads** (this covers Instagram too)
   - Account: your Shero Meta Business account
   - Date range: **Yesterday**
   - **Metrics:** Impressions, Reach, Clicks (all), Link clicks, CTR (link), Amount spent, CPM, CPC (link), Results, Cost per result, Frequency
   - **Dimensions:** Date, Campaign name, Ad set name
   - Destination: cell **A2** of **Meta_Ads** tab
4. Scheduling: **Daily at 7:00 AM**
5. Click **Get data**

> Supermetrics will ask you to authorise your Meta Business account the first time. Use the same login as Meta Business Manager.

---

## Step 7 — Set up Daily Email Digest

1. In Apps Script → **Triggers** (clock icon in left sidebar)
2. **+ Add Trigger**:
   - Function: `sendDailyDigest`
   - Event source: Time-driven
   - Type: Day timer
   - Time: **8:00 AM – 9:00 AM**
3. Save — you'll receive a morning email at maniraj@shero.in like:

```
Shero Home Food — Daily Report (2025-05-21)
═══════════════════════════════════

GOOGLE ADS
  Clicks:      142
  Spend:       ₹3,420.00
  Conversions: 11
  Cost/Conv:   ₹310.91

META ADS
  Link Clicks: 87
  Spend:       ₹1,850.00
  Results:     9
  Cost/Result: ₹205.56

COMBINED
  Total Spend: ₹5,270.00

LEADS TODAY: 8 total (5 Google, 3 Meta)
```

---

## Step 8 — Connect Lovable ERP

### Send leads from Lovable to the sheet
When a lead form is submitted in Lovable, POST to the webhook:

```json
POST <your-web-app-url>
Content-Type: application/json

{
  "name": "Priya Sharma",
  "phone": "9876543210",
  "email": "priya@example.com",
  "pincode": "400001",
  "service": "Birthday Catering",
  "campaign": "Mumbai_Catering_May25",
  "platform": "Meta",
  "adGroup": "Birthday_Lookalike_AdSet"
}
```

- Set `"platform"` to `"Google"` or `"Meta"` so the Dashboard splits lead counts correctly
- Set `"adGroup"` to the Ad Group name (Google) or Ad Set name (Meta)

### Read leads in Lovable
- Use Google Sheets API with range `Leads!A:K`
- Filter by `Status = "New"` to show unprocessed leads
- Update `Status` to `"Contacted"`, `"Converted"`, or `"Lost"` as you work each lead

---

## Lead Status Workflow

| Status | Meaning |
|--------|---------|
| `New` | Just came in |
| `Contacted` | Called or messaged |
| `Converted` | Became a paying customer |
| `Lost` | Did not convert |

---

## Webhook Test

```bash
# Test a Google lead
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "phone": "9999999999",
    "email": "test@example.com",
    "pincode": "400001",
    "service": "Corporate Lunch",
    "campaign": "Brand_Search_May25",
    "platform": "Google",
    "adGroup": "Corporate_Keywords"
  }'

# Expected: {"status":"ok","row":2}

# Test a Meta lead
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meta Test",
    "phone": "8888888888",
    "email": "meta@example.com",
    "pincode": "400002",
    "service": "Wedding Catering",
    "campaign": "Wedding_Retargeting",
    "platform": "Meta",
    "adGroup": "Mumbai_Wedding_AdSet"
  }'
```
