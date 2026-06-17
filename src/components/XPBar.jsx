import { getLevelForXP, getXPProgress } from '../utils/gamification.js'

export default function XPBar({ xp }) {
  const level = getLevelForXP(xp)
  const progress = getXPProgress(xp)
  const nextLevel = level.maxXP === Infinity ? null : level.maxXP
  const xpToNext = nextLevel ? nextLevel - xp : 0

  return (
    <div className="card px-4 py-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-semibold text-vermillion-500 uppercase tracking-wide">
            Lv.{level.level}
          </span>
          <span className="ml-2 font-display font-bold text-ink-900 dark:text-ink-100">
            {level.title}
          </span>
          <span className="ml-1.5 text-xs text-ink-400 dark:text-ink-500">
            {level.english}
          </span>
        </div>
        <span className="text-sm font-mono font-bold text-ink-600 dark:text-ink-300">
          {xp} XP
        </span>
      </div>

      <div className="h-2 bg-ink-100 dark:bg-ink-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-vermillion-500 to-gold-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {nextLevel && (
        <p className="text-xs text-ink-400 dark:text-ink-500 mt-1 text-right">
          {xpToNext} XP to next level
        </p>
      )}
    </div>
  )
}
