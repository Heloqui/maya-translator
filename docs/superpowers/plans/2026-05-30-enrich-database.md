# Enrich Maya Translator Database — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add academic depth to the Maya Translator app — expanded dictionary (~300 entries), 20 real inscriptions with block-by-block reading, 20 archaeological sites with interactive map, quiz system, and cross-linking between all sections.

**Architecture:** Static JSON data files consumed by Next.js 15 client components. No backend, no DB. New pages follow existing pattern: `src/app/<route>/page.js` as `'use client'` components using `useLang()` for i18n. New data accessed via `src/lib/data.js` functions. Leaflet for the map (only external dependency added).

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, Leaflet + react-leaflet (new), static JSON data files.

**Spec:** `docs/superpowers/specs/2026-05-30-enrich-database-design.md`

---

## File Structure

### New data files:
- `data/inscriptions.json` — 20 inscriptions with block-by-block readings
- `data/sites.json` — 20 archaeological sites with coordinates

### New pages:
- `src/app/inscriptions/page.js` — inscription list with filters
- `src/app/inscriptions/[id]/page.js` — inscription detail (block reader)
- `src/app/sites/page.js` — interactive map with site cards
- `src/app/quiz/page.js` — quiz engine with 3 modes

### New components:
- `src/components/InscriptionCard.jsx` — inscription list item
- `src/components/BlockReader.jsx` — block-by-block inscription reader
- `src/components/SiteMap.jsx` — Leaflet map wrapper
- `src/components/SiteCard.jsx` — site info popup/card
- `src/components/QuizEngine.jsx` — quiz logic + UI

### Modified files:
- `data/dictionary.json` — add new fields + new categories + ~200 new entries
- `src/lib/data.js` — add getInscriptions(), getSites(), getQuizQuestions()
- `src/lib/lang.js` — add i18n strings for new pages
- `src/components/Sidebar.jsx` — add 3 new nav items
- `src/components/DictionaryEntry.jsx` — show new fields + inscription links
- `src/components/GlyphDetail.jsx` — show inscription links
- `src/app/page.js` — update stats for new data

---

## Task 1: Expand dictionary.json — new fields on existing entries

**Files:**
- Modify: `data/dictionary.json`

This task adds the new optional fields (`thompson`, `etymology`, `cognates`, `usage_examples`, `inscriptions`, `subcategory`, `frequency`) to existing entries. Not all entries will have all fields — only where academically justified.

- [ ] **Step 1: Read existing dictionary.json and understand current structure**

Run: `node -e "const d = require('./data/dictionary.json'); console.log(Object.keys(d)); console.log('Total:', Object.values(d).filter(Array.isArray).reduce((a,b) => a+b.length, 0))"`

Expected: List of categories + total count ~99

- [ ] **Step 2: Add new fields to titles_and_ranks entries**

In `data/dictionary.json`, enrich `titles_and_ranks` entries. Example for the first entry — apply same pattern to all 13:

```json
{
  "maya": "ajaw",
  "spanish": "señor, gobernante",
  "english": "lord, ruler",
  "confidence": "confirmed",
  "thompson": ["T533"],
  "etymology": "Proto-ch'olano *ajaw",
  "cognates": { "kiche": "ajaw", "yucatec": "ajaw" },
  "usage_examples": ["K'uhul B'aakal Ajaw"],
  "inscriptions": ["palenque-sarcophagus", "copan-stela-a"],
  "subcategory": "royalty",
  "frequency": "very_high"
}
```

Entries to enrich (all 13 titles): ajaw, k'uhul ajaw, kaloomte', sajal, b'aah ajaw, ch'ok, lakam, yajaw k'ahk', ti'sakhuun, b'aahkab', aj k'uhuun, itz'aat, wayom.

For each entry, add only the fields that are verifiable. Minimum: `thompson` (if known), `frequency`, `subcategory`. Optional: `etymology`, `cognates`, `usage_examples`, `inscriptions`.

- [ ] **Step 3: Add new fields to verbs**

Same enrichment pattern for the 21 verb entries. All verbs get at minimum: `frequency`, `subcategory` (e.g., "accession", "warfare", "ritual", "motion"). Where known, add `thompson`, `usage_examples`, `inscriptions`.

- [ ] **Step 4: Add new fields to nouns, adjectives, directional_terms, death/war expressions**

Same enrichment pattern for remaining categories. Each entry gets at minimum `frequency` and `subcategory`.

- [ ] **Step 5: Validate the enriched dictionary**

Run: `node -e "const d = require('./data/dictionary.json'); let total = 0; for (const [k,v] of Object.entries(d)) { if (Array.isArray(v)) { console.log(k + ':', v.length); total += v.length; const withThompson = v.filter(e => e.thompson).length; console.log('  with thompson:', withThompson); } } console.log('Total:', total)"`

Expected: Same 99 entries, many now with thompson/frequency/subcategory fields.

- [ ] **Step 6: Commit**

```bash
git add data/dictionary.json
git commit -m "feat: enrich existing dictionary entries with thompson, frequency, etymology"
```

---

## Task 2: Expand dictionary.json — new categories and entries (~200 new)

**Files:**
- Modify: `data/dictionary.json`

Add new categories: `kinship`, `architecture`, `flora_fauna`, `astronomy`, `rituals`, `toponyms`, `body_parts`, `time_periods`.

- [ ] **Step 1: Add kinship category (~15 entries)**

Add to `data/dictionary.json` a new key `"kinship"` with entries like:

```json
"kinship": [
  {
    "maya": "mam",
    "spanish": "abuelo, ancestro",
    "english": "grandfather, ancestor",
    "confidence": "confirmed",
    "thompson": ["T607"],
    "frequency": "high",
    "subcategory": "elder"
  },
  {
    "maya": "na'",
    "spanish": "madre",
    "english": "mother",
    "confidence": "confirmed",
    "frequency": "high",
    "subcategory": "parent"
  },
  {
    "maya": "yum",
    "spanish": "padre, señor",
    "english": "father, lord",
    "confidence": "confirmed",
    "frequency": "high",
    "subcategory": "parent"
  },
  {
    "maya": "atan",
    "spanish": "esposa",
    "english": "wife",
    "confidence": "confirmed",
    "frequency": "medium",
    "subcategory": "spouse"
  },
  {
    "maya": "nich'an",
    "spanish": "hijo (de padre)",
    "english": "son (of father)",
    "confidence": "confirmed",
    "frequency": "medium",
    "subcategory": "child"
  },
  {
    "maya": "yal",
    "spanish": "hijo/a (de madre)",
    "english": "child (of mother)",
    "confidence": "confirmed",
    "frequency": "medium",
    "subcategory": "child"
  },
  {
    "maya": "yitzihn",
    "spanish": "hermano menor",
    "english": "younger brother",
    "confidence": "confirmed",
    "frequency": "medium",
    "subcategory": "sibling"
  },
  {
    "maya": "sakuun",
    "spanish": "hermano mayor",
    "english": "elder brother",
    "confidence": "confirmed",
    "frequency": "medium",
    "subcategory": "sibling"
  },
  {
    "maya": "mihin",
    "spanish": "hijo",
    "english": "child, offspring",
    "confidence": "probable",
    "frequency": "medium",
    "subcategory": "child"
  },
  {
    "maya": "ix",
    "spanish": "mujer, femenino",
    "english": "woman, feminine prefix",
    "confidence": "confirmed",
    "thompson": ["T1000"],
    "frequency": "very_high",
    "subcategory": "gender"
  },
  {
    "maya": "winik",
    "spanish": "persona, hombre",
    "english": "person, man",
    "confidence": "confirmed",
    "thompson": ["T521"],
    "frequency": "very_high",
    "subcategory": "general"
  },
  {
    "maya": "ch'ok",
    "spanish": "joven, príncipe",
    "english": "youth, young prince",
    "confidence": "confirmed",
    "thompson": ["T561"],
    "frequency": "high",
    "subcategory": "age"
  }
]
```

- [ ] **Step 2: Add architecture category (~15 entries)**

Add `"architecture"` key with entries for: nah (house), otoot (home), pib'naah (sweat bath), wayib' (dormitory), k'uhul nah (temple), yotoot (palace), ek'huun (black house), tzak (building), lakam-ha' (large water - Palenque), witz (mountain-pyramid), hol (hole/doorway), peten (island), sak nah (white house), b'ih (road/sacbe), kaloomte'-nah (warrior house).

Each entry follows the same schema with: maya, spanish, english, confidence, frequency, subcategory. Add thompson where known.

- [ ] **Step 3: Add flora_fauna category (~15 entries)**

Add `"flora_fauna"` with: b'ahlam (jaguar), mo' (macaw), muwan (hawk), k'uk' (quetzal), tz'ikin (bird), chan/kaan (serpent), hix (jaguar/ocelot), chij (deer), b'alam (jaguar variant), ahiin (crocodile), wahyis (spirit animal), ik'at (load), kakaw (cacao), nal (maize), che' (tree).

- [ ] **Step 4: Add astronomy category (~12 entries)**

Add `"astronomy"` with: k'in (sun/day), uh (moon), ek' (star), k'ahk' (fire), ha' (water/rain), ik' (wind), muyal (cloud), chaahk (rain god), k'inich (sun-eyed), yax ek' (Venus as morning star), chak ek' (Venus as evening star), way (dream/spirit).

- [ ] **Step 5: Add rituals category (~15 entries)**

Add `"rituals"` with: ch'am (receive/take), k'al (bind/wrap), chok (scatter/offer), jub'uy (descend), tzak (conjure), k'uh (god/sacred), pib' (underground oven/offering), way (spirit companion), ohl (heart/center), b'aah (head/self/image), tz'ihb' (writing/painting), ak'ot (dance), ch'ab' (creation/penance), pax (drumming), lok' (exit/emerge).

- [ ] **Step 6: Add toponyms category (~10 entries)**

Add `"toponyms"` with place-name readings from inscriptions: lakamha' (Palenque), mutal (Tikal), uxwitza' (Copán), pa'chan (Yaxchilán), kaan (Calakmul), saal (Naranjo), huxwitza' (Caracol), b'aakal (Palenque kingdom), waka' (El Perú), yokib' (Piedras Negras).

- [ ] **Step 7: Add body_parts category (~10 entries)**

Add `"body_parts"` with: b'aah (head), chi' (mouth), ich (eye), jol (skull/head), k'ab' (hand), ook (foot), ti' (mouth/edge), nak (belly), ohl (heart), b'aak (bone).

- [ ] **Step 8: Add time_periods category (~10 entries)**

Add `"time_periods"` with: k'in (day), winik/winal (20-day month), tun (360-day year), k'atun (7,200 days), b'ak'tun (144,000 days), haab' (365-day year), pih (b'ak'tun variant), winikhaab' (k'atun variant), k'altuun (stone-binding), lahuntun (half-k'atun).

- [ ] **Step 9: Update metadata count**

In `data/dictionary.json`, update `metadata.entries` to reflect new total count and update `metadata.categories` array.

- [ ] **Step 10: Validate expanded dictionary**

Run: `node -e "const d = require('./data/dictionary.json'); let total = 0; for (const [k,v] of Object.entries(d)) { if (Array.isArray(v)) { console.log(k + ':', v.length); total += v.length; } } console.log('Total:', total)"`

Expected: ~300 total entries across ~16 categories.

- [ ] **Step 11: Commit**

```bash
git add data/dictionary.json
git commit -m "feat: expand dictionary to ~300 entries with 8 new categories"
```

---

## Task 3: Create inscriptions.json — 20 iconic monuments

**Files:**
- Create: `data/inscriptions.json`

- [ ] **Step 1: Create inscriptions.json with structure and first 5 inscriptions**

Create `data/inscriptions.json` with this structure. Start with the 5 most famous inscriptions, each with 3-6 glyph blocks minimum:

```json
{
  "metadata": {
    "name": "Classic Maya Inscription Corpus",
    "version": "0.1.0",
    "description": "Selected inscriptions from major Classic Maya sites with block-by-block transliteration",
    "entries": 20,
    "sources": [
      "Schele, L. & Freidel, D. (1990). A Forest of Kings.",
      "Martin, S. & Grube, N. (2000). Chronicle of the Maya Kings and Queens.",
      "Stuart, D. Various publications.",
      "Montgomery, J. (2002). Dictionary of Maya Hieroglyphs."
    ]
  },
  "inscriptions": [
    {
      "id": "palenque-sarcophagus",
      "name": { "es": "Lápida del Sarcófago de Pakal", "en": "Pakal's Sarcophagus Lid" },
      "site": "palenque",
      "date_long_count": "9.12.11.5.18",
      "date_gregorian": "683 d.C.",
      "type": "funerary",
      "description": {
        "es": "La lápida del sarcófago de K'inich Janaab Pakal en el Templo de las Inscripciones. Una de las obras maestras del arte maya, muestra al rey descendiendo al inframundo.",
        "en": "The sarcophagus lid of K'inich Janaab Pakal in the Temple of the Inscriptions. One of the masterpieces of Maya art, showing the king descending to the underworld."
      },
      "historical_context": {
        "es": "Pakal gobernó Palenque por 68 años (615-683 d.C.), el reinado más largo documentado en la historia maya. Su tumba fue descubierta por Alberto Ruz Lhuillier en 1952.",
        "en": "Pakal ruled Palenque for 68 years (615-683 CE), the longest documented reign in Maya history. His tomb was discovered by Alberto Ruz Lhuillier in 1952."
      },
      "blocks": [
        {
          "position": "A1-B1",
          "glyphs": ["T740", "T533"],
          "transliteration": "K'UHUL-AJAW",
          "transcription": "k'uhul ajaw",
          "translation": { "es": "señor sagrado", "en": "holy lord" },
          "notes": { "es": "Título real estándar del gobernante", "en": "Standard royal title of the ruler" }
        },
        {
          "position": "A2-B2",
          "glyphs": ["T606", "T533"],
          "transliteration": "B'AAKAL-AJAW",
          "transcription": "b'aakal ajaw",
          "translation": { "es": "señor de B'aakal", "en": "lord of B'aakal" },
          "notes": { "es": "B'aakal es el nombre antiguo del reino de Palenque", "en": "B'aakal is the ancient name of the Palenque kingdom" }
        },
        {
          "position": "A3",
          "glyphs": ["T510"],
          "transliteration": "CHAM-i",
          "transcription": "chami",
          "translation": { "es": "murió", "en": "he died" },
          "notes": { "es": "Expresión de muerte estándar en inscripciones dinásticas", "en": "Standard death expression in dynastic inscriptions" }
        },
        {
          "position": "A4-B4",
          "glyphs": ["T544", "T548"],
          "transliteration": "9-K'IN 12-TUN",
          "transcription": "b'alonlajun k'in lahchan tun",
          "translation": { "es": "9 días, 12 tunes", "en": "9 days, 12 tuns" },
          "notes": { "es": "Parte de la fecha de Cuenta Larga", "en": "Part of the Long Count date" }
        }
      ],
      "source": "Schele & Freidel, 1990; Ruz Lhuillier, 1973",
      "image_credit": "Drawing by Merle Greene Robertson"
    }
  ]
}
```

The first 5 inscriptions to include:
1. `palenque-sarcophagus` — Pakal's Sarcophagus Lid (funerary, 683 CE)
2. `palenque-tablet-cross` — Tablet of the Cross (mythological, 692 CE)
3. `yaxchilan-lintel-24` — Lintel 24 (bloodletting ritual, ~725 CE)
4. `copan-stela-a` — Stela A (royal portrait, 731 CE)
5. `tikal-stela-31` — Stela 31 (dynastic history, ~445 CE)

Each with 3-6 blocks minimum, full bilingual translations, historical context, and source citations.

- [ ] **Step 2: Add inscriptions 6-10**

Add 5 more inscriptions:
6. `quirigua-stela-c` — Stela C (creation mythology, 775 CE)
7. `copan-altar-q` — Altar Q (16 rulers dynasty, 776 CE)
8. `palenque-96-glyphs` — Panel of 96 Glyphs (dynastic record)
9. `yaxchilan-lintel-25` — Lintel 25 (vision serpent ritual, ~725 CE)
10. `bonampak-murals` — Bonampak Murals captions (warfare, ~790 CE)

Same structure: id, name (es/en), site, date, type, description (es/en), historical_context (es/en), blocks array, source, image_credit.

- [ ] **Step 3: Add inscriptions 11-15**

11. `copan-hieroglyphic-stairway` — Hieroglyphic Stairway (dynastic, ~755 CE)
12. `palenque-tablet-palace` — Palace Tablet (accession, 720 CE)
13. `vase-seven-gods` — Vase of the Seven Gods K2796 (mythological)
14. `yaxchilan-lintel-26` — Lintel 26 (warfare, ~725 CE)
15. `piedras-negras-stela-3` — Stela 3 (accession, 687 CE)

- [ ] **Step 4: Add inscriptions 16-20**

16. `cancuen-panel-3` — Panel 3 (political alliance, 799 CE)
17. `dos-pilas-stela-16` — Stela 16 (warfare, 735 CE)
18. `naranjo-stela-24` — Stela 24 (Lady Six Sky, 682 CE)
19. `calakmul-stela-51` — Stela 51 (Yuknoom Yich'aak K'ahk', 731 CE)
20. `san-bartolo-murals` — San Bartolo Murals (earliest known Maya text, ~100 BCE)

- [ ] **Step 5: Validate inscriptions data**

Run: `node -e "const d = require('./data/inscriptions.json'); console.log('Total:', d.inscriptions.length); d.inscriptions.forEach(i => console.log(i.id, '—', i.blocks.length, 'blocks,', i.type)); const sites = [...new Set(d.inscriptions.map(i => i.site))]; console.log('Sites referenced:', sites.length, sites)"`

Expected: 20 inscriptions, blocks per each, multiple sites referenced.

- [ ] **Step 6: Commit**

```bash
git add data/inscriptions.json
git commit -m "feat: add 20 inscriptions with block-by-block transliteration"
```

---

## Task 4: Create sites.json — 20 archaeological sites

**Files:**
- Create: `data/sites.json`

- [ ] **Step 1: Create sites.json with first 10 sites**

Create `data/sites.json`:

```json
{
  "metadata": {
    "name": "Classic Maya Archaeological Sites",
    "version": "0.1.0",
    "description": "Major archaeological sites of the Classic Maya civilization with geographic and dynastic data",
    "entries": 20,
    "sources": [
      "Martin, S. & Grube, N. (2000). Chronicle of the Maya Kings and Queens.",
      "Sharer, R. & Traxler, L. (2006). The Ancient Maya.",
      "Coe, M. & Houston, S. (2015). The Maya."
    ]
  },
  "regions": {
    "peten": { "es": "Petén Central", "en": "Central Petén" },
    "usumacinta": { "es": "Cuenca del Usumacinta", "en": "Usumacinta Basin" },
    "motagua": { "es": "Valle del Motagua", "en": "Motagua Valley" },
    "puuc": { "es": "Región Puuc", "en": "Puuc Region" },
    "northern_lowlands": { "es": "Tierras Bajas del Norte", "en": "Northern Lowlands" },
    "southern_lowlands": { "es": "Tierras Bajas del Sur", "en": "Southern Lowlands" },
    "peten_lakes": { "es": "Lagos del Petén", "en": "Petén Lakes" },
    "rio_bec": { "es": "Río Bec", "en": "Río Bec" }
  },
  "sites": [
    {
      "id": "palenque",
      "name": { "es": "Palenque", "en": "Palenque" },
      "ancient_name": "Lakamha'",
      "meaning": { "es": "Lugar de Grandes Aguas", "en": "Place of Great Waters" },
      "coordinates": { "lat": 17.4838, "lng": -92.0461 },
      "region": "usumacinta",
      "country": "MX",
      "period": { "from": "226", "to": "799", "peak": "615-683" },
      "dynasty": "B'aakal",
      "emblem_glyph": "B'AAKAL-AJAW",
      "notable_rulers": [
        { "name": "K'inich Janaab Pakal", "reign": "615-683", "aka": "Pakal el Grande" },
        { "name": "K'inich Kan B'alam II", "reign": "684-702" },
        { "name": "K'inich Ahkal Mo' Nahb III", "reign": "721-736" }
      ],
      "inscriptions": ["palenque-sarcophagus", "palenque-tablet-cross", "palenque-96-glyphs", "palenque-tablet-palace"],
      "description": {
        "es": "Ciudad-estado maya en las estribaciones de la Sierra de Chiapas. Famosa por su arquitectura elegante, el Templo de las Inscripciones y la tumba de Pakal. Sus inscripciones son las más extensas y mejor preservadas del mundo maya.",
        "en": "Maya city-state in the foothills of the Chiapas highlands. Famous for its elegant architecture, the Temple of the Inscriptions, and Pakal's tomb. Its inscriptions are among the most extensive and best-preserved in the Maya world."
      },
      "sources": ["Martin & Grube, 2000", "Schele & Freidel, 1990"]
    },
    {
      "id": "tikal",
      "name": { "es": "Tikal", "en": "Tikal" },
      "ancient_name": "Mutal",
      "meaning": { "es": "Lugar de las Voces", "en": "Place of Voices" },
      "coordinates": { "lat": 17.2220, "lng": -89.6237 },
      "region": "peten",
      "country": "GT",
      "period": { "from": "-400", "to": "869", "peak": "682-810" },
      "dynasty": "Mutal",
      "emblem_glyph": "MUTAL-AJAW",
      "notable_rulers": [
        { "name": "Siyaj K'ahk'", "reign": "378-?", "aka": "Llegada de fuego" },
        { "name": "Jasaw Chan K'awiil I", "reign": "682-734" },
        { "name": "Yik'in Chan K'awiil", "reign": "734-766" }
      ],
      "inscriptions": ["tikal-stela-31"],
      "description": {
        "es": "Una de las ciudades más grandes y poderosas del mundo maya clásico, ubicada en el corazón del Petén guatemalteco. Sus templos-pirámide alcanzan más de 70 metros de altura.",
        "en": "One of the largest and most powerful cities in the Classic Maya world, located in the heart of Guatemala's Petén. Its temple-pyramids reach over 70 meters in height."
      },
      "sources": ["Martin & Grube, 2000", "Coe, 1967"]
    }
  ]
}
```

Add sites 3-10 following the same pattern: Copán, Yaxchilán, Calakmul, Quiriguá, Piedras Negras, Bonampak, Toniná, Dos Pilas.

Each site needs: id, name (es/en), ancient_name, meaning (es/en), coordinates (real lat/lng), region, country, period (from/to/peak), dynasty, emblem_glyph, notable_rulers array, inscriptions array (cross-refs to inscriptions.json IDs), description (es/en), sources.

- [ ] **Step 2: Add sites 11-20**

Add: Naranjo, Caracol, Uxmal, Chichén Itzá, Cancuén, El Mirador, San Bartolo, Cobá, Ceibal, La Corona.

Same structure as step 1.

- [ ] **Step 3: Validate sites data**

Run: `node -e "const d = require('./data/sites.json'); console.log('Total sites:', d.sites.length); d.sites.forEach(s => console.log(s.id, s.coordinates.lat.toFixed(2), s.coordinates.lng.toFixed(2), s.region, s.country)); const regions = [...new Set(d.sites.map(s => s.region))]; console.log('Regions:', regions)"`

Expected: 20 sites, valid coordinates, multiple regions and countries.

- [ ] **Step 4: Commit**

```bash
git add data/sites.json
git commit -m "feat: add 20 archaeological sites with coordinates and dynastic data"
```

---

## Task 5: Update data.js — access functions for new data

**Files:**
- Modify: `src/lib/data.js`

- [ ] **Step 1: Add imports and accessor functions**

Add to `src/lib/data.js` after existing imports:

```js
import inscriptionsData from '../../data/inscriptions.json'
import sitesData from '../../data/sites.json'
```

Then add these functions after the existing `getStats()`:

```js
export function getInscriptions() {
  return inscriptionsData.inscriptions
}

export function getInscription(id) {
  return inscriptionsData.inscriptions.find(i => i.id === id) || null
}

export function getInscriptionsByType(type) {
  return inscriptionsData.inscriptions.filter(i => i.type === type)
}

export function getInscriptionsBySite(siteId) {
  return inscriptionsData.inscriptions.filter(i => i.site === siteId)
}

export function getSites() {
  return sitesData.sites
}

export function getSite(id) {
  return sitesData.sites.find(s => s.id === id) || null
}

export function getRegions() {
  return sitesData.regions
}

export function getSitesByRegion(region) {
  return sitesData.sites.filter(s => s.region === region)
}
```

- [ ] **Step 2: Add quiz question generators**

Add to `src/lib/data.js`:

```js
/**
 * Generate quiz questions from existing data.
 * Returns array of { type, question, options, correct, explanation }
 */
export function getQuizQuestions(mode = 'syllables', count = 10) {
  if (mode === 'syllables') {
    return generateSyllableQuestions(count)
  } else if (mode === 'vocabulary') {
    return generateVocabularyQuestions(count)
  } else if (mode === 'inscriptions') {
    return generateInscriptionQuestions(count)
  }
  return []
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateSyllableQuestions(count) {
  const all = getSyllabary().filter(s => s.confidence === 'confirmed')
  const selected = shuffle(all).slice(0, count)

  return selected.map(glyph => {
    const wrong = shuffle(all.filter(g => g.value !== glyph.value)).slice(0, 3)
    const options = shuffle([glyph.value, ...wrong.map(w => w.value)])
    return {
      type: 'syllable',
      prompt: glyph.value,
      promptThompson: glyph.thompson,
      options,
      correct: glyph.value,
      explanation: { es: `Este glifo se lee "${glyph.value}"`, en: `This glyph reads "${glyph.value}"` }
    }
  })
}

function generateVocabularyQuestions(count) {
  const dict = getDictionary()
  const allEntries = []
  for (const [cat, entries] of Object.entries(dict)) {
    if (cat === 'metadata' || cat === 'numerals') continue
    if (Array.isArray(entries)) {
      entries.forEach(e => allEntries.push(e))
    }
  }

  const selected = shuffle(allEntries.filter(e => e.confidence === 'confirmed')).slice(0, count)

  return selected.map(entry => {
    const wrong = shuffle(allEntries.filter(e => e.maya !== entry.maya && e.spanish)).slice(0, 3)
    const options = shuffle([entry.spanish, ...wrong.map(w => w.spanish)])
    return {
      type: 'vocabulary',
      prompt: entry.maya,
      options,
      correct: entry.spanish,
      explanation: {
        es: `"${entry.maya}" significa "${entry.spanish}"`,
        en: `"${entry.maya}" means "${entry.english}"`
      }
    }
  })
}

function generateInscriptionQuestions(count) {
  const inscriptions = getInscriptions()
  const allBlocks = []
  for (const insc of inscriptions) {
    for (const block of insc.blocks) {
      allBlocks.push({ ...block, inscriptionId: insc.id, inscriptionName: insc.name })
    }
  }

  const selected = shuffle(allBlocks).slice(0, count)

  return selected.map(block => {
    const wrong = shuffle(allBlocks.filter(b => b.transcription !== block.transcription)).slice(0, 3)
    const options = shuffle([
      block.translation.es,
      ...wrong.map(w => w.translation.es)
    ])
    return {
      type: 'inscription',
      prompt: block.transliteration,
      promptGlyphs: block.glyphs,
      options,
      correct: block.translation.es,
      explanation: {
        es: `"${block.transliteration}" se lee "${block.transcription}" y significa "${block.translation.es}"`,
        en: `"${block.transliteration}" reads "${block.transcription}" and means "${block.translation.en}"`
      }
    }
  })
}
```

- [ ] **Step 3: Update getStats()**

Update the existing `getStats()` function in `src/lib/data.js`:

```js
export function getStats() {
  const sylls = getSyllabary()
  const dict = getDictionary()
  let dictTotal = 0
  for (const [k, v] of Object.entries(dict)) {
    if (k !== 'metadata' && Array.isArray(v)) dictTotal += v.length
  }
  return {
    confirmed: sylls.filter(s => s.confidence === 'confirmed').length,
    logograms: syllabaryData.common_logograms.length,
    daySigns: syllabaryData.calendar_glyphs.day_signs.length,
    numerals: dictionaryData.numerals.length,
    inscriptions: inscriptionsData.inscriptions.length,
    sites: sitesData.sites.length,
    dictEntries: dictTotal,
  }
}
```

- [ ] **Step 4: Verify data.js loads correctly**

Run: `cd c:/Users/heloq/dev/maya-translator && node -e "// Quick syntax check" && echo "OK"`

Since the project uses ES modules via Next.js, the real test is the dev server. But at least confirm no obvious syntax errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data.js
git commit -m "feat: add data accessors for inscriptions, sites, and quiz generation"
```

---

## Task 6: Add i18n strings for new pages

**Files:**
- Modify: `src/lib/lang.js`

- [ ] **Step 1: Add i18n strings to both es and en objects**

Add these keys to the `es` object in `STRINGS` in `src/lib/lang.js`:

```js
// Inscriptions
inscriptions: 'Inscripciones',
inscriptionsDesc: '20 monumentos icónicos',
inscriptionsTitle: 'Inscripciones Mayas',
inscriptionsSubtitle: 'Lecturas paso a paso de monumentos del Clásico Maya',
allTypes: 'Todos',
funerary: 'Funerario',
dynastic: 'Dinástico',
warfare: 'Bélico',
dedication: 'Dedicatorio',
mythological: 'Mitológico',
ritual: 'Ritual',
astronomical: 'Astronómico',
filterBySite: 'Filtrar por sitio',
filterByType: 'Filtrar por tipo',
blocks: 'bloques',
viewInscription: 'Ver lectura',
transliterationLabel: 'Transliteración',
transcriptionLabel: 'Transcripción',
translationLabel: 'Traducción',
historicalContext: 'Contexto histórico',
simpleView: 'Vista simple',
detailedView: 'Vista detallada',
backToList: '← Volver a la lista',
// Sites
sites: 'Sitios',
sitesDesc: '20 sitios arqueológicos',
sitesTitle: 'Mapa de Sitios Arqueológicos',
sitesSubtitle: 'Principales ciudades del mundo maya clásico',
ancientName: 'Nombre antiguo',
period: 'Periodo',
peak: 'Apogeo',
dynastyLabel: 'Dinastía',
rulers: 'Gobernantes',
reign: 'Reinado',
viewInscriptions: 'Ver inscripciones',
allRegions: 'Todas las regiones',
// Quiz
quiz: 'Quiz',
quizDesc: 'Pon a prueba tu conocimiento',
quizTitle: 'Quiz Maya',
quizSubtitle: 'Pon a prueba tu conocimiento de la escritura maya',
syllableQuiz: 'Lectura de glifos',
vocabularyQuiz: 'Vocabulario',
inscriptionQuiz: 'Inscripciones',
startQuiz: 'Comenzar',
nextQuestion: 'Siguiente',
showAnswer: 'Ver respuesta',
correct: '¡Correcto!',
incorrect: 'Incorrecto',
score: 'Puntuación',
questionOf: 'de',
quizComplete: '¡Quiz completado!',
tryAgain: 'Intentar de nuevo',
whatGlyphReads: '¿Cómo se lee este glifo?',
whatWordMeans: '¿Qué significa esta palabra?',
whatBlockSays: '¿Qué dice este bloque?',
```

Add the equivalent English translations to the `en` object:

```js
// Inscriptions
inscriptions: 'Inscriptions',
inscriptionsDesc: '20 iconic monuments',
inscriptionsTitle: 'Maya Inscriptions',
inscriptionsSubtitle: 'Step-by-step readings of Classic Maya monuments',
allTypes: 'All',
funerary: 'Funerary',
dynastic: 'Dynastic',
warfare: 'Warfare',
dedication: 'Dedication',
mythological: 'Mythological',
ritual: 'Ritual',
astronomical: 'Astronomical',
filterBySite: 'Filter by site',
filterByType: 'Filter by type',
blocks: 'blocks',
viewInscription: 'View reading',
transliterationLabel: 'Transliteration',
transcriptionLabel: 'Transcription',
translationLabel: 'Translation',
historicalContext: 'Historical context',
simpleView: 'Simple view',
detailedView: 'Detailed view',
backToList: '← Back to list',
// Sites
sites: 'Sites',
sitesDesc: '20 archaeological sites',
sitesTitle: 'Archaeological Sites Map',
sitesSubtitle: 'Major cities of the Classic Maya world',
ancientName: 'Ancient name',
period: 'Period',
peak: 'Peak',
dynastyLabel: 'Dynasty',
rulers: 'Rulers',
reign: 'Reign',
viewInscriptions: 'View inscriptions',
allRegions: 'All regions',
// Quiz
quiz: 'Quiz',
quizDesc: 'Test your knowledge',
quizTitle: 'Maya Quiz',
quizSubtitle: 'Test your knowledge of Maya writing',
syllableQuiz: 'Glyph reading',
vocabularyQuiz: 'Vocabulary',
inscriptionQuiz: 'Inscriptions',
startQuiz: 'Start',
nextQuestion: 'Next',
showAnswer: 'Show answer',
correct: 'Correct!',
incorrect: 'Incorrect',
score: 'Score',
questionOf: 'of',
quizComplete: 'Quiz complete!',
tryAgain: 'Try again',
whatGlyphReads: 'How is this glyph read?',
whatWordMeans: 'What does this word mean?',
whatBlockSays: 'What does this block say?',
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/lang.js
git commit -m "feat: add i18n strings for inscriptions, sites, and quiz pages"
```

---

## Task 7: Update Sidebar — add 3 new nav items

**Files:**
- Modify: `src/components/Sidebar.jsx`

- [ ] **Step 1: Add new nav items to the navItems array**

In `src/components/Sidebar.jsx`, add 3 items to `navItems` after the `name` entry:

```js
const navItems = [
  { href: '/', icon: '🏠', label: t.home },
  { href: '/syllabary', icon: '𐊀', label: t.syllabary },
  { href: '/dictionary', icon: '📖', label: t.dictionary },
  { href: '/transliterator', icon: '✏️', label: t.transliterator },
  { href: '/calendar', icon: '📅', label: t.calendar },
  { href: '/math', icon: '🔢', label: t.math },
  { href: '/name', icon: '✍️', label: t.yourName },
  { href: '/inscriptions', icon: '🏛️', label: t.inscriptions },
  { href: '/sites', icon: '🗺️', label: t.sites },
  { href: '/quiz', icon: '❓', label: t.quiz },
]
```

- [ ] **Step 2: Verify sidebar renders**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1 | tail -20`

Expected: Build succeeds (new pages don't exist yet but sidebar links are just links).

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.jsx
git commit -m "feat: add inscriptions, sites, quiz links to sidebar"
```

---

## Task 8: Inscriptions list page

**Files:**
- Create: `src/app/inscriptions/page.js`
- Create: `src/components/InscriptionCard.jsx`

- [ ] **Step 1: Create InscriptionCard component**

Create `src/components/InscriptionCard.jsx`:

```jsx
'use client'
import Link from 'next/link'
import { useLang } from '@/lib/lang'

const TYPE_COLORS = {
  funerary: 'bg-purple-900/50 text-purple-300',
  dynastic: 'bg-blue-900/50 text-blue-300',
  warfare: 'bg-red-900/50 text-red-300',
  dedication: 'bg-green-900/50 text-green-300',
  mythological: 'bg-amber-900/50 text-amber-300',
  ritual: 'bg-teal-900/50 text-teal-300',
  astronomical: 'bg-indigo-900/50 text-indigo-300',
}

export default function InscriptionCard({ inscription }) {
  const { t, lang } = useLang()
  const name = inscription.name[lang] || inscription.name.es
  const desc = inscription.description[lang] || inscription.description.es

  return (
    <Link
      href={`/inscriptions/${inscription.id}`}
      className="block bg-maya-surface rounded-xl p-4 border border-maya-border hover:border-maya-gold transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-maya-text group-hover:text-maya-gold transition-colors text-sm">
          {name}
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_COLORS[inscription.type] || 'bg-maya-border text-maya-muted'}`}>
          {t[inscription.type] || inscription.type}
        </span>
      </div>
      <p className="text-xs text-maya-muted line-clamp-2 mb-2">{desc}</p>
      <div className="flex items-center justify-between text-[10px] text-maya-muted">
        <span>{inscription.site} · {inscription.date_gregorian}</span>
        <span>{inscription.blocks.length} {t.blocks}</span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create inscriptions list page**

Create `src/app/inscriptions/page.js`:

```jsx
'use client'
import { useState, useMemo } from 'react'
import { getInscriptions, getSites } from '@/lib/data'
import { useLang } from '@/lib/lang'
import InscriptionCard from '@/components/InscriptionCard'

const inscriptions = getInscriptions()

export default function InscriptionsPage() {
  const { t } = useLang()
  const [typeFilter, setTypeFilter] = useState('all')
  const [siteFilter, setSiteFilter] = useState('all')
  const sites = getSites()

  const types = [...new Set(inscriptions.map(i => i.type))]
  const siteIds = [...new Set(inscriptions.map(i => i.site))]

  const filtered = useMemo(() => {
    return inscriptions.filter(i => {
      if (typeFilter !== 'all' && i.type !== typeFilter) return false
      if (siteFilter !== 'all' && i.site !== siteFilter) return false
      return true
    })
  }, [typeFilter, siteFilter])

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.inscriptionsTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.inscriptionsSubtitle}</p>

      <div className="flex gap-2 flex-wrap mb-4">
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-maya-surface border border-maya-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-maya-gold"
        >
          <option value="all">{t.allTypes}</option>
          {types.map(type => (
            <option key={type} value={type}>{t[type] || type}</option>
          ))}
        </select>

        <select
          value={siteFilter}
          onChange={e => setSiteFilter(e.target.value)}
          className="bg-maya-surface border border-maya-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-maya-gold"
        >
          <option value="all">{t.filterBySite}</option>
          {siteIds.map(id => {
            const site = sites.find(s => s.id === id)
            return <option key={id} value={id}>{site?.name?.es || id}</option>
          })}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(insc => (
          <InscriptionCard key={insc.id} inscription={insc} />
        ))}
        {filtered.length === 0 && (
          <p className="text-maya-muted text-sm text-center py-8">{t.noResults}</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1 | tail -20`

Expected: Build succeeds with /inscriptions route.

- [ ] **Step 4: Commit**

```bash
git add src/app/inscriptions/page.js src/components/InscriptionCard.jsx
git commit -m "feat: add inscriptions list page with type/site filters"
```

---

## Task 9: Inscription detail page (block reader)

**Files:**
- Create: `src/app/inscriptions/[id]/page.js`
- Create: `src/components/BlockReader.jsx`

- [ ] **Step 1: Create BlockReader component**

Create `src/components/BlockReader.jsx`:

```jsx
'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import MayaGlyph from './MayaGlyph'
import { getGlyphImage } from '@/lib/glyph-images'

export default function BlockReader({ blocks }) {
  const { t, lang } = useLang()
  const [detailed, setDetailed] = useState(false)
  const [activeBlock, setActiveBlock] = useState(null)

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setDetailed(!detailed)}
          className="text-xs px-3 py-1 rounded-lg bg-maya-surface border border-maya-border hover:border-maya-gold transition-colors"
        >
          {detailed ? t.simpleView : t.detailedView}
        </button>
      </div>

      <div className="space-y-2">
        {blocks.map((block, i) => {
          const isActive = activeBlock === i
          const translation = block.translation[lang] || block.translation.es
          const notes = block.notes?.[lang] || block.notes?.es

          return (
            <div
              key={i}
              onClick={() => setActiveBlock(isActive ? null : i)}
              className={`bg-maya-surface rounded-lg p-3 border cursor-pointer transition-colors ${
                isActive ? 'border-maya-gold' : 'border-maya-border hover:border-maya-gold/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-maya-muted font-mono w-8 flex-shrink-0">
                  {block.position}
                </span>

                <div className="flex gap-1 flex-shrink-0">
                  {block.glyphs.map((thompson, gi) => {
                    const syllable = findSyllableByThompson(thompson)
                    const imgPath = syllable ? getGlyphImage(syllable) : null
                    return imgPath ? (
                      <div key={gi} className="w-10 h-10 bg-white rounded flex items-center justify-center p-0.5">
                        <img src={imgPath} alt={thompson} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div key={gi} className="w-10 h-10 bg-maya-border rounded flex items-center justify-center">
                        <MayaGlyph thompson={[thompson]} size="text-xl" className="text-maya-gold" />
                      </div>
                    )
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  {detailed ? (
                    <div className="space-y-0.5">
                      <div className="text-xs">
                        <span className="text-maya-muted">{t.transliterationLabel}: </span>
                        <span className="font-mono text-blue-400">{block.transliteration}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-maya-muted">{t.transcriptionLabel}: </span>
                        <span className="italic">{block.transcription}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-maya-muted">{t.translationLabel}: </span>
                        <span className="text-maya-gold">{translation}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-maya-gold">{translation}</span>
                  )}
                </div>
              </div>

              {isActive && notes && (
                <p className="text-[11px] text-maya-muted mt-2 ml-11 border-t border-maya-border pt-2">
                  {notes}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Helper: find a syllable value for a Thompson code so we can show Tokovinine images
function findSyllableByThompson(thompson) {
  // This is a best-effort lookup — not all Thompson codes map to syllables
  // Import is avoided to keep this lightweight; we rely on glyph-images.json indirectly
  return null // Will be enhanced in cross-linking task
}
```

- [ ] **Step 2: Create inscription detail page**

Create `src/app/inscriptions/[id]/page.js`:

```jsx
'use client'
import { use } from 'react'
import Link from 'next/link'
import { getInscription, getSite } from '@/lib/data'
import { useLang } from '@/lib/lang'
import BlockReader from '@/components/BlockReader'

export default function InscriptionDetailPage({ params }) {
  const { id } = use(params)
  const { t, lang } = useLang()
  const inscription = getInscription(id)

  if (!inscription) {
    return (
      <div className="p-6 text-center">
        <p className="text-maya-muted">Inscription not found</p>
        <Link href="/inscriptions" className="text-maya-gold text-sm mt-2 inline-block">{t.backToList}</Link>
      </div>
    )
  }

  const site = getSite(inscription.site)
  const name = inscription.name[lang] || inscription.name.es
  const desc = inscription.description[lang] || inscription.description.es
  const context = inscription.historical_context[lang] || inscription.historical_context.es

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Link href="/inscriptions" className="text-xs text-maya-muted hover:text-maya-gold mb-4 inline-block">
        {t.backToList}
      </Link>

      <h1 className="text-xl font-bold text-maya-gold mb-1">{name}</h1>

      <div className="flex flex-wrap gap-2 text-xs text-maya-muted mb-3">
        {site && (
          <Link href={`/sites`} className="hover:text-maya-gold">
            {site.name[lang] || site.name.es}
          </Link>
        )}
        <span>·</span>
        <span>{inscription.date_gregorian}</span>
        <span>·</span>
        <span>{t[inscription.type] || inscription.type}</span>
      </div>

      <p className="text-sm text-maya-muted mb-4">{desc}</p>

      <BlockReader blocks={inscription.blocks} />

      <div className="mt-6 bg-maya-surface rounded-lg p-4 border border-maya-border">
        <h2 className="text-sm font-bold text-maya-gold mb-2">{t.historicalContext}</h2>
        <p className="text-xs text-maya-muted">{context}</p>
      </div>

      <div className="mt-4 text-[10px] text-maya-muted">
        <p>{t.sources}: {inscription.source}</p>
        {inscription.image_credit && <p>Image: {inscription.image_credit}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1 | tail -20`

Expected: Build succeeds with /inscriptions/[id] route.

- [ ] **Step 4: Commit**

```bash
git add src/app/inscriptions/[id]/page.js src/components/BlockReader.jsx
git commit -m "feat: add inscription detail page with block-by-block reader"
```

---

## Task 10: Install Leaflet and create Sites page

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/components/SiteMap.jsx`
- Create: `src/components/SiteCard.jsx`
- Create: `src/app/sites/page.js`

- [ ] **Step 1: Install Leaflet dependencies**

Run: `cd c:/Users/heloq/dev/maya-translator && npm install leaflet react-leaflet`

Expected: Packages added to dependencies.

- [ ] **Step 2: Create SiteCard component**

Create `src/components/SiteCard.jsx`:

```jsx
'use client'
import Link from 'next/link'
import { useLang } from '@/lib/lang'

export default function SiteCard({ site }) {
  const { t, lang } = useLang()
  const name = site.name[lang] || site.name.es
  const desc = site.description[lang] || site.description.es
  const meaning = site.meaning[lang] || site.meaning.es

  return (
    <div className="bg-maya-surface rounded-lg p-4 border border-maya-border max-w-sm">
      <h3 className="font-bold text-maya-gold text-sm">{name}</h3>
      {site.ancient_name && (
        <div className="text-xs text-maya-muted mt-0.5">
          {t.ancientName}: <span className="text-blue-400">{site.ancient_name}</span>
          {meaning && <span className="ml-1">({meaning})</span>}
        </div>
      )}

      <p className="text-xs text-maya-muted mt-2 line-clamp-3">{desc}</p>

      <div className="mt-3 space-y-1 text-xs">
        <div>
          <span className="text-maya-muted">{t.period}: </span>
          <span>{site.period.from} — {site.period.to}</span>
          {site.period.peak && <span className="text-maya-gold ml-1">({t.peak}: {site.period.peak})</span>}
        </div>
        {site.dynasty && (
          <div>
            <span className="text-maya-muted">{t.dynastyLabel}: </span>
            <span>{site.dynasty}</span>
          </div>
        )}
      </div>

      {site.notable_rulers?.length > 0 && (
        <div className="mt-2">
          <span className="text-[10px] text-maya-muted">{t.rulers}:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {site.notable_rulers.map((r, i) => (
              <span key={i} className="text-[10px] bg-maya-border px-2 py-0.5 rounded-full">
                {r.name} <span className="text-maya-muted">({r.reign})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {site.inscriptions?.length > 0 && (
        <div className="mt-3 border-t border-maya-border pt-2">
          <Link
            href={`/inscriptions?site=${site.id}`}
            className="text-[10px] text-maya-gold hover:underline"
          >
            {t.viewInscriptions} ({site.inscriptions.length})
          </Link>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create SiteMap component**

Create `src/components/SiteMap.jsx`:

```jsx
'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/lib/lang'
import SiteCard from './SiteCard'

export default function SiteMap({ sites }) {
  const [MapContainer, setMapContainer] = useState(null)
  const [selectedSite, setSelectedSite] = useState(null)
  const { lang } = useLang()

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      // Fix default marker icon
      delete L.default.Icon.Default.prototype._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      setMapContainer(() => RL)
    })
  }, [])

  if (!MapContainer) {
    return (
      <div className="w-full h-[500px] bg-maya-surface rounded-xl flex items-center justify-center border border-maya-border">
        <span className="text-maya-muted text-sm">Loading map...</span>
      </div>
    )
  }

  const { MapContainer: MC, TileLayer, Marker, Popup } = MapContainer

  // Center on Maya region
  const center = [17.5, -89.5]

  return (
    <div className="relative">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <MC
        center={center}
        zoom={6}
        className="w-full h-[500px] rounded-xl border border-maya-border z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map(site => (
          <Marker
            key={site.id}
            position={[site.coordinates.lat, site.coordinates.lng]}
            eventHandlers={{
              click: () => setSelectedSite(site),
            }}
          >
            <Popup maxWidth={320} minWidth={280}>
              <SiteCard site={site} />
            </Popup>
          </Marker>
        ))}
      </MC>
    </div>
  )
}
```

- [ ] **Step 4: Create sites page**

Create `src/app/sites/page.js`:

```jsx
'use client'
import { useState, useMemo } from 'react'
import { getSites, getRegions } from '@/lib/data'
import { useLang } from '@/lib/lang'
import SiteMap from '@/components/SiteMap'
import SiteCard from '@/components/SiteCard'

const sites = getSites()
const regions = getRegions()

export default function SitesPage() {
  const { t, lang } = useLang()
  const [regionFilter, setRegionFilter] = useState('all')

  const filtered = useMemo(() => {
    if (regionFilter === 'all') return sites
    return sites.filter(s => s.region === regionFilter)
  }, [regionFilter])

  const regionKeys = [...new Set(sites.map(s => s.region))]

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.sitesTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.sitesSubtitle}</p>

      <div className="mb-4">
        <select
          value={regionFilter}
          onChange={e => setRegionFilter(e.target.value)}
          className="bg-maya-surface border border-maya-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-maya-gold"
        >
          <option value="all">{t.allRegions}</option>
          {regionKeys.map(key => (
            <option key={key} value={key}>
              {regions[key]?.[lang] || regions[key]?.es || key}
            </option>
          ))}
        </select>
      </div>

      <SiteMap sites={filtered} />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(site => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify build**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1 | tail -20`

Expected: Build succeeds with /sites route.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/app/sites/page.js src/components/SiteMap.jsx src/components/SiteCard.jsx
git commit -m "feat: add interactive sites map page with Leaflet"
```

---

## Task 11: Quiz page

**Files:**
- Create: `src/components/QuizEngine.jsx`
- Create: `src/app/quiz/page.js`

- [ ] **Step 1: Create QuizEngine component**

Create `src/components/QuizEngine.jsx`:

```jsx
'use client'
import { useState, useCallback } from 'react'
import { useLang } from '@/lib/lang'
import { getQuizQuestions } from '@/lib/data'
import MayaGlyph from './MayaGlyph'
import { getGlyphImage } from '@/lib/glyph-images'

export default function QuizEngine({ mode }) {
  const { t, lang } = useLang()
  const [questions, setQuestions] = useState(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const startQuiz = useCallback(() => {
    setQuestions(getQuizQuestions(mode, 10))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }, [mode])

  if (!questions) {
    return (
      <div className="text-center py-12">
        <p className="text-maya-muted text-sm mb-4">
          {mode === 'syllables' && t.whatGlyphReads}
          {mode === 'vocabulary' && t.whatWordMeans}
          {mode === 'inscriptions' && t.whatBlockSays}
        </p>
        <button
          onClick={startQuiz}
          className="px-6 py-2 bg-maya-gold text-maya-bg rounded-lg font-bold text-sm hover:bg-maya-gold/80 transition-colors"
        >
          {t.startQuiz}
        </button>
      </div>
    )
  }

  if (finished) {
    // Save best score to localStorage
    const key = `maya-quiz-${mode}`
    const prev = parseInt(localStorage.getItem(key) || '0', 10)
    if (score > prev) localStorage.setItem(key, score.toString())

    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-maya-gold mb-2">{t.quizComplete}</h2>
        <p className="text-3xl font-bold mb-4">{score} / {questions.length}</p>
        <button
          onClick={startQuiz}
          className="px-6 py-2 bg-maya-gold text-maya-bg rounded-lg font-bold text-sm hover:bg-maya-gold/80 transition-colors"
        >
          {t.tryAgain}
        </button>
      </div>
    )
  }

  const q = questions[current]
  const isCorrect = selected === q.correct
  const hasAnswered = selected !== null

  function handleSelect(option) {
    if (hasAnswered) return
    setSelected(option)
    if (option === q.correct) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-maya-muted">
          {current + 1} {t.questionOf} {questions.length}
        </span>
        <span className="text-xs text-maya-gold">{t.score}: {score}</span>
      </div>

      {/* Question prompt */}
      <div className="bg-maya-surface rounded-xl p-6 border border-maya-border mb-4 text-center">
        {q.type === 'syllable' && (
          <>
            <p className="text-xs text-maya-muted mb-3">{t.whatGlyphReads}</p>
            {getGlyphImage(q.prompt) ? (
              <div className="w-24 h-24 bg-white rounded-xl mx-auto flex items-center justify-center p-2">
                <img src={getGlyphImage(q.prompt)} alt="?" className="max-w-full max-h-full object-contain" />
              </div>
            ) : q.promptThompson?.length > 0 ? (
              <MayaGlyph thompson={q.promptThompson} size="text-5xl" className="text-maya-gold" />
            ) : (
              <span className="text-4xl font-bold text-maya-gold">?</span>
            )}
          </>
        )}
        {q.type === 'vocabulary' && (
          <>
            <p className="text-xs text-maya-muted mb-3">{t.whatWordMeans}</p>
            <span className="text-2xl font-bold text-maya-gold">{q.prompt}</span>
          </>
        )}
        {q.type === 'inscription' && (
          <>
            <p className="text-xs text-maya-muted mb-3">{t.whatBlockSays}</p>
            <span className="text-lg font-mono text-blue-400">{q.prompt}</span>
          </>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {q.options.map((option, i) => {
          let style = 'bg-maya-surface border-maya-border hover:border-maya-gold/50'
          if (hasAnswered) {
            if (option === q.correct) style = 'bg-green-900/30 border-green-500'
            else if (option === selected) style = 'bg-red-900/30 border-red-500'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={hasAnswered}
              className={`p-3 rounded-lg border text-sm text-left transition-colors ${style}`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Feedback + Next */}
      {hasAnswered && (
        <div className="space-y-3">
          <p className={`text-sm font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? t.correct : t.incorrect}
          </p>
          <p className="text-xs text-maya-muted">
            {q.explanation[lang] || q.explanation.es}
          </p>
          <button
            onClick={handleNext}
            className="w-full py-2 bg-maya-gold text-maya-bg rounded-lg font-bold text-sm hover:bg-maya-gold/80 transition-colors"
          >
            {t.nextQuestion}
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create quiz page**

Create `src/app/quiz/page.js`:

```jsx
'use client'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import QuizEngine from '@/components/QuizEngine'

export default function QuizPage() {
  const { t } = useLang()
  const [mode, setMode] = useState('syllables')

  const MODES = [
    { key: 'syllables', label: t.syllableQuiz, icon: '𐊀' },
    { key: 'vocabulary', label: t.vocabularyQuiz, icon: '📖' },
    { key: 'inscriptions', label: t.inscriptionQuiz, icon: '🏛️' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.quizTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.quizSubtitle}</p>

      <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
        {MODES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              mode === key ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted hover:bg-maya-border'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <QuizEngine key={mode} mode={mode} />
    </div>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1 | tail -20`

Expected: Build succeeds with /quiz route.

- [ ] **Step 4: Commit**

```bash
git add src/app/quiz/page.js src/components/QuizEngine.jsx
git commit -m "feat: add quiz page with syllable, vocabulary, and inscription modes"
```

---

## Task 12: Update homepage and DictionaryEntry with new data

**Files:**
- Modify: `src/app/page.js`
- Modify: `src/components/DictionaryEntry.jsx`
- Modify: `src/app/dictionary/page.js`

- [ ] **Step 1: Update homepage cards and stats**

In `src/app/page.js`, add new cards for inscriptions, sites, quiz and update the stats line.

Add 3 new cards to the `CARDS` array:

```js
{ href: '/inscriptions', icon: '🏛️', title: t.inscriptions, desc: t.inscriptionsDesc },
{ href: '/sites', icon: '🗺️', title: t.sites, desc: t.sitesDesc },
{ href: '/quiz', icon: '❓', title: t.quiz, desc: t.quizDesc },
```

Update the stats line at the bottom to include new counts:

```jsx
<p className="text-maya-muted text-xs mt-8 text-center">
  {stats.confirmed} {t.confirmedReadings} · {stats.dictEntries} {t.dictionary.toLowerCase()} · {stats.inscriptions} {t.inscriptions.toLowerCase()} · {stats.sites} {t.sites.toLowerCase()}
</p>
```

- [ ] **Step 2: Update DictionaryEntry to show new fields**

In `src/components/DictionaryEntry.jsx`, add display for new optional fields below existing content:

```jsx
'use client'
import Link from 'next/link'
import ConfidenceBadge from './ConfidenceBadge'
import SpeakButton from './SpeakButton'
import { getGlyphImage } from '@/lib/glyph-images'
import { useLang } from '@/lib/lang'

export default function DictionaryEntry({ entry }) {
  const imgPath = getGlyphImage(entry.maya)
  const { t, lang } = useLang()

  return (
    <div className="bg-maya-surface rounded-lg p-3 border border-maya-border">
      <div className="flex items-center gap-3">
        {imgPath && (
          <div className="flex-shrink-0 w-14 h-14 bg-white rounded-lg flex items-center justify-center p-1.5">
            <img
              src={imgPath}
              alt={entry.maya}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="font-bold text-maya-gold">{entry.maya}</span>
              <span className="text-maya-muted mx-2">→</span>
              <span>{entry.spanish}</span>
              {entry.english && (
                <span className="text-maya-muted text-sm ml-2">({entry.english})</span>
              )}
            </div>
            <SpeakButton text={entry.maya} mode="word" size="small" />
            <ConfidenceBadge level={entry.confidence} showLabel={false} />
          </div>
          {entry.notes && (
            <p className="text-xs text-maya-muted mt-1">{entry.notes}</p>
          )}
          {/* New fields */}
          {entry.etymology && (
            <p className="text-[10px] text-blue-400 mt-1">{entry.etymology}</p>
          )}
          {entry.cognates && Object.keys(entry.cognates).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(entry.cognates).map(([lang, word]) => (
                <span key={lang} className="text-[10px] bg-maya-border px-1.5 py-0.5 rounded">
                  {lang}: {word}
                </span>
              ))}
            </div>
          )}
          {entry.inscriptions?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {entry.inscriptions.map(id => (
                <Link
                  key={id}
                  href={`/inscriptions/${id}`}
                  className="text-[10px] text-maya-gold hover:underline"
                >
                  {id}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update dictionary page TABS for new categories**

In `src/app/dictionary/page.js`, add new tabs for the new categories:

```js
const TABS = [
  { key: 'titles_and_ranks', label: t.titles },
  { key: 'verbs', label: t.verbs },
  { key: 'nouns', label: t.nouns },
  { key: 'adjectives_and_colors', label: t.colors },
  { key: 'directional_terms', label: t.directions },
  { key: 'numerals', label: t.numerals },
  { key: 'death_expressions', label: t.death },
  { key: 'war_expressions', label: t.war },
  { key: 'kinship', label: t.kinship },
  { key: 'architecture', label: t.architecture },
  { key: 'flora_fauna', label: t.floraFauna },
  { key: 'astronomy', label: t.astronomy },
  { key: 'rituals', label: t.ritualsCat },
  { key: 'toponyms', label: t.toponyms },
  { key: 'body_parts', label: t.bodyParts },
  { key: 'time_periods', label: t.timePeriods },
]
```

Also add the corresponding i18n strings to `src/lib/lang.js` (both es and en):

```js
// ES
kinship: 'Parentesco',
architecture: 'Arquitectura',
floraFauna: 'Flora y Fauna',
astronomy: 'Astronomía',
ritualsCat: 'Rituales',
toponyms: 'Topónimos',
bodyParts: 'Cuerpo',
timePeriods: 'Tiempo',

// EN
kinship: 'Kinship',
architecture: 'Architecture',
floraFauna: 'Flora & Fauna',
astronomy: 'Astronomy',
ritualsCat: 'Rituals',
toponyms: 'Toponyms',
bodyParts: 'Body',
timePeriods: 'Time',
```

- [ ] **Step 4: Verify build**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1 | tail -20`

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.js src/components/DictionaryEntry.jsx src/app/dictionary/page.js src/lib/lang.js
git commit -m "feat: update homepage, dictionary entry, and dictionary tabs for new data"
```

---

## Task 13: Cross-linking — connect all the data

**Files:**
- Modify: `src/components/GlyphDetail.jsx`
- Modify: `src/components/BlockReader.jsx`
- Modify: `src/lib/data.js`

- [ ] **Step 1: Add cross-reference helper to data.js**

Add to `src/lib/data.js`:

```js
/**
 * Find inscriptions that reference a given Thompson code.
 */
export function getInscriptionsForThompson(thompson) {
  return inscriptionsData.inscriptions.filter(insc =>
    insc.blocks.some(block =>
      block.glyphs.includes(thompson)
    )
  )
}

/**
 * Find a syllable value for a Thompson code.
 */
export function getSyllableByThompson(thompson) {
  const all = getSyllabary()
  for (const s of all) {
    if (s.thompson?.includes(thompson)) return s.value
  }
  // Check logograms
  const logo = syllabaryData.common_logograms.find(l => l.thompson === thompson)
  if (logo) return logo.reading.toLowerCase()
  return null
}
```

- [ ] **Step 2: Update GlyphDetail to show inscription links**

In `src/components/GlyphDetail.jsx`, import the new function and add a section after the logogram match section:

Add import:
```js
import { getInscriptionsForThompson } from '@/lib/data'
import Link from 'next/link'
```

Add after the logogram match section (before the sources toggle):
```jsx
{/* Inscriptions where this glyph appears */}
{glyph.thompson?.length > 0 && (() => {
  const inscriptions = glyph.thompson.flatMap(t => getInscriptionsForThompson(t))
  const unique = [...new Map(inscriptions.map(i => [i.id, i])).values()]
  if (unique.length === 0) return null
  return (
    <div className="border-t border-maya-border pt-3 mt-3">
      <div className="text-xs text-maya-muted mb-1">{t.inscriptions}:</div>
      <div className="flex flex-wrap gap-1">
        {unique.map(insc => (
          <Link
            key={insc.id}
            href={`/inscriptions/${insc.id}`}
            className="text-[10px] bg-maya-border px-2 py-0.5 rounded-full text-maya-gold hover:bg-maya-gold hover:text-maya-bg transition-colors"
          >
            {insc.name[lang] || insc.name.es}
          </Link>
        ))}
      </div>
    </div>
  )
})()}
```

- [ ] **Step 3: Update BlockReader to use real glyph lookups**

In `src/components/BlockReader.jsx`, replace the placeholder `findSyllableByThompson` function:

Add import:
```js
import { getSyllableByThompson } from '@/lib/data'
```

Replace the `findSyllableByThompson` function at the bottom:
```js
// Remove the local function and use the imported one instead
```

Update the glyph rendering inside the blocks map to use the imported function:
```jsx
{block.glyphs.map((thompson, gi) => {
  const syllable = getSyllableByThompson(thompson)
  const imgPath = syllable ? getGlyphImage(syllable) : null
  // ... rest stays the same
```

- [ ] **Step 4: Verify build**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1 | tail -20`

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data.js src/components/GlyphDetail.jsx src/components/BlockReader.jsx
git commit -m "feat: add cross-linking between glyphs, inscriptions, and dictionary"
```

---

## Task 14: Final verification and smoke test

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run build 2>&1`

Expected: Build succeeds with all routes: /, /syllabary, /dictionary, /transliterator, /calendar, /math, /name, /inscriptions, /inscriptions/[id], /sites, /quiz.

- [ ] **Step 2: Validate all data files**

Run: `cd c:/Users/heloq/dev/maya-translator && node -e "
const dict = require('./data/dictionary.json');
const insc = require('./data/inscriptions.json');
const sites = require('./data/sites.json');
let dictTotal = 0;
for (const [k,v] of Object.entries(dict)) { if (Array.isArray(v)) dictTotal += v.length; }
console.log('Dictionary entries:', dictTotal);
console.log('Inscriptions:', insc.inscriptions.length);
console.log('Sites:', sites.sites.length);
// Verify cross-refs
const siteIds = new Set(sites.sites.map(s => s.id));
const inscSites = new Set(insc.inscriptions.map(i => i.site));
const missingSites = [...inscSites].filter(s => !siteIds.has(s));
console.log('Missing site refs:', missingSites.length === 0 ? 'NONE (good)' : missingSites);
"`

Expected: ~300 dictionary entries, 20 inscriptions, 20 sites, no missing cross-references.

- [ ] **Step 3: Start dev server and smoke test**

Run: `cd c:/Users/heloq/dev/maya-translator && npm run dev &`

Open in browser:
1. http://localhost:3300 — homepage shows new cards and updated stats
2. http://localhost:3300/dictionary — new category tabs visible
3. http://localhost:3300/inscriptions — list of 20 inscriptions with filters
4. http://localhost:3300/inscriptions/palenque-sarcophagus — block reader works
5. http://localhost:3300/sites — map renders with markers
6. http://localhost:3300/quiz — all 3 quiz modes work

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final adjustments after smoke testing"
```
