'use client'
import { useMode } from '@/lib/modes'
import DotBarNumeral from './DotBarNumeral'

export default function CalendarDisplay({ result }) {
  const { mode } = useMode()

  if (!result) return null

  const { longCount, longCountStr, tzolkin, haab, direction, color } = result

  return (
    <div className="space-y-4">
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

      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Tzolk&apos;in (260 dias)</div>
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

      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Haab&apos; (365 dias)</div>
        <div className="text-xl font-bold">
          <span className="text-maya-gold">{haab.day}</span>
          <span className="mx-2">{haab.month.name}</span>
        </div>
        <div className="text-sm text-maya-muted mt-1">{haab.month.meaning}</div>
        {mode === 'investigador' && (
          <div className="text-xs text-blue-400 mt-1">Thompson: {haab.month.thompson}</div>
        )}
      </div>

      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Rueda Calendárica</div>
        <div className="text-lg font-bold text-maya-gold">
          {tzolkin.number} {tzolkin.sign.choltan} {haab.day} {haab.month.name}
        </div>
      </div>

      <div className="bg-maya-surface rounded-xl p-4 border border-maya-border">
        <div className="text-xs text-maya-muted mb-2">Dirección y color</div>
        <div className="text-sm">
          <span className="text-maya-muted">Dirección: </span><span>{direction}</span>
        </div>
        <div className="text-sm">
          <span className="text-maya-muted">Color: </span><span>{color}</span>
        </div>
      </div>

      {mode === 'investigador' && (
        <div className="text-xs text-maya-muted bg-maya-deep rounded-lg p-3">
          Constante de correlación GMT: 584283 (Goodman-Martínez-Thompson)
        </div>
      )}
    </div>
  )
}
