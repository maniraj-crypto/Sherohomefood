# Shero Home Food — Google Sheets Hub Setup Guide

## What this sets up

| Tab | Purpose |
|-----|---------|
| **Leads** | Every lead lands here (name, phone, email, pincode, service, campaign) |
| **Ads_Performance** | Daily Google Ads data pulled by Supermetrics |
| **Dashboard** | Auto-calculated summary: today / this week / this month |

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
4. Replace the `SHEET_ID` line at the top with your actual Sheet ID:
   ```js
   var SHEET_ID = "your-sheet-id-here";
   ```
5. Click **Save** (floppy disk icon)

---

## Step 3 — Run Setup

1. In Apps Script, select the function `setupSheets` from the dropdown
2. Click **Run**
3. Approve permissions when prompted (it needs access to your Google Sheet and Gmail)
4. This creates all 3 tabs with headers and dashboard formulas

---

## Step 4 — Deploy as Web App (for lead webhook)

1. In Apps Script, click **Deploy → New deployment**
2. Click the gear icon next to "Type" → select **Web app**
3. Settings:
   - Description: `Shero Lead Webhook`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → copy the **Web App URL** — this is your lead endpoint

> Save this URL — you'll use it in your website forms and Lovable ERP

---

## Step 5 — Connect Supermetrics

1. Open the **Ads_Performance** tab in your sheet
2. Go to **Extensions → Supermetrics → Launch sidebar**
3. Configure the query:
   - **Data source:** Google Ads
   - **Accounts:** Select your Shero account
   - **Date range:** Yesterday (for daily refresh)
   - **Metrics:** Impressions, Clicks, CTR, Cost, Avg. CPC, Conversions, Cost/conv., Conv. rate
   - **Dimensions:** Date, Campaign name
   - **Destination:** Cell `A2` of **Ads_Performance** tab
4. Under **Scheduling**, enable **Refresh automatically** → set to **Daily at 7:00 AM**
5. Click **Get data**

---

## Step 6 — Set up Daily Email Digest (optional)

1. In Apps Script, go to **Triggers** (clock icon in left sidebar)
2. Click **+ Add Trigger**
3. Settings:
   - Function: `sendDailyDigest`
   - Event source: Time-driven
   - Type: Day timer
   - Time: 8:00 AM – 9:00 AM
4. Save — you'll get a daily email at maniraj@shero.in every morning

---

## Step 7 — Connect Lovable ERP

### Option A: Send leads to the sheet via webhook
In your Lovable app, make a POST request to the Web App URL when a lead form is submitted:

```json
POST <your-web-app-url>
Content-Type: application/json

{
  "name": "Customer Name",
  "phone": "9876543210",
  "email": "customer@example.com",
  "pincode": "400001",
  "service": "Wedding Catering",
  "campaign": "Brand_Mumbai",
  "adGroup": "Catering_Keywords"
}
```

### Option B: Read the sheet from Lovable
Use Google Sheets API in Lovable to read the **Leads** tab:
- Enable Google Sheets API in your Google Cloud project
- Use the Sheet ID and range `Leads!A:J` to fetch all leads
- Filter by `Status = "New"` to show unprocessed leads

---

## Lead Status Workflow

Update the **Status** column in the Leads tab to track progress:

| Status | Meaning |
|--------|---------|
| `New` | Just came in, not contacted |
| `Contacted` | Called/emailed the lead |
| `Converted` | Became a customer |
| `Lost` | Did not convert |

---

## Webhook Test (after deployment)

```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "phone": "9999999999",
    "email": "test@example.com",
    "pincode": "400001",
    "service": "Corporate Lunch",
    "campaign": "Test_Campaign"
  }'
```

Expected response: `{"status":"ok","row":2}`
