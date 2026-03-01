'use strict';

// ═══ STATE ════════════════════════════════════════════════════
const S = {
  passing: new Set(),
  selPol:  new Set(['mostly_blue','slightly_blue','swing','slightly_red','mostly_red']),
  selGun:  new Set([1,2,3,4,5]),
  weights: {},
  map:     null,
  markers: [],
};

// ═══ HELPERS ══════════════════════════════════════════════════
const el = id => document.getElementById(id);

function polCat(rep) {
  if (rep < 35) return 'mostly_blue';
  if (rep < 45) return 'slightly_blue';
  if (rep < 55) return 'swing';
  if (rep < 65) return 'slightly_red';
  return 'mostly_red';
}

function polColor(rep) {
  if (rep < 35) return '#2255ee';
  if (rep < 45) return '#5588ff';
  if (rep < 55) return '#9040cc';
  if (rep < 65) return '#ff5555';
  return '#cc2020';
}

function polLabel(rep) {
  const c = POL_CATEGORIES.find(c => rep >= c.min && rep < c.max);
  return c ? c.label : '—';
}

function riskLabel(v) {
  if (!v || v <= 0) return '✓ Kein Risiko';
  if (v <= 1) return '○ Sehr gering';
  if (v <= 2) return '◐ Gering';
  if (v <= 3) return '● Moderat';
  if (v <= 4) return '⚠ Hoch';
  return '⛔ Sehr hoch';
}

function quakeRisk(d) { return d[F.QUAKE] || 0; }
function tornadoRisk(d) {
  const high = ['OK','KS']; const med = ['TX','AR','MS','AL','TN','MO','IA','IL'];
  if (high.includes(d[F.ST])) return 4;
  if (med.includes(d[F.ST])) return 3;
  return d[F.TORNADO] || 0;
}
function floodRisk(d)  { return d[F.FLOOD] || 0; }
function isHurricane(d) {
  const cs = ['FL','LA','MS','AL','GA','SC','NC','TX'];
  const ns = ['Walton','Bay','Okaloosa','Santa Rosa','Baldwin','Glynn','Dare','Carteret','Beaufort','Horry','Brevard','Charlotte','Indian River','Nueces'];
  return cs.includes(d[F.ST]) && ns.some(n => d[F.NAME].includes(n));
}
function isWildfire(d) {
  const ws = ['CA','OR','AZ','NM','NV','MT','ID','WY','CO'];
  return ws.includes(d[F.ST]) && (d[F.TJUL] > 22 || d[F.RAIN] < 20);
}

function zillowUrl(name, state) {
  const clean = name.split('(')[0].trim().replace(/[^a-zA-Z\s]/g,'').trim().toLowerCase().replace(/\s+/g,'-');
  return `https://www.zillow.com/homes/for_sale/${clean}-county-${state.toLowerCase()}_rb/`;
}

// ═══ FILTERS ══════════════════════════════════════════════════
function readFilters() {
  return {
    julLo:  +el('f-jul-lo').value,    julHi:  +el('f-jul-hi').value,
    dezLo:  +el('f-dez-lo').value,    dezHi:  +el('f-dez-hi').value,
    sunLo:  +el('f-sun-lo').value,    sunHi:  +el('f-sun-hi').value,
    rainLo: +el('f-rain-lo').value,   rainHi: +el('f-rain-hi').value,
    incLo:  +el('f-inc-lo').value,    incHi:  +el('f-inc-hi').value,
    priceMax: +el('f-price').value,
    rentMax:  +el('f-rent').value,
    beachMax: +el('f-beach').value,
    cityMax:  +el('f-city').value,
    mtnMax:   +el('f-mtn').value,
    humidMax: +el('f-humid').value,
    aqiMax:   +el('f-aqi').value,
    hospMax:  +el('f-hosp').value,
    airMax:   +el('f-airport').value,
    unempMax: +el('f-unemp').value,
    popMax:   +el('f-popden').value,
    noH:  el('tog-h').checked,
    noF:  el('tog-f').checked,
    noQ:  el('tog-q').checked,
    noT:  el('tog-t').checked,
    noFl: el('tog-fl').checked,
  };
}

function applyFilters() {
  const f = readFilters();
  S.passing.clear();

  COUNTIES.forEach((d, i) => {
    if (d[F.TJUL]   < f.julLo  || d[F.TJUL]   > f.julHi)   return;
    if (d[F.TDEC]   < f.dezLo  || d[F.TDEC]   > f.dezHi)   return;
    if (d[F.SUN]    < f.sunLo  || d[F.SUN]    > f.sunHi)   return;
    if (d[F.RAIN]   < f.rainLo || d[F.RAIN]   > f.rainHi)  return;
    if (d[F.INC]    < f.incLo  || d[F.INC]    > f.incHi)   return;
    if (d[F.PRICE]  > f.priceMax)  return;
    if (d[F.RENT]   > f.rentMax)   return;
    if (d[F.BEACH]  > f.beachMax)  return;
    if (d[F.CITY]   > f.cityMax)   return;
    if (d[F.MTN]    > f.mtnMax)    return;
    if (d[F.HUMID]  > f.humidMax)  return;
    if (d[F.AQI]    > f.aqiMax)    return;
    if (d[F.HOSP]   > f.hospMax)   return;
    if (d[F.AIRPORT]> f.airMax)    return;
    if (d[F.UNEMP]  > f.unempMax)  return;
    if (d[F.POPDEN] > f.popMax)    return;
    if (f.noH  && isHurricane(d))       return;
    if (f.noF  && isWildfire(d))        return;
    if (f.noQ  && quakeRisk(d) >= 3)    return;
    if (f.noT  && tornadoRisk(d) >= 3)  return;
    if (f.noFl && floodRisk(d) >= 3)    return;
    if (!S.selPol.has(polCat(d[F.REP]))) return;
    if (!S.selGun.has(d[F.GUN]))          return;
    S.passing.add(i);
  });

  updateUI();
}

function updateUI() {
  const n = S.passing.size;
  el('pass-n').textContent = n;
  el('hdr-pass').textContent = n;
  const btn = el('btn-go');
  btn.disabled = n === 0;
  btn.textContent = n === 0 ? 'Keine Counties — Filter anpassen' : `${n} Counties → Zur Matrix ▶`;
  updateMarkers();
}

// ═══ MAP ══════════════════════════════════════════════════════

// ── MARKER-STIL: hier Größe und Farbe anpassen ────────────────
const MARKER = {
  passRadius:    8,       // Größe: passende Counties  (px)
  failRadius:    4,       // Größe: nicht-passende Counties (px)
  passColor:    '#3ec87a', // Farbe: passende Counties (Hex)
  failColor:    '#1e2d3d', // Farbe: nicht-passende Counties (Hex)
  passBorder:   '#3ec87a', // Randfarbe: passend
  failBorder:   '#263545', // Randfarbe: nicht-passend
  passOpacity:  0.88,      // Transparenz: passend  (0–1)
  failOpacity:  0.25,      // Transparenz: nicht-passend (0–1)
};

// ── KARTEN-STILE: hier weitere Stile hinzufügen ───────────────
const MAP_LAYERS = {
  dark: {
    label: '🌑 Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    opts: { attribution:'© OpenStreetMap © CARTO', maxZoom:19, subdomains:'abcd' }
  },
  light: {
    label: '☀️ Hell',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    opts: { attribution:'© OpenStreetMap © CARTO', maxZoom:19, subdomains:'abcd' }
  },
  satellite: {
    label: '🛰️ Satellit',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    opts: { attribution:'© Esri, Maxar, Earthstar Geographics', maxZoom:19 }
  },
  topo: {
    label: '🏔️ Topo',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    opts: { attribution:'© OpenStreetMap © OpenTopoMap', maxZoom:17 }
  },
  streets: {
    label: '🗺️ Straßen',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    opts: { attribution:'© OpenStreetMap', maxZoom:19 }
  },
};

let S_currentLayer = null;
let S_currentLayerKey = 'dark';

function initMap() {
  S.map = L.map('map', { zoomControl:true, preferCanvas:true }).setView([38,-96], 4);

  // Standard-Karte laden
  const def = MAP_LAYERS[S_currentLayerKey];
  S_currentLayer = L.tileLayer(def.url, def.opts).addTo(S.map);

  // Karten-Switcher-Button einfügen
  buildMapSwitcher();

  COUNTIES.forEach((d, i) => {
    const m = L.circleMarker([d[F.LAT], d[F.LNG]], mStyle(true))
      .addTo(S.map);
    m.on('click', () => showPopup(i, m));
    S.markers.push(m);
  });
}

function buildMapSwitcher() {
  // Container über der Karte
  const mapDiv = document.getElementById('map');
  const wrapper = mapDiv.parentElement;
  wrapper.style.position = 'relative';

  const bar = document.createElement('div');
  bar.id = 'map-switcher';
  bar.style.cssText = `
    position:absolute; top:10px; right:10px; z-index:1000;
    display:flex; gap:4px; flex-wrap:wrap; justify-content:flex-end;
  `;

  Object.entries(MAP_LAYERS).forEach(([key, cfg]) => {
    const btn = document.createElement('button');
    btn.textContent = cfg.label;
    btn.dataset.key = key;
    btn.style.cssText = `
      background:rgba(20,28,40,0.92); color:#cdd6f4;
      border:1px solid #3ec87a44; border-radius:6px;
      padding:5px 10px; font-size:12px; cursor:pointer;
      backdrop-filter:blur(4px); transition:all .2s;
      font-family:inherit;
    `;
    if (key === S_currentLayerKey) {
      btn.style.background = '#3ec87a';
      btn.style.color = '#0d1117';
      btn.style.fontWeight = '700';
    }
    btn.addEventListener('mouseenter', () => {
      if (btn.dataset.key !== S_currentLayerKey)
        btn.style.background = 'rgba(62,200,122,0.2)';
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.dataset.key !== S_currentLayerKey)
        btn.style.background = 'rgba(20,28,40,0.92)';
    });
    btn.addEventListener('click', () => switchMapLayer(key));
    bar.appendChild(btn);
  });

  wrapper.appendChild(bar);
}

function switchMapLayer(key) {
  if (key === S_currentLayerKey) return;
  S_currentLayer.remove();
  const cfg = MAP_LAYERS[key];
  S_currentLayer = L.tileLayer(cfg.url, cfg.opts).addTo(S.map);
  S_currentLayer.bringToBack();
  S_currentLayerKey = key;

  // Button-Highlighting aktualisieren
  document.querySelectorAll('#map-switcher button').forEach(btn => {
    const active = btn.dataset.key === key;
    btn.style.background = active ? '#3ec87a' : 'rgba(20,28,40,0.92)';
    btn.style.color = active ? '#0d1117' : '#cdd6f4';
    btn.style.fontWeight = active ? '700' : '400';
  });
}

function mStyle(pass) {
  return {
    radius:      pass ? MARKER.passRadius  : MARKER.failRadius,
    fillColor:   pass ? MARKER.passColor   : MARKER.failColor,
    color:       pass ? MARKER.passBorder  : MARKER.failBorder,
    weight: 1.5, opacity: 1,
    fillOpacity: pass ? MARKER.passOpacity : MARKER.failOpacity,
  };
}

function updateMarkers() {
  COUNTIES.forEach((_, i) => {
    const pass = S.passing.has(i);
    S.markers[i].setStyle(mStyle(pass));
    S.markers[i].setRadius(pass ? MARKER.passRadius : MARKER.failRadius);
  });
}

function showPopup(i, marker) {
  const d = COUNTIES[i];
  const rep = d[F.REP];
  const pc  = polColor(rep);
  const gun = GUN_CATEGORIES.find(g => g.val === d[F.GUN]);
  const zlink = zillowUrl(d[F.NAME], d[F.ST]);

  marker.bindPopup(L.popup({ maxWidth:310, className:'cpop' }).setContent(`
    <div class="pop">
      <div class="pop-name">${d[F.NAME]}, ${d[F.ST]}</div>
      <div class="pop-grid">
        <div class="pr"><span>Juli / Dez</span><b>${d[F.TJUL]}°C / ${d[F.TDEC]}°C</b></div>
        <div class="pr"><span>Hauspreis</span><b>$${d[F.PRICE]}k</b></div>
        <div class="pr"><span>Miete Ø</span><b>$${d[F.RENT]}/mo</b></div>
        <div class="pr"><span>Strand</span><b>${d[F.BEACH]} mi</b></div>
        <div class="pr"><span>Berge ab</span><b>${d[F.MTN]} mi</b></div>
        <div class="pr"><span>Sonne</span><b>${d[F.SUN]} h/yr</b></div>
        <div class="pr"><span>Regen</span><b>${d[F.RAIN]}"</b></div>
        <div class="pr"><span>Luftfeuchte</span><b>${d[F.HUMID]}%</b></div>
        <div class="pr"><span>AQI</span><b>${d[F.AQI]}</b></div>
        <div class="pr"><span>Kriminalität</span><b>${d[F.VCRIME]}/100k</b></div>
        <div class="pr"><span>Krankenhaus</span><b>${d[F.HOSP]} mi</b></div>
        <div class="pr"><span>Erdbeben</span><b>${riskLabel(quakeRisk(d))}</b></div>
        <div class="pr"><span>Tornado</span><b>${riskLabel(tornadoRisk(d))}</b></div>
        <div class="pr"><span>Überflutung</span><b>${riskLabel(floodRisk(d))}</b></div>
        <div class="pr"><span>Waffengesetze</span><b>${gun ? gun.label : '—'}</b></div>
      </div>
      <div class="pop-pbar">
        <div class="pop-ptrack">
          <div class="pop-pdot" style="left:${rep}%;background:${pc};box-shadow:0 0 5px ${pc}"></div>
        </div>
        <div class="pop-plabel" style="color:${pc}">${polLabel(rep)} · ${rep}% Republikanisch</div>
      </div>
      <a href="${zlink}" target="_blank" class="pop-zillow">🏠 Häuser auf Zillow →</a>
    </div>`
  )).openPopup();
}

// ═══ DUAL-RANGE SLIDERS ═══════════════════════════════════════
function drUpdate(base, loId, hiId, fillId, valId, fmt) {
  const lo = el(loId), hi = el(hiId);
  let l = +lo.value, h = +hi.value;
  if (l > h - 1) {
    if (document.activeElement === lo) lo.value = l = h - 1;
    else hi.value = h = l + 1;
  }
  const mn = +lo.min, mx = +lo.max, span = mx - mn;
  const lp = ((l - mn) / span) * 100;
  const hp = ((h - mn) / span) * 100;
  const fill = el(fillId);
  if (fill) fill.style.cssText = `left:${lp}%;right:${100-hp}%;position:absolute;top:0;height:100%;background:var(--amber);border-radius:2px;pointer-events:none`;
  const ve = el(valId);
  if (ve) ve.textContent = fmt(l, h);
  applyFilters();
}

function srUpdate(slOrId, valId, fmt) {
  // accepts either an element (this) or an ID string
  const sl = (typeof slOrId === 'string') ? el(slOrId) : slOrId;
  if (!sl) return;
  const pct = ((+sl.value - +sl.min) / (+sl.max - +sl.min)) * 100;
  sl.style.background = `linear-gradient(to right,var(--amber) ${pct}%,var(--s3) ${pct}%)`;
  const ve = el(valId);
  if (ve) ve.textContent = fmt(sl.value);
  applyFilters();
}

// Called from HTML oninput handlers
function drJul()   { drUpdate('jul',  'f-jul-lo',  'f-jul-hi',  'df-jul',  'fv-jul',  (l,h)=>`${l}°C–${h}°C`); }
function drDez()   { drUpdate('dez',  'f-dez-lo',  'f-dez-hi',  'df-dez',  'fv-dez',  (l,h)=>`${l}°C–${h}°C`); }
function drSun()   { drUpdate('sun',  'f-sun-lo',  'f-sun-hi',  'df-sun',  'fv-sun',  (l,h)=>`${l}–${h} h`); }
function drRain()  { drUpdate('rain', 'f-rain-lo', 'f-rain-hi', 'df-rain', 'fv-rain', (l,h)=>`${l}"–${h}"`); }
function drInc()   { drUpdate('inc',  'f-inc-lo',  'f-inc-hi',  'df-inc',  'fv-inc',  (l,h)=>`$${l}k–$${h}k`); }

// ═══ CHIP BUILDERS ════════════════════════════════════════════
function buildPolChips() {
  const wrap = el('pol-chips');
  POL_CATEGORIES.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'pol-chip active';
    b.dataset.key = cat.key;
    b.style.setProperty('--pc', cat.color);
    b.textContent = cat.label;
    b.onclick = () => {
      b.classList.toggle('active');
      b.classList.contains('active') ? S.selPol.add(cat.key) : S.selPol.delete(cat.key);
      applyFilters();
    };
    wrap.appendChild(b);
  });
}

function buildGunChips() {
  const wrap = el('gun-chips');
  GUN_CATEGORIES.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'gun-chip active';
    b.innerHTML = `
      <div class="gc-top">${cat.label}</div>
      <div class="gc-states">${cat.desc}</div>
      <div class="gc-def">${cat.def}</div>`;
    b.onclick = () => {
      b.classList.toggle('active');
      b.classList.contains('active') ? S.selGun.add(cat.val) : S.selGun.delete(cat.val);
      applyFilters();
    };
    wrap.appendChild(b);
  });
}

// ═══ MATRIX ═══════════════════════════════════════════════════
function buildWeightPanel() {
  const body = el('wp-body');
  CRITERIA.forEach(cr => {
    S.weights[cr.key] = cr.w;
    const div = document.createElement('div');
    div.className = 'wi';
    div.innerHTML = `
      <div class="wi-top">
        <span class="wi-name">${cr.icon} ${cr.label}</span>
        <span class="wi-val" id="wv-${cr.key}">${cr.w}★</span>
      </div>
      <div class="wi-hint">${cr.unit} · ${cr.hi?'↑ mehr=besser':'↓ weniger=besser'}</div>
      <div class="wi-row" id="wst-${cr.key}"></div>`;
    body.appendChild(div);
    const row = div.querySelector('.wi-row');
    const ignore = document.createElement('div');
    ignore.className = 'star'; ignore.textContent = '—'; ignore.title = 'Ignorieren';
    ignore.onclick = () => setW(cr.key, 0);
    row.appendChild(ignore);
    for (let v = 1; v <= 5; v++) {
      const s = document.createElement('div');
      s.className = 'star'; s.textContent = '★';
      s.onclick = () => setW(cr.key, v);
      row.appendChild(s);
    }
    refreshStars(cr.key);
  });
}

function setW(key, val) {
  S.weights[key] = val;
  el(`wv-${key}`).textContent = val === 0 ? '—' : val + '★';
  refreshStars(key);
  renderMatrix();
}

function refreshStars(key) {
  const w = S.weights[key];
  el(`wst-${key}`).querySelectorAll('.star').forEach((s, i) => {
    s.classList.toggle('on', w === 0 ? i === 0 : i > 0 && i <= w);
  });
}

function normalize(val, mn, mx, hi) {
  if (mx === mn) return 5;
  const n = ((val - mn) / (mx - mn)) * 10;
  return hi ? n : 10 - n;
}

function renderMatrix() {
  const cont = el('mr');
  const locs = Array.from(S.passing).map(i => COUNTIES[i]);
  if (locs.length === 0) {
    cont.innerHTML = '<div class="no-res"><div style="font-size:3rem;opacity:.2">🗺️</div><p>Setze in Phase 1 Filter.<br>Die besten Counties erscheinen hier.</p></div>';
    return;
  }

  const ranges = {};
  CRITERIA.forEach(cr => {
    const idx = F[cr.key];
    if (idx === undefined) return;
    const vals = locs.map(d => d[idx]).filter(v => v !== undefined && v !== null);
    ranges[cr.key] = { mn: Math.min(...vals), mx: Math.max(...vals) };
  });

  const scored = locs.map(d => {
    let tot = 0, maxTot = 0;
    CRITERIA.forEach(cr => {
      const w = S.weights[cr.key] || 0;
      if (!w) return;
      const idx = F[cr.key];
      if (idx === undefined) return;
      tot += normalize(d[idx], ranges[cr.key].mn, ranges[cr.key].mx, cr.hi) * w;
      maxTot += 10 * w;
    });
    return { d, score: tot, max: maxTot, pct: maxTot > 0 ? (tot/maxTot)*100 : 0 };
  }).sort((a,b) => b.score - a.score).slice(0, 10);

  const rows = scored.map((item, idx) => {
    const d = item.d;
    const rep = d[F.REP];
    const pc  = polColor(rep);
    const gun = GUN_CATEGORIES.find(g => g.val === d[F.GUN]);
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`;
    const zlink = zillowUrl(d[F.NAME], d[F.ST]);

    const hR = isHurricane(d), fR = isWildfire(d);
    const qR = quakeRisk(d) >= 3, tR = tornadoRisk(d) >= 3, flR = floodRisk(d) >= 3;

    const chips = [
      hR  ? '<span class="chip ch">🌀 Hurrikan</span>' : '',
      fR  ? '<span class="chip cf">🔥 Waldbrand</span>' : '',
      qR  ? '<span class="chip cq">🌍 Erdbeben</span>' : '',
      tR  ? '<span class="chip ct">🌪️ Tornado</span>' : '',
      flR ? '<span class="chip cfl">🌊 Flut</span>' : '',
      (!hR&&!fR&&!qR&&!tR&&!flR) ? '<span class="chip cs">✓ Kein Risiko</span>' : '',
    ].join('');

    const p = v => v < 300 ? 'g' : v < 550 ? 'w' : 'r';
    const c = v => v < 200 ? 'g' : v < 400 ? 'w' : 'r';

    return `
    <div class="rc ${idx<3?'r'+idx:''}">
      <div class="rc-top">
        <div class="rc-medal">${medal}</div>
        <div class="rc-info">
          <div class="rc-name">${d[F.NAME]}, ${d[F.ST]}</div>
          <div class="rc-sub">${d[F.TJUL]}°C Juli · ${d[F.TDEC]}°C Dez · $${d[F.PRICE]}k · ${d[F.SUN]}h Sonne</div>
        </div>
        <div class="rc-pts"><span class="pts-main">${Math.round(item.score)}</span><span class="pts-sub">/${Math.round(item.max)}</span></div>
      </div>
      <div class="rc-bar"><div class="rcbf" style="width:${item.pct.toFixed(1)}%"></div></div>
      <div class="rc-grid">
        <div class="rv"><div class="rl">Hauspreis</div><div class="rv2 ${p(d[F.PRICE])}">$${d[F.PRICE]}k</div></div>
        <div class="rv"><div class="rl">Miete</div><div class="rv2">$${d[F.RENT]}/mo</div></div>
        <div class="rv"><div class="rl">Einkommen</div><div class="rv2">$${d[F.INC]}k</div></div>
        <div class="rv"><div class="rl">Kriminalität</div><div class="rv2 ${c(d[F.VCRIME])}">${d[F.VCRIME]}</div></div>
        <div class="rv"><div class="rl">Arbeitslos.</div><div class="rv2">${d[F.UNEMP]}%</div></div>
        <div class="rv"><div class="rl">Strand</div><div class="rv2">${d[F.BEACH]} mi</div></div>
        <div class="rv"><div class="rl">Berge ab</div><div class="rv2">${d[F.MTN]} mi</div></div>
        <div class="rv"><div class="rl">Metropole</div><div class="rv2">${d[F.CITY]} mi</div></div>
        <div class="rv"><div class="rl">Sonne h/yr</div><div class="rv2">${d[F.SUN]}</div></div>
        <div class="rv"><div class="rl">Regen"</div><div class="rv2">${d[F.RAIN]}"</div></div>
        <div class="rv"><div class="rl">Luftfeuchte</div><div class="rv2">${d[F.HUMID]}%</div></div>
        <div class="rv"><div class="rl">AQI</div><div class="rv2">${d[F.AQI]}</div></div>
        <div class="rv"><div class="rl">Walk Score</div><div class="rv2">${d[F.WALK]}</div></div>
        <div class="rv"><div class="rl">Bike Score</div><div class="rv2">${d[F.BIKE]}</div></div>
        <div class="rv"><div class="rl">Breitband</div><div class="rv2">${d[F.BROAD]}%</div></div>
        <div class="rv"><div class="rl">Bachelor+</div><div class="rv2">${d[F.COLLEGE]}%</div></div>
        <div class="rv"><div class="rl">Grundsteuer</div><div class="rv2">${d[F.PROPTAX]}%</div></div>
        <div class="rv"><div class="rl">Einkommenst.</div><div class="rv2">${d[F.STATETAX]}%</div></div>
        <div class="rv"><div class="rl">Krankenhaus</div><div class="rv2">${d[F.HOSP]} mi</div></div>
        <div class="rv"><div class="rl">Flughafen</div><div class="rv2">${d[F.AIRPORT]} mi</div></div>
      </div>
      <div class="pbar-wrap">
        <div class="pbar-track">
          <div class="pbar-dot" style="left:${rep}%;background:${pc};box-shadow:0 0 6px ${pc}"></div>
        </div>
        <div class="pbar-labels">
          <span style="color:#2255ee">◀ Demokratisch</span>
          <span style="color:${pc};font-weight:700">${polLabel(rep)}</span>
          <span style="color:#cc2020">Republikanisch ▶</span>
        </div>
      </div>
      <div class="rc-foot">
        <div class="chips">${chips}<span class="chip cg">${gun?gun.label:'—'}</span></div>
        <a href="${zlink}" target="_blank" class="zb">🏠 Zillow</a>
      </div>
    </div>`;
  });

  cont.innerHTML = `
    <div class="mr-head"><h2>Top ${scored.length} Counties</h2><span>von ${locs.length} passenden</span></div>
    <div class="rlist">${rows.join('')}</div>`;
}

// ═══ PAGE NAV ═════════════════════════════════════════════════
function showPage(n) {
  document.querySelectorAll('.page').forEach((p,i) => p.classList.toggle('active', i+1 === n));
  document.querySelectorAll('.ptab').forEach((b,i) => b.classList.toggle('active', i+1 === n));
  if (n === 1) setTimeout(() => S.map && S.map.invalidateSize(), 60);
  if (n === 2) renderMatrix();
}

function goMatrix() { showPage(2); }

// ═══ INIT ═════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  buildPolChips();
  buildGunChips();
  buildWeightPanel();
  initMap();

  // Initial display of filter values
  ['jul','dez','sun','rain','inc'].forEach(k => {
    const lo = el(`f-${k}-lo`), hi = el(`f-${k}-hi`);
    if (lo && hi) {
      const fmt = {
        jul:  (l,h) => `${l}°C–${h}°C`,
        dez:  (l,h) => `${l}°C–${h}°C`,
        sun:  (l,h) => `${l}–${h} h`,
        rain: (l,h) => `${l}"–${h}"`,
        inc:  (l,h) => `$${l}k–$${h}k`,
      }[k];
      const ve = el(`fv-${k}`);
      if (ve && fmt) ve.textContent = fmt(lo.value, hi.value);
    }
  });

  const singles = [
    ['f-price',   'fv-price',   v=>`$${v}k`],
    ['f-rent',    'fv-rent',    v=>`$${v}/mo`],
    ['f-beach',   'fv-beach',   v=>`${v} mi`],
    ['f-city',    'fv-city',    v=>`${v} mi`],
    ['f-mtn',     'fv-mtn',     v=>`${v} mi`],
    ['f-humid',   'fv-humid',   v=>`${v}%`],
    ['f-aqi',     'fv-aqi',     v=>`AQI ${v}`],
    ['f-hosp',    'fv-hosp',    v=>`${v} mi`],
    ['f-airport', 'fv-airport', v=>`${v} mi`],
    ['f-unemp',   'fv-unemp',   v=>`${v}%`],
    ['f-popden',  'fv-popden',  v=>`${v}/qmi`],
  ];
  singles.forEach(([sid, vid, fmt]) => {
    const s = el(sid);
    if (!s) return;
    const pct = ((+s.value - +s.min) / (+s.max - +s.min)) * 100;
    s.style.background = `linear-gradient(to right,var(--amber) ${pct}%,var(--s3) ${pct}%)`;
    const ve = el(vid);
    if (ve) ve.textContent = fmt(s.value);
  });

  applyFilters();
});
