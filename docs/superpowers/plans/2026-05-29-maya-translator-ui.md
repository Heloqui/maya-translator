# Maya Glyphs Translator UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive web app with 4 pages (Syllabary, Dictionary, Transliterator, Calendar) powered by static JSON data, with 3 audience modes and a dark+gold theme.

**Architecture:** Next.js 15 App Router with client components for interactivity. Data loaded via static JSON imports — no database, no API. Mode state managed via React Context + localStorage. All calendar math is pure deterministic JavaScript.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, JavaScript (no TypeScript)

---

## File Structure

```
src/
  app/
    layout.js              — Root layout: metadata, font, ModeProvider wrapper, Sidebar
    page.js                — Dashboard: cards grid, mode selector, stats
    globals.css            — Tailwind directives + CSS custom properties for theme
    syllabary/page.js      — Syllabary grid + detail panel (client component)
    dictionary/page.js     — Dictionary with category tabs + search (client component)
    transliterator/page.js — Transliterator input/output (client component)
    calendar/page.js       — Calendar converter (client component)
  components/
    Sidebar.jsx            — Left sidebar (desktop) / bottom tab bar (mobile)
    ModeSelector.jsx       — 3-pill mode switcher (Explorador/Estudiante/Investigador)
    ConfidenceBadge.jsx    — Colored dot + label for confidence levels
    SyllabaryGrid.jsx      — 20-row × 5-col grid with click selection
    GlyphDetail.jsx        — Right panel showing selected glyph info
    DictionaryEntry.jsx    — Single dictionary row/card
    DotBarNumeral.jsx      — Visual Maya dot-and-bar number (SVG)
    CalendarDisplay.jsx    — Calendar output: Long Count, Tzolk'in, Haab'
  lib/
    modes.js               — ModeContext provider + useMode hook + localStorage
    calendar.js            — Gregorian ↔ Maya calendar conversion (GMT 584283)
    transliterate.js       — Syllable parsing + synharmony rules + dictionary lookup
    data.js                — Flatten syllabary.json into lookup maps
data/
  syllabary.json           — (exists) 100 CV combinations + 5 vowels
  dictionary.json          — (exists) 120+ entries
tailwind.config.js         — Theme colors (maya-bg, maya-surface, maya-gold, confidence-*)
```

---

### Task 1: Scaffold Next.js + Tailwind + Theme

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `next.config.js`
- Create: `src/app/globals.css`
- Create: `src/app/layout.js`
- Create: `src/app/page.js`

- [ ] **Step 1: Install Next.js, React, Tailwind**

```bash
cd c:/Users/heloq/dev/maya-translator
npm install next@latest react@latest react-dom@latest
npm install -D tailwindcss @tailwindcss/postcss postcss
```

- [ ] **Step 2: Create tailwind.config.js**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maya: {
          bg: '#0f0f1e',
          surface: '#1a1a35',
          deep: '#12122a',
          darker: '#0a0a18',
          gold: '#c9a84c',
          'gold-dim': '#a08a3e',
          text: '#e0e0e0',
          muted: '#888888',
          border: '#2a2a4a',
        },
        confidence: {
          confirmed: '#4caf50',
          probable: '#cddc39',
          tentative: '#f44336',
          unknown: '#666666',
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create postcss.config.js**

```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] **Step 4: Create next.config.js**

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
```

- [ ] **Step 5: Create src/app/globals.css**

```css
@import 'tailwindcss';

@config '../../tailwind.config.js';

body {
  background-color: #0f0f1e;
  color: #e0e0e0;
}
```

- [ ] **Step 6: Create src/app/layout.js (minimal)**

```jsx
// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
  description: 'Silabario interactivo, diccionario y transliterador de jeroglíficos mayas basado en datos epigráficos verificados.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-maya-bg text-maya-text antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Create src/app/page.js (placeholder)**

```jsx
// src/app/page.js
export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-maya-gold tracking-widest">MAYA GLYPHS</h1>
    </main>
  )
}
```

- [ ] **Step 8: Run dev server and verify**

```bash
npm run dev
```

Expected: Page loads at http://localhost:3300 with "MAYA GLYPHS" in gold on dark background.

- [ ] **Step 9: Commit**

```bash
git add src/ tailwind.config.js postcss.config.js next.config.js package.json package-lock.json
git commit -m "feat: scaffold Next.js 15 + Tailwind with Maya dark+gold theme"
```

---

### Task 2: Mode Context + Sidebar Navigation

**Files:**
- Create: `src/lib/modes.js`
- Create: `src/components/Sidebar.jsx`
- Create: `src/components/ModeSelector.jsx`
- Modify: `src/app/layout.js`

- [ ] **Step 1: Create src/lib/modes.js**

```jsx
// src/lib/modes.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const ModeContext = createContext()

const MODES = {
  explorador: { label: 'Explorador', icon: '🌎' },
  estudiante: { label: 'Estudiante', icon: '🎓' },
  investigador: { label: 'Investigador', icon: '🔬' },
}

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('explorador')

  useEffect(() => {
    const saved = localStorage.getItem('maya-mode')
    if (saved && MODES[saved]) setMode(saved)
  }, [])

  function changeMode(newMode) {
    setMode(newMode)
    localStorage.setItem('maya-mode', newMode)
  }

  return (
    <ModeContext.Provider value={{ mode, changeMode, modes: MODES }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within ModeProvider')
  return ctx
}
```

- [ ] **Step 2: Create src/components/ModeSelector.jsx**

```jsx
// src/components/ModeSelector.jsx
'use client'
import { useMode } from '@/lib/modes'

export default function ModeSelector() {
  const { mode, changeMode, modes } = useMode()

  return (
    <div className="flex gap-2 justify-center">
      {Object.entries(modes).map(([key, { label, icon }]) => (
        <button
          key={key}
          onClick={() => changeMode(key)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            mode === key
              ? 'bg-maya-gold text-maya-bg'
              : 'bg-maya-surface text-maya-muted border border-maya-border hover:border-maya-gold'
          }`}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create src/components/Sidebar.jsx**

```jsx
// src/components/Sidebar.jsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMode } from '@/lib/modes'

const NAV_ITEMS = [
  { href: '/', icon: '🏠', label: 'Inicio' },
  { href: '/syllabary', icon: '𐊀', label: 'Silabario' },
  { href: '/dictionary', icon: '📖', label: 'Diccionario' },
  { href: '/transliterator', icon: '✏️', label: 'Transliterador' },
  { href: '/calendar', icon: '📅', label: 'Calendario' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { mode, modes } = useMode()

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-14 bg-maya-darker flex-col items-center py-3 gap-2 border-r border-maya-surface z-50">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${
                active ? 'bg-maya-gold text-maya-bg' : 'bg-maya-surface text-maya-muted hover:bg-maya-border'
              }`}
            >
              {icon}
            </Link>
          )
        })}
        <div className="flex-1" />
        <div className="text-[10px] text-maya-muted text-center leading-tight">
          {modes[mode]?.icon}<br />{modes[mode]?.label.slice(0, 3).toUpperCase()}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-maya-darker flex items-center justify-around border-t border-maya-surface z-50">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 text-xs ${
                active ? 'text-maya-gold' : 'text-maya-muted'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[9px]">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
```

- [ ] **Step 4: Update src/app/layout.js to include ModeProvider + Sidebar**

```jsx
// src/app/layout.js
import './globals.css'
import { ModeProvider } from '@/lib/modes'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'Maya Glyphs — Traductor de Jeroglíficos Mayas',
  description: 'Silabario interactivo, diccionario y transliterador de jeroglíficos mayas basado en datos epigráficos verificados.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-maya-bg text-maya-text antialiased">
        <ModeProvider>
          <Sidebar />
          <main className="md:ml-14 pb-16 md:pb-0">
            {children}
          </main>
        </ModeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Verify sidebar renders and navigation works**

```bash
npm run dev
```

Expected: Gold sidebar on left (desktop) with 5 icons. Clicking navigates between pages (404 is fine for pages not yet created). Mobile shows bottom tab bar.

- [ ] **Step 6: Commit**

```bash
git add src/lib/modes.js src/components/Sidebar.jsx src/components/ModeSelector.jsx src/app/layout.js
git commit -m "feat: add mode context (localStorage) + sidebar navigation"
```

---

### Task 3: Dashboard Homepage

**Files:**
- Create: `src/lib/data.js`
- Create: `src/components/ConfidenceBadge.jsx`
- Modify: `src/app/page.js`

- [ ] **Step 1: Create src/lib/data.js**

```js
// src/lib/data.js
import syllabaryData from '../../data/syllabary.json'
import dictionaryData from '../../data/dictionary.json'

export function getSyllabary() {
  const all = []

  for (const v of syllabaryData.vowels) {
    all.push({ value: v.value, onset: null, ...v })
  }

  for (const group of syllabaryData.syllabograms) {
    for (const s of group.syllables) {
      all.push({ ...s, onset: group.onset })
    }
  }

  return all
}

export function getSyllabaryGrid() {
  return syllabaryData
}

export function getDictionary() {
  return dictionaryData
}

export function getStats() {
  const sylls = getSyllabary()
  return {
    confirmed: sylls.filter(s => s.confidence === 'confirmed').length,
    logograms: syllabaryData.common_logograms.length,
    daySigns: syllabaryData.calendar_glyphs.day_signs.length,
    numerals: dictionaryData.numerals.length,
  }
}
```

- [ ] **Step 2: Create src/components/ConfidenceBadge.jsx**

```jsx
// src/components/ConfidenceBadge.jsx
const COLORS = {
  confirmed: 'text-confidence-confirmed',
  probable: 'text-confidence-probable',
  tentative: 'text-confidence-tentative',
  unknown: 'text-confidence-unknown',
}

const LABELS = {
  confirmed: 'confirmado',
  probable: 'probable',
  tentative: 'tentativo',
  unknown: 'desconocido',
}

export default function ConfidenceBadge({ level, showLabel = true }) {
  return (
    <span className={`inline-flex items-center gap-1 ${COLORS[level] || COLORS.unknown}`}>
      <span className="text-xs">●</span>
      {showLabel && <span className="text-xs">{LABELS[level] || level}</span>}
    </span>
  )
}
```

- [ ] **Step 3: Build src/app/page.js — Dashboard**

```jsx
// src/app/page.js
'use client'
import Link from 'next/link'
import ModeSelector from '@/components/ModeSelector'
import { getStats } from '@/lib/data'

const CARDS = [
  { href: '/syllabary', icon: '𐊀', title: 'Silabario', desc: '100 signos silábicos' },
  { href: '/dictionary', icon: '📖', title: 'Diccionario', desc: '120+ palabras en Ch\'olan' },
  { href: '/transliterator', icon: '✏️', title: 'Transliterador', desc: 'Escribe en maya clásico' },
  { href: '/calendar', icon: '📅', title: 'Calendario', desc: 'Cuenta Larga · Tzolk\'in · Haab\'' },
]

export default function Home() {
  const stats = getStats()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-maya-gold tracking-[0.2em] mb-2">
        MAYA GLYPHS
      </h1>
      <p className="text-maya-muted text-sm mb-8 text-center">
        Traductor de Jeroglíficos Mayas — Datos verificados, sin alucinaciones
      </p>

      <ModeSelector />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-lg w-full">
        {CARDS.map(({ href, icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-maya-surface rounded-xl p-5 text-center border border-maya-border hover:border-maya-gold transition-colors group"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-bold text-maya-text group-hover:text-maya-gold transition-colors">{title}</div>
            <div className="text-xs text-maya-muted mt-1">{desc}</div>
          </Link>
        ))}
      </div>

      <p className="text-maya-muted text-xs mt-8 text-center">
        {stats.confirmed} lecturas confirmadas · {stats.logograms} logogramas · {stats.daySigns} signos de día · Sistema vigesimal completo
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Verify dashboard renders**

```bash
npm run dev
```

Expected: Dashboard with gold title, mode selector, 4 cards in 2×2 grid, stats footer. Cards link to section pages.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data.js src/components/ConfidenceBadge.jsx src/app/page.js
git commit -m "feat: dashboard homepage with cards, mode selector, stats"
```

---

### Task 4: Syllabary Page — Grid + Detail Panel

**Files:**
- Create: `src/components/SyllabaryGrid.jsx`
- Create: `src/components/GlyphDetail.jsx`
- Create: `src/app/syllabary/page.js`

- [ ] **Step 1: Create src/components/SyllabaryGrid.jsx**

```jsx
// src/components/SyllabaryGrid.jsx
'use client'

const CONFIDENCE_BG = {
  confirmed: 'bg-green-900/40 hover:bg-green-900/60',
  probable: 'bg-yellow-900/40 hover:bg-yellow-900/60',
  tentative: 'bg-red-900/40 hover:bg-red-900/60',
  unknown: 'bg-gray-800/40',
}

const VOWELS = ['a', 'e', 'i', 'o', 'u']

export default function SyllabaryGrid({ syllabaryData, selected, onSelect }) {
  const { vowels, syllabograms } = syllabaryData

  return (
    <div className="overflow-x-auto">
      {/* Column headers */}
      <div className="grid grid-cols-[48px_repeat(5,1fr)] gap-1 mb-1 min-w-[340px]">
        <div />
        {VOWELS.map(v => (
          <div key={v} className="text-center text-sm font-bold text-maya-gold">{v}</div>
        ))}
      </div>

      {/* Pure vowels row */}
      <div className="grid grid-cols-[48px_repeat(5,1fr)] gap-1 mb-1 min-w-[340px]">
        <div className="flex items-center text-xs font-bold text-maya-gold">V</div>
        {vowels.map(v => (
          <button
            key={v.value}
            onClick={() => onSelect(v)}
            className={`p-2 rounded text-center text-sm transition-colors cursor-pointer ${CONFIDENCE_BG[v.confidence]} ${
              selected?.value === v.value ? 'ring-2 ring-maya-gold' : ''
            }`}
          >
            {v.value}
          </button>
        ))}
      </div>

      {/* Consonant rows */}
      {syllabograms.map(group => (
        <div key={group.onset} className="grid grid-cols-[48px_repeat(5,1fr)] gap-1 mb-1 min-w-[340px]">
          <div className="flex items-center text-xs font-bold text-maya-gold">{group.onset}</div>
          {group.syllables.map(s => (
            <button
              key={s.value}
              onClick={() => s.confidence !== 'unknown' ? onSelect(s) : null}
              className={`p-2 rounded text-center text-sm transition-colors ${
                s.confidence === 'unknown' ? 'cursor-default opacity-40' : 'cursor-pointer'
              } ${CONFIDENCE_BG[s.confidence]} ${
                selected?.value === s.value ? 'ring-2 ring-maya-gold' : ''
              }`}
            >
              {s.value}
            </button>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex gap-4 text-xs mt-4 p-2 bg-maya-surface rounded-lg min-w-[340px]">
        <span><span className="text-confidence-confirmed">■</span> confirmado</span>
        <span><span className="text-confidence-probable">■</span> probable</span>
        <span><span className="text-confidence-tentative">■</span> tentativo</span>
        <span><span className="text-confidence-unknown">■</span> desconocido</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/GlyphDetail.jsx**

```jsx
// src/components/GlyphDetail.jsx
'use client'
import { useMode } from '@/lib/modes'
import ConfidenceBadge from './ConfidenceBadge'

export default function GlyphDetail({ glyph, logograms }) {
  const { mode } = useMode()

  if (!glyph) {
    return (
      <div className="text-maya-muted text-sm text-center py-12">
        Selecciona un glifo para ver detalles
      </div>
    )
  }

  const matchingLogo = logograms?.find(l =>
    glyph.thompson?.some(t => l.thompson === t)
  )

  return (
    <div>
      {/* Glyph display */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-maya-surface rounded-xl flex items-center justify-center ring-2 ring-maya-gold">
          <span className="text-3xl font-bold text-maya-gold">{glyph.value}</span>
        </div>
      </div>

      {/* Basic info — all modes */}
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-maya-muted">Valor: </span>
          <span className="font-bold">{glyph.value}</span>
        </div>
        <div>
          <span className="text-maya-muted">Confianza: </span>
          <ConfidenceBadge level={glyph.confidence} />
        </div>

        {/* Estudiante + Investigador */}
        {mode !== 'explorador' && (
          <>
            {glyph.frequency && (
              <div>
                <span className="text-maya-muted">Frecuencia: </span>
                <span>{glyph.frequency === 'very_high' ? 'muy alta' : glyph.frequency === 'high' ? 'alta' : glyph.frequency === 'medium' ? 'media' : 'baja'}</span>
              </div>
            )}
            {glyph.variants && (
              <div>
                <span className="text-maya-muted">Variantes: </span>
                <span>{glyph.variants}</span>
              </div>
            )}
            {glyph.notes && (
              <div>
                <span className="text-maya-muted">Notas: </span>
                <span className="text-xs">{glyph.notes}</span>
              </div>
            )}
          </>
        )}

        {/* Investigador only */}
        {mode === 'investigador' && glyph.thompson?.length > 0 && (
          <div>
            <span className="text-maya-muted">Thompson: </span>
            <span className="text-blue-400">{glyph.thompson.join(', ')}</span>
          </div>
        )}

        {/* Logogram match */}
        {matchingLogo && (
          <div className="border-t border-maya-border pt-3 mt-3">
            <div className="text-xs text-maya-muted mb-1">También logograma:</div>
            <div className="font-bold">{matchingLogo.reading}</div>
            <div className="text-xs text-maya-muted">&ldquo;{matchingLogo.meaning}&rdquo;</div>
          </div>
        )}

        {/* Sources — Investigador only */}
        {mode === 'investigador' && (
          <div className="border-t border-maya-border pt-3 mt-3">
            <div className="text-xs text-maya-muted mb-1">Fuentes:</div>
            <div className="text-xs text-blue-400">Stuart 2013</div>
            <div className="text-xs text-blue-400">Thompson 1962</div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create src/app/syllabary/page.js**

```jsx
// src/app/syllabary/page.js
'use client'
import { useState } from 'react'
import { getSyllabaryGrid } from '@/lib/data'
import { useMode } from '@/lib/modes'
import SyllabaryGrid from '@/components/SyllabaryGrid'
import GlyphDetail from '@/components/GlyphDetail'

const syllabaryData = getSyllabaryGrid()

export default function SyllabaryPage() {
  const [selected, setSelected] = useState(null)
  const { mode } = useMode()

  return (
    <div className="flex min-h-screen">
      {/* Main grid area */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-maya-gold">Silabario Maya</h1>
            <p className="text-xs text-maya-muted">
              Modo {mode === 'explorador' ? 'Explorador' : mode === 'estudiante' ? 'Estudiante' : 'Investigador'}
              {' · '}Click en un glifo para ver detalles
            </p>
          </div>
        </div>

        <SyllabaryGrid
          syllabaryData={syllabaryData}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {/* Detail panel — desktop */}
      <div className="hidden lg:block w-56 bg-maya-deep border-l border-maya-surface p-4 overflow-y-auto">
        <div className="text-sm text-maya-muted mb-3">Detalle del glifo</div>
        <GlyphDetail
          glyph={selected}
          logograms={syllabaryData.common_logograms}
        />
      </div>

      {/* Detail panel — mobile modal */}
      {selected && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40 flex items-end" onClick={() => setSelected(null)}>
          <div
            className="w-full bg-maya-deep rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-maya-border rounded-full mx-auto mb-4" />
            <GlyphDetail
              glyph={selected}
              logograms={syllabaryData.common_logograms}
            />
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify syllabary page**

```bash
npm run dev
```

Navigate to http://localhost:3300/syllabary. Expected: 20-row grid (vowels + 19 consonants), cells colored by confidence. Click a cell → detail panel shows info on desktop, bottom sheet on mobile.

- [ ] **Step 5: Commit**

```bash
git add src/components/SyllabaryGrid.jsx src/components/GlyphDetail.jsx src/app/syllabary/
git commit -m "feat: syllabary page with interactive grid + detail panel"
```

---

### Task 5: Dictionary Page

**Files:**
- Create: `src/components/DictionaryEntry.jsx`
- Create: `src/components/DotBarNumeral.jsx`
- Create: `src/app/dictionary/page.js`

- [ ] **Step 1: Create src/components/DictionaryEntry.jsx**

```jsx
// src/components/DictionaryEntry.jsx
import ConfidenceBadge from './ConfidenceBadge'

export default function DictionaryEntry({ entry, mode }) {
  return (
    <div className="bg-maya-surface rounded-lg p-3 border border-maya-border">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-bold text-maya-gold">{entry.maya}</span>
          <span className="text-maya-muted mx-2">→</span>
          <span>{entry.spanish}</span>
          {mode !== 'explorador' && entry.english && (
            <span className="text-maya-muted text-sm ml-2">({entry.english})</span>
          )}
        </div>
        {mode !== 'explorador' && (
          <ConfidenceBadge level={entry.confidence} showLabel={false} />
        )}
      </div>
      {mode === 'investigador' && entry.notes && (
        <p className="text-xs text-maya-muted mt-1">{entry.notes}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/DotBarNumeral.jsx**

```jsx
// src/components/DotBarNumeral.jsx
export default function DotBarNumeral({ value }) {
  if (value < 0 || value > 19) return null

  const bars = Math.floor(value / 5)
  const dots = value % 5

  if (value === 0) {
    return (
      <svg width="40" height="32" viewBox="0 0 40 32" className="inline-block">
        <ellipse cx="20" cy="16" rx="12" ry="8" fill="none" stroke="#c9a84c" strokeWidth="2" />
      </svg>
    )
  }

  const barHeight = 6
  const dotRadius = 4
  const barGap = 3
  const dotGap = 10
  const totalBarH = bars * (barHeight + barGap)
  const totalDotH = dots > 0 ? dotRadius * 2 : 0
  const gap = (bars > 0 && dots > 0) ? 4 : 0
  const height = totalBarH + totalDotH + gap + 4
  const width = Math.max(36, dots * dotGap + 8)

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      {/* Dots on top */}
      {Array.from({ length: dots }).map((_, i) => {
        const cx = (width / 2) - ((dots - 1) * dotGap / 2) + i * dotGap
        return <circle key={`d${i}`} cx={cx} cy={dotRadius + 2} r={dotRadius} fill="#c9a84c" />
      })}
      {/* Bars below dots */}
      {Array.from({ length: bars }).map((_, i) => {
        const y = totalDotH + gap + i * (barHeight + barGap)
        return <rect key={`b${i}`} x={4} y={y} width={width - 8} height={barHeight} rx={2} fill="#c9a84c" />
      })}
    </svg>
  )
}
```

- [ ] **Step 3: Create src/app/dictionary/page.js**

```jsx
// src/app/dictionary/page.js
'use client'
import { useState, useMemo } from 'react'
import { getDictionary } from '@/lib/data'
import { useMode } from '@/lib/modes'
import DictionaryEntry from '@/components/DictionaryEntry'
import DotBarNumeral from '@/components/DotBarNumeral'

const dict = getDictionary()

const TABS = [
  { key: 'titles_and_ranks', label: 'Títulos' },
  { key: 'verbs', label: 'Verbos' },
  { key: 'nouns', label: 'Sustantivos' },
  { key: 'adjectives_and_colors', label: 'Colores' },
  { key: 'directional_terms', label: 'Direcciones' },
  { key: 'numerals', label: 'Numerales' },
  { key: 'death_expressions', label: 'Muerte' },
  { key: 'war_expressions', label: 'Guerra' },
]

export default function DictionaryPage() {
  const [tab, setTab] = useState('titles_and_ranks')
  const [search, setSearch] = useState('')
  const { mode } = useMode()

  const entries = useMemo(() => {
    const items = dict[tab] || []
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(e =>
      e.maya?.toLowerCase().includes(q) ||
      e.spanish?.toLowerCase().includes(q) ||
      e.english?.toLowerCase().includes(q)
    )
  }, [tab, search])

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">Diccionario Maya</h1>
      <p className="text-xs text-maya-muted mb-4">Vocabulario del maya clásico (Ch&apos;olti&apos;an)</p>

      {/* Search */}
      <input
        type="text"
        placeholder="Buscar por maya, español o inglés..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-maya-surface border border-maya-border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-maya-gold"
      />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSearch('') }}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              tab === key ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted hover:bg-maya-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'numerals' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {entries.map(n => (
            <div key={n.value} className="bg-maya-surface rounded-lg p-3 border border-maya-border text-center">
              <DotBarNumeral value={n.value} />
              <div className="font-bold text-maya-gold mt-2">{n.value}</div>
              <div className="text-sm">{n.maya}</div>
              {mode !== 'explorador' && (
                <div className="text-xs text-maya-muted mt-1">{n.glyph_system}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {entries.length === 0 && (
            <p className="text-maya-muted text-sm text-center py-8">Sin resultados</p>
          )}
          {entries.map((entry, i) => (
            <DictionaryEntry key={i} entry={entry} mode={mode} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify dictionary page**

```bash
npm run dev
```

Navigate to http://localhost:3300/dictionary. Expected: Tabs for categories, search bar, entries with maya→spanish→english. Numerals tab shows dot-and-bar SVGs. Mode changes detail level.

- [ ] **Step 5: Commit**

```bash
git add src/components/DictionaryEntry.jsx src/components/DotBarNumeral.jsx src/app/dictionary/
git commit -m "feat: dictionary page with category tabs, search, dot-bar numerals"
```

---

### Task 6: Transliterator Page

**Files:**
- Create: `src/lib/transliterate.js`
- Create: `src/app/transliterator/page.js`

- [ ] **Step 1: Create src/lib/transliterate.js**

```js
// src/lib/transliterate.js
import { getSyllabary, getDictionary } from './data'

const syllabaryLookup = new Map()
for (const s of getSyllabary()) {
  syllabaryLookup.set(s.value, s)
}

export function transliterate(input) {
  if (!input.trim()) return null

  const syllables = input.toLowerCase().trim().split('-').map(s => s.trim()).filter(Boolean)

  const parsed = syllables.map(val => {
    const match = syllabaryLookup.get(val)
    return {
      value: val,
      found: !!match,
      confidence: match?.confidence || 'unknown',
      thompson: match?.thompson || [],
    }
  })

  // Apply synharmony: for CVC pattern, drop the final vowel of the last syllable
  // e.g., ba-la-ma → b.al.am → BAHLAM
  let phonetic = ''
  for (let i = 0; i < parsed.length; i++) {
    const val = parsed[i].value
    if (i < parsed.length - 1) {
      // Keep full syllable
      phonetic += val
    } else {
      // Last syllable: check if previous syllable's vowel matches (synharmony)
      // In CVC words, the last vowel is typically silent
      if (parsed.length > 1) {
        // Extract consonant only from last syllable (drop vowel)
        const consonant = val.replace(/[aeiou]$/, '')
        if (consonant !== val) {
          phonetic += consonant
        } else {
          phonetic += val
        }
      } else {
        phonetic += val
      }
    }
  }

  // Look up in dictionary
  const dict = getDictionary()
  const allEntries = [
    ...(dict.titles_and_ranks || []),
    ...(dict.verbs || []),
    ...(dict.nouns || []),
    ...(dict.adjectives_and_colors || []),
    ...(dict.directional_terms || []),
    ...(dict.death_expressions || []),
    ...(dict.war_expressions || []),
  ]

  const dictMatch = allEntries.find(e =>
    e.maya.toLowerCase().replace(/['\s]/g, '') === phonetic.replace(/['\s]/g, '')
  )

  const allFound = parsed.every(p => p.found)
  const minConfidence = parsed.reduce((min, p) => {
    const order = { confirmed: 3, probable: 2, tentative: 1, unknown: 0 }
    return order[p.confidence] < order[min] ? p.confidence : min
  }, 'confirmed')

  return {
    input: syllables.join('-'),
    syllables: parsed,
    phonetic: phonetic.toUpperCase(),
    synharmony: parsed.length > 1,
    dictMatch,
    allFound,
    overallConfidence: allFound ? minConfidence : 'unknown',
  }
}

export function reverseLookup(query) {
  if (!query.trim()) return []

  const dict = getDictionary()
  const allEntries = [
    ...(dict.titles_and_ranks || []),
    ...(dict.verbs || []),
    ...(dict.nouns || []),
    ...(dict.adjectives_and_colors || []),
    ...(dict.directional_terms || []),
    ...(dict.death_expressions || []),
    ...(dict.war_expressions || []),
  ]

  const q = query.toLowerCase()
  return allEntries.filter(e =>
    e.spanish?.toLowerCase().includes(q) ||
    e.english?.toLowerCase().includes(q)
  ).slice(0, 10)
}
```

- [ ] **Step 2: Create src/app/transliterator/page.js**

```jsx
// src/app/transliterator/page.js
'use client'
import { useState, useMemo } from 'react'
import { useMode } from '@/lib/modes'
import { transliterate, reverseLookup } from '@/lib/transliterate'
import ConfidenceBadge from '@/components/ConfidenceBadge'

export default function TransliteratorPage() {
  const [input, setInput] = useState('')
  const [reverse, setReverse] = useState(false)
  const [reverseQuery, setReverseQuery] = useState('')
  const { mode } = useMode()

  const result = useMemo(() => transliterate(input), [input])
  const reverseResults = useMemo(() => reverseLookup(reverseQuery), [reverseQuery])

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">Transliterador</h1>
      <p className="text-xs text-maya-muted mb-4">Convierte secuencias de glifos a fonética maya clásica</p>

      {/* Direction toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setReverse(false)}
          className={`px-3 py-1.5 rounded-lg text-xs ${!reverse ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          Glifos → Maya
        </button>
        <button
          onClick={() => setReverse(true)}
          className={`px-3 py-1.5 rounded-lg text-xs ${reverse ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          Español → Maya
        </button>
      </div>

      {!reverse ? (
        <>
          {/* Forward: syllable input */}
          <div className="mb-6">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escribe sílabas separadas por guión: ba-la-ma"
              className="w-full bg-maya-surface border border-maya-border rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-maya-gold"
            />
            {input && (
              <button onClick={() => setInput('')} className="text-xs text-maya-muted mt-1 hover:text-maya-gold">
                Limpiar
              </button>
            )}
          </div>

          {/* Output */}
          {result && (
            <div className="bg-maya-surface rounded-xl p-5 border border-maya-border space-y-4">
              {/* Phonetic result */}
              <div>
                <div className="text-xs text-maya-muted mb-1">Lectura fonética:</div>
                <div className="text-2xl font-bold text-maya-gold">{result.phonetic}</div>
              </div>

              {/* Per-syllable breakdown */}
              <div>
                <div className="text-xs text-maya-muted mb-2">Sílabas:</div>
                <div className="flex gap-2 flex-wrap">
                  {result.syllables.map((s, i) => (
                    <div key={i} className={`bg-maya-deep rounded-lg px-3 py-2 text-center ${!s.found ? 'border border-red-500/50' : ''}`}>
                      <div className="font-bold">{s.value}</div>
                      <ConfidenceBadge level={s.confidence} showLabel={false} />
                      {mode === 'investigador' && s.thompson.length > 0 && (
                        <div className="text-[10px] text-blue-400 mt-1">{s.thompson.join(', ')}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Synharmony note */}
              {mode !== 'explorador' && result.synharmony && (
                <div className="text-xs text-maya-muted bg-maya-deep rounded-lg p-3">
                  <span className="text-maya-gold">Regla CVC:</span> La vocal final se descarta (sinharmonía vocálica)
                </div>
              )}

              {/* Dictionary match */}
              {result.dictMatch && (
                <div className="border-t border-maya-border pt-3">
                  <div className="text-xs text-confidence-confirmed mb-1">● Coincidencia en diccionario:</div>
                  <div>
                    <span className="font-bold text-maya-gold">{result.dictMatch.maya}</span>
                    <span className="text-maya-muted mx-2">→</span>
                    <span>{result.dictMatch.spanish}</span>
                    {mode !== 'explorador' && result.dictMatch.english && (
                      <span className="text-maya-muted text-sm ml-2">({result.dictMatch.english})</span>
                    )}
                  </div>
                </div>
              )}

              {/* Overall confidence */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-maya-muted">Confianza general:</span>
                <ConfidenceBadge level={result.overallConfidence} />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Reverse: Spanish search */}
          <input
            type="text"
            value={reverseQuery}
            onChange={e => setReverseQuery(e.target.value)}
            placeholder="Buscar palabra en español o inglés..."
            className="w-full bg-maya-surface border border-maya-border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-maya-gold"
          />
          <div className="space-y-2">
            {reverseResults.map((entry, i) => (
              <div key={i} className="bg-maya-surface rounded-lg p-3 border border-maya-border">
                <span className="font-bold text-maya-gold">{entry.maya}</span>
                <span className="text-maya-muted mx-2">→</span>
                <span>{entry.spanish}</span>
                {entry.english && <span className="text-maya-muted text-sm ml-2">({entry.english})</span>}
              </div>
            ))}
            {reverseQuery && reverseResults.length === 0 && (
              <p className="text-maya-muted text-sm text-center py-8">Sin resultados</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify transliterator**

```bash
npm run dev
```

Navigate to http://localhost:3300/transliterator. Type "ba-la-ma" → should show "BAHLAM" with dictionary match "jaguar". Type "pa-ka-la" → "PAKAL" → "shield". Reverse mode: search "jaguar" → shows "b'ahlam".

- [ ] **Step 4: Commit**

```bash
git add src/lib/transliterate.js src/app/transliterator/
git commit -m "feat: transliterator with synharmony rules + dictionary lookup + reverse mode"
```

---

### Task 7: Calendar Page

**Files:**
- Create: `src/lib/calendar.js`
- Create: `src/components/CalendarDisplay.jsx`
- Create: `src/app/calendar/page.js`

- [ ] **Step 1: Create src/lib/calendar.js**

```js
// src/lib/calendar.js
import { getSyllabaryGrid } from './data'

// GMT correlation constant
const GMT_CORRELATION = 584283

const calendarData = getSyllabaryGrid().calendar_glyphs

export function getDaySigns() {
  return calendarData.day_signs
}

export function getMonthSigns() {
  return calendarData.month_signs
}

// Convert Gregorian date to Julian Day Number
function gregorianToJDN(year, month, day) {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

// Convert JDN to Maya Long Count day number
function jdnToMayaDays(jdn) {
  return jdn - GMT_CORRELATION
}

// Convert Maya day number to Long Count (B'ak'tun.K'atun.Tun.Winal.K'in)
function mayaDaysToLongCount(days) {
  let remaining = days
  const baktun = Math.floor(remaining / 144000)
  remaining %= 144000
  const katun = Math.floor(remaining / 7200)
  remaining %= 7200
  const tun = Math.floor(remaining / 360)
  remaining %= 360
  const winal = Math.floor(remaining / 20)
  const kin = remaining % 20

  return { baktun, katun, tun, winal, kin }
}

// Get Tzolk'in date (day number 1-13, day sign 1-20)
function getTzolkin(mayaDays) {
  // Tzolk'in starts at 4 Ajaw
  const dayNum = ((mayaDays + 3) % 13 + 13) % 13 + 1
  const daySign = ((mayaDays + 19) % 20 + 20) % 20
  const sign = calendarData.day_signs[daySign]
  return { number: dayNum, signIndex: daySign, sign }
}

// Get Haab' date (day 0-19 within month 0-18)
function getHaab(mayaDays) {
  // Haab' starts at 8 Kumk'u
  const dayInYear = ((mayaDays + 348) % 365 + 365) % 365
  const month = Math.floor(dayInYear / 20)
  const day = dayInYear % 20
  const monthSign = calendarData.month_signs[month]
  return { day, monthIndex: month, month: monthSign }
}

// Parse Long Count string "13.0.11.7.5" to Maya day number
function longCountToMayaDays(lc) {
  const parts = lc.split('.').map(Number)
  if (parts.length !== 5 || parts.some(isNaN)) return null
  const [baktun, katun, tun, winal, kin] = parts
  return baktun * 144000 + katun * 7200 + tun * 360 + winal * 20 + kin
}

// Convert Maya day number back to Gregorian
function mayaDaysToGregorian(mayaDays) {
  const jdn = mayaDays + GMT_CORRELATION
  // JDN to Gregorian
  const l = jdn + 68569
  const n = Math.floor(4 * l / 146097)
  const l2 = l - Math.floor((146097 * n + 3) / 4)
  const i = Math.floor(4000 * (l2 + 1) / 1461001)
  const l3 = l2 - Math.floor(1461 * i / 4) + 31
  const j = Math.floor(80 * l3 / 2447)
  const day = l3 - Math.floor(2447 * j / 80)
  const l4 = Math.floor(j / 11)
  const month = j + 2 - 12 * l4
  const year = 100 * (n - 49) + i + l4
  return { year, month, day }
}

// Direction and color for day sign
const DIRECTIONS = ['East', 'North', 'West', 'South']
const DIRECTION_COLORS = ['chak (rojo)', 'sak (blanco)', 'ek\' (negro)', 'k\'an (amarillo)']

export function convertGregorianToMaya(year, month, day) {
  const jdn = gregorianToJDN(year, month, day)
  const mayaDays = jdnToMayaDays(jdn)
  const longCount = mayaDaysToLongCount(mayaDays)
  const tzolkin = getTzolkin(mayaDays)
  const haab = getHaab(mayaDays)

  const dirIndex = tzolkin.signIndex % 4
  const direction = DIRECTIONS[dirIndex]
  const color = DIRECTION_COLORS[dirIndex]

  return {
    longCount,
    longCountStr: `${longCount.baktun}.${longCount.katun}.${longCount.tun}.${longCount.winal}.${longCount.kin}`,
    tzolkin,
    haab,
    direction,
    color,
    mayaDays,
  }
}

export function convertLongCountToGregorian(lcStr) {
  const mayaDays = longCountToMayaDays(lcStr)
  if (mayaDays === null) return null
  const gregorian = mayaDaysToGregorian(mayaDays)
  const tzolkin = getTzolkin(mayaDays)
  const haab = getHaab(mayaDays)

  const dirIndex = tzolkin.signIndex % 4
  const direction = DIRECTIONS[dirIndex]
  const color = DIRECTION_COLORS[dirIndex]

  const longCount = mayaDaysToLongCount(mayaDays)

  return {
    gregorian,
    longCount,
    longCountStr: lcStr,
    tzolkin,
    haab,
    direction,
    color,
    mayaDays,
  }
}
```

- [ ] **Step 2: Create src/components/CalendarDisplay.jsx**

```jsx
// src/components/CalendarDisplay.jsx
'use client'
import { useMode } from '@/lib/modes'
import DotBarNumeral from './DotBarNumeral'

export default function CalendarDisplay({ result }) {
  const { mode } = useMode()

  if (!result) return null

  const { longCount, longCountStr, tzolkin, haab, direction, color } = result

  return (
    <div className="space-y-4">
      {/* Long Count */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Cuenta Larga</div>
        <div className="text-2xl font-bold text-maya-gold tracking-wider">{longCountStr}</div>
        {mode !== 'explorador' && (
          <div className="flex gap-3 mt-3">
            {[
              { label: "B'ak'tun", val: longCount.baktun },
              { label: "K'atun", val: longCount.katun },
              { label: 'Tun', val: longCount.tun },
              { label: 'Winal', val: longCount.winal },
              { label: "K'in", val: longCount.kin },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <DotBarNumeral value={val} />
                <div className="text-[10px] text-maya-muted mt-1">{label}</div>
                <div className="text-xs font-bold">{val}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tzolk'in */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Tzolk&apos;in (260 días)</div>
        <div className="text-xl font-bold">
          <span className="text-maya-gold">{tzolkin.number}</span>
          <span className="mx-2">{tzolkin.sign.choltan}</span>
          <span className="text-sm text-maya-muted">({tzolkin.sign.yucatec})</span>
        </div>
        <div className="text-sm text-maya-muted mt-1">{tzolkin.sign.meaning}</div>
        {mode === 'investigador' && (
          <div className="text-xs text-blue-400 mt-1">Thompson: {tzolkin.sign.thompson}</div>
        )}
      </div>

      {/* Haab' */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Haab&apos; (365 días)</div>
        <div className="text-xl font-bold">
          <span className="text-maya-gold">{haab.day}</span>
          <span className="mx-2">{haab.month.name}</span>
        </div>
        <div className="text-sm text-maya-muted mt-1">{haab.month.meaning}</div>
        {mode === 'investigador' && (
          <div className="text-xs text-blue-400 mt-1">Thompson: {haab.month.thompson}</div>
        )}
      </div>

      {/* Calendar Round */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Rueda Calendárica</div>
        <div className="text-lg font-bold text-maya-gold">
          {tzolkin.number} {tzolkin.sign.choltan} {haab.day} {haab.month.name}
        </div>
      </div>

      {/* Direction & Color */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Dirección y color</div>
        <div className="text-sm">
          <span className="text-maya-muted">Dirección: </span><span>{direction}</span>
        </div>
        <div className="text-sm">
          <span className="text-maya-muted">Color: </span><span>{color}</span>
        </div>
      </div>

      {/* Investigador: correlation note */}
      {mode === 'investigador' && (
        <div className="text-xs text-maya-muted bg-maya-deep rounded-lg p-3">
          Constante de correlación GMT: 584283 (Goodman-Martínez-Thompson)
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create src/app/calendar/page.js**

```jsx
// src/app/calendar/page.js
'use client'
import { useState, useMemo } from 'react'
import { convertGregorianToMaya, convertLongCountToGregorian } from '@/lib/calendar'
import CalendarDisplay from '@/components/CalendarDisplay'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function CalendarPage() {
  const [dateInput, setDateInput] = useState(todayStr())
  const [lcInput, setLcInput] = useState('')
  const [direction, setDirection] = useState('gregorian') // 'gregorian' or 'longcount'

  const result = useMemo(() => {
    if (direction === 'gregorian') {
      const [y, m, d] = dateInput.split('-').map(Number)
      if (!y || !m || !d) return null
      return convertGregorianToMaya(y, m, d)
    } else {
      if (!lcInput.trim()) return null
      return convertLongCountToGregorian(lcInput.trim())
    }
  }, [dateInput, lcInput, direction])

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">Calendario Maya</h1>
      <p className="text-xs text-maya-muted mb-4">Convierte fechas entre el calendario gregoriano y los calendarios mayas</p>

      {/* Direction toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDirection('gregorian')}
          className={`px-3 py-1.5 rounded-lg text-xs ${direction === 'gregorian' ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          Gregoriano → Maya
        </button>
        <button
          onClick={() => setDirection('longcount')}
          className={`px-3 py-1.5 rounded-lg text-xs ${direction === 'longcount' ? 'bg-maya-gold text-maya-bg font-bold' : 'bg-maya-surface text-maya-muted'}`}
        >
          Cuenta Larga → Gregoriano
        </button>
      </div>

      {/* Input */}
      {direction === 'gregorian' ? (
        <div className="flex gap-2 mb-6">
          <input
            type="date"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            className="flex-1 bg-maya-surface border border-maya-border rounded-lg px-4 py-3 focus:outline-none focus:border-maya-gold [color-scheme:dark]"
          />
          <button
            onClick={() => setDateInput(todayStr())}
            className="px-4 py-2 bg-maya-gold text-maya-bg rounded-lg text-sm font-bold hover:bg-maya-gold-dim"
          >
            Hoy
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <input
            type="text"
            value={lcInput}
            onChange={e => setLcInput(e.target.value)}
            placeholder="Ej: 13.0.11.7.5"
            className="w-full bg-maya-surface border border-maya-border rounded-lg px-4 py-3 focus:outline-none focus:border-maya-gold"
          />
          {result?.gregorian && (
            <div className="text-sm text-maya-muted mt-2">
              Fecha gregoriana: <span className="text-maya-text font-bold">
                {result.gregorian.day}/{result.gregorian.month}/{result.gregorian.year}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Output */}
      <CalendarDisplay result={result} />
    </div>
  )
}
```

- [ ] **Step 4: Verify calendar page**

```bash
npm run dev
```

Navigate to http://localhost:3300/calendar. Expected: Today's date shows Long Count, Tzolk'in, Haab', Calendar Round with dot-and-bar numerals. Reverse mode: enter "9.12.2.0.16" → shows Gregorian date. Well-known test: Dec 21, 2012 = 13.0.0.0.0 4 Ajaw 3 K'ank'in.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calendar.js src/components/CalendarDisplay.jsx src/app/calendar/
git commit -m "feat: Maya calendar converter (Long Count, Tzolk'in, Haab', Calendar Round)"
```

---

### Task 8: Build Verification + Final Commit

**Files:**
- Modify: `.gitignore` (create if missing)

- [ ] **Step 1: Create .gitignore**

```
node_modules/
.next/
.superpowers/
```

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 3: Test all pages manually**

```bash
npm run start
```

Check all 5 pages at http://localhost:3300:
- `/` — Dashboard renders with 4 cards, mode selector works
- `/syllabary` — Grid renders 20 rows, click shows detail panel, mode changes detail level
- `/dictionary` — Tabs switch categories, search filters, numerals show dot-bar SVGs
- `/transliterator` — "ba-la-ma" → "BAHLAM" + jaguar match, reverse search works
- `/calendar` — Today's date converts, Dec 21 2012 = 13.0.0.0.0

- [ ] **Step 4: Commit .gitignore + any fixes**

```bash
git add .gitignore
git commit -m "chore: add .gitignore, verify production build"
```
