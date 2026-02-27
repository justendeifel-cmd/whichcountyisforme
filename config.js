'use strict';

// ═══ SPALTEN-INDEX ════════════════════════════════════════════
const F = {
  NAME:0,  ST:1,   LAT:2,   LNG:3,
  TJUL:4,  TDEC:5,
  PRICE:6, RENT:7,
  BEACH:8, CITY:9, MTN:10,
  INC:11,  VCRIME:12, REP:13,
  UNEMP:14, POPDEN:15,
  RAIN:16, HUMID:17, SUN:18,
  AQI:19,
  WALK:20, BIKE:21, TRANSIT:22,
  BROAD:23,
  PROPTAX:24, STATETAX:25,
  GUN:26,  COLLEGE:27,
  QUAKE:28, TORNADO:29, FLOOD:30,
  HOSP:31, AIRPORT:32,
  PARK:33, EXPAT:34
};

// ═══ STAATLICHE EINKOMMENSTEUER (max %) ═══════════════════════
const STATE_TAX = {
  AK:0,FL:0,NV:0,NH:0,SD:0,TN:0,TX:0,WA:0,WY:0,
  AZ:2.5,CO:4.4,IL:4.95,IN:3.15,KY:4.5,MI:4.25,
  NC:4.75,ND:2.5,OH:3.99,PA:3.07,UT:4.65,
  AL:5,AR:4.7,DE:6.6,GA:5.75,ID:5.8,IA:6,
  KS:5.7,LA:4.25,ME:7.15,MD:5.75,MA:5,MS:5,
  MO:4.95,MT:6.75,NE:6.84,NJ:10.75,NM:5.9,NY:10.9,
  OK:4.75,RI:5.99,SC:6.5,VA:5.75,VT:8.75,WI:7.65,WV:5.12,
  CA:13.3,MN:9.85,OR:9.9,HI:11,CT:6.99
};

// ═══ WAFFENGESETZE PER STAAT 1=sehr streng…5=sehr locker ═════
const STATE_GUN = {
  CA:1,NJ:1,MA:1,HI:1,NY:1,CT:1,IL:1,MD:1,
  WA:2,OR:2,CO:2,NM:2,VA:2,DE:2,RI:2,VT:2,MN:2,
  FL:3,AZ:3,NC:3,GA:3,WI:3,MI:3,OH:3,PA:3,
  IN:3,NV:3,ME:3,NH:3,IA:3,NE:3,SC:3,UT:3,KS:3,
  TX:4,TN:4,AL:4,MS:4,AR:4,LA:4,MO:4,OK:4,
  ID:4,KY:4,WV:4,SD:4,ND:4,MT:4,
  AK:5,WY:5
};

// ═══ GRUNDSTEUER PER STAAT (Ø %) ══════════════════════════════
const STATE_PROPTAX = {
  HI:0.29,AL:0.40,LA:0.55,SC:0.57,CO:0.51,DE:0.56,WV:0.59,
  WY:0.61,AZ:0.63,AR:0.65,ID:0.73,CA:0.74,MS:0.78,NM:0.80,
  NC:0.82,VA:0.82,MT:0.84,KY:0.86,IN:0.87,GA:0.87,NV:0.59,
  TN:0.66,FL:0.91,OK:0.90,OR:0.94,MO:1.01,WA:1.03,ND:1.04,
  MA:1.14,MD:1.09,SD:1.14,MN:1.11,AK:0.89,UT:0.62,ME:1.36,
  KS:1.41,MI:1.54,RI:1.53,IA:1.57,PA:1.58,OH:1.59,WI:1.61,
  TX:1.80,NE:1.73,NY:1.73,CT:1.79,VT:1.90,NH:2.18,IL:2.07,NJ:2.49
};

// ═══ POLITISCHE KATEGORIEN ════════════════════════════════════
const POL_CATEGORIES = [
  {key:'mostly_blue',   label:'🔵🔵 Stark Demokratisch', min:0,  max:35,  color:'#2255ee'},
  {key:'slightly_blue', label:'🔵 Eher Demokratisch',    min:35, max:45,  color:'#5588ff'},
  {key:'swing',         label:'🟣 Swing County',          min:45, max:55,  color:'#9040cc'},
  {key:'slightly_red',  label:'🔴 Eher Republikanisch',   min:55, max:65,  color:'#ff5555'},
  {key:'mostly_red',    label:'🔴🔴 Stark Republikanisch',min:65, max:100, color:'#cc2020'},
];

// ═══ WAFFENGESETZE KATEGORIEN ════════════════════════════════
const GUN_CATEGORIES = [
  {
    val:1, label:'🔒🔒 Sehr Streng',
    desc:'CA · NY · MA · NJ · HI · CT · IL · MD',
    def:'Umfassende Hintergrundprüfung, Wartezeit 10–14 Tage, Waffenregister, Verbot von Sturmgewehren & Hochkapazitätsmagazinen, "May-Issue"-Tragegenehmigung (Behörde entscheidet nach Ermessen), Red-Flag-Gesetze, sichere Aufbewahrungspflicht.'
  },
  {
    val:2, label:'🔒 Streng',
    desc:'WA · OR · CO · NM · VA · VT · MN · DE',
    def:'Universelle Hintergrundprüfung (auch Privatverkäufe), Wartezeit 3–7 Tage, teilweise Verbot großer Magazine, Red-Flag-Gesetze vorhanden, "Shall-Issue"-Tragegenehmigung (Genehmigung bei Erfüllung der Voraussetzungen).'
  },
  {
    val:3, label:'⚖️ Moderat',
    desc:'FL · AZ · NC · GA · OH · PA · NV · UT',
    def:'"Shall-Issue" Tragegenehmigung, Hintergrundprüfung bei lizenzierten Händlern, keine universelle Prüfung bei Privatverkäufen, keine Wartezeit in den meisten Fällen, begrenzte Red-Flag-Gesetze, keine generellen Sturmgewehrverbote.'
  },
  {
    val:4, label:'🔓 Locker',
    desc:'TX · TN · AL · AR · MO · OK · ID · MT',
    def:'"Permitless Carry" (verdecktes Tragen ohne Genehmigung), keine Wartezeit, keine universellen Hintergrundprüfungen bei Privatverkäufen, keine Red-Flag-Gesetze, Sturmgewehre legal, offenes Tragen (Open Carry) erlaubt.'
  },
  {
    val:5, label:'🔓🔓 Sehr Locker',
    desc:'AK · WY',
    def:'Vollständiges "Constitutional Carry" — offenes und verdecktes Tragen ohne jegliche Genehmigung oder Registrierung für alle legalen Waffenbesitzer. Keinerlei staatliche Einschränkungen über Bundesgesetz hinaus, keine Wartezeiten, keine Registrierungspflicht.'
  },
];

// ═══ MATRIX-KRITERIEN ════════════════════════════════════════
const CRITERIA = [
  {key:'TJUL',    icon:'☀️', label:'Sommer-Klima',        unit:'°C',   hi:true,  w:3},
  {key:'TDEC',    icon:'❄️', label:'Winter-Milde',         unit:'°C',   hi:true,  w:4},
  {key:'PRICE',   icon:'🏡', label:'Hauspreis',            unit:'$k',   hi:false, w:4},
  {key:'RENT',    icon:'🏘️', label:'Monatsmiete',          unit:'$/mo', hi:false, w:3},
  {key:'BEACH',   icon:'🏖️', label:'Strandnähe',           unit:'mi',   hi:false, w:3},
  {key:'CITY',    icon:'🏙️', label:'Großstadt-Nähe',       unit:'mi',   hi:false, w:2},
  {key:'MTN',     icon:'⛰️', label:'Bergnähe',             unit:'mi',   hi:false, w:2},
  {key:'INC',     icon:'💵', label:'Ø Einkommen',          unit:'$k',   hi:true,  w:2},
  {key:'VCRIME',  icon:'🔒', label:'Kriminalität',         unit:'/100k',hi:false, w:3},
  {key:'UNEMP',   icon:'📉', label:'Arbeitslosenquote',    unit:'%',    hi:false, w:2},
  {key:'POPDEN',  icon:'👥', label:'Bevölkerungsdichte',   unit:'/qmi', hi:false, w:1},
  {key:'RAIN',    icon:'💧', label:'Jahresniederschlag',   unit:'"',    hi:true,  w:2},
  {key:'HUMID',   icon:'🌡️', label:'Luftfeuchtigkeit',     unit:'%',    hi:false, w:2},
  {key:'SUN',     icon:'🌞', label:'Sonnenstunden/Jahr',   unit:'h',    hi:true,  w:3},
  {key:'AQI',     icon:'🌬️', label:'Luftqualität (AQI)',   unit:'',     hi:false, w:2},
  {key:'WALK',    icon:'🚶', label:'Walkability',          unit:'/100', hi:true,  w:2},
  {key:'BIKE',    icon:'🚲', label:'Fahrradfreundlich',    unit:'/100', hi:true,  w:2},
  {key:'TRANSIT', icon:'🚌', label:'Öffentl. Verkehr',     unit:'/100', hi:true,  w:1},
  {key:'BROAD',   icon:'🌐', label:'Breitband-Internet',   unit:'%',    hi:true,  w:2},
  {key:'COLLEGE', icon:'🎓', label:'Hochschulabschlüsse',  unit:'%',    hi:true,  w:2},
  {key:'PARK',    icon:'🌿', label:'Nationalpark-Nähe',    unit:'mi',   hi:false, w:2},
  {key:'EXPAT',   icon:'🇩🇪', label:'Expat-Community',     unit:'/10',  hi:true,  w:2},
];
