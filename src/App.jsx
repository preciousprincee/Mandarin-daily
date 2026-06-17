import { useState } from 'react'
import Header from './components/Header.jsx'
import HomeView from './components/HomeView.jsx'
import ProgressView from './components/ProgressView.jsx'
import BadgesView from './components/BadgesView.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import BadgeToast from './components/BadgeToast.jsx'
import XPToast from './components/XPToast.jsx'
import { useAppState } from './hooks/useAppState.js'
import { useSpeech } from './hooks/useSpeech.js'

export default function App() {
  const [view, setView] = useState('home')
  const [showSettings, setShowSettings] = useState(false)
  const [xpToast, setXPToast] = useState(null)

  const state = useAppState()
  const speech = useSpeech()

  const {
    darkMode, toggleDarkMode,
    settings, saveSettings,
    completeLesson,
    newBadges, dismissNewBadges,
  } = state

  function handleComplete(dateKey) {
    const result = completeLesson(dateKey)
    if (result.xpEarned > 0) {
      setXPToast(result.xpEarned)
    }
    return result
  }

  return (
    <div className={`min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors duration-300`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        streak={state.streak}
        onSettingsClick={() => setShowSettings(true)}
        currentView={view}
        onViewChange={setView}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 safe-bottom">
        {view === 'home' && (
          <HomeView
            state={state}
            speech={speech}
            onComplete={handleComplete}
            onSettingsClick={() => setShowSettings(true)}
          />
        )}
        {view === 'progress' && <ProgressView state={state} />}
        {view === 'badges' && <BadgesView state={state} />}
      </main>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      <BadgeToast badges={newBadges} onDismiss={dismissNewBadges} />

      {xpToast && (
        <XPToast xpEarned={xpToast} onDone={() => setXPToast(null)} />
      )}
    </div>
  )
}
