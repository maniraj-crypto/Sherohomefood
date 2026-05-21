// ============================================================
// Shero Home Food — Google Sheets Hub
// Tabs: Leads | Ads_Performance | Dashboard
// Deploy as: Web App (Execute as Me, Anyone can access)
// ============================================================

var SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ── Sheet & column definitions ───────────────────────────────

var LEADS_HEADERS = [
  "Timestamp", "Name", "Phone", "Email", "Pincode",
  "Service Interested In", "Campaign Source", "Ad Group", "Status", "Notes"
];

var ADS_HEADERS = [
  "Date", "Campaign Name", "Impressions", "Clicks", "CTR (%)",
  "Cost (₹)", "CPC (₹)", "Conversions", "Cost per Conversion (₹)", "Conversion Rate (%)"
];

var DASHBOARD_HEADERS = [
  "Metric", "Today", "This Week", "This Month"
];

// ── Setup: run once to create all tabs ──────────────────────

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  createOrClearSheet(ss, "Leads",           LEADS_HEADERS,      "#E8F5E9");
  createOrClearSheet(ss, "Ads_Performance", ADS_HEADERS,        "#E3F2FD");
  createOrClearSheet(ss, "Dashboard",       DASHBOARD_HEADERS,  "#FFF8E1");

  buildDashboardFormulas(ss);

  SpreadsheetApp.flush();
  Logger.log("Setup complete. Share this sheet URL with Supermetrics and your team.");
}

function createOrClearSheet(ss, name, headers, color) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  } else {
    sheet.clearContents();
  }

  // Header row styling
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground(color);
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  return sheet;
}

// ── Dashboard summary formulas ───────────────────────────────

function buildDashboardFormulas(ss) {
  var dash = ss.getSheetByName("Dashboard");
  dash.clearContents();

  var headerRange = dash.getRange(1, 1, 1, 4);
  headerRange.setValues([DASHBOARD_HEADERS]);
  headerRange.setBackground("#FFF8E1");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  dash.setFrozenRows(1);

  // Labels + formulas referencing Ads_Performance
  var rows = [
    ["Impressions",
      '=SUMIF(Ads_Performance!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Ads_Performance!C:C)',
      '=SUMIF(Ads_Performance!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Ads_Performance!C:C)',
      '=SUMPRODUCT((MONTH(DATEVALUE(Ads_Performance!A2:A1000))=MONTH(TODAY()))*(YEAR(DATEVALUE(Ads_Performance!A2:A1000))=YEAR(TODAY()))*Ads_Performance!C2:C1000)'
    ],
    ["Clicks",
      '=SUMIF(Ads_Performance!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Ads_Performance!D:D)',
      '=SUMIF(Ads_Performance!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Ads_Performance!D:D)',
      '=SUMPRODUCT((MONTH(DATEVALUE(Ads_Performance!A2:A1000))=MONTH(TODAY()))*(YEAR(DATEVALUE(Ads_Performance!A2:A1000))=YEAR(TODAY()))*Ads_Performance!D2:D1000)'
    ],
    ["Cost (₹)",
      '=SUMIF(Ads_Performance!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Ads_Performance!F:F)',
      '=SUMIF(Ads_Performance!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Ads_Performance!F:F)',
      '=SUMPRODUCT((MONTH(DATEVALUE(Ads_Performance!A2:A1000))=MONTH(TODAY()))*(YEAR(DATEVALUE(Ads_Performance!A2:A1000))=YEAR(TODAY()))*Ads_Performance!F2:F1000)'
    ],
    ["Conversions",
      '=SUMIF(Ads_Performance!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Ads_Performance!H:H)',
      '=SUMIF(Ads_Performance!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Ads_Performance!H:H)',
      '=SUMPRODUCT((MONTH(DATEVALUE(Ads_Performance!A2:A1000))=MONTH(TODAY()))*(YEAR(DATEVALUE(Ads_Performance!A2:A1000))=YEAR(TODAY()))*Ads_Performance!H2:H1000)'
    ],
    ["Total Leads",
      '=COUNTIF(Leads!A:A,">="&TODAY())',
      '=COUNTIF(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1))',
      '=SUMPRODUCT((MONTH(Leads!A2:A1000)=MONTH(TODAY()))*(YEAR(Leads!A2:A1000)=YEAR(TODAY())))'
    ],
    ["Cost per Lead (₹)",
      '=IFERROR(SUMIF(Ads_Performance!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Ads_Performance!F:F)/COUNTIF(Leads!A:A,">="&TODAY()),"N/A")',
      '"N/A"',
      '"N/A"'
    ],
  ];

  dash.getRange(2, 1, rows.length, 4).setValues(rows);
  dash.autoResizeColumns(1, 4);
}

// ── Webhook: POST endpoint to receive leads ──────────────────
//
// Payload (JSON):
// {
//   "name":     "Ravi Kumar",
//   "phone":    "9876543210",
//   "email":    "ravi@example.com",
//   "pincode":  "400001",
//   "service":  "Wedding Catering",
//   "campaign": "Brand_Mumbai_Apr25",
//   "adGroup":  "Catering_Keyword_Match"   // optional
// }
//
// Returns: { "status": "ok", "row": <row number> }

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName("Leads");

    var row = [
      new Date(),                          // Timestamp
      data.name     || "",
      data.phone    || "",
      data.email    || "",
      data.pincode  || "",
      data.service  || "",
      data.campaign || "",
      data.adGroup  || "",
      "New",                               // Default status
      ""                                   // Notes (blank)
    ];

    sheet.appendRow(row);
    var lastRow = sheet.getLastRow();

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET: health check ────────────────────────────────────────

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", service: "Shero Home Food Lead Sheet" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Optional: daily email digest ────────────────────────────
// Set a time-based trigger on this function (6 AM daily)

function sendDailyDigest() {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var ads  = ss.getSheetByName("Ads_Performance");
  var leads = ss.getSheetByName("Leads");

  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

  // Count today's leads
  var leadData = leads.getDataRange().getValues();
  var todayLeads = leadData.slice(1).filter(function(r) {
    return r[0] && Utilities.formatDate(new Date(r[0]), Session.getScriptTimeZone(), "yyyy-MM-dd") === today;
  });

  // Find today's ads row
  var adsData = ads.getDataRange().getValues();
  var todayAds = adsData.filter(function(r) { return r[0] === today; });

  var body = "📊 Shero Home Food — Daily Report (" + today + ")\n\n";

  if (todayAds.length > 0) {
    var totalClicks = todayAds.reduce(function(s, r) { return s + (r[3] || 0); }, 0);
    var totalCost   = todayAds.reduce(function(s, r) { return s + (r[5] || 0); }, 0);
    var totalConv   = todayAds.reduce(function(s, r) { return s + (r[7] || 0); }, 0);
    body += "Google Ads:\n";
    body += "  Clicks: " + totalClicks + "\n";
    body += "  Spend: ₹" + totalCost.toFixed(2) + "\n";
    body += "  Conversions: " + totalConv + "\n\n";
  } else {
    body += "Google Ads: No data yet for today (Supermetrics may not have refreshed)\n\n";
  }

  body += "Leads Today: " + todayLeads.length + "\n";
  if (todayLeads.length > 0) {
    body += "\nNew Leads:\n";
    todayLeads.forEach(function(r) {
      body += "  • " + r[1] + " | " + r[2] + " | " + r[6] + "\n";
    });
  }

  MailApp.sendEmail("maniraj@shero.in", "Shero Ads + Leads — " + today, body);
}
