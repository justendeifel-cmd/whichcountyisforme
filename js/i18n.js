'use strict';
// ═══════════════════════════════════════════════════════
//  i18n.js — Übersetzungen: DE · EN · ES · FR
// ═══════════════════════════════════════════════════════

const LANGS = {
  de: {
    flag: '🇩🇪', label: 'DE',
    // ── Navigation ──────────────────────────────────────
    tab1:          'Karte & Filter',
    tab2:          'Entscheidungsmatrix',
    badge:         'passen',
    // ── Filter-Panel ────────────────────────────────────
    filterTitle:   'Filter-Regler',
    secClimate:    '☀️ Klima & Wetter',
    secCost:       '💰 Kosten & Immobilien',
    secDist:       '📍 Entfernungen (Meilen)',
    secEcon:       '💵 Wirtschaft',
    secPol:        '🗳️ Politik (Wahl 2020)',
    secGun:        '🔒 Waffengesetze',
    secRisk:       '⚠️ Naturrisiken ausschließen',
    // ── Filter-Labels ───────────────────────────────────
    lblJul:        'Juli-Ø-Temperatur',
    lblDez:        'Dezember-Ø-Temperatur',
    lblSun:        'Sonnenstunden/Jahr',
    lblRain:       'Jahresniederschlag (Zoll)',
    lblHumid:      'Max. Luftfeuchtigkeit Sommer',
    lblAqi:        'Max. Luftqualität AQI',
    lblPrice:      'Max. Hauspreis',
    lblRent:       'Max. Monatsmiete',
    lblBeach:      'Max. Entfernung Strand',
    lblCity:       'Max. Entfernung 1M+ Stadt',
    lblMtn:        'Berge spätestens ab',
    lblHosp:       'Max. Entfernung Krankenhaus',
    lblAirport:    'Max. Entfernung Flughafen',
    lblInc:        'Ø Haushaltseinkommen',
    lblUnemp:      'Max. Arbeitslosenquote',
    lblPopden:     'Max. Bevölkerungsdichte',
    tickPopLo:     'sehr ländlich',
    // ── Risiko-Toggle ───────────────────────────────────
    riskHurr:      '🌀 Hurrikan-Küstenregionen',
    riskFire:      '🔥 Waldbrand-Regionen',
    riskQuake:     '🌍 Erdbebengebiete (≥ moderat)',
    riskTornado:   '🌪️ Tornado-Regionen (≥ moderat)',
    riskFlood:     '🌊 Überflutungsrisiko (≥ moderat)',
    // ── Footer ──────────────────────────────────────────
    passLine:      'Counties erfüllen alle Kriterien',
    btnGo:         'Zur Matrix ▶',
    btnNone:       'Keine Counties — Filter anpassen',
    // ── Matrix ──────────────────────────────────────────
    matTitle:      'Wichtigkeiten',
    matHint:       '— = ignorieren · 5★ = Top-Priorität',
    matEmpty:      'Setze in Phase 1 deine Filter.\nDie besten Counties erscheinen hier.',
    // ── Popup ───────────────────────────────────────────
    popPop:        'Einw.',
    popDen:        'Dichte',
    popInc:        'Einkommen',
    popPrice:      'Hauspreis',
    popRent:       'Miete/mo',
    popUnemp:      'Arbeitslos',
    popCrime:      'Kriminalität',
    popPol:        'Republikanisch',
    popGun:        'Waffengesetze',
    popBeach:      'Strand',
    popCity:       'Großstadt',
    popMtn:        'Berge',
    popHosp:       'Krankenhaus',
    popAirport:    'Flughafen',
    popPark:       'Nationalpark',
    popSun:        'Sonne/Jahr',
    popRainL:      'Niederschlag',
    popAqi:        'AQI',
    popWalk:       'Walk',
    popBike:       'Bike',
    popTransit:    'Transit',
    popExpat:      'Expat-Community',
    popBroad:      'Breitband',
    popPropTax:    'Grundsteuer',
    popStateTax:   'Staatssteuer',
    popClose:      'Schließen',
    popMi:         'Meilen',
    popHr:         'Std.',
    // ── Politisch-Labels ────────────────────────────────
    polStrD:       'Stark Demokratisch',
    polLeanD:      'Eher Demokratisch',
    polSwing:      'Swing',
    polLeanR:      'Eher Republikanisch',
    polStrR:       'Stark Republikanisch',
  },

  en: {
    flag: '🇺🇸', label: 'EN',
    tab1:          'Map & Filters',
    tab2:          'Decision Matrix',
    badge:         'match',
    filterTitle:   'Filter Controls',
    secClimate:    '☀️ Climate & Weather',
    secCost:       '💰 Cost & Real Estate',
    secDist:       '📍 Distances (Miles)',
    secEcon:       '💵 Economy',
    secPol:        '🗳️ Politics (2020 Election)',
    secGun:        '🔒 Gun Laws',
    secRisk:       '⚠️ Exclude Natural Risks',
    lblJul:        'July Avg. Temperature',
    lblDez:        'December Avg. Temperature',
    lblSun:        'Sunshine Hours/Year',
    lblRain:       'Annual Rainfall (inches)',
    lblHumid:      'Max. Summer Humidity',
    lblAqi:        'Max. Air Quality AQI',
    lblPrice:      'Max. Home Price',
    lblRent:       'Max. Monthly Rent',
    lblBeach:      'Max. Distance to Beach',
    lblCity:       'Max. Distance to 1M+ City',
    lblMtn:        'Mountains at most',
    lblHosp:       'Max. Distance to Hospital',
    lblAirport:    'Max. Distance to Airport',
    lblInc:        'Avg. Household Income',
    lblUnemp:      'Max. Unemployment Rate',
    lblPopden:     'Max. Population Density',
    tickPopLo:     'very rural',
    riskHurr:      '🌀 Hurricane Coastal Zones',
    riskFire:      '🔥 Wildfire Regions',
    riskQuake:     '🌍 Earthquake Zones (≥ moderate)',
    riskTornado:   '🌪️ Tornado Regions (≥ moderate)',
    riskFlood:     '🌊 Flood Risk (≥ moderate)',
    passLine:      'counties meet all criteria',
    btnGo:         'Go to Matrix ▶',
    btnNone:       'No counties — adjust filters',
    matTitle:      'Priorities',
    matHint:       '— = ignore · 5★ = top priority',
    matEmpty:      'Set your filters in Phase 1.\nThe best counties will appear here.',
    popPop:        'Pop.',
    popDen:        'Density',
    popInc:        'Income',
    popPrice:      'Home Price',
    popRent:       'Rent/mo',
    popUnemp:      'Unemp.',
    popCrime:      'Crime',
    popPol:        'Republican',
    popGun:        'Gun Laws',
    popBeach:      'Beach',
    popCity:       'City',
    popMtn:        'Mountains',
    popHosp:       'Hospital',
    popAirport:    'Airport',
    popPark:       'Nat. Park',
    popSun:        'Sun/Year',
    popRainL:      'Rainfall',
    popAqi:        'AQI',
    popWalk:       'Walk',
    popBike:       'Bike',
    popTransit:    'Transit',
    popExpat:      'Expat Community',
    popBroad:      'Broadband',
    popPropTax:    'Property Tax',
    popStateTax:   'State Tax',
    popClose:      'Close',
    popMi:         'miles',
    popHr:         'hr',
    polStrD:       'Strong Democrat',
    polLeanD:      'Leans Democrat',
    polSwing:      'Swing',
    polLeanR:      'Leans Republican',
    polStrR:       'Strong Republican',
  },

  es: {
    flag: '🇪🇸', label: 'ES',
    tab1:          'Mapa & Filtros',
    tab2:          'Matriz de Decisión',
    badge:         'coinciden',
    filterTitle:   'Controles de Filtro',
    secClimate:    '☀️ Clima & Tiempo',
    secCost:       '💰 Costos & Inmuebles',
    secDist:       '📍 Distancias (Millas)',
    secEcon:       '💵 Economía',
    secPol:        '🗳️ Política (Elección 2020)',
    secGun:        '🔒 Leyes de Armas',
    secRisk:       '⚠️ Excluir Riesgos Naturales',
    lblJul:        'Temperatura Media Julio',
    lblDez:        'Temperatura Media Diciembre',
    lblSun:        'Horas de Sol/Año',
    lblRain:       'Lluvia Anual (pulgadas)',
    lblHumid:      'Humedad Máx. en Verano',
    lblAqi:        'Calidad del Aire AQI Máx.',
    lblPrice:      'Precio Máx. de Vivienda',
    lblRent:       'Alquiler Mensual Máx.',
    lblBeach:      'Dist. Máx. a la Playa',
    lblCity:       'Dist. Máx. a Ciudad 1M+',
    lblMtn:        'Montañas como máximo a',
    lblHosp:       'Dist. Máx. al Hospital',
    lblAirport:    'Dist. Máx. al Aeropuerto',
    lblInc:        'Ingreso Familiar Promedio',
    lblUnemp:      'Desempleo Máx.',
    lblPopden:     'Densidad Pob. Máx.',
    tickPopLo:     'muy rural',
    riskHurr:      '🌀 Zonas Costeras de Huracán',
    riskFire:      '🔥 Regiones de Incendio',
    riskQuake:     '🌍 Zonas Sísmicas (≥ moderado)',
    riskTornado:   '🌪️ Regiones de Tornado (≥ mod.)',
    riskFlood:     '🌊 Riesgo de Inundación (≥ mod.)',
    passLine:      'condados cumplen los criterios',
    btnGo:         'Ir a Matriz ▶',
    btnNone:       'Sin condados — ajustar filtros',
    matTitle:      'Prioridades',
    matHint:       '— = ignorar · 5★ = máxima prioridad',
    matEmpty:      'Configura filtros en la Fase 1.\nLos mejores condados aparecerán aquí.',
    popPop:        'Pob.',
    popDen:        'Densidad',
    popInc:        'Ingresos',
    popPrice:      'Precio Casa',
    popRent:       'Alquiler/mes',
    popUnemp:      'Desempleo',
    popCrime:      'Crimen',
    popPol:        'Republicano',
    popGun:        'Leyes Armas',
    popBeach:      'Playa',
    popCity:       'Ciudad',
    popMtn:        'Montañas',
    popHosp:       'Hospital',
    popAirport:    'Aeropuerto',
    popPark:       'P. Nacional',
    popSun:        'Sol/Año',
    popRainL:      'Lluvia',
    popAqi:        'AQI',
    popWalk:       'A pie',
    popBike:       'Bici',
    popTransit:    'Transporte',
    popExpat:      'Com. Expat',
    popBroad:      'Banda Ancha',
    popPropTax:    'Imp. Propiedad',
    popStateTax:   'Imp. Estatal',
    popClose:      'Cerrar',
    popMi:         'millas',
    popHr:         'h',
    polStrD:       'Fuertemente Demócrata',
    polLeanD:      'Demócrata moderado',
    polSwing:      'Swing',
    polLeanR:      'Republicano moderado',
    polStrR:       'Fuertemente Republicano',
  },

  fr: {
    flag: '🇫🇷', label: 'FR',
    tab1:          'Carte & Filtres',
    tab2:          'Matrice de Décision',
    badge:         'correspondent',
    filterTitle:   'Réglages des Filtres',
    secClimate:    '☀️ Climat & Météo',
    secCost:       '💰 Coûts & Immobilier',
    secDist:       '📍 Distances (Miles)',
    secEcon:       '💵 Économie',
    secPol:        '🗳️ Politique (Élection 2020)',
    secGun:        '🔒 Lois sur les Armes',
    secRisk:       '⚠️ Exclure Risques Naturels',
    lblJul:        'Température Moy. Juillet',
    lblDez:        'Température Moy. Décembre',
    lblSun:        'Heures de Soleil/An',
    lblRain:       'Pluie Annuelle (pouces)',
    lblHumid:      'Humidité Estivale Max.',
    lblAqi:        'Qualité Air AQI Max.',
    lblPrice:      'Prix Immobilier Max.',
    lblRent:       'Loyer Mensuel Max.',
    lblBeach:      'Dist. Max. à la Plage',
    lblCity:       'Dist. Max. Ville 1M+',
    lblMtn:        'Montagnes au plus à',
    lblHosp:       'Dist. Max. à l\'Hôpital',
    lblAirport:    'Dist. Max. à l\'Aéroport',
    lblInc:        'Revenu Moyen du Ménage',
    lblUnemp:      'Chômage Max.',
    lblPopden:     'Densité Pop. Max.',
    tickPopLo:     'très rural',
    riskHurr:      '🌀 Zones Côtières Ouragan',
    riskFire:      '🔥 Régions d\'Incendie',
    riskQuake:     '🌍 Zones Sismiques (≥ modéré)',
    riskTornado:   '🌪️ Régions Tornades (≥ mod.)',
    riskFlood:     '🌊 Risque Inondation (≥ mod.)',
    passLine:      'comtés remplissent les critères',
    btnGo:         'Vers la Matrice ▶',
    btnNone:       'Aucun comté — ajuster les filtres',
    matTitle:      'Priorités',
    matHint:       '— = ignorer · 5★ = priorité max.',
    matEmpty:      'Définissez vos filtres en Phase 1.\nLes meilleurs comtés apparaîtront ici.',
    popPop:        'Pop.',
    popDen:        'Densité',
    popInc:        'Revenus',
    popPrice:      'Prix Maison',
    popRent:       'Loyer/mois',
    popUnemp:      'Chômage',
    popCrime:      'Criminalité',
    popPol:        'Républicain',
    popGun:        'Lois Armes',
    popBeach:      'Plage',
    popCity:       'Ville',
    popMtn:        'Montagnes',
    popHosp:       'Hôpital',
    popAirport:    'Aéroport',
    popPark:       'Parc Nat.',
    popSun:        'Soleil/An',
    popRainL:      'Pluie',
    popAqi:        'AQI',
    popWalk:       'Marche',
    popBike:       'Vélo',
    popTransit:    'Transport',
    popExpat:      'Com. Expat',
    popBroad:      'Haut Débit',
    popPropTax:    'Taxe Foncière',
    popStateTax:   'Impôt État',
    popClose:      'Fermer',
    popMi:         'miles',
    popHr:         'h',
    polStrD:       'Fortement Démocrate',
    polLeanD:      'Plutôt Démocrate',
    polSwing:      'Swing',
    polLeanR:      'Plutôt Républicain',
    polStrR:       'Fortement Républicain',
  },
};

// ── Aktive Sprache ───────────────────────────────────────
let LANG = 'de';

// Übersetzungs-Helfer
function t(key) {
  return (LANGS[LANG] && LANGS[LANG][key]) || LANGS.de[key] || key;
}

// ── Sprache anwenden ─────────────────────────────────────
function applyLang(code) {
  if (!LANGS[code]) return;
  LANG = code;
  localStorage.setItem('ucf-lang', code);

  // Alle [data-i18n] Elemente aktualisieren
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // html lang-Attribut
  document.documentElement.lang = code;

  // Dynamische Buttons neu rendern (falls bereits vorhanden)
  if (typeof updatePassCount === 'function') updatePassCount();
  if (typeof renderPolChips  === 'function') renderPolChips();
  if (typeof renderGunChips  === 'function') renderGunChips();
  if (typeof renderWeights   === 'function') renderWeights();

  // Sprach-Switcher-Highlighting
  document.querySelectorAll('#lang-switcher button').forEach(btn => {
    const active = btn.dataset.lang === code;
    btn.style.background    = active ? '#3ec87a'           : 'rgba(20,28,40,0.92)';
    btn.style.color         = active ? '#0d1117'           : '#cdd6f4';
    btn.style.fontWeight    = active ? '700'               : '400';
    btn.style.borderColor   = active ? '#3ec87a'           : '#3ec87a44';
  });
}

// ── Switcher-Button in Header einfügen ───────────────────
function buildLangSwitcher() {
  const target = document.getElementById('lang-switcher-slot');
  if (!target) return;

  const bar = document.createElement('div');
  bar.id = 'lang-switcher';
  bar.style.cssText = 'display:flex; gap:4px; align-items:center;';

  Object.entries(LANGS).forEach(([code, cfg]) => {
    const btn = document.createElement('button');
    btn.textContent  = cfg.flag + ' ' + cfg.label;
    btn.dataset.lang = code;
    btn.style.cssText = `
      background:rgba(20,28,40,0.92); color:#cdd6f4;
      border:1px solid #3ec87a44; border-radius:6px;
      padding:4px 9px; font-size:12px; cursor:pointer;
      font-family:inherit; transition:all .18s;
    `;
    btn.addEventListener('click', () => applyLang(code));
    btn.addEventListener('mouseenter', () => {
      if (btn.dataset.lang !== LANG) btn.style.background = 'rgba(62,200,122,0.2)';
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.dataset.lang !== LANG) btn.style.background = 'rgba(20,28,40,0.92)';
    });
    bar.appendChild(btn);
  });

  target.appendChild(bar);

  // Gespeicherte Sprache wiederherstellen
  const saved = localStorage.getItem('ucf-lang');
  if (saved && LANGS[saved]) {
    applyLang(saved);
  } else {
    applyLang('de');
  }
}
