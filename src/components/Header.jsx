import { Moon, Sun, Settings, Flame } from 'lucide-react'

export default function Header({ darkMode, toggleDarkMode, streak, onSettingsClick, currentView, onViewChange }) {
  return (
    <header className="sticky top-0 z-40 safe-top">
      <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur border-b border-ink-100 dark:border-ink-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 group"
          >
            <span className="font-display text-xl font-black text-vermillion-500">MD</span>
            <span className="font-body text-sm font-semibold text-ink-500 dark:text-ink-400 hidden sm:block">
              Mandarin Daily
            </span>
          </button>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {[
              { id: 'home', label: 'Today' },
              { id: 'progress', label: 'Progress' },
              { id: 'badges', label: 'Badges' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === id
                    ? 'bg-vermillion-500 text-white'
                    : 'text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Streak pill */}
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              streak > 0
                ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                : 'bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500'
            }`}>
              <Flame size={13} className={streak > 0 ? 'text-orange-500' : ''} />
              <span>{streak}</span>
            </div>

            <button
              onClick={toggleDarkMode}
              className="btn-ghost w-8 h-8 p-0"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={onSettingsClick}
              className="btn-ghost w-8 h-8 p-0"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
