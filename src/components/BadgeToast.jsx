import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function BadgeToast({ badges, onDismiss }) {
  useEffect(() => {
    if (badges.length > 0) {
      const timer = setTimeout(onDismiss, 4000)
      return () => clearTimeout(timer)
    }
  }, [badges, onDismiss])

  if (badges.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {badges.map((badge, i) => (
        <div
          key={badge.id}
          className="animate-slide-up flex items-center gap-3 bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-4 py-3 rounded-2xl shadow-2xl pointer-events-auto"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <span className="text-2xl">{badge.icon}</span>
          <div>
            <p className="text-xs font-bold text-gold-400 dark:text-gold-600 uppercase tracking-wide">Badge Earned!</p>
            <p className="font-semibold text-sm">{badge.name}</p>
            <p className="text-xs opacity-70">{badge.desc}</p>
          </div>
          <button
            onClick={onDismiss}
            className="ml-2 opacity-60 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
