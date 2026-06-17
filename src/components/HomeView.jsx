import { useState, useEffect } from 'react'
import { Loader2, RefreshCw, AlertTriangle, Zap } from 'lucide-react'
import LessonCard from './LessonCard.jsx'
import XPBar from './XPBar.jsx'
import { generateLesson } from '../utils/groq.js'
import { getTodayKey } from '../utils/storage.js'
import { getCurriculumStage } from '../utils/gamification.js'

export default function HomeView({ state, speech, onComplete, onSettingsClick }) {
  const { settings, lessons, saveLesson, streak, xp, totalDays } = state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const todayKey = getTodayKey()
  const todayLesson = lessons[todayKey]
  const dayNumber = totalDays + 1
  const currentStage = getCurriculumStage(dayNumber)

  // Auto-load today's lesson if API key exists and no lesson yet
  useEffect(() => {
    if (settings.groqApiKey && !todayLesson) {
      loadLesson()
    }
  }, [settings.groqApiKey])

  async function loadLesson() {
    if (!settings.groqApiKey) {
      setError('no_key')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const previousTopics = Object.values(lessons)
        .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
        .map(l => l.topic)
        .filter(Boolean)

      const lesson = await generateLesson(settings.groqApiKey, dayNumber, previousTopics)
      saveLesson(todayKey, { ...lesson, loaded: true, completed: false })
    } catch (e) {
      setError(e.message || 'Failed to generate lesson')
    }
    setLoading(false)
  }

  function handleComplete() {
    const result = onComplete(todayKey)
    return result
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Date & streak header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-widest">{dateStr}</p>
          <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-50 mt-0.5">
            {todayLesson?.completed ? '今天完成了 ✓' : '今天的课 · Today\'s Lesson'}
          </h1>
        </div>
        {streak > 0 && (
          <div className="text-right">
            <div className="text-2xl font-black text-orange-500">{streak}</div>
            <div className="text-xs text-ink-400 dark:text-ink-500">day streak</div>
          </div>
        )}
      </div>

      {/* Curriculum stage banner */}
      <div className="bg-vermillion-50 dark:bg-vermillion-500/10 border border-vermillion-100 dark:border-vermillion-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-vermillion-500 animate-pulse-soft" />
        <div>
          <span className="text-xs font-bold text-vermillion-600 dark:text-vermillion-400 uppercase tracking-wide">
            {currentStage.label}
          </span>
          <span className="text-xs text-ink-500 dark:text-ink-400 ml-2">{currentStage.desc}</span>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar xp={xp} />

      {/* Lesson Area */}
      {!settings.groqApiKey ? (
        <div className="card p-8 text-center space-y-4">
          <div className="text-4xl">🔑</div>
          <div>
            <h3 className="font-display font-bold text-ink-900 dark:text-ink-100 text-lg">Set up your API key</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
              Add your Groq API key in settings to start generating daily lessons.
            </p>
          </div>
          <button onClick={onSettingsClick} className="btn-primary mx-auto">
            Open Settings
          </button>
          <p className="text-xs text-ink-400 dark:text-ink-500">
            Free API key at{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-vermillion-500 underline">
              console.groq.com
            </a>
          </p>
        </div>
      ) : loading ? (
        <div className="card p-12 flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-vermillion-500 animate-spin" />
          <div className="text-center">
            <p className="font-semibold text-ink-700 dark:text-ink-200">Generating your lesson…</p>
            <p className="text-sm text-ink-400 dark:text-ink-500 mt-1">Day {dayNumber} · {currentStage.label}</p>
          </div>
        </div>
      ) : error ? (
        <div className="card p-8 text-center space-y-4">
          <AlertTriangle className="text-vermillion-500 mx-auto" size={32} />
          <div>
            <h3 className="font-semibold text-ink-900 dark:text-ink-100">
              {error === 'no_key' ? 'No API key set' : 'Something went wrong'}
            </h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 break-words">
              {error === 'no_key' ? 'Please add your Groq API key in settings.' : error}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            {error === 'no_key' && (
              <button onClick={onSettingsClick} className="btn-primary">Settings</button>
            )}
            <button onClick={loadLesson} className="btn-ghost">
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        </div>
      ) : todayLesson ? (
        <LessonCard
          lesson={todayLesson}
          onComplete={handleComplete}
          completed={todayLesson.completed}
          speech={speech}
          apiKey={settings.groqApiKey}
        />
      ) : (
        <div className="card p-8 text-center space-y-4">
          <div className="text-4xl">✨</div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100">Ready for Day {dayNumber}?</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
              {currentStage.label} — {currentStage.desc}
            </p>
          </div>
          <button onClick={loadLesson} className="btn-primary mx-auto gap-2">
            <Zap size={16} />
            Generate Today's Lesson
          </button>
        </div>
      )}
    </div>
  )
}
