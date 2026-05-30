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
  { href: '/math', icon: '🔢', label: 'Matemáticas' },
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
