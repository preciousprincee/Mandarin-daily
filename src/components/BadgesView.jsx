import { BADGES, getLevelForXP } from '../utils/gamification.js'
import { Lock } from 'lucide-react'

export default function BadgesView({ state }) {
  const { badges, xp, streak, totalDays } = state
  const earnedIds = badges.map(b => b.id)
  const stats = { streak, xp, totalDays }

  const earned = BADGES.filter(b => earnedIds.includes(b.id))
  const locked = BADGES.filter(b => !earnedIds.includes(b.id))

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-50">Badges</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          {earned.length} of {BADGES.length} earned
        </p>
      </div>

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex justify-between text-xs text-ink-500 dark:text-ink-400 mb-2">
          <span>Collection progress</span>
          <span>{Math.round((earned.length / BADGES.length) * 100)}%</span>
        </div>
        <div className="h-2.5 bg-ink-100 dark:bg-ink-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-vermillion-500 to-gold-500 rounded-full transition-all duration-1000"
            style={{ width: `${(earned.length / BADGES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Earned badges */}
      {earned.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-jade-600 dark:text-jade-400 uppercase tracking-widest mb-3">Earned</h2>
          <div className="grid grid-cols-2 gap-3">
            {earned.map(badge => (
              <div key={badge.id} className="card p-4 border-jade-200 dark:border-jade-500/20 bg-jade-50/50 dark:bg-jade-500/5">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="font-semibold text-sm text-ink-900 dark:text-ink-100">{badge.name}</div>
                <div className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest mb-3">Locked</h2>
          <div className="grid grid-cols-2 gap-3">
            {locked.map(badge => {
              // Show hint for badges close to being earned
              const isClose = badge.condition({ streak: streak + 2, xp: xp + 100, totalDays: totalDays + 3 })
              return (
                <div
                  key={badge.id}
                  className={`card p-4 opacity-60 ${isClose ? 'border-gold-200 dark:border-gold-500/20' : ''}`}
                >
                  <div className="relative w-fit mb-2">
                    <div className="text-3xl grayscale">{badge.icon}</div>
                    <Lock size={12} className="absolute -bottom-1 -right-1 text-ink-500 bg-white dark:bg-ink-800 rounded-full p-0.5" />
                  </div>
                  <div className="font-semibold text-sm text-ink-700 dark:text-ink-300">{badge.name}</div>
                  <div className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">{badge.desc}</div>
                  {isClose && (
                    <div className="text-xs text-gold-600 dark:text-gold-400 font-semibold mt-1">Almost there!</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {earned.length === 0 && (
        <div className="card p-10 text-center">
          <div className="text-5xl mb-3">🏅</div>
          <p className="font-semibold text-ink-700 dark:text-ink-200">No badges yet</p>
          <p className="text-sm text-ink-400 dark:text-ink-500 mt-1">Complete your first lesson to start earning!</p>
        </div>
      )}
    </div>
  )
}
