'use client'
import { useState, useMemo } from 'react'
import { useMode } from '@/lib/modes'
import DotBarNumeral from '@/components/DotBarNumeral'
import { getDictionary } from '@/lib/data'

const dict = getDictionary()

const POSITIONS = [
  { name: "B'ak'tun", multiplier: 144000, index: 4 },
  { name: "K'atun", multiplier: 7200, index: 3 },
  { name: 'Tun', multiplier: 360, index: 2 },
  { name: 'Winal', multiplier: 20, index: 1 },
  { name: "K'in", multiplier: 1, index: 0 },
]

function toVigesimal(num) {
  if (num < 0) return null
  const digits = []
  let remaining = Math.floor(num)
  // Use modified vigesimal (Winal position is 0-17 for calendar, but for pure math it's 0-19)
  // For pure math, all positions are base 20
  for (const pos of [...POSITIONS].reverse()) {
    const digit = Math.floor(remaining / pos.multiplier)
    digits.unshift(digit)
    remaining = remaining % pos.multiplier
  }
  // Remove leading zeros but keep at least K'in
  while (digits.length > 1 && digits[0] === 0) digits.shift()
  return digits
}

// Pure vigesimal (all positions base 20, no calendar modification)
function toPureVigesimal(num) {
  if (num < 0) return null
  if (num === 0) return [0]
  const digits = []
  let remaining = Math.floor(num)
  while (remaining > 0) {
    digits.unshift(remaining % 20)
    remaining = Math.floor(remaining / 20)
  }
  return digits
}

function fromPureVigesimal(digits) {
  let result = 0
  for (let i = 0; i < digits.length; i++) {
    result += digits[digits.length - 1 - i] * Math.pow(20, i)
  }
  return result
}

export default function MathPage() {
  const [decimal, setDecimal] = useState('365')
  const [numA, setNumA] = useState('400')
  const [numB, setNumB] = useState('125')
  const [operator, setOperator] = useState('+')
  const { mode } = useMode()

  // Section A: Converter
  const decNum = parseInt(decimal) || 0
  const vigesimalDigits = useMemo(() => toPureVigesimal(Math.max(0, decNum)), [decNum])
  const vigesimalStr = vigesimalDigits ? vigesimalDigits.join('.') : '0'

  // Section B: Calculator
  const a = parseInt(numA) || 0
  const b = parseInt(numB) || 0
  const calcResult = operator === '+' ? a + b : Math.max(0, a - b)
  const digitsA = useMemo(() => toPureVigesimal(Math.max(0, a)), [a])
  const digitsB = useMemo(() => toPureVigesimal(Math.max(0, b)), [b])
  const digitsResult = useMemo(() => toPureVigesimal(calcResult), [calcResult])

  // Pad arrays to same length for visual alignment
  const maxLen = Math.max(digitsA?.length || 1, digitsB?.length || 1, digitsResult?.length || 1)
  const padded = (arr) => {
    if (!arr) return Array(maxLen).fill(0)
    return [...Array(maxLen - arr.length).fill(0), ...arr]
  }

  // Position labels for pure vigesimal
  const posLabels = ["K'in (×1)", "Winal (×20)", "Tun (×400)", "K'atun (×8,000)", "B'ak'tun (×160,000)"]

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-maya-gold mb-1">Matemáticas Mayas</h1>
      <p className="text-xs text-maya-muted mb-6">Sistema vigesimal (base 20) con el cero</p>

      {/* Section A: Converter */}
      <div className="bg-maya-surface rounded-xl p-5 border border-maya-border mb-6">
        <h2 className="text-lg font-bold text-maya-gold mb-3">Conversor Decimal → Maya</h2>
        <div className="flex gap-3 items-start mb-4">
          <div className="flex-1">
            <input
              type="number"
              value={decimal}
              onChange={e => setDecimal(e.target.value)}
              min="0"
              max="99999999"
              placeholder="Escribe un número..."
              className="w-full bg-maya-deep border border-maya-border rounded-lg px-4 py-3 text-2xl text-maya-gold font-bold focus:outline-none focus:border-maya-gold"
            />
            {mode !== 'explorador' && (
              <div className="text-xs text-maya-muted mt-1">
                Vigesimal: <span className="text-maya-gold font-mono">{vigesimalStr}</span>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Maya numeral display (bottom = ones, top = highest) */}
        <div className="flex justify-center">
          <div className="flex flex-col-reverse items-center gap-2">
            {vigesimalDigits && vigesimalDigits.map((digit, i) => {
              const posIdx = vigesimalDigits.length - 1 - i
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-right text-xs text-maya-muted">
                    {posLabels[posIdx] || `×${Math.pow(20, posIdx).toLocaleString()}`}
                  </div>
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <DotBarNumeral value={digit} />
                  </div>
                  <div className="w-12 text-sm font-bold text-maya-text">{digit}</div>
                </div>
              )
            })}
          </div>
        </div>

        {mode !== 'explorador' && (
          <div className="text-xs text-maya-muted mt-4 bg-maya-deep rounded-lg p-3 text-center">
            {vigesimalDigits && vigesimalDigits.map((d, i) => {
              const power = vigesimalDigits.length - 1 - i
              const multiplier = Math.pow(20, power)
              return `${d}×${multiplier.toLocaleString()}`
            }).join(' + ')} = {decNum.toLocaleString()}
          </div>
        )}
      </div>

      {/* Section B: Calculator */}
      <div className="bg-maya-surface rounded-xl p-5 border border-maya-border mb-6">
        <h2 className="text-lg font-bold text-maya-gold mb-3">Calculadora Maya</h2>

        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-start mb-4">
          <input
            type="number"
            value={numA}
            onChange={e => setNumA(e.target.value)}
            min="0"
            className="bg-maya-deep border border-maya-border rounded-lg px-3 py-2 text-lg text-maya-gold font-bold text-center focus:outline-none focus:border-maya-gold"
          />
          <select
            value={operator}
            onChange={e => setOperator(e.target.value)}
            className="bg-maya-deep border border-maya-border rounded-lg px-3 py-2 text-xl text-maya-gold font-bold text-center focus:outline-none focus:border-maya-gold"
          >
            <option value="+">+</option>
            <option value="-">−</option>
          </select>
          <input
            type="number"
            value={numB}
            onChange={e => setNumB(e.target.value)}
            min="0"
            className="bg-maya-deep border border-maya-border rounded-lg px-3 py-2 text-lg text-maya-gold font-bold text-center focus:outline-none focus:border-maya-gold"
          />
          <div className="text-xl text-maya-gold font-bold py-2">=</div>
          <div className="bg-maya-deep border border-maya-gold rounded-lg px-3 py-2 text-lg text-maya-gold font-bold text-center">
            {calcResult.toLocaleString()}
          </div>
        </div>

        {/* Visual calculation with dot-bar numerals */}
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-start">
          {/* Number A */}
          <div className="flex flex-col-reverse items-center gap-1">
            {padded(digitsA).slice().reverse().map((d, i) => (
              <div key={i} className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={d} />
              </div>
            ))}
            <div className="text-xs text-maya-muted mt-1">{a.toLocaleString()}</div>
          </div>

          {/* Operator */}
          <div className="flex items-center justify-center pt-4">
            <span className="text-2xl text-maya-gold font-bold">{operator === '+' ? '+' : '−'}</span>
          </div>

          {/* Number B */}
          <div className="flex flex-col-reverse items-center gap-1">
            {padded(digitsB).slice().reverse().map((d, i) => (
              <div key={i} className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={d} />
              </div>
            ))}
            <div className="text-xs text-maya-muted mt-1">{b.toLocaleString()}</div>
          </div>

          {/* Equals */}
          <div className="flex items-center justify-center pt-4">
            <span className="text-2xl text-maya-gold font-bold">=</span>
          </div>

          {/* Result */}
          <div className="flex flex-col-reverse items-center gap-1">
            {padded(digitsResult).slice().reverse().map((d, i) => (
              <div key={i} className="w-12 h-12 bg-maya-gold/20 border border-maya-gold rounded flex items-center justify-center">
                <DotBarNumeral value={d} />
              </div>
            ))}
            <div className="text-xs text-maya-gold font-bold mt-1">{calcResult.toLocaleString()}</div>
          </div>
        </div>

        {mode !== 'explorador' && (
          <div className="text-xs text-maya-muted mt-4 bg-maya-deep rounded-lg p-3">
            <span className="text-maya-gold">Sistema vigesimal:</span> Cada posición vale 20 veces más que la anterior. Cuando un dígito supera 19, se &quot;acarrea&quot; 1 a la posición superior (como pasar de 9 a 10 en decimal, pero aquí de 19 a 1.0 en vigesimal).
          </div>
        )}
      </div>

      {/* Section C: Reference Grid */}
      <div className="bg-maya-surface rounded-xl p-5 border border-maya-border">
        <h2 className="text-lg font-bold text-maya-gold mb-3">Numerales Mayas (0-19)</h2>
        <p className="text-xs text-maya-muted mb-4">
          ● = 1 &nbsp;&nbsp; ▬ = 5 &nbsp;&nbsp;
          {mode !== 'explorador' && (
            <span>El cero maya (concha) fue inventado siglos antes que en Europa y Asia</span>
          )}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {dict.numerals.map(n => (
            <div key={n.value} className="bg-maya-deep rounded-lg p-2 text-center border border-maya-border">
              <div className="w-full flex justify-center py-1 bg-white rounded mb-1">
                <DotBarNumeral value={n.value} />
              </div>
              <div className="text-sm font-bold text-maya-gold">{n.value}</div>
              <div className="text-[9px] text-maya-muted truncate">{n.maya}</div>
            </div>
          ))}
        </div>

        {mode === 'investigador' && (
          <div className="text-xs text-maya-muted mt-4 bg-maya-deep rounded-lg p-3">
            Los mayas usaban un sistema posicional vigesimal (base 20) con un verdadero concepto de cero.
            Para el calendario, la tercera posición (Tun) solo llega a 17 (18×20=360 ≈ 1 año solar).
            En matemáticas puras, todas las posiciones van de 0 a 19.
          </div>
        )}
      </div>
    </div>
  )
}
