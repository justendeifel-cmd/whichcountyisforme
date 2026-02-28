# USA County Finder

## Projektstruktur

```
usa-finder/
├── index.html          ← Einstiegspunkt (nur Shell, kein Logik)
├── style.css           ← Alle Styles
├── js/
│   ├── config.js       ← Feldnamen, State-Daten, Konstanten
│   ├── counties.js     ← County-Datensatz (~250 Counties)
│   ├── filters.js      ← Filter-Logik
│   ├── scoring.js      ← Matrix-Scoring
│   ├── map.js          ← Leaflet Karte
│   └── app.js          ← Haupt-Koordinator, UI, Events
└── README.md
```

## Offline nutzen

Einfach `index.html` im Browser öffnen. Kein Server nötig.

## Daten erweitern

Neue Counties in `js/counties.js` hinzufügen — gleiche Array-Reihenfolge wie `FIELD_ORDER` in `js/config.js`.

Für den vollständigen Import aller 3.143 Counties:
1. CSV von US Census / USDA herunterladen
2. In das Array-Format konvertieren (Python-Script: `tools/csv_to_js.py` — TODO)
3. `counties.js` ersetzen

## Live-Deployment (Zukunft)

Wenn online: `counties.js` durch API-Calls ersetzen.
Die Datei enthält `TODO: REPLACE WITH FETCH` Kommentare an allen relevanten Stellen.

## Datenquellen

| Feld | Quelle |
|------|--------|
| Hauspreise | Zillow Research Data |
| Miete | Zillow Observed Rent Index |
| Wetter | NOAA Climate Normals |
| Kriminalität | FBI UCR 2022 |
| Demographie | US Census ACS 2022 |
| Naturkatastrophen | FEMA Risk Index |
| Steuern | Tax Foundation / Wikipedia |
| Walkability | Walk Score |
| Luftqualität | EPA Air Quality Index |
| Einkommen | Bureau of Economic Analysis |
| Bildung | NCES / US Census |
| Internet | FCC Broadband Data |
| Nationalparks | NPS Boundary Data |

## Datenstand

Counties: ~250 (Stand 2024)
Ziel: 3.143 (alle US Counties)
