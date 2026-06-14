export const dynamic = 'force-static'

const CONTENT = `# Maya Glyphs

> Maya Glyphs is an interactive Maya hieroglyphic translator and learning tool. It includes a verified syllabary of 100 signs, a dictionary of 300+ Ch'olan words, a transliterator, three calendar systems (Long Count, Tzolk'in, Haab'), base-20 mathematics, 20 real inscriptions with block-by-block readings, and an archaeological site map. All data is epigraphically verified — no AI-generated translations.

## Key features

- **Syllabary**: 100 Maya syllabic signs with verified readings and glyph images
- **Dictionary**: 300+ words in Ch'olan (Classic Maya language) with translations
- **Transliterator**: Convert text to Maya hieroglyphic syllables (phonetic approximation)
- **Name writer**: Write any name in Maya hieroglyphs using phonetic syllables
- **Calendar converter**: Convert any date to Long Count, Tzolk'in (260-day sacred calendar), and Haab' (365-day solar calendar)
- **Maya birthday**: Find your Tzolk'in day sign and its meaning
- **Mathematics**: Base-20 (vigesimal) number system with dot-bar-shell notation
- **Inscriptions**: 20 real monument inscriptions with block-by-block epigraphic readings
- **Archaeological sites**: Interactive map of 20 major Classic Maya cities (Palenque, Tikal, Copan, Calakmul, etc.)
- **Quiz**: Test your knowledge of Maya writing

## What Maya Glyphs is NOT

Maya Glyphs is NOT an AI translation tool. It does not use GPT or any LLM to "translate" text into Maya. The Maya writing system is a logosyllabic script — it cannot translate arbitrary sentences. Maya Glyphs provides:
1. A verified syllabary for phonetic approximation of names and words
2. A curated dictionary of attested Ch'olan vocabulary
3. Real epigraphic readings of actual inscriptions

## Data sources

- Montgomery (2002) Dictionary of Maya Hieroglyphs
- Kettunen & Helmke (2020) Introduction to Maya Hieroglyphs
- FAMSI (Foundation for the Advancement of Mesoamerican Studies)
- Individual site epigraphy reports

## Bilingual

Available in Spanish and English.

## Links

- Homepage: https://mayaglyphs.app
- Syllabary: https://mayaglyphs.app/syllabary
- Dictionary: https://mayaglyphs.app/dictionary
- Name writer: https://mayaglyphs.app/name
- Calendar: https://mayaglyphs.app/calendar
- Birthday: https://mayaglyphs.app/birthday
- Sites map: https://mayaglyphs.app/sites
`

export function GET() {
  return new Response(CONTENT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
