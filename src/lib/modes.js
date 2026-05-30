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
