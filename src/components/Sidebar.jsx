'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/lang'
import LangToggle from './LangToggle'

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = useLang()

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

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-14 bg-maya-darker flex-col items-center py-3 gap-2 border-r border-maya-surface z-50">
        {navItems.map(({ href, icon, label }) => {
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
        <LangToggle />
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-maya-darker flex items-center justify-around border-t border-maya-surface z-50">
        {navItems.map(({ href, icon, label }) => {
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
