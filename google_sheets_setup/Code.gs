// ============================================================
// Shero Home Food — Google Sheets Hub
// Tabs: Leads | Google_Ads | Meta_Ads | Dashboard
// Deploy as: Web App (Execute as Me, Anyone can access)
// ============================================================

var SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ── Sheet & column definitions ───────────────────────────────

var LEADS_HEADERS = [
  "Timestamp", "Name", "Phone", "Email", "Pincode",
  "Service Interested In", "Campaign Source", "Platform", "Ad Group / Ad Set", "Status", "Notes"
];

var GOOGLE_ADS_HEADERS = [
  "Date", "Campaign Name", "Impressions", "Clicks", "CTR (%)",
  "Cost (₹)", "CPC (₹)", "Conversions", "Cost per Conversion (₹)", "Conversion Rate (%)"
];

var META_ADS_HEADERS = [
  "Date", "Campaign Name", "Ad Set Name", "Impressions", "Reach",
  "Clicks (All)", "Link Clicks", "CTR (Link) (%)", "Spend (₹)", "CPM (₹)",
  "CPC (₹)", "Results", "Cost per Result (₹)", "Frequency"
];

var DASHBOARD_HEADERS = [
  "Metric", "Today", "This Week", "This Month"
];

// ── Setup: run once to create all tabs ──────────────────────

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  createOrClearSheet(ss, "Leads",       LEADS_HEADERS,       "#E8F5E9");
  createOrClearSheet(ss, "Google_Ads",  GOOGLE_ADS_HEADERS,  "#E3F2FD");
  createOrClearSheet(ss, "Meta_Ads",    META_ADS_HEADERS,    "#FCE4EC");
  createOrClearSheet(ss, "Dashboard",   DASHBOARD_HEADERS,   "#FFF8E1");

  buildDashboardFormulas(ss);

  SpreadsheetApp.flush();
  Logger.log("Setup complete.");
}

function createOrClearSheet(ss, name, headers, color) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  } else {
    sheet.clearContents();
  }

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
// Columns: A=Metric | B=Today | C=This Week | D=This Month

function buildDashboardFormulas(ss) {
  var dash = ss.getSheetByName("Dashboard");
  dash.clearContents();

  // Section headers
  var sections = [
    { row: 1,  label: "── GOOGLE ADS ──",  color: "#E3F2FD" },
    { row: 7,  label: "── META ADS ──",    color: "#FCE4EC" },
    { row: 14, label: "── COMBINED ──",    color: "#F3E5F5" },
    { row: 18, label: "── LEADS ──",       color: "#E8F5E9" },
  ];

  // Google Ads rows (start row 2)
  var googleRows = [
    ["G: Impressions",
      '=SUMIF(Google_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Google_Ads!C:C)',
      '=SUMIF(Google_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Google_Ads!C:C)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=YEAR(TODAY()))*Google_Ads!C2:C2000)'
    ],
    ["G: Clicks",
      '=SUMIF(Google_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Google_Ads!D:D)',
      '=SUMIF(Google_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Google_Ads!D:D)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=YEAR(TODAY()))*Google_Ads!D2:D2000)'
    ],
    ["G: Spend (₹)",
      '=SUMIF(Google_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Google_Ads!F:F)',
      '=SUMIF(Google_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Google_Ads!F:F)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=YEAR(TODAY()))*Google_Ads!F2:F2000)'
    ],
    ["G: Conversions",
      '=SUMIF(Google_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Google_Ads!H:H)',
      '=SUMIF(Google_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Google_Ads!H:H)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Google_Ads!A2:A2000),0))=YEAR(TODAY()))*Google_Ads!H2:H2000)'
    ],
    ["G: Cost/Conv (₹)",
      '=IFERROR(SUMIF(Google_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Google_Ads!F:F)/SUMIF(Google_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Google_Ads!H:H),"N/A")',
      '"N/A"',
      '"N/A"'
    ],
  ];

  // Meta Ads rows (start row 8)
  var metaRows = [
    ["M: Impressions",
      '=SUMIF(Meta_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Meta_Ads!D:D)',
      '=SUMIF(Meta_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Meta_Ads!D:D)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=YEAR(TODAY()))*Meta_Ads!D2:D2000)'
    ],
    ["M: Reach",
      '=SUMIF(Meta_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Meta_Ads!E:E)',
      '=SUMIF(Meta_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Meta_Ads!E:E)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=YEAR(TODAY()))*Meta_Ads!E2:E2000)'
    ],
    ["M: Link Clicks",
      '=SUMIF(Meta_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Meta_Ads!G:G)',
      '=SUMIF(Meta_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Meta_Ads!G:G)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=YEAR(TODAY()))*Meta_Ads!G2:G2000)'
    ],
    ["M: Spend (₹)",
      '=SUMIF(Meta_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Meta_Ads!I:I)',
      '=SUMIF(Meta_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Meta_Ads!I:I)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=YEAR(TODAY()))*Meta_Ads!I2:I2000)'
    ],
    ["M: Results",
      '=SUMIF(Meta_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Meta_Ads!L:L)',
      '=SUMIF(Meta_Ads!A:A,">="&TEXT(TODAY()-WEEKDAY(TODAY(),2)+1,"yyyy-mm-dd"),Meta_Ads!L:L)',
      '=SUMPRODUCT((MONTH(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=MONTH(TODAY()))*(YEAR(IFERROR(DATEVALUE(Meta_Ads!A2:A2000),0))=YEAR(TODAY()))*Meta_Ads!L2:L2000)'
    ],
    ["M: Cost/Result (₹)",
      '=IFERROR(SUMIF(Meta_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Meta_Ads!I:I)/SUMIF(Meta_Ads!A:A,TEXT(TODAY(),"yyyy-mm-dd"),Meta_Ads!L:L),"N/A")',
      '"N/A"',
      '"N/A"'
    ],
  ];

  // Combined rows (start row 15)
  var combinedRows = [
    ["Total Spend (₹)",
      '=IFERROR(B3,0)+IFERROR(B11,0)',
      '=IFERROR(C3,0)+IFERROR(C11,0)',
      '=IFERROR(D3,0)+IFERROR(D11,0)'
    ],
    ["Total Conversions / Results",
      '=IFERROR(B5,0)+IFERROR(B12,0)',
      '=IFERROR(C5,0)+IFERROR(C12,0)',
      '=IFERROR(D5,0)+IFERROR(D12,0)'
    ],
    ["Blended Cost/Lead (₹)",
      '=IFERROR((IFERROR(B3,0)+IFERROR(B11,0))/B21,"N/A")',
      '"N/A"',
      '"N/A"'
    ],
  ];

  // Leads rows (start row 19)
  var leadsRows = [
    ["Leads Today",
      '=COUNTIF(Leads!A:A,">="&TODAY())',
      '=COUNTIF(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1))',
      '=SUMPRODUCT((MONTH(Leads!A2:A2000)=MONTH(TODAY()))*(YEAR(Leads!A2:A2000)=YEAR(TODAY())))'
    ],
    ["From Google Ads",
      '=COUNTIFS(Leads!A:A,">="&TODAY(),Leads!H:H,"Google")',
      '=COUNTIFS(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1),Leads!H:H,"Google")',
      '=SUMPRODUCT((MONTH(Leads!A2:A2000)=MONTH(TODAY()))*(YEAR(Leads!A2:A2000)=YEAR(TODAY()))*(Leads!H2:H2000="Google"))'
    ],
    ["From Meta",
      '=COUNTIFS(Leads!A:A,">="&TODAY(),Leads!H:H,"Meta")',
      '=COUNTIFS(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1),Leads!H:H,"Meta")',
      '=SUMPRODUCT((MONTH(Leads!A2:A2000)=MONTH(TODAY()))*(YEAR(Leads!A2:A2000)=YEAR(TODAY()))*(Leads!H2:H2000="Meta"))'
    ],
  ];

  // Write section headers
  var sectionLabelStyle = function(sheet, row, label, color) {
    var r = sheet.getRange(row, 1, 1, 4);
    r.merge();
    r.setValue(label);
    r.setBackground(color);
    r.setFontWeight("bold");
    r.setFontSize(10);
  };

  // Header row
  var hdr = dash.getRange(1, 1, 1, 4);
  hdr.setValues([DASHBOARD_HEADERS]);
  hdr.setBackground("#FFF8E1");
  hdr.setFontWeight("bold");
  hdr.setFontSize(11);
  dash.setFrozenRows(1);

  sectionLabelStyle(dash, 2,  "── GOOGLE ADS ──",  "#E3F2FD");
  dash.getRange(3, 1, googleRows.length, 4).setValues(googleRows);

  sectionLabelStyle(dash, 8,  "── META ADS ──",    "#FCE4EC");
  dash.getRange(9, 1, metaRows.length, 4).setValues(metaRows);

  sectionLabelStyle(dash, 15, "── COMBINED ──",    "#F3E5F5");
  dash.getRange(16, 1, combinedRows.length, 4).setValues(combinedRows);

  sectionLabelStyle(dash, 19, "── LEADS ──",       "#E8F5E9");
  dash.getRange(20, 1, leadsRows.length, 4).setValues(leadsRows);

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
//   "platform": "Google",              // "Google" or "Meta"
//   "adGroup":  "Catering_Keywords"    // Ad Group (Google) or Ad Set (Meta)
// }

function doPost(e) {
  try {
    var data  = JSON.parse(e.postData.contents);
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName("Leads");

    var row = [
      new Date(),
      data.name     || "",
      data.phone    || "",
      data.email    || "",
      data.pincode  || "",
      data.service  || "",
      data.campaign || "",
      data.platform || "",   // "Google" or "Meta"
      data.adGroup  || "",
      "New",
      ""
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", row: sheet.getLastRow() }))
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

// ── Daily email digest ───────────────────────────────────────
// Set a time-based trigger on this function (8 AM daily)

function sendDailyDigest() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var gAds  = ss.getSheetByName("Google_Ads");
  var mAds  = ss.getSheetByName("Meta_Ads");
  var leads = ss.getSheetByName("Leads");
  var tz    = Session.getScriptTimeZone();
  var today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

  // ── Google Ads ──
  var gData    = gAds.getDataRange().getValues().slice(1);
  var gToday   = gData.filter(function(r) { return r[0] === today; });
  var gClicks  = gToday.reduce(function(s, r) { return s + (r[3] || 0); }, 0);
  var gCost    = gToday.reduce(function(s, r) { return s + (r[5] || 0); }, 0);
  var gConv    = gToday.reduce(function(s, r) { return s + (r[7] || 0); }, 0);

  // ── Meta Ads ──
  var mData    = mAds.getDataRange().getValues().slice(1);
  var mToday   = mData.filter(function(r) { return r[0] === today; });
  var mClicks  = mToday.reduce(function(s, r) { return s + (r[6] || 0); }, 0);  // Link Clicks col G
  var mCost    = mToday.reduce(function(s, r) { return s + (r[8] || 0); }, 0);  // Spend col I
  var mResults = mToday.reduce(function(s, r) { return s + (r[11] || 0); }, 0); // Results col L

  // ── Leads ──
  var leadData   = leads.getDataRange().getValues().slice(1);
  var todayLeads = leadData.filter(function(r) {
    return r[0] && Utilities.formatDate(new Date(r[0]), tz, "yyyy-MM-dd") === today;
  });
  var gLeads = todayLeads.filter(function(r) { return r[7] === "Google"; });
  var mLeads = todayLeads.filter(function(r) { return r[7] === "Meta"; });

  // ── Build email ──
  var body = "Shero Home Food — Daily Report (" + today + ")\n";
  body += "═══════════════════════════════════\n\n";

  body += "GOOGLE ADS\n";
  body += "  Clicks:      " + gClicks + "\n";
  body += "  Spend:       ₹" + gCost.toFixed(2) + "\n";
  body += "  Conversions: " + gConv + "\n";
  body += "  Cost/Conv:   ₹" + (gConv > 0 ? (gCost / gConv).toFixed(2) : "N/A") + "\n\n";

  body += "META ADS\n";
  body += "  Link Clicks: " + mClicks + "\n";
  body += "  Spend:       ₹" + mCost.toFixed(2) + "\n";
  body += "  Results:     " + mResults + "\n";
  body += "  Cost/Result: ₹" + (mResults > 0 ? (mCost / mResults).toFixed(2) : "N/A") + "\n\n";

  body += "COMBINED\n";
  body += "  Total Spend: ₹" + (gCost + mCost).toFixed(2) + "\n\n";

  body += "LEADS TODAY: " + todayLeads.length + " total";
  body += " (" + gLeads.length + " Google, " + mLeads.length + " Meta)\n";

  if (todayLeads.length > 0) {
    body += "\nNew Leads:\n";
    todayLeads.forEach(function(r) {
      body += "  • " + r[1] + " | " + r[2] + " | " + r[6] + " [" + (r[7] || "?") + "]\n";
    });
  }

  MailApp.sendEmail("maniraj@shero.in", "Shero Daily Report — " + today, body);
}
