'use client'
import { useLang } from '@/lib/lang'

export default function LangToggle() {
  const { lang, changeLang } = useLang()

  return (
    <button
      onClick={() => changeLang(lang === 'es' ? 'en' : 'es')}
      className="px-2 py-1 rounded text-[10px] font-bold bg-maya-surface text-maya-muted border border-maya-border hover:border-maya-gold transition-colors"
      title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  )
}
