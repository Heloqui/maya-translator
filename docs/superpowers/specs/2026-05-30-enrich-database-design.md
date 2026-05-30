# Enriquecer la Base de Datos del Maya Translator

**Fecha:** 2026-05-30
**Objetivo:** Agregar profundidad académica (estudiantes + investigadores) a una app que ya tiene el core interactivo/turístico cubierto.
**Enfoque:** Capas incrementales — datos y features avanzan juntos, cada capa es deployable.

---

## Estado Actual

- **Silabario:** 5 vocales + 19 grupos consonánticos (~98 sílabas), 26 logogramas, signos calendáricos
- **Diccionario:** 99 entradas en 8 categorías (títulos, verbos, sustantivos, colores, direcciones, numerales, muerte, guerra)
- **Imágenes:** 614 glifos Tokovinine + 862 codepoints Thompson como fallback
- **Páginas:** Dashboard, Silabario, Diccionario, Transliterador, Calendario, Matemáticas, Escritor de Nombres
- **Tech:** Next.js 15, Tailwind, datos estáticos JSON, PWA, bilingüe ES/EN

---

## Capa 1: Datos

### 1.1 Diccionario expandido (99 → ~300 entradas)

**Campos nuevos por entrada:**

```json
{
  "maya": "ajaw",
  "spanish": "señor, gobernante",
  "english": "lord, ruler",
  "confidence": "confirmed",
  "thompson": ["T533"],
  "etymology": "Del proto-ch'olano *ajaw",
  "cognates": { "tzotzil": "ajvalil", "kiche": "ajaw" },
  "usage_examples": ["K'inich Janaab Pakal, K'uhul B'aakal Ajaw"],
  "inscriptions": ["palenque-sarcophagus"],
  "category": "titles",
  "subcategory": "royalty",
  "frequency": "very_high"
}
```

**Categorías nuevas a agregar:** parentesco, arquitectura, flora/fauna, astronomía, rituales, topónimos, gentilicios.

**Campos nuevos opcionales** (no todas las entradas los tendrán):
- `thompson`: array de códigos Thompson asociados
- `etymology`: origen de la palabra
- `cognates`: cognados en lenguas mayas modernas (tzotzil, k'iche', yucateco, etc.)
- `usage_examples`: ejemplos reales de uso en textos
- `inscriptions`: IDs de inscripciones donde aparece (ref cruzada)
- `subcategory`: subcategoría dentro de la categoría
- `frequency`: very_high / high / medium / low / rare

**Criterio de rigor:** Solo entradas verificables con fuentes publicadas (Kettunen & Helmke, Stuart, Houston, Montgomery). Cada entrada mantiene el campo `confidence`.

**Fuentes principales:**
- Kettunen & Helmke (2020). Introduction to Maya Hieroglyphs
- Montgomery, J. (2002). Dictionary of Maya Hieroglyphs
- Stuart, D. Various publications, University of Texas
- Boot, E. (2009). The Updated Preliminary Classic Maya-English, English-Classic Maya Vocabulary

### 1.2 Inscripciones (~20 monumentos icónicos)

**Archivo nuevo:** `data/inscriptions.json`

```json
{
  "id": "palenque-sarcophagus",
  "name": { "es": "Lápida del Sarcófago de Pakal", "en": "Pakal's Sarcophagus Lid" },
  "site": "palenque",
  "date_long_count": "9.12.11.5.18",
  "date_gregorian": "683 d.C.",
  "type": "funerary",
  "blocks": [
    {
      "position": "A1",
      "glyphs": ["T533", "T740"],
      "transliteration": "K'UHUL-AJAW",
      "transcription": "k'uhul ajaw",
      "translation": { "es": "señor sagrado", "en": "holy lord" },
      "notes": "Título real estándar"
    }
  ],
  "description": { "es": "...", "en": "..." },
  "historical_context": { "es": "...", "en": "..." },
  "source": "Schele & Freidel, 1990",
  "image_credit": "Drawing by Linda Schele, FAMSI"
}
```

**Tipos de inscripción:** funerary, dynastic, warfare, dedication, astronomical, ritual.

**Monumentos prioritarios (~20):**
1. Lápida del Sarcófago de Pakal (Palenque)
2. Tablero de la Cruz (Palenque)
3. Tablero de la Cruz Foliada (Palenque)
4. Dintel 24, 25, 26 de Yaxchilán
5. Estela A de Copán
6. Estela C de Quiriguá
7. Altar Q de Copán
8. Estela 31 de Tikal
9. Panel de los 96 Glifos (Palenque)
10. Escalinata Jeroglífica de Copán
11. Estela 11 de Yaxchilán
12. Marcador del Juego de Pelota de Copán
13. Tablero del Palacio (Palenque)
14. Vaso de los 7 Dioses (K2796)
15. Estela 1 de La Mojarra (epi-olmeca, contexto)
16. Dintel 8 de Yaxchilán
17. Panel 3 de Cancuén
18. Estela 3 de Piedras Negras
19. Plato de los Remeros (K1609)
20. Mural de San Bartolo (preclásico)

### 1.3 Sitios Arqueológicos (~20 sitios)

**Archivo nuevo:** `data/sites.json`

```json
{
  "id": "palenque",
  "name": { "es": "Palenque", "en": "Palenque" },
  "ancient_name": "Lakamha'",
  "meaning": { "es": "Lugar de Grandes Aguas", "en": "Place of Great Waters" },
  "coordinates": { "lat": 17.4838, "lng": -92.0461 },
  "region": "usumacinta",
  "country": "MX",
  "period": { "from": "226", "to": "799", "peak": "615-683" },
  "dynasty": "B'aakal",
  "notable_rulers": ["K'inich Janaab Pakal", "K'inich Kan B'alam II"],
  "inscriptions": ["palenque-sarcophagus", "palenque-tablet-cross"],
  "description": { "es": "...", "en": "..." },
  "sources": ["Martin & Grube, 2000"]
}
```

**Regiones:** peten, usumacinta, motagua, puuc, rio_bec, chenes, northern_lowlands, southern_highlands.

**Sitios prioritarios (~20):**
1. Palenque (Lakamha') — MX
2. Tikal (Mutal) — GT
3. Copán — HN
4. Yaxchilán — MX
5. Calakmul (Kaan) — MX
6. Quiriguá — GT
7. Piedras Negras — GT
8. Bonampak — MX
9. Toniná — MX
10. Dos Pilas — GT
11. Naranjo (Sa'al) — GT
12. Caracol — BZ
13. Uxmal — MX
14. Chichén Itzá — MX
15. Cancuén — GT
16. El Mirador — GT
17. San Bartolo — GT
18. Cobá — MX
19. Ceibal (Seibal) — GT
20. La Corona — GT

---

## Capa 2: Features / Páginas Nuevas

### 2.1 Página de Inscripciones (`/inscriptions`)

- **Lista:** Todos los monumentos con filtros por sitio, periodo y tipo
- **Vista detallada:** Lectura bloque por bloque
  - Muestra glifo (imagen Thompson)
  - Transliteración → transcripción → traducción
  - Click en glifo → navega al diccionario/silabario
- **Dos modos de vista:**
  - Simple: solo traducción completa
  - Expandida: aparato epigráfico completo (transliteración, notas, fuentes)
- **Bilingüe:** Todas las traducciones y descripciones en ES/EN

### 2.2 Mapa de Sitios (`/sites`)

- **Librería:** Leaflet (open source, sin API key) con tiles OpenStreetMap
- **Visualización:** Mapa centrado en el área Maya con los ~20 sitios como markers
- **Interacción:** Click en sitio → card con:
  - Nombre moderno + nombre antiguo + significado
  - Periodo de ocupación y apogeo
  - Dinastía y gobernantes notables
  - Lista de inscripciones disponibles (clickeables)
- **Filtros:** Por región y por periodo
- **Dependencia nueva:** `leaflet` + `react-leaflet` (NPM)

### 2.3 Quizzes (`/quiz`)

- **3 modos de quiz:**
  - **Lectura de glifos:** Muestra imagen → 4 opciones de valor silábico
  - **Vocabulario:** Palabra en maya → ¿qué significa?
  - **Inscripciones:** Muestra un bloque → ¿qué dice?
- **Dificultad progresiva:**
  - Nivel 1: Sílabas confirmadas (vocales + consonantes comunes)
  - Nivel 2: Logogramas
  - Nivel 3: Bloques completos de inscripciones
- **Datos generados automáticamente** desde los JSON existentes
- **Persistencia:** Score y progreso en localStorage (sin backend)
- **Tono:** Académico pero accesible, sin gamificación excesiva

---

## Capa 3: Cross-linking

No es una página nueva sino conexiones entre todo lo que existe:

- **Diccionario:** Cada palabra muestra en qué inscripciones aparece
- **Silabario:** Cada glifo muestra inscripciones donde se usa
- **Inscripciones:** Cada bloque linkea a glifos en el silabario y palabras en el diccionario
- **Sitios:** Lista de inscripciones del sitio con links directos
- **Dashboard:** Stats actualizadas (total inscripciones, sitios, etc.)

---

## Archivos Afectados

### Archivos nuevos:
- `data/inscriptions.json` — corpus de inscripciones
- `data/sites.json` — sitios arqueológicos
- `src/app/inscriptions/page.js` — lista de inscripciones
- `src/app/inscriptions/[id]/page.js` — detalle de inscripción
- `src/app/sites/page.js` — mapa de sitios
- `src/app/quiz/page.js` — quizzes
- `src/components/InscriptionReader.jsx` — lector bloque a bloque
- `src/components/SiteMap.jsx` — mapa Leaflet
- `src/components/QuizEngine.jsx` — motor de quizzes
- `src/components/SiteCard.jsx` — card de sitio

### Archivos modificados:
- `data/dictionary.json` — campos nuevos + categorías nuevas
- `src/lib/data.js` — funciones para leer inscriptions.json y sites.json
- `src/components/Sidebar.jsx` — 3 links nuevos (Inscripciones, Sitios, Quiz)
- `src/components/DictionaryEntry.jsx` — mostrar campos nuevos + links a inscripciones
- `src/components/GlyphDetail.jsx` — links a inscripciones donde aparece
- `src/app/page.js` — stats actualizadas en el dashboard

### Dependencias nuevas:
- `leaflet` — mapas
- `react-leaflet` — wrapper React para Leaflet

---

## Fuera de Alcance

- Backend / base de datos (todo sigue siendo JSON estático)
- Cuentas de usuario / login
- Imágenes propias de monumentos (usamos descripciones + créditos a fuentes)
- Generación de datos con IA (todo manual/curado)
- Deploy a Vercel (será siguiente fase)

---

## Orden de Implementación

1. **Capa 1a:** Expandir `dictionary.json` con campos nuevos en entradas existentes + agregar categorías nuevas (~200 entradas nuevas)
2. **Capa 1b:** Crear `inscriptions.json` con 20 monumentos
3. **Capa 1c:** Crear `sites.json` con 20 sitios
4. **Capa 2a:** Página de Inscripciones + InscriptionReader
5. **Capa 2b:** Mapa de Sitios con Leaflet
6. **Capa 2c:** Sistema de Quizzes
7. **Capa 3:** Cross-linking entre todas las secciones
