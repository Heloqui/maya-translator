'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/lang'
import { convertGregorianToMaya } from '@/lib/calendar'
import { getGlyphImage } from '@/lib/glyph-images'

const DAY_SIGN_MEANINGS = {
  "imix":     { es: "Cocodrilo — Energía primordial, inicio, nutrición", en: "Crocodile — Primal energy, beginning, nurturing" },
  "ik'":      { es: "Viento — Comunicación, espíritu, aliento de vida", en: "Wind — Communication, spirit, breath of life" },
  "ak'bal":   { es: "Noche — Oscuridad, misterio, lo subconsciente", en: "Night — Darkness, mystery, the subconscious" },
  "k'an":     { es: "Maíz — Abundancia, madurez, semilla", en: "Corn — Abundance, ripeness, seed" },
  "chikchan": { es: "Serpiente — Poder, energía vital, kundalini", en: "Serpent — Power, life force, kundalini" },
  "kimi":     { es: "Muerte — Transformación, renacimiento, ancestros", en: "Death — Transformation, rebirth, ancestors" },
  "manik'":   { es: "Venado — Elegancia, gracia, cazador", en: "Deer — Elegance, grace, hunter" },
  "lamat":    { es: "Estrella — Venus, fertilidad, armonía", en: "Star — Venus, fertility, harmony" },
  "muluk":    { es: "Agua — Emociones, ofrendas, purificación", en: "Water — Emotions, offerings, purification" },
  "ok":       { es: "Perro — Guía, lealtad, compañero del inframundo", en: "Dog — Guide, loyalty, companion of the underworld" },
  "chuwen":   { es: "Mono — Creatividad, arte, tejedor del tiempo", en: "Monkey — Creativity, art, weaver of time" },
  "eb'":      { es: "Hierba — Camino, destino, lluvia benigna", en: "Grass — Road, destiny, gentle rain" },
  "b'en":     { es: "Caña — Autoridad, crecimiento, pilar del mundo", en: "Reed — Authority, growth, pillar of the world" },
  "ix":       { es: "Jaguar — Fuerza femenina, magia, tierra", en: "Jaguar — Feminine strength, magic, earth" },
  "men":      { es: "Águila — Visión, libertad, mente superior", en: "Eagle — Vision, freedom, higher mind" },
  "kib'":     { es: "Búho — Sabiduría, perdón, cera de abeja", en: "Owl — Wisdom, forgiveness, beeswax" },
  "kab'an":   { es: "Tierra — Movimiento sísmico, pensamiento, inteligencia", en: "Earth — Seismic movement, thought, intelligence" },
  "etz'nab'": { es: "Pedernal — Verdad cortante, sacrificio, espejo", en: "Flint — Cutting truth, sacrifice, mirror" },
  "kawak":    { es: "Tormenta — Lluvia, trueno, sanación", en: "Storm — Rain, thunder, healing" },
  "ajaw":     { es: "Señor — Sol, flor, líder, iluminación", en: "Lord — Sun, flower, leader, enlightenment" },
}

function getMeaning(signName, lang) {
  if (!signName) return null
  const key = signName.toLowerCase().trim()
  // Try direct match first
  if (DAY_SIGN_MEANINGS[key]) return DAY_SIGN_MEANINGS[key][lang]
  // Try without apostrophes
  const noApos = key.replace(/[''ʼ']/g, '')
  for (const [k, v] of Object.entries(DAY_SIGN_MEANINGS)) {
    if (k.replace(/[''ʼ']/g, '') === noApos) return v[lang]
  }
  return null
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function BirthdayPage() {
  const { t, lang } = useLang()
  const [dateInput, setDateInput] = useState('')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!dateInput) return null
    const [y, m, d] = dateInput.split('-').map(Number)
    if (!y || !m || !d) return null
    return convertGregorianToMaya(y, m, d)
  }, [dateInput])

  const daySignName = result?.tzolkin?.sign?.choltan
  const daySignImg = daySignName ? getGlyphImage(daySignName.toLowerCase()) : null
  const meaning = daySignName ? getMeaning(daySignName, lang) : null

  const shareText = result
    ? `${t.bornOn} ${result.tzolkin.number} ${daySignName} ${result.haab.day} ${result.haab.month?.name} 🏛️ ${t.discoverYours}: https://maya-translator.vercel.app/birthday`
    : ''

  function handleShare() {
    if (!shareText) return
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎂</div>
          <h1 className="text-2xl md:text-3xl font-bold text-maya-gold leading-tight mb-2">
            {t.birthdayTitle}
          </h1>
          <p className="text-sm text-maya-muted">{t.birthdaySubtitle}</p>
        </div>

        {/* Date picker */}
        <div className="bg-maya-surface rounded-xl border border-maya-border p-5 mb-6">
          <label className="block text-xs text-maya-muted mb-2 uppercase tracking-wider">
            {t.selectBirthdate}
          </label>
          <input
            type="date"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            max={todayStr()}
            className="w-full bg-maya-deep border border-maya-border rounded-lg px-4 py-3 text-maya-text focus:outline-none focus:border-maya-gold transition-colors [color-scheme:dark] text-base"
          />
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4 animate-fadeIn">
            {/* Main result card — mystical feel */}
            <div className="bg-maya-surface rounded-2xl border-2 border-maya-gold p-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] text-center">
              <div className="text-xs text-maya-muted uppercase tracking-widest mb-4">
                {t.yourMayaBirthday}
              </div>

              {/* Glyph image */}
              {daySignImg ? (
                <div className="w-28 h-28 mx-auto bg-white rounded-2xl flex items-center justify-center p-3 mb-4 shadow-lg shadow-maya-gold/20">
                  <img
                    src={daySignImg}
                    alt={daySignName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 mx-auto bg-maya-deep rounded-2xl flex items-center justify-center border-2 border-maya-gold mb-4">
                  <span className="text-xl font-bold text-maya-gold">{daySignName}</span>
                </div>
              )}

              {/* Calendar Round */}
              <div className="text-3xl font-bold text-maya-gold mb-1">
                {result.tzolkin.number} {daySignName}
              </div>
              <div className="text-lg text-maya-text mb-1">
                {result.haab.day} {result.haab.month?.name}
              </div>
              <div className="text-xs text-maya-muted">
                {t.longCount}: {result.longCountStr}
              </div>
            </div>

            {/* Day sign meaning */}
            {meaning && (
              <div className="bg-maya-surface rounded-xl border border-maya-border p-5">
                <div className="text-xs text-maya-muted uppercase tracking-wider mb-2">
                  {t.yourDaySign} · {t.meaning}
                </div>
                <div className="text-sm text-maya-text leading-relaxed">{meaning}</div>
              </div>
            )}

            {/* Haab month meaning */}
            {result.haab.month?.meaning && (
              <div className="bg-maya-surface rounded-xl border border-maya-border p-5">
                <div className="text-xs text-maya-muted uppercase tracking-wider mb-2">
                  Haab&apos;
                </div>
                <div className="text-sm text-maya-muted">{result.haab.month.meaning}</div>
              </div>
            )}

            {/* Share button */}
            <button
              onClick={handleShare}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-maya-gold text-maya-bg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  {t.copiedToClipboard}
                </>
              ) : (
                <>
                  <span>🔗</span>
                  {t.shareResult}
                </>
              )}
            </button>

            {/* Share preview text */}
            <div className="bg-maya-deep rounded-xl border border-maya-border p-4 text-xs text-maya-muted italic leading-relaxed">
              {shareText}
            </div>

            {/* Link to full calendar */}
            <div className="text-center pt-2">
              <Link
                href="/calendar"
                className="text-xs text-maya-gold hover:underline"
              >
                {t.seeFullCalendar} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
