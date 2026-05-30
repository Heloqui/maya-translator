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
      {Array.from({ length: dots }).map((_, i) => {
        const cx = (width / 2) - ((dots - 1) * dotGap / 2) + i * dotGap
        return <circle key={`d${i}`} cx={cx} cy={dotRadius + 2} r={dotRadius} fill="#c9a84c" />
      })}
      {Array.from({ length: bars }).map((_, i) => {
        const y = totalDotH + gap + i * (barHeight + barGap)
        return <rect key={`b${i}`} x={4} y={y} width={width - 8} height={barHeight} rx={2} fill="#c9a84c" />
      })}
    </svg>
  )
}
