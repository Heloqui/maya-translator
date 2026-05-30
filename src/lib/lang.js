'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const LangContext = createContext()

const STRINGS = {
  es: {
    // Dashboard
    siteTitle: 'MAYA GLYPHS',
    siteSubtitle: 'Traductor de Jeroglíficos Mayas — Datos verificados, sin alucinaciones',
    syllabary: 'Silabario',
    syllabaryDesc: '100 signos silábicos',
    dictionary: 'Diccionario',
    dictionaryDesc: "120+ palabras en Ch'olan",
    transliterator: 'Transliterador',
    transliteratorDesc: 'Escribe en maya clásico',
    calendar: 'Calendario',
    calendarDesc: "Cuenta Larga · Tzolk'in · Haab'",
    math: 'Matemáticas',
    mathDesc: 'Sistema vigesimal (base 20)',
    confirmedReadings: 'lecturas confirmadas',
    logograms: 'logogramas',
    daySigns: 'signos de día',
    // Syllabary
    syllabaryTitle: 'Silabario Maya',
    selectGlyph: 'Click en un glifo para ver detalles',
    glyphDetail: 'Detalle del glifo',
    selectToView: 'Selecciona un glifo para ver detalles',
    value: 'Valor',
    confidence: 'Confianza',
    frequency: 'Frecuencia',
    variants: 'Variantes',
    notes: 'Notas',
    sources: 'Fuentes',
    alsoLogogram: 'También logograma',
    confirmed: 'confirmado',
    probable: 'probable',
    tentative: 'tentativo',
    unknown: 'desconocido',
    veryHigh: 'muy alta',
    high: 'alta',
    medium: 'media',
    low: 'baja',
    mode: 'Modo',
    // Dictionary
    dictionaryTitle: 'Diccionario Maya',
    dictionarySubtitle: "Vocabulario del maya clásico (Ch'olti'an)",
    searchPlaceholder: 'Buscar por maya, español o inglés...',
    noResults: 'Sin resultados',
    titles: 'Títulos',
    verbs: 'Verbos',
    nouns: 'Sustantivos',
    colors: 'Colores',
    directions: 'Direcciones',
    numerals: 'Numerales',
    death: 'Muerte',
    war: 'Guerra',
    // Transliterator
    transliteratorTitle: 'Transliterador',
    transliteratorSubtitle: 'Convierte secuencias de glifos a fonética maya clásica',
    glyphsToMaya: 'Glifos → Maya',
    spanishToMaya: 'Español → Maya',
    inputPlaceholder: 'Escribe sílabas separadas por guión: ba-la-ma',
    clear: 'Limpiar',
    phoneticReading: 'Lectura fonética',
    syllables: 'Sílabas',
    cvcRule: 'Regla CVC:',
    cvcExplain: 'La vocal final se descarta (sinharmonía vocálica)',
    dictMatch: 'Coincidencia en diccionario',
    overallConfidence: 'Confianza general',
    searchSpanish: 'Buscar palabra en español o inglés...',
    // Calendar
    calendarTitle: 'Calendario Maya',
    calendarSubtitle: 'Convierte fechas entre el calendario gregoriano y los calendarios mayas',
    gregorianToMaya: 'Gregoriano → Maya',
    longCountToGregorian: 'Cuenta Larga → Gregoriano',
    today: 'Hoy',
    longCount: 'Cuenta Larga',
    calendarRound: 'Rueda Calendárica',
    directionAndColor: 'Dirección y color',
    direction: 'Dirección',
    color: 'Color',
    gregorianDate: 'Fecha gregoriana',
    // Math
    mathTitle: 'Matemáticas Mayas',
    mathSubtitle: 'Sistema vigesimal (base 20) con el cero',
    howToRead: 'Cómo leer los números mayas',
    hideGuide: 'Ocultar guía',
    converter: 'Conversor Decimal → Maya',
    calculator: 'Calculadora Maya',
    numeralReference: 'Numerales Mayas (0-19)',
    // Sidebar
    home: 'Inicio',
    // Modes
    explorador: 'Explorador',
    estudiante: 'Estudiante',
    investigador: 'Investigador',
    // Stats
    fullVigesimal: 'Sistema vigesimal completo',
    yourName: 'Tu Nombre',
  },
  en: {
    siteTitle: 'MAYA GLYPHS',
    siteSubtitle: 'Maya Hieroglyphic Translator — Verified data, no hallucinations',
    syllabary: 'Syllabary',
    syllabaryDesc: '100 syllabic signs',
    dictionary: 'Dictionary',
    dictionaryDesc: "120+ words in Ch'olan",
    transliterator: 'Transliterator',
    transliteratorDesc: 'Write in Classic Maya',
    calendar: 'Calendar',
    calendarDesc: "Long Count · Tzolk'in · Haab'",
    math: 'Mathematics',
    mathDesc: 'Vigesimal system (base 20)',
    confirmedReadings: 'confirmed readings',
    logograms: 'logograms',
    daySigns: 'day signs',
    syllabaryTitle: 'Maya Syllabary',
    selectGlyph: 'Click a glyph to see details',
    glyphDetail: 'Glyph Detail',
    selectToView: 'Select a glyph to view details',
    value: 'Value',
    confidence: 'Confidence',
    frequency: 'Frequency',
    variants: 'Variants',
    notes: 'Notes',
    sources: 'Sources',
    alsoLogogram: 'Also logogram',
    confirmed: 'confirmed',
    probable: 'probable',
    tentative: 'tentative',
    unknown: 'unknown',
    veryHigh: 'very high',
    high: 'high',
    medium: 'medium',
    low: 'low',
    mode: 'Mode',
    dictionaryTitle: 'Maya Dictionary',
    dictionarySubtitle: "Classic Maya vocabulary (Ch'olti'an)",
    searchPlaceholder: 'Search by Maya, Spanish or English...',
    noResults: 'No results',
    titles: 'Titles',
    verbs: 'Verbs',
    nouns: 'Nouns',
    colors: 'Colors',
    directions: 'Directions',
    numerals: 'Numerals',
    death: 'Death',
    war: 'War',
    transliteratorTitle: 'Transliterator',
    transliteratorSubtitle: 'Convert glyph sequences to Classic Maya phonetics',
    glyphsToMaya: 'Glyphs → Maya',
    spanishToMaya: 'English → Maya',
    inputPlaceholder: 'Type syllables separated by hyphen: ba-la-ma',
    clear: 'Clear',
    phoneticReading: 'Phonetic reading',
    syllables: 'Syllables',
    cvcRule: 'CVC Rule:',
    cvcExplain: 'Final vowel is dropped (vowel synharmony)',
    dictMatch: 'Dictionary match',
    overallConfidence: 'Overall confidence',
    searchSpanish: 'Search word in Spanish or English...',
    calendarTitle: 'Maya Calendar',
    calendarSubtitle: 'Convert dates between Gregorian and Maya calendars',
    gregorianToMaya: 'Gregorian → Maya',
    longCountToGregorian: 'Long Count → Gregorian',
    today: 'Today',
    longCount: 'Long Count',
    calendarRound: 'Calendar Round',
    directionAndColor: 'Direction and color',
    direction: 'Direction',
    color: 'Color',
    gregorianDate: 'Gregorian date',
    mathTitle: 'Maya Mathematics',
    mathSubtitle: 'Vigesimal system (base 20) with zero',
    howToRead: 'How to read Maya numbers',
    hideGuide: 'Hide guide',
    converter: 'Decimal → Maya Converter',
    calculator: 'Maya Calculator',
    numeralReference: 'Maya Numerals (0-19)',
    home: 'Home',
    explorador: 'Explorer',
    estudiante: 'Student',
    investigador: 'Researcher',
    fullVigesimal: 'Full vigesimal system',
    yourName: 'Your Name',
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState('es')

  useEffect(() => {
    const saved = localStorage.getItem('maya-lang')
    if (saved === 'en' || saved === 'es') setLang(saved)
  }, [])

  function changeLang(newLang) {
    setLang(newLang)
    localStorage.setItem('maya-lang', newLang)
  }

  const t = STRINGS[lang]

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
