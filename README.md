# Maya Glyphs Translator

Traductor de jeroglíficos mayas basado en datos epigráficos verificados.
No generativo — sin alucinaciones.

## Filosofía

- **Determinístico primero**: Lookup de base de datos, no generación de texto
- **Confianza explícita**: Cada lectura muestra su nivel de certeza
- **Fuentes citadas**: Toda traducción referencia la publicación académica que la respalda
- **Honestidad**: Si no se sabe, se dice "lectura incierta" — nunca se inventa

## Arquitectura

```
[Imagen de inscripción]
       ↓
[1. Vision: Segmentar bloques glíficos] ← CNN / Vision Transformer
       ↓
[2. Clasificar: Identificar cada glifo]  ← Lookup en catálogo (Thompson + Bonn)
       ↓
[3. Transliterar: Glifo → fonética maya]  ← Tabla determinística (syllabary.json)
       ↓
[4. Traducir: Maya clásico → Español/EN]  ← Diccionario + reglas gramaticales
       ↓
[5. Presentar con confianza + fuentes]    ← UI con scores de certeza
```

## Datos

| Archivo | Contenido |
|---------|-----------|
| `data/syllabary.json` | Silabario completo: 19 consonantes × 5 vocales + 5 vocales puras, con Thompson T-numbers |
| `data/dictionary.json` | Diccionario core: títulos, verbos, sustantivos, colores, calendario, numerales |
| `data/logograms.json` | (próximo) Catálogo de logogramas con variantes |
| `data/sites.json` | (próximo) Sitios arqueológicos con glifos emblema |

## Fuentes de datos

- **Thompson Catalog (1962)** — Sistema de numeración base
- **Maya Hieroglyphic Database (MHD)** — CSU Chico, 200K+ bloques glíficos
- **ClassicMayan / TWKM** — U. de Bonn, 1048 signos, 15K+ imágenes, open-access
- **FAMSI** — Guías de estudio y catálogo Thompson digitalizado
- **Corpus of Maya Hieroglyphic Inscriptions** — Harvard Peabody Museum

## Stack (propuesto)

- **Frontend**: Next.js + React (web app)
- **Vision Model**: ONNX runtime (clasificador de glifos, runs client-side)
- **Data**: JSON estático (silabario + diccionario), no requiere servidor DB
- **API (opcional)**: Para procesamiento de imágenes pesado

## Estado

- [x] Silabario digital estructurado (120 combinaciones CV)
- [x] Diccionario core (120+ entradas)
- [x] Calendario maya (20 días, 19 meses, Cuenta Larga)
- [x] Sistema numérico vigesimal (0-19)
- [ ] Logogramas extendidos
- [ ] Sitios + glifos emblema
- [ ] UI del silabario interactivo
- [ ] Prototipo de clasificador visual
- [ ] Motor de transliteración
- [ ] API de traducción

## Licencia

Datos compilados de fuentes académicas públicas. El software será open source.
