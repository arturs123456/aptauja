/*
  GOOGLE APPS SCRIPT — ieliec šo kodu Google Sheets → Extensions → Apps Script → Code.gs

  SETUP SOĻI:
  1. Izveido jaunu Google Sheet: https://sheets.new
  2. Pirmajā rindā ieraksti kolonnu nosaukumus:
     id | timestamp | vards | zinojums
  3. Atver: Extensions → Apps Script
  4. Izdzēs visu esošo kodu un ieliec šo
  5. Saglabā (Ctrl+S)
  6. Palaid: Run → initialSetup (un autorizē, kad prasa)
  7. Deploy → New deployment → Web app
     - Execute as: Me
     - Who has access: Anyone
  8. Nokopē URL un ieliec index.html failā vietā IELIEC_SAVU_GOOGLE_APPS_SCRIPT_URL_SEIT
*/

const scriptProp = PropertiesService.getScriptProperties()

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function sanitizeValue(value) {
  if (typeof value !== 'string') return value
  const triggers = ['=', '+', '-', '@']
  if (triggers.some(t => value.startsWith(t))) {
    return "'" + value
  }
  return value
}

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    // Honeypot — if bot filled hidden field, silently reject
    if (e.parameter.mobile_number && e.parameter.mobile_number !== '') {
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'success', message: 'OK' })
      ).setMimeType(ContentService.MimeType.JSON)
    }

    const sheetName = e.parameter.sheet_name || 'Sheet1'
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    const sheet = doc.getSheetByName(sheetName)
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1

    const newRow = headers.map(function(header) {
      if (header === 'id') return Utilities.getUuid()
      if (header === 'timestamp') return new Date()
      const rawValue = e.parameter[header] || ''
      return sanitizeValue(rawValue)
    })

    const newRange = sheet.getRange(nextRow, 1, 1, newRow.length)
    newRange.setNumberFormat('@')
    newRange.setValues([newRow])

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', row: nextRow })
    ).setMimeType(ContentService.MimeType.JSON)

  } catch (e) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: e.toString() })
    ).setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}
