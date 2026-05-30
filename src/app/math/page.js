'use client'
import { useState, useMemo } from 'react'
import { useLang } from '@/lib/lang'
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

function GuideSection() {
  const { lang, t } = useLang()
  return (
    <div className="bg-maya-surface rounded-xl p-5 border border-maya-border mb-6">
      <h2 className="text-lg font-bold text-maya-gold mb-4">{t.howToRead}</h2>

      {/* Step 1: The three symbols */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-maya-text mb-3">{lang === 'es' ? '1. Solo tres símbolos' : '1. Only three symbols'}</h3>
        <p className="text-sm text-maya-muted mb-3">
          {lang === 'es'
            ? 'A diferencia de nuestro sistema que usa 10 dígitos (0-9), los mayas solo necesitaban tres símbolos para representar cualquier número:'
            : 'Unlike our system that uses 10 digits (0-9), the Maya only needed three symbols to represent any number:'}
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-maya-deep rounded-lg p-3 text-center border border-maya-border">
            <div className="bg-white rounded-lg p-3 mb-2 flex justify-center">
              <DotBarNumeral value={0} />
            </div>
            <div className="text-maya-gold font-bold">{lang === 'es' ? 'Concha' : 'Shell'}</div>
            <div className="text-xs text-maya-muted">{lang === 'es' ? '= 0 (cero)' : '= 0 (zero)'}</div>
          </div>
          <div className="bg-maya-deep rounded-lg p-3 text-center border border-maya-border">
            <div className="bg-white rounded-lg p-3 mb-2 flex justify-center">
              <DotBarNumeral value={1} />
            </div>
            <div className="text-maya-gold font-bold">{lang === 'es' ? 'Punto' : 'Dot'}</div>
            <div className="text-xs text-maya-muted">{lang === 'es' ? '= 1 (uno)' : '= 1 (one)'}</div>
          </div>
          <div className="bg-maya-deep rounded-lg p-3 text-center border border-maya-border">
            <div className="bg-white rounded-lg p-3 mb-2 flex justify-center">
              <DotBarNumeral value={5} />
            </div>
            <div className="text-maya-gold font-bold">{lang === 'es' ? 'Barra' : 'Bar'}</div>
            <div className="text-xs text-maya-muted">{lang === 'es' ? '= 5 (cinco)' : '= 5 (five)'}</div>
          </div>
        </div>
      </div>

      {/* Step 2: Combining 0-19 */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-maya-text mb-3">{lang === 'es' ? '2. Combinando puntos y barras (0 a 19)' : '2. Combining dots and bars (0 to 19)'}</h3>
        <p className="text-sm text-maya-muted mb-3">
          {lang === 'es'
            ? 'Combinando puntos (encima) y barras (debajo) se forman los números del 0 al 19. Los puntos van arriba, las barras abajo. Máximo 4 puntos y 3 barras.'
            : 'By combining dots (on top) and bars (below), you form numbers from 0 to 19. Dots go on top, bars on the bottom. Maximum 4 dots and 3 bars.'}
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-2xl mx-auto">
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(n => (
            <div key={n} className="bg-maya-deep rounded p-1.5 text-center">
              <div className="bg-white rounded p-1 mb-1 flex justify-center min-h-[32px] items-center">
                <DotBarNumeral value={n} />
              </div>
              <div className="text-xs text-maya-gold font-bold">{n}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-maya-muted mt-3 bg-maya-deep rounded-lg p-3">
          <span className="text-maya-gold">{lang === 'es' ? 'Ejemplo:' : 'Example:'}</span> {lang === 'es' ? 'El número 13 = 2 barras (5+5=10) + 3 puntos (1+1+1=3) = 13' : 'The number 13 = 2 bars (5+5=10) + 3 dots (1+1+1=3) = 13'}
        </div>
      </div>

      {/* Step 3: Vertical positions */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-maya-text mb-3">{lang === 'es' ? '3. Se leen de abajo hacia arriba' : '3. Read from bottom to top'}</h3>
        <p className="text-sm text-maya-muted mb-3">
          {lang === 'es'
            ? 'Para números mayores a 19, los mayas apilaban los símbolos en columnas verticales. Cada nivel vale 20 veces más que el anterior (como nosotros multiplicamos por 10 en cada posición decimal).'
            : 'For numbers greater than 19, the Maya stacked symbols in vertical columns. Each level is worth 20 times more than the one below (just as we multiply by 10 in each decimal position).'}
        </p>
        <div className="flex justify-center">
          <div className="bg-maya-deep rounded-xl p-4 border border-maya-border">
            <div className="flex items-start gap-6">
              {/* Our system */}
              <div className="text-center">
                <div className="text-xs text-maya-muted mb-2">{lang === 'es' ? 'Nuestro sistema (base 10)' : 'Our system (base 10)'}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-maya-muted w-16 text-right">{lang === 'es' ? 'centenas' : 'hundreds'}</span>
                    <span className="w-10 h-10 bg-maya-surface rounded flex items-center justify-center text-lg font-bold text-maya-text">3</span>
                    <span className="text-xs text-maya-muted">×100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-maya-muted w-16 text-right">{lang === 'es' ? 'decenas' : 'tens'}</span>
                    <span className="w-10 h-10 bg-maya-surface rounded flex items-center justify-center text-lg font-bold text-maya-text">6</span>
                    <span className="text-xs text-maya-muted">×10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-maya-muted w-16 text-right">{lang === 'es' ? 'unidades' : 'ones'}</span>
                    <span className="w-10 h-10 bg-maya-surface rounded flex items-center justify-center text-lg font-bold text-maya-text">5</span>
                    <span className="text-xs text-maya-muted">×1</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-maya-text mt-2">= 365</div>
              </div>

              <div className="flex items-center pt-8">
                <span className="text-2xl text-maya-gold">→</span>
              </div>

              {/* Maya system */}
              <div className="text-center">
                <div className="text-xs text-maya-muted mb-2">{lang === 'es' ? 'Sistema maya (base 20)' : 'Maya system (base 20)'}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-maya-muted w-16 text-right">×400</span>
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                      <DotBarNumeral value={0} />
                    </div>
                    <span className="text-xs text-maya-muted">= 0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-maya-muted w-16 text-right">×20</span>
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                      <DotBarNumeral value={18} />
                    </div>
                    <span className="text-xs text-maya-muted">= 360</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-maya-muted w-16 text-right">×1</span>
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                      <DotBarNumeral value={5} />
                    </div>
                    <span className="text-xs text-maya-muted">= 5</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-maya-gold mt-2">= 365</div>
              </div>
            </div>
            <div className="text-xs text-maya-muted mt-3 text-center">
              365 = (0 × 400) + (18 × 20) + (5 × 1)
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: The zero */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-maya-text mb-3">{lang === 'es' ? '4. El cero maya: un invento revolucionario' : '4. Maya zero: a revolutionary invention'}</h3>
        <p className="text-sm text-maya-muted mb-3">
          {lang === 'es'
            ? 'Los mayas inventaron el concepto del cero de forma independiente, siglos antes de que llegara a Europa desde la India. Lo representaban como una concha (o flor). Sin el cero, no podrían distinguir entre 1 (un punto), 20 (un punto con concha debajo) y 400 (un punto con dos conchas debajo).'
            : 'The Maya independently invented the concept of zero, centuries before it reached Europe from India. They represented it as a shell (or flower). Without zero, they could not distinguish between 1 (a dot), 20 (a dot with a shell below) and 400 (a dot with two shells below).'}
        </p>
        <div className="flex justify-center gap-6">
          <div className="bg-maya-deep rounded-lg p-3 text-center border border-maya-border">
            <div className="space-y-1 flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={1} />
              </div>
            </div>
            <div className="text-maya-gold font-bold mt-2">1</div>
            <div className="text-[10px] text-maya-muted">jun</div>
          </div>
          <div className="bg-maya-deep rounded-lg p-3 text-center border border-maya-border">
            <div className="space-y-1 flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={1} />
              </div>
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={0} />
              </div>
            </div>
            <div className="text-maya-gold font-bold mt-2">20</div>
            <div className="text-[10px] text-maya-muted">jun k&apos;al</div>
          </div>
          <div className="bg-maya-deep rounded-lg p-3 text-center border border-maya-border">
            <div className="space-y-1 flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={1} />
              </div>
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={0} />
              </div>
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={0} />
              </div>
            </div>
            <div className="text-maya-gold font-bold mt-2">400</div>
            <div className="text-[10px] text-maya-muted">jun b&apos;ak&apos;</div>
          </div>
        </div>
      </div>

      {/* Step 5: How to add */}
      <div>
        <h3 className="text-sm font-bold text-maya-text mb-3">{lang === 'es' ? '5. Cómo sumar en maya' : '5. How to add in Maya'}</h3>
        <p className="text-sm text-maya-muted mb-3">
          {lang === 'es'
            ? 'Se suma posición por posición, de abajo hacia arriba. Si el resultado en una posición supera 19, se resta 20 y se "acarrea" 1 a la posición de arriba (igual que al sumar 7+5=12 en decimal: escribes 2 y llevas 1).'
            : 'You add position by position, from bottom to top. If the result in a position exceeds 19, subtract 20 and carry 1 to the position above (just like adding 7+5=12 in decimal: you write 2 and carry 1).'}
        </p>
        <div className="bg-maya-deep rounded-lg p-4 border border-maya-border">
          <div className="flex items-center justify-center gap-4">
            {/* 7 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={7} />
              </div>
              <div className="text-xs text-maya-muted mt-1">7</div>
            </div>
            <span className="text-xl text-maya-gold font-bold">+</span>
            {/* 15 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <DotBarNumeral value={15} />
              </div>
              <div className="text-xs text-maya-muted mt-1">15</div>
            </div>
            <span className="text-xl text-maya-gold font-bold">=</span>
            {/* Result: 22 = 1.2 in vigesimal */}
            <div className="text-center">
              <div className="space-y-1 flex flex-col items-center">
                <div className="w-12 h-12 bg-maya-gold/20 border border-maya-gold rounded flex items-center justify-center">
                  <DotBarNumeral value={1} />
                </div>
                <div className="w-12 h-12 bg-maya-gold/20 border border-maya-gold rounded flex items-center justify-center">
                  <DotBarNumeral value={2} />
                </div>
              </div>
              <div className="text-xs text-maya-gold font-bold mt-1">22</div>
            </div>
          </div>
          <div className="text-xs text-maya-muted mt-3 text-center">
            {lang === 'es'
              ? '7 + 15 = 22 → en vigesimal: 1 veintena + 2 unidades → se escribe con un punto arriba (×20) y dos puntos abajo (×1)'
              : '7 + 15 = 22 → in vigesimal: 1 twenty + 2 ones → written with a dot on top (×20) and two dots below (×1)'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MathPage() {
  const [decimal, setDecimal] = useState('365')
  const [numA, setNumA] = useState('400')
  const [numB, setNumB] = useState('125')
  const [operator, setOperator] = useState('+')
  const [showGuide, setShowGuide] = useState(false)
  const { lang, t } = useLang()

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
      <h1 className="text-xl font-bold text-maya-gold mb-1">{t.mathTitle}</h1>
      <p className="text-xs text-maya-muted mb-4">{t.mathSubtitle}</p>

      {/* Guide toggle */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="mb-6 px-4 py-2 bg-maya-gold text-maya-bg rounded-lg text-sm font-bold hover:bg-maya-gold-dim transition-colors"
      >
        {showGuide ? t.hideGuide : `📖 ${t.howToRead}`}
      </button>

      {showGuide && <GuideSection />}

      {/* Section A: Converter */}
      <div className="bg-maya-surface rounded-xl p-5 border border-maya-border mb-6">
        <h2 className="text-lg font-bold text-maya-gold mb-3">{t.converter}</h2>
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
            <div className="text-xs text-maya-muted mt-1">
              Vigesimal: <span className="text-maya-gold font-mono">{vigesimalStr}</span>
            </div>
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

        <div className="text-xs text-maya-muted mt-4 bg-maya-deep rounded-lg p-3 text-center">
          {vigesimalDigits && vigesimalDigits.map((d, i) => {
            const power = vigesimalDigits.length - 1 - i
            const multiplier = Math.pow(20, power)
            return `${d}×${multiplier.toLocaleString()}`
          }).join(' + ')} = {decNum.toLocaleString()}
        </div>
      </div>

      {/* Section B: Calculator */}
      <div className="bg-maya-surface rounded-xl p-5 border border-maya-border mb-6">
        <h2 className="text-lg font-bold text-maya-gold mb-3">{t.calculator}</h2>

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

        <div className="text-xs text-maya-muted mt-4 bg-maya-deep rounded-lg p-3">
          <span className="text-maya-gold">{lang === 'es' ? 'Sistema vigesimal:' : 'Vigesimal system:'}</span> {lang === 'es' ? 'Cada posición vale 20 veces más que la anterior. Cuando un dígito supera 19, se "acarrea" 1 a la posición superior (como pasar de 9 a 10 en decimal, pero aquí de 19 a 1.0 en vigesimal).' : 'Each position is worth 20 times more than the previous one. When a digit exceeds 19, carry 1 to the upper position (like going from 9 to 10 in decimal, but here from 19 to 1.0 in vigesimal).'}
        </div>
      </div>

      {/* Section C: Reference Grid */}
      <div className="bg-maya-surface rounded-xl p-5 border border-maya-border">
        <h2 className="text-lg font-bold text-maya-gold mb-3">{t.numeralReference}</h2>
        <p className="text-xs text-maya-muted mb-4">
          ● = 1 &nbsp;&nbsp; ▬ = 5 &nbsp;&nbsp;
          <span>{lang === 'es' ? 'El cero maya (concha) fue inventado siglos antes que en Europa y Asia' : 'Maya zero (shell) was invented centuries before Europe and Asia'}</span>
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

        <div className="text-xs text-maya-muted mt-4 bg-maya-deep rounded-lg p-3">
          {lang === 'es'
            ? 'Los mayas usaban un sistema posicional vigesimal (base 20) con un verdadero concepto de cero. Para el calendario, la tercera posición (Tun) solo llega a 17 (18×20=360 ≈ 1 año solar). En matemáticas puras, todas las posiciones van de 0 a 19.'
            : 'The Maya used a positional vigesimal (base 20) system with a true concept of zero. For the calendar, the third position (Tun) only goes up to 17 (18×20=360 ≈ 1 solar year). In pure mathematics, all positions range from 0 to 19.'}
        </div>
      </div>
    </div>
  )
}
