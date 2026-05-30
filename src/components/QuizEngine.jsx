'use client'
import { useState, useCallback } from 'react'
import { useLang } from '@/lib/lang'
import { getQuizQuestions } from '@/lib/data'
import MayaGlyph from './MayaGlyph'
import { getGlyphImage } from '@/lib/glyph-images'

export default function QuizEngine({ mode }) {
  const { t, lang } = useLang()
  const [questions, setQuestions] = useState(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const startQuiz = useCallback(() => {
    setQuestions(getQuizQuestions(mode, 10))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }, [mode])

  if (!questions) {
    return (
      <div className="text-center py-12">
        <p className="text-maya-muted text-sm mb-4">
          {mode === 'syllables' && t.whatGlyphReads}
          {mode === 'vocabulary' && t.whatWordMeans}
          {mode === 'inscriptions' && t.whatBlockSays}
        </p>
        <button
          onClick={startQuiz}
          className="px-6 py-2 bg-maya-gold text-maya-bg rounded-lg font-bold text-sm hover:bg-maya-gold/80 transition-colors"
        >
          {t.startQuiz}
        </button>
      </div>
    )
  }

  if (finished) {
    const key = `maya-quiz-${mode}`
    const prev = parseInt(localStorage.getItem(key) || '0', 10)
    if (score > prev) localStorage.setItem(key, score.toString())

    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-maya-gold mb-2">{t.quizComplete}</h2>
        <p className="text-3xl font-bold mb-4">{score} / {questions.length}</p>
        <button
          onClick={startQuiz}
          className="px-6 py-2 bg-maya-gold text-maya-bg rounded-lg font-bold text-sm hover:bg-maya-gold/80 transition-colors"
        >
          {t.tryAgain}
        </button>
      </div>
    )
  }

  const q = questions[current]
  const isCorrect = selected === q.correct
  const hasAnswered = selected !== null

  function handleSelect(option) {
    if (hasAnswered) return
    setSelected(option)
    if (option === q.correct) setScore(s => s + 1)
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-maya-muted">
          {current + 1} {t.questionOf} {questions.length}
        </span>
        <span className="text-xs text-maya-gold">{t.score}: {score}</span>
      </div>

      <div className="bg-maya-surface rounded-xl p-6 border border-maya-border mb-4 text-center">
        {q.type === 'syllable' && (
          <>
            <p className="text-xs text-maya-muted mb-3">{t.whatGlyphReads}</p>
            {getGlyphImage(q.prompt) ? (
              <div className="w-24 h-24 bg-white rounded-xl mx-auto flex items-center justify-center p-2">
                <img src={getGlyphImage(q.prompt)} alt="?" className="max-w-full max-h-full object-contain" />
              </div>
            ) : q.promptThompson?.length > 0 ? (
              <MayaGlyph thompson={q.promptThompson} size="text-5xl" className="text-maya-gold" />
            ) : (
              <span className="text-4xl font-bold text-maya-gold">?</span>
            )}
          </>
        )}
        {q.type === 'vocabulary' && (
          <>
            <p className="text-xs text-maya-muted mb-3">{t.whatWordMeans}</p>
            <span className="text-2xl font-bold text-maya-gold">{q.prompt}</span>
          </>
        )}
        {q.type === 'inscription' && (
          <>
            <p className="text-xs text-maya-muted mb-3">{t.whatBlockSays}</p>
            <span className="text-lg font-mono text-blue-400">{q.prompt}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {q.options.map((option, i) => {
          let style = 'bg-maya-surface border-maya-border hover:border-maya-gold/50'
          if (hasAnswered) {
            if (option === q.correct) style = 'bg-green-900/30 border-green-500'
            else if (option === selected) style = 'bg-red-900/30 border-red-500'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={hasAnswered}
              className={`p-3 rounded-lg border text-sm text-left transition-colors ${style}`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {hasAnswered && (
        <div className="space-y-3">
          <p className={`text-sm font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? t.correct : t.incorrect}
          </p>
          <p className="text-xs text-maya-muted">
            {q.explanation[lang] || q.explanation.es}
          </p>
          <button
            onClick={handleNext}
            className="w-full py-2 bg-maya-gold text-maya-bg rounded-lg font-bold text-sm hover:bg-maya-gold/80 transition-colors"
          >
            {t.nextQuestion}
          </button>
        </div>
      )}
    </div>
  )
}
