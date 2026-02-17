# Aptauja / Kontaktforma

Vienkārša HTML kontaktforma, kas saglabā atbildes Google Sheets tabulā.

## Kā darbojas

1. Lietotājs aizpilda formu (vārds + ziņojums)
2. Dati tiek nosūtīti uz Google Apps Script
3. Apps Script saglabā datus tavā Google Sheets tabulā

## Setup

### 1. Google Sheets
- Atver [sheets.new](https://sheets.new)
- Pirmajā rindā ieraksti kolonnas: `id` | `timestamp` | `vards` | `zinojums`

### 2. Apps Script
- Extensions → Apps Script
- Ieliec `google-apps-script.js` kodu
- Run → `initialSetup` (autorizē kad prasa)
- Deploy → New deployment → Web app → "Anyone" → nokopē URL

### 3. HTML forma
- `index.html` failā nomaini `IELIEC_SAVU_GOOGLE_APPS_SCRIPT_URL_SEIT` uz savu deployment URL
- Hostē failu jebkur (GitHub Pages, Cloudflare Pages, utt.)
