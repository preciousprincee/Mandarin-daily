import { getTodayKey } from '../utils/storage.js'
import { getLevelForXP, CURRICULUM_STAGES } from '../utils/gamification.js'
import { CheckCircle, Circle, Flame, Zap, BookOpen, Calendar } from 'lucide-react'

export default function ProgressView({ state }) {
  const { streak, xp, totalDays, lessons } = state
  const level = getLevelForXP(xp)
  const todayKey = getTodayKey()

  // Build last 30 days grid
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const key = d.toISOString().split('T')[0]
    return {
      key,
      date: d,
      lesson: lessons[key],
      isToday: key === todayKey,
    }
  })

  // Stats
  const completedCount = Object.values(lessons).filter(l => l.completed).length
  const completedDays = days.filter(d => d.lesson?.completed)

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-50">Your Progress</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Flame, label: 'Current Streak', value: streak, unit: 'days', color: 'text-orange-500' },
          { icon: Zap, label: 'Total XP', value: xp, unit: 'points', color: 'text-gold-500' },
          { icon: BookOpen, label: 'Lessons Done', value: completedCount, unit: 'total', color: 'text-vermillion-500' },
          { icon: Calendar, label: 'Days Active', value: totalDays, unit: 'days', color: 'text-jade-500' },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <div key={label} className="card p-4">
            <Icon size={18} className={color} />
            <div className="mt-2">
              <div className="font-mono text-2xl font-black text-ink-900 dark:text-ink-50">{value}</div>
              <div className="text-xs text-ink-400 dark:text-ink-500">{unit}</div>
              <div className="text-xs font-semibold text-ink-600 dark:text-ink-300 mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Level info */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-vermillion-500 uppercase tracking-wide">Current Level</p>
            <p className="font-display text-xl font-black text-ink-900 dark:text-ink-50 mt-0.5">{level.title}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400">{level.english}</p>
          </div>
          <div className="text-4xl font-black font-mono text-ink-200 dark:text-ink-700">{level.level}</div>
        </div>
      </div>

      {/* 30-day calendar heatmap */}
      <div className="card p-5">
        <h3 className="font-semibold text-ink-700 dark:text-ink-200 mb-4 text-sm">Last 30 Days</h3>
        <div className="grid grid-cols-10 gap-1.5">
          {days.map(({ key, lesson, isToday }) => (
            <div
              key={key}
              title={key}
              className={`aspect-square rounded-md transition-all ${
                lesson?.completed
                  ? 'bg-vermillion-500'
                  : lesson?.loaded
                  ? 'bg-vermillion-200 dark:bg-vermillion-500/30'
                  : isToday
                  ? 'bg-ink-200 dark:bg-ink-700 ring-2 ring-vermillion-400 ring-offset-1 ring-offset-white dark:ring-offset-ink-800'
                  : 'bg-ink-100 dark:bg-ink-800'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-500">
            <div className="w-3 h-3 rounded-sm bg-vermillion-500" />
            Completed
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-500">
            <div className="w-3 h-3 rounded-sm bg-ink-100 dark:bg-ink-800" />
            Not started
          </div>
        </div>
      </div>

      {/* Curriculum path */}
      <div className="card p-5">
        <h3 className="font-semibold text-ink-700 dark:text-ink-200 mb-4 text-sm">Learning Path</h3>
        <div className="space-y-3">
          {CURRICULUM_STAGES.map((stage, i) => {
            const started = totalDays + 1 >= stage.days[0]
            const current = totalDays + 1 >= stage.days[0] && totalDays + 1 <= stage.days[1]
            return (
              <div key={stage.stage} className={`flex gap-3 items-start ${!started ? 'opacity-40' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  current
                    ? 'bg-vermillion-500'
                    : started
                    ? 'bg-jade-500'
                    : 'bg-ink-200 dark:bg-ink-700'
                }`}>
                  {started && !current
                    ? <CheckCircle size={14} className="text-white" />
                    : <Circle size={14} className="text-white" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-ink-800 dark:text-ink-200">{stage.label}</span>
                    {current && <span className="text-xs bg-vermillion-500 text-white px-2 py-0.5 rounded-full">You are here</span>}
                    <span className="text-xs text-ink-400">Day {stage.days[0]}–{stage.days[1] > 100 ? '∞' : stage.days[1]}</span>
                  </div>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{stage.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
