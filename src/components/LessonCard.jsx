import { useState } from 'react'
import { Volume2, Mic, MicOff, ChevronRight, ChevronLeft, CheckCircle, Loader2, BookOpen, MessageCircle, Music, Info, SkipForward } from 'lucide-react'
import { generateSpeakingFeedback } from '../utils/groq.js'

const TABS = [
  { id: 'word', label: 'Word', icon: BookOpen },
  { id: 'phrase', label: 'Phrase', icon: MessageCircle },
  { id: 'grammar', label: 'Grammar', icon: ChevronRight },
  { id: 'tone', label: 'Tones', icon: Music },
  { id: 'practice', label: 'Practice', icon: Mic },
]

export default function LessonCard({ lesson, onComplete, onSkip, onPrev, hasPrev, completed, speech, apiKey }) {
  const [activeTab, setActiveTab] = useState('word')
  const [feedback, setFeedback] = useState(null)
  const [gettingFeedback, setGettingFeedback] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  const { speak, isSpeaking, startListening, stopListening, isListening, transcript, clearTranscript, hasTTS, hasSTT } = speech

  async function handleMicFeedback(targetPhrase) {
    if (isListening) {
      stopListening()
      if (transcript && apiKey) {
        setGettingFeedback(true)
        try {
          const fb = await generateSpeakingFeedback(apiKey, targetPhrase, transcript)
          setFeedback(fb)
        } catch {
          setFeedback({ score: null, feedback: 'Could not analyze pronunciation. Check your API key.', tip: '' })
        }
        setGettingFeedback(false)
      }
    } else {
      clearTranscript()
      setFeedback(null)
      startListening()
    }
  }

  function handleComplete() {
    setShowComplete(true)
    setTimeout(() => onComplete(), 400)
  }

  if (!lesson) return null

  return (
    <div className="card overflow-hidden animate-slide-up">
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-vermillion-500 to-vermillion-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-vermillion-100 text-xs font-semibold uppercase tracking-widest">
              Day {lesson.dayNumber} · {lesson.stage?.replace('_', ' ')}
            </span>
            <h2 className="text-white font-display font-bold text-xl mt-0.5">
              {lesson.topic}
            </h2>
          </div>
          {completed && (
            <div className="animate-stamp">
              <CheckCircle className="text-white" size={28} />
            </div>
          )}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex border-b border-ink-100 dark:border-ink-700 bg-ink-50 dark:bg-ink-900">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === id
                ? 'border-vermillion-500 text-vermillion-500'
                : 'border-transparent text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300'
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 min-h-[280px]">

        {/* WORD TAB */}
        {activeTab === 'word' && (
          <div className="animate-fade-in space-y-4">
            <div className="text-center">
              <div className="chinese-large mb-1">{lesson.word?.character}</div>
              <div className="pinyin text-lg">{lesson.word?.pinyin}</div>
              <div className="text-ink-600 dark:text-ink-300 font-medium mt-1">{lesson.word?.meaning}</div>
              <span className="tone-mark mt-2 inline-block">{lesson.word?.toneBreakdown}</span>
            </div>

            {hasTTS && (
              <button
                onClick={() => speak(lesson.word?.character)}
                disabled={isSpeaking}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink-50 dark:bg-ink-700 hover:bg-ink-100 dark:hover:bg-ink-600 transition-all text-ink-700 dark:text-ink-200 font-medium text-sm active:scale-95"
              >
                <Volume2 size={16} className={isSpeaking ? 'text-vermillion-500 animate-pulse-soft' : ''} />
                {isSpeaking ? 'Playing…' : 'Listen to word'}
              </button>
            )}

            <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-4">
              <p className="text-sm text-ink-500 dark:text-ink-400 font-medium mb-2">Example sentence</p>
              <p className="font-display text-base font-bold text-ink-900 dark:text-ink-100">{lesson.word?.example}</p>
              <p className="pinyin text-sm mt-1">{lesson.word?.examplePinyin}</p>
              <p className="text-ink-500 dark:text-ink-400 text-sm italic mt-1">{lesson.word?.exampleMeaning}</p>
              {hasTTS && (
                <button
                  onClick={() => speak(lesson.word?.example)}
                  disabled={isSpeaking}
                  className="mt-2 flex items-center gap-1.5 text-xs text-vermillion-500 font-semibold active:scale-95"
                >
                  <Volume2 size={13} />
                  Listen to sentence
                </button>
              )}
            </div>
          </div>
        )}

        {/* PHRASE TAB */}
        {activeTab === 'phrase' && (
          <div className="animate-fade-in space-y-4">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-ink-900 dark:text-ink-100">{lesson.phrase?.chinese}</p>
              <p className="pinyin mt-1">{lesson.phrase?.pinyin}</p>
              <p className="text-ink-600 dark:text-ink-300 font-medium mt-1">{lesson.phrase?.meaning}</p>
            </div>

            {hasTTS && (
              <button
                onClick={() => speak(lesson.phrase?.chinese)}
                disabled={isSpeaking}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink-50 dark:bg-ink-700 hover:bg-ink-100 dark:hover:bg-ink-600 transition-all text-ink-700 dark:text-ink-200 font-medium text-sm active:scale-95"
              >
                <Volume2 size={16} className={isSpeaking ? 'text-vermillion-500 animate-pulse-soft' : ''} />
                {isSpeaking ? 'Playing…' : 'Listen to phrase'}
              </button>
            )}

            <div className="bg-jade-500/10 border border-jade-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-jade-600 dark:text-jade-400 uppercase tracking-wide mb-1">When to use</p>
              <p className="text-sm text-ink-700 dark:text-ink-200">{lesson.phrase?.usage}</p>
            </div>

            <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wide mb-1">Pronunciation tip</p>
              <p className="text-sm text-ink-700 dark:text-ink-200">{lesson.phrase?.audioHint}</p>
            </div>
          </div>
        )}

        {/* GRAMMAR TAB */}
        {activeTab === 'grammar' && (
          <div className="animate-fade-in space-y-4">
            <div>
              <p className="text-xs font-semibold text-vermillion-500 uppercase tracking-wide">{lesson.grammar?.rule}</p>
              <p className="text-ink-700 dark:text-ink-200 text-sm leading-relaxed mt-1">{lesson.grammar?.explanation}</p>
            </div>

            <div className="bg-ink-900 dark:bg-ink-950 rounded-xl p-4">
              <p className="text-xs font-mono text-ink-400 mb-2">Pattern</p>
              <p className="font-mono text-jade-400 font-bold">{lesson.grammar?.pattern}</p>
            </div>

            <div className="border border-ink-100 dark:border-ink-700 rounded-xl p-4">
              <p className="font-display text-lg font-bold text-ink-900 dark:text-ink-100">{lesson.grammar?.example}</p>
              <p className="pinyin text-sm mt-1">{lesson.grammar?.examplePinyin}</p>
              <p className="text-ink-500 dark:text-ink-400 text-sm italic">{lesson.grammar?.exampleMeaning}</p>
              {hasTTS && (
                <button
                  onClick={() => speak(lesson.grammar?.example)}
                  disabled={isSpeaking}
                  className="mt-2 flex items-center gap-1.5 text-xs text-vermillion-500 font-semibold active:scale-95"
                >
                  <Volume2 size={13} />
                  Listen
                </button>
              )}
            </div>

            {lesson.culturalNote && (
              <div className="flex gap-3 bg-vermillion-50 dark:bg-vermillion-500/10 rounded-xl p-4">
                <Info size={16} className="text-vermillion-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-ink-700 dark:text-ink-200">{lesson.culturalNote}</p>
              </div>
            )}
          </div>
        )}

        {/* TONE TAB */}
        {activeTab === 'tone' && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h3 className="font-semibold text-ink-900 dark:text-ink-100 text-base">{lesson.toneLesson?.title}</h3>
              <p className="text-ink-600 dark:text-ink-300 text-sm leading-relaxed mt-2">{lesson.toneLesson?.content}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { tone: '1st', mark: 'ā', desc: 'High flat', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20' },
                { tone: '2nd', mark: 'á', desc: 'Rising', color: 'bg-jade-50 dark:bg-jade-500/10 text-jade-700 dark:text-jade-300 border-jade-200 dark:border-jade-500/20' },
                { tone: '3rd', mark: 'ǎ', desc: 'Dip-rise', color: 'bg-gold-50 dark:bg-gold-500/10 text-gold-700 dark:text-gold-300 border-gold-200 dark:border-gold-500/20' },
                { tone: '4th', mark: 'à', desc: 'Falling', color: 'bg-vermillion-50 dark:bg-vermillion-500/10 text-vermillion-700 dark:text-vermillion-300 border-vermillion-200 dark:border-vermillion-500/20' },
              ].map(t => (
                <div key={t.tone} className={`rounded-xl border p-3 text-center ${t.color}`}>
                  <div className="font-display text-2xl font-black">{t.mark}</div>
                  <div className="text-xs font-bold mt-1">{t.tone}</div>
                  <div className="text-xs opacity-70">{t.desc}</div>
                </div>
              ))}
            </div>

            <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-2">Practice phrase</p>
              <p className="font-display text-xl font-bold text-ink-900 dark:text-ink-100">{lesson.toneLesson?.practice}</p>
              {hasTTS && (
                <button
                  onClick={() => speak(lesson.toneLesson?.practice)}
                  disabled={isSpeaking}
                  className="mt-2 flex items-center gap-1.5 text-xs text-vermillion-500 font-semibold active:scale-95"
                >
                  <Volume2 size={13} />
                  Listen
                </button>
              )}
            </div>
          </div>
        )}

        {/* PRACTICE TAB */}
        {activeTab === 'practice' && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-4">
              <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wide mb-2">Scenario</p>
              <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">{lesson.practicePrompt}</p>
            </div>

            <div className="text-center space-y-1">
              <p className="font-display text-lg font-bold text-ink-900 dark:text-ink-100">{lesson.phrase?.chinese}</p>
              <p className="pinyin">{lesson.phrase?.pinyin}</p>
              {hasTTS && (
                <button
                  onClick={() => speak(lesson.phrase?.chinese)}
                  disabled={isSpeaking}
                  className="mx-auto flex items-center gap-1.5 text-xs text-vermillion-500 font-semibold active:scale-95 mt-1"
                >
                  <Volume2 size={13} />
                  {isSpeaking ? 'Playing…' : 'Hear it first'}
                </button>
              )}
            </div>

            {hasSTT ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleMicFeedback(lesson.phrase?.chinese)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                    isListening
                      ? 'bg-vermillion-500 text-white animate-pulse-soft'
                      : 'bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 hover:opacity-90'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  {isListening ? 'Tap to stop & analyze' : 'Tap to speak'}
                </button>

                {transcript && (
                  <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-3">
                    <p className="text-xs text-ink-400 mb-1">You said:</p>
                    <p className="font-display text-base font-bold text-ink-900 dark:text-ink-100">{transcript}</p>
                  </div>
                )}

                {gettingFeedback && (
                  <div className="flex items-center justify-center gap-2 text-sm text-ink-500 py-2">
                    <Loader2 size={14} className="animate-spin" />
                    Analyzing pronunciation…
                  </div>
                )}

                {feedback && (
                  <div className="bg-jade-500/10 border border-jade-500/20 rounded-xl p-4 space-y-2">
                    {feedback.score && (
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-lg ${i < feedback.score ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-ink-700 dark:text-ink-200">{feedback.feedback}</p>
                    {feedback.tip && (
                      <p className="text-xs text-jade-600 dark:text-jade-400 font-semibold">💡 {feedback.tip}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-ink-400 dark:text-ink-500">
                Speech recognition not available in this browser.
                <br />Try Chrome on desktop or Android.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {!completed ? (
        <div className="px-5 pb-5 space-y-2">
          <button
            onClick={handleComplete}
            className={`btn-primary w-full py-3.5 text-base ${showComplete ? 'bg-jade-500 hover:bg-jade-600' : ''}`}
          >
            {showComplete ? (
              <><CheckCircle size={18} /> Lesson Complete!</>
            ) : (
              'Mark as Complete · +50 XP'
            )}
          </button>

          <div className="flex items-center gap-2">
            {hasPrev && (
              <button
                onClick={onPrev}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors border border-ink-200 dark:border-ink-700"
              >
                <ChevronLeft size={15} />
                Back
              </button>
            )}
            <button
              onClick={onSkip}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors"
            >
              <SkipForward size={14} />
              Skip this lesson
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5 pb-5">
          <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-jade-500/10 text-jade-600 dark:text-jade-400 font-semibold text-sm">
            <CheckCircle size={16} />
            Completed!
          </div>
        </div>
      )}
    </div>
  )
}
