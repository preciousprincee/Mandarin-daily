// Storage keys
export const KEYS = {
  SETTINGS: 'md_settings',
  STREAK: 'md_streak',
  XP: 'md_xp',
  LESSONS: 'md_lessons',
  BADGES: 'md_badges',
  LAST_LESSON_DATE: 'md_last_lesson_date',
  TOTAL_DAYS: 'md_total_days',
  DARK_MODE: 'md_dark_mode',
}

export function getItem(key, fallback = null) {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('localStorage write failed', e)
  }
}

export function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

export function getYesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1)
  const d2 = new Date(dateStr2)
  return Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)))
}
