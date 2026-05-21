// ============================================================
// Shero Home Food — Google Sheets Hub
// Tabs: Leads | Google_Ads | Meta_Ads | Dashboard
// Deploy as: Web App (Execute as Me, Anyone can access)
// ============================================================

var SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ── CONFIG: paste your Lovable ERP webhook URL here ──────────
var LOVABLE_WEBHOOK_URL = "https://your-lovable-erp-webhook-url.com/leads";

// Col index of "ERP Sync" in Leads sheet (0-based, col L = index 11)
var ERP_SYNC_COL = 12; // 1-based column number for setValues

// ── Sheet & column definitions ───────────────────────────────

var LEADS_HEADERS = [
  "Timestamp", "Name", "Phone", "Email", "Pincode",
  "Service Interested In", "Campaign Source", "Platform", "Ad Group / Ad Set",
  "Status", "Notes", "ERP Sync"
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
  setupOnEditTrigger();

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

// ── Push a lead object to Lovable ERP ───────────────────────
// Returns "Synced" on success, "Failed: <reason>" on error.

function pushToERP(lead) {
  if (!LOVABLE_WEBHOOK_URL || LOVABLE_WEBHOOK_URL.indexOf("your-lovable") !== -1) {
    return "No ERP URL";
  }

  var attempts = 3;
  var delay    = 1000; // ms

  for (var i = 0; i < attempts; i++) {
    try {
      var response = UrlFetchApp.fetch(LOVABLE_WEBHOOK_URL, {
        method:             "post",
        contentType:        "application/json",
        payload:            JSON.stringify(lead),
        muteHttpExceptions: true
      });

      var code = response.getResponseCode();
      if (code >= 200 && code < 300) {
        return "Synced";
      }

      // Retryable server errors
      if (code >= 500 && i < attempts - 1) {
        Utilities.sleep(delay);
        delay *= 2;
        continue;
      }

      return "Failed: HTTP " + code;

    } catch (err) {
      if (i < attempts - 1) {
        Utilities.sleep(delay);
        delay *= 2;
      } else {
        return "Failed: " + err.message;
      }
    }
  }

  return "Failed: max retries";
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
//   "adGroup":  "Catering_Keywords"
// }
//
// Response: { "status": "ok", "row": N, "erp": "Synced" | "Failed: ..." }

function doPost(e) {
  try {
    var data  = JSON.parse(e.postData.contents);
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName("Leads");

    var lead = {
      timestamp: new Date().toISOString(),
      name:      data.name     || "",
      phone:     data.phone    || "",
      email:     data.email    || "",
      pincode:   data.pincode  || "",
      service:   data.service  || "",
      campaign:  data.campaign || "",
      platform:  data.platform || "",
      adGroup:   data.adGroup  || "",
      status:    "New"
    };

    // Push to ERP first (inline, same request)
    var erpStatus = pushToERP(lead);

    var row = [
      new Date(),
      lead.name,
      lead.phone,
      lead.email,
      lead.pincode,
      lead.service,
      lead.campaign,
      lead.platform,
      lead.adGroup,
      lead.status,
      "",          // Notes
      erpStatus    // ERP Sync
    ];

    sheet.appendRow(row);

    // Colour-code the ERP Sync cell
    var lastRow   = sheet.getLastRow();
    var syncCell  = sheet.getRange(lastRow, 12);
    syncCell.setBackground(erpStatus === "Synced" ? "#C8E6C9" : "#FFCDD2");

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", row: lastRow, erp: erpStatus }))
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

// ── onEdit trigger: sync manually added rows to ERP ─────────
// Fires when someone types a lead directly into the sheet.
// Detects a new row in Leads where ERP Sync is blank.

function onLeadEdit(e) {
  var sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Leads") return;

  var row = e.range.getRow();
  if (row < 2) return; // skip header

  var syncCell = sheet.getRange(row, 12);
  if (syncCell.getValue() !== "") return; // already synced

  // Read the full row
  var values = sheet.getRange(row, 1, 1, 11).getValues()[0];
  if (!values[0]) return; // empty row

  var lead = {
    timestamp: values[0] ? new Date(values[0]).toISOString() : new Date().toISOString(),
    name:      values[1] || "",
    phone:     values[2] || "",
    email:     values[3] || "",
    pincode:   values[4] || "",
    service:   values[5] || "",
    campaign:  values[6] || "",
    platform:  values[7] || "",
    adGroup:   values[8] || "",
    status:    values[9] || "New"
  };

  var erpStatus = pushToERP(lead);
  syncCell.setValue(erpStatus);
  syncCell.setBackground(erpStatus === "Synced" ? "#C8E6C9" : "#FFCDD2");
}

// ── Register the onEdit trigger (run once from setupSheets) ──

function setupOnEditTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Remove existing to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === "onLeadEdit") {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger("onLeadEdit")
    .forSpreadsheet(ss)
    .onEdit()
    .create();
}

// ── Retry failed ERP syncs ───────────────────────────────────
// Run manually or set a trigger every 15 minutes.

function retryFailedSyncs() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Leads");
  var data  = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var syncStatus = data[i][11];
    if (typeof syncStatus === "string" && syncStatus.indexOf("Failed") === 0) {

      var lead = {
        timestamp: data[i][0] ? new Date(data[i][0]).toISOString() : "",
        name:      data[i][1] || "",
        phone:     data[i][2] || "",
        email:     data[i][3] || "",
        pincode:   data[i][4] || "",
        service:   data[i][5] || "",
        campaign:  data[i][6] || "",
        platform:  data[i][7] || "",
        adGroup:   data[i][8] || "",
        status:    data[i][9] || "New"
      };

      var result   = pushToERP(lead);
      var syncCell = sheet.getRange(i + 1, 12);
      syncCell.setValue(result);
      syncCell.setBackground(result === "Synced" ? "#C8E6C9" : "#FFCDD2");
    }
  }
}

// ── Dashboard summary formulas ───────────────────────────────

function buildDashboardFormulas(ss) {
  var dash = ss.getSheetByName("Dashboard");
  dash.clearContents();

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
      '"N/A"', '"N/A"'
    ],
  ];

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
      '"N/A"', '"N/A"'
    ],
  ];

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
      '"N/A"', '"N/A"'
    ],
  ];

  var leadsRows = [
    ["Leads Today",
      '=COUNTIF(Leads!A:A,">="&TODAY())',
      '=COUNTIF(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1))',
      '=SUMPRODUCT((MONTH(Leads!A2:A2000)=MONTH(TODAY()))*(YEAR(Leads!A2:A2000)=YEAR(TODAY())))'
    ],
    ["From Google",
      '=COUNTIFS(Leads!A:A,">="&TODAY(),Leads!H:H,"Google")',
      '=COUNTIFS(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1),Leads!H:H,"Google")',
      '=SUMPRODUCT((MONTH(Leads!A2:A2000)=MONTH(TODAY()))*(YEAR(Leads!A2:A2000)=YEAR(TODAY()))*(Leads!H2:H2000="Google"))'
    ],
    ["From Meta",
      '=COUNTIFS(Leads!A:A,">="&TODAY(),Leads!H:H,"Meta")',
      '=COUNTIFS(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1),Leads!H:H,"Meta")',
      '=SUMPRODUCT((MONTH(Leads!A2:A2000)=MONTH(TODAY()))*(YEAR(Leads!A2:A2000)=YEAR(TODAY()))*(Leads!H2:H2000="Meta"))'
    ],
    ["ERP Sync Failures",
      '=COUNTIFS(Leads!A:A,">="&TODAY(),Leads!L:L,"Failed*")',
      '=COUNTIFS(Leads!A:A,">="&(TODAY()-WEEKDAY(TODAY(),2)+1),Leads!L:L,"Failed*")',
      '=SUMPRODUCT((MONTH(Leads!A2:A2000)=MONTH(TODAY()))*(YEAR(Leads!A2:A2000)=YEAR(TODAY()))*(LEFT(Leads!L2:L2000,6)="Failed"))'
    ],
  ];

  var sectionLabel = function(row, label, color) {
    var r = dash.getRange(row, 1, 1, 4);
    r.merge();
    r.setValue(label);
    r.setBackground(color);
    r.setFontWeight("bold");
    r.setFontSize(10);
  };

  var hdr = dash.getRange(1, 1, 1, 4);
  hdr.setValues([DASHBOARD_HEADERS]);
  hdr.setBackground("#FFF8E1");
  hdr.setFontWeight("bold");
  hdr.setFontSize(11);
  dash.setFrozenRows(1);

  sectionLabel(2,  "── GOOGLE ADS ──",  "#E3F2FD");
  dash.getRange(3,  1, googleRows.length,   4).setValues(googleRows);

  sectionLabel(8,  "── META ADS ──",    "#FCE4EC");
  dash.getRange(9,  1, metaRows.length,    4).setValues(metaRows);

  sectionLabel(15, "── COMBINED ──",    "#F3E5F5");
  dash.getRange(16, 1, combinedRows.length, 4).setValues(combinedRows);

  sectionLabel(19, "── LEADS ──",       "#E8F5E9");
  dash.getRange(20, 1, leadsRows.length,   4).setValues(leadsRows);

  dash.autoResizeColumns(1, 4);
}

// ── Daily email digest ───────────────────────────────────────

function sendDailyDigest() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var gAds  = ss.getSheetByName("Google_Ads");
  var mAds  = ss.getSheetByName("Meta_Ads");
  var leads = ss.getSheetByName("Leads");
  var tz    = Session.getScriptTimeZone();
  var today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

  var gData    = gAds.getDataRange().getValues().slice(1);
  var gToday   = gData.filter(function(r) { return r[0] === today; });
  var gClicks  = gToday.reduce(function(s, r) { return s + (r[3] || 0); }, 0);
  var gCost    = gToday.reduce(function(s, r) { return s + (r[5] || 0); }, 0);
  var gConv    = gToday.reduce(function(s, r) { return s + (r[7] || 0); }, 0);

  var mData    = mAds.getDataRange().getValues().slice(1);
  var mToday   = mData.filter(function(r) { return r[0] === today; });
  var mClicks  = mToday.reduce(function(s, r) { return s + (r[6] || 0); }, 0);
  var mCost    = mToday.reduce(function(s, r) { return s + (r[8] || 0); }, 0);
  var mResults = mToday.reduce(function(s, r) { return s + (r[11] || 0); }, 0);

  var leadData   = leads.getDataRange().getValues().slice(1);
  var todayLeads = leadData.filter(function(r) {
    return r[0] && Utilities.formatDate(new Date(r[0]), tz, "yyyy-MM-dd") === today;
  });
  var gLeads   = todayLeads.filter(function(r) { return r[7] === "Google"; });
  var mLeads   = todayLeads.filter(function(r) { return r[7] === "Meta"; });
  var failSync = todayLeads.filter(function(r) {
    return typeof r[11] === "string" && r[11].indexOf("Failed") === 0;
  });

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

  body += "COMBINED SPEND: ₹" + (gCost + mCost).toFixed(2) + "\n\n";

  body += "LEADS TODAY: " + todayLeads.length + " total";
  body += " (" + gLeads.length + " Google, " + mLeads.length + " Meta)\n";
  body += "ERP Synced: " + (todayLeads.length - failSync.length) + " | Failed: " + failSync.length + "\n";

  if (todayLeads.length > 0) {
    body += "\nNew Leads:\n";
    todayLeads.forEach(function(r) {
      body += "  • " + r[1] + " | " + r[2] + " | " + r[6] + " [" + (r[7] || "?") + "] — ERP: " + (r[11] || "?") + "\n";
    });
  }

  if (failSync.length > 0) {
    body += "\nWARNING: " + failSync.length + " lead(s) failed to sync to ERP. Run retryFailedSyncs() to retry.\n";
  }

  MailApp.sendEmail("maniraj@shero.in", "Shero Daily Report — " + today, body);
}
