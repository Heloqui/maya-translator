# Maya Glyphs Translator — UI Design Spec

## Overview

Interactive web app for exploring, learning, and transliterating Classic Maya hieroglyphs. Built on verified epigraphic data (syllabary.json, dictionary.json) with explicit confidence levels — no generative AI, no hallucinations.

## Audiences & Modes

Three modes stored in localStorage, selectable from dashboard and persistent across sessions:

| Mode | Label | What changes |
|------|-------|-------------|
| Explorador | 🌎 | Basic info, visual-first, simplified labels in Spanish |
| Estudiante | 🎓 | Full info, examples, learning aids, Spanish + English |
| Investigador | 🔬 | Thompson numbers, all variants, source citations, technical notes |

## Stack

- **Framework:** Next.js 15 (App Router, React 19, JavaScript — no TypeScript)
- **Styling:** Tailwind CSS
- **Data:** Static JSON imports from `data/` directory (no database)
- **Deploy:** Vercel (future)
- **Port:** 3300 (dev)

## Visual Theme

- Background: `#0f0f1e` (deep navy-black)
- Surface: `#1a1a35` (card backgrounds)
- Surface deep: `#12122a` (sidebar, detail panels)
- Accent: `#c9a84c` (gold — evokes ancient stone/amber)
- Text primary: `#e0e0e0`
- Text secondary: `#888888`
- Confidence colors:
  - Confirmed: `#4caf50` (green)
  - Probable: `#cddc39` (yellow-green)
  - Tentative: `#f44336` (red)
  - Unknown: `#666666` (gray)

## Layout

### Navigation Pattern: Dashboard (C) + Sidebar (B)

**Homepage (`/`):** Dashboard with 4 large cards (Silabario, Diccionario, Transliterador, Calendario), mode selector pills, summary stats footer.

**Internal pages:** Left sidebar with icon buttons for section navigation (collapses to bottom tab bar on mobile). Main content area. Optional right detail panel (desktop) / bottom sheet or modal (mobile).

### Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Homepage with cards, mode selector, stats |
| `/syllabary` | Silabario | Interactive syllabary grid with detail panel |
| `/dictionary` | Diccionario | Searchable dictionary by category |
| `/transliterator` | Transliterador | Syllable sequence → phonetic output |
| `/calendar` | Calendario | Gregorian ↔ Maya date converter |

### Shared Layout (`/app/layout.js`)

- Sidebar (desktop): 56px wide, icons for each section + home button
- Bottom tab bar (mobile): same 5 icons
- Active section highlighted with gold accent
- Mode indicator (small pill in sidebar footer)

## Pages

### 1. Dashboard (`/`)

**Components:**
- Header: "MAYA GLYPHS" title + subtitle
- Mode selector: 3 pills (Explorador/Estudiante/Investigador), gold active state
- Cards grid: 2×2 on desktop, 1 column on mobile
  - Each card: icon, title, subtitle with stat, subtle border
  - Active/hover: gold border
- Footer stats: "48 lecturas confirmadas · 26 logogramas · 20 signos de día · Sistema vigesimal completo"

### 2. Silabario (`/syllabary`)

**Layout:** Sidebar | Main grid | Detail panel

**Main grid:**
- Row headers: consonant onsets (b, ch, ch', h, j, k, k', l, m, n, p, s, t, t', tz, tz', w, x, y)
- Column headers: vowels (a, e, i, o, u)
- First row: pure vowels (a, e, i, o, u)
- Each cell: colored by confidence level, shows syllable value
- Click → populates detail panel
- Selected cell: gold border

**Detail panel (right, 220px):**
- Glyph display area (placeholder for future glyph images)
- Value (phonetic)
- Thompson T-numbers (clickable, investigador mode)
- Confidence badge (colored dot + label)
- Frequency
- Variant count
- Notes
- Logogram reading if applicable (from logograms data)
- Source citations (investigador mode)

**Filters (top bar):**
- Confidence filter: checkboxes (confirmed/probable/tentative/unknown)
- Search: by syllable value or Thompson number

**Mode differences:**
- Explorador: grid + basic detail (value, confidence as color only)
- Estudiante: grid + full detail panel
- Investigador: grid + full detail + Thompson numbers + source citations + variant list

### 3. Diccionario (`/dictionary`)

**Layout:** Sidebar | Main content

**Tab bar:** Títulos | Verbos | Sustantivos | Colores | Direcciones | Calendario | Numerales | Expresiones

**Each entry (card-style row):**
- Maya term (bold, gold)
- Spanish translation
- English translation
- Confidence badge

**Search bar:** Filters across maya, spanish, english fields

**Numerals sub-section:** Visual grid showing dot-and-bar system (0-19) with maya term

**Mode differences:**
- Explorador: Maya → Spanish only, no confidence badges
- Estudiante: Maya → Spanish → English, confidence badges
- Investigador: All + notes field

### 4. Transliterador (`/transliterator`)

**Layout:** Sidebar | Main content (split top/bottom)

**Input area (top):**
- Text input field with placeholder: "Escribe sílabas separadas por guión: ba-la-ma"
- Quick-insert buttons for common syllables (or clickable syllabary mini-grid)
- Clear button

**Output area (bottom):**
- Transliteration result: phonetic reading (e.g., "BAHLAM")
- Synharmony rule applied indicator (e.g., "Regla CVC: vocal final 'a' descartada")
- Dictionary matches: if the result matches a known word, show it with translation
- Per-syllable confidence: each syllable shows its confidence dot
- Overall confidence score

**Reverse mode toggle:**
- Switch to "Español → Maya" mode
- Type Spanish word → suggests syllable sequences from dictionary

**Mode differences:**
- Explorador: simple input → output, dictionary match only
- Estudiante: full output with rules explanation
- Investigador: shows Thompson numbers for each syllable, alternative readings

### 5. Calendario (`/calendar`)

**Layout:** Sidebar | Main content

**Input section:**
- Date picker (defaults to today)
- "Hoy" quick button
- Reverse input: Long Count text field (e.g., "13.0.11.7.5")

**Output section:**
- **Cuenta Larga:** 5 positions displayed as dot-and-bar numerals + decimal
- **Tzolk'in:** Day number (1-13) + day sign name + meaning
- **Haab':** Day number (0-19) + month name + meaning
- **Calendar Round:** Combined Tzolk'in + Haab' notation
- Day sign glyph display (placeholder for future images)

**Additional info:**
- Meaning/significance of the day sign
- Associated deity (if known)
- Cardinal direction and color association

**Mode differences:**
- Explorador: date → names + meanings (visual, simple)
- Estudiante: full breakdown with explanations of each calendar system
- Investigador: Thompson numbers for day/month signs, correlation constant note (GMT 584283)

## Data Architecture

All data loaded as static JSON imports — no API calls, no database.

```
data/
  syllabary.json    — 100 CV combinations + 5 vowels, Thompson numbers, confidence
  dictionary.json   — 120+ entries: titles, verbs, nouns, colors, calendar, numerals, expressions
```

**Calendar calculations:** Pure JavaScript functions. The correlation between Gregorian and Maya dates uses the GMT correlation constant (584283). This is deterministic math, not data lookup.

## File Structure

```
src/
  app/
    layout.js              — Root layout with sidebar
    page.js                — Dashboard
    syllabary/page.js      — Silabario
    dictionary/page.js     — Diccionario
    transliterator/page.js — Transliterador
    calendar/page.js       — Calendario
    globals.css            — Tailwind + custom theme vars
  components/
    Sidebar.jsx            — Icon sidebar (desktop) / tab bar (mobile)
    ModeSelector.jsx       — Explorador/Estudiante/Investigador pills
    ConfidenceBadge.jsx    — Colored dot + label
    SyllabaryGrid.jsx      — The main grid component
    GlyphDetail.jsx        — Right detail panel
    DictionaryEntry.jsx    — Single dictionary card
    CalendarDisplay.jsx    — Calendar output visualization
    DotBarNumeral.jsx      — Visual dot-and-bar number display
  lib/
    modes.js               — Mode context + localStorage persistence
    calendar.js            — Gregorian ↔ Maya date conversion functions
    transliterate.js       — Syllable sequence → phonetic reading logic
    data.js                — JSON data loaders
  hooks/
    useMode.js             — React hook for current mode
data/
  syllabary.json
  dictionary.json
```

## Responsive Behavior

| Breakpoint | Sidebar | Detail panel | Grid columns |
|-----------|---------|-------------|-------------|
| Desktop (≥1024px) | Left sidebar 56px | Right panel 220px | 5 (full grid) |
| Tablet (768-1023px) | Left sidebar 56px | Modal on tap | 5 (full grid) |
| Mobile (<768px) | Bottom tab bar 56px | Bottom sheet on tap | 5 (scrollable) |

## Anti-Hallucination Principles

1. **No generative AI in the pipeline** — all translations are deterministic lookups
2. **Confidence always visible** — every piece of data shows its certainty level
3. **Unknown = "unknown"** — never guess or interpolate missing data
4. **Sources cited** — investigador mode shows which publication supports each reading
5. **Data versioned** — syllabary.json and dictionary.json are versioned, changes tracked in git
