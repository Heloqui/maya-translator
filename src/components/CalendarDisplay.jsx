'use client'
import { useLang } from '@/lib/lang'
import DotBarNumeral from './DotBarNumeral'
import { thompsonToChar } from '@/lib/glyphs'
import { getGlyphImage } from '@/lib/glyph-images'

function CalendarGlyph({ name, thompson }) {
  const imgPath = getGlyphImage(name?.toLowerCase())
  const fontChar = thompson ? thompsonToChar(thompson) : null

  if (!imgPath && !fontChar) return null

  return (
    <div className="flex-shrink-0 w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden">
      {imgPath ? (
        <img
          src={imgPath}
          alt={name}
          className="w-full h-full object-contain p-2"
        />
      ) : (
        <span
          style={{ fontFamily: 'MayaGlyphs, serif', fontSize: '5rem', lineHeight: 1 }}
          className="text-gray-800"
        >
          {fontChar}
        </span>
      )}
    </div>
  )
}

export default function CalendarDisplay({ result }) {
  const { t } = useLang()

  if (!result) return null

  const { longCount, longCountStr, tzolkin, haab, direction, color } = result

  return (
    <div className="space-y-4">
      {/* Long Count */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">{t.longCount}</div>
        <div className="text-2xl font-bold text-maya-gold tracking-wider">{longCountStr}</div>
        <div className="flex gap-3 mt-3">
          {[
            { label: "B'ak'tun", val: longCount.baktun },
            { label: "K'atun", val: longCount.katun },
            { label: 'Tun', val: longCount.tun },
            { label: 'Winal', val: longCount.winal },
            { label: "K'in", val: longCount.kin },
          ].map(({ label, val }) => (
            <div key={label} className="text-center">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                <DotBarNumeral value={val} />
              </div>
              <div className="text-[10px] text-maya-muted mt-1">{label}</div>
              <div className="text-xs font-bold">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tzolk'in */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Tzolk&apos;in (260 d&iacute;as)</div>
        <div className="flex items-center gap-4">
          <CalendarGlyph
            name={tzolkin.sign.choltan}
            thompson={tzolkin.sign.thompson}
          />
          <div>
            <div className="text-xl font-bold">
              <span className="text-maya-gold">{tzolkin.number}</span>
              <span className="mx-2">{tzolkin.sign.choltan}</span>
              <span className="text-sm text-maya-muted">({tzolkin.sign.yucatec})</span>
            </div>
            <div className="text-sm text-maya-muted mt-1">{tzolkin.sign.meaning}</div>
            <div className="text-xs text-blue-400 mt-1">Thompson: {tzolkin.sign.thompson}</div>
          </div>
        </div>
      </div>

      {/* Haab' */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Haab&apos; (365 d&iacute;as)</div>
        <div className="flex items-center gap-4">
          <CalendarGlyph
            name={haab.month.name}
            thompson={haab.month.thompson}
          />
          <div>
            <div className="text-xl font-bold">
              <span className="text-maya-gold">{haab.day}</span>
              <span className="mx-2">{haab.month.name}</span>
            </div>
            <div className="text-sm text-maya-muted mt-1">{haab.month.meaning}</div>
            <div className="text-xs text-blue-400 mt-1">Thompson: {haab.month.thompson}</div>
          </div>
        </div>
      </div>

      {/* Calendar Round */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">{t.calendarRound}</div>
        <div className="flex items-center gap-3">
          <CalendarGlyph
            name={tzolkin.sign.choltan}
            thompson={tzolkin.sign.thompson}
          />
          <div className="text-lg font-bold text-maya-gold">
            {tzolkin.number} {tzolkin.sign.choltan} {haab.day} {haab.month.name}
          </div>
          <CalendarGlyph
            name={haab.month.name}
            thompson={haab.month.thompson}
          />
        </div>
      </div>

      {/* Direction & Color */}
      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">{t.directionAndColor}</div>
        <div className="text-sm">
          <span className="text-maya-muted">{t.direction}: </span><span>{direction}</span>
        </div>
        <div className="text-sm">
          <span className="text-maya-muted">{t.color}: </span><span>{color}</span>
        </div>
      </div>

      <div className="text-xs text-maya-muted bg-maya-deep rounded-lg p-3">
        Constante de correlaci&oacute;n GMT: 584283 (Goodman-Mart&iacute;nez-Thompson)
      </div>
    </div>
  )
}
