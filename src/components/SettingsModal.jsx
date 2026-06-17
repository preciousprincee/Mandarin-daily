import { useState } from 'react'
import { X, Eye, EyeOff, ExternalLink, Trash2, AlertTriangle } from 'lucide-react'
import { KEYS } from '../utils/storage.js'

export default function SettingsModal({ settings, onSave, onClose, darkMode, toggleDarkMode }) {
  const [apiKey, setApiKey] = useState(settings.groqApiKey || '')
  const [showKey, setShowKey] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    onSave({ ...settings, groqApiKey: apiKey.trim() })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  function handleReset() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md card p-6 space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-ink-900 dark:text-ink-50">Settings</h2>
          <button onClick={onClose} className="btn-ghost w-8 h-8 p-0">
            <X size={18} />
          </button>
        </div>

        {/* Dark mode */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-ink-800 dark:text-ink-200">Dark mode</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">Easy on the eyes at night</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-vermillion-500' : 'bg-ink-300 dark:bg-ink-600'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="border-t border-ink-100 dark:border-ink-700" />

        {/* Groq API key */}
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-sm text-ink-800 dark:text-ink-200">Groq API Key</p>
            <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
              Used to generate your daily lessons. Stored only in your browser.
            </p>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-ink-200 dark:border-ink-600 bg-ink-50 dark:bg-ink-700 text-ink-900 dark:text-ink-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-vermillion-400 placeholder:text-ink-300 dark:placeholder:text-ink-500"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => setShowKey(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
            >
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-vermillion-500 hover:text-vermillion-600 font-semibold"
          >
            <ExternalLink size={12} />
            Get a free Groq API key
          </a>
        </div>

        {/* Model info */}
        <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-4">
          <p className="text-xs font-semibold text-ink-600 dark:text-ink-300 mb-1">Model</p>
          <p className="font-mono text-sm text-ink-900 dark:text-ink-100">llama3-70b-8192</p>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-1">Fast, free tier available. Used for lesson generation and speaking feedback.</p>
        </div>

        <button
          onClick={handleSave}
          className={`btn-primary w-full ${saved ? 'bg-jade-500 hover:bg-jade-500' : ''}`}
        >
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>

        <div className="border-t border-ink-100 dark:border-ink-700" />

        {/* Danger zone */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-widest">Danger Zone</p>
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-2 text-sm text-ink-500 dark:text-ink-400 hover:text-vermillion-500 transition-colors"
            >
              <Trash2 size={14} />
              Reset all progress
            </button>
          ) : (
            <div className="bg-vermillion-50 dark:bg-vermillion-500/10 border border-vermillion-200 dark:border-vermillion-500/30 rounded-xl p-4 space-y-3">
              <div className="flex gap-2">
                <AlertTriangle size={16} className="text-vermillion-500 flex-shrink-0" />
                <p className="text-sm text-ink-700 dark:text-ink-200">
                  This will delete your streak, XP, all lessons, and badges. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleReset} className="flex-1 py-2 rounded-xl bg-vermillion-500 text-white text-sm font-semibold hover:bg-vermillion-600">
                  Yes, reset everything
                </button>
                <button onClick={() => setShowReset(false)} className="flex-1 py-2 rounded-xl bg-ink-100 dark:bg-ink-700 text-sm font-semibold text-ink-700 dark:text-ink-200">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
