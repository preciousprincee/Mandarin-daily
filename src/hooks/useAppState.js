import { useState, useEffect, useCallback } from 'react'
import { getItem, setItem, KEYS, getTodayKey, getYesterdayKey } from '../utils/storage.js'
import { checkNewBadges, XP_PER_LESSON, XP_PER_STREAK_BONUS } from '../utils/gamification.js'

export function useAppState() {
  const [darkMode, setDarkMode] = useState(() => getItem(KEYS.DARK_MODE, false))
  const [settings, setSettings] = useState(() => getItem(KEYS.SETTINGS, { groqApiKey: '' }))
  const [streak, setStreak] = useState(() => getItem(KEYS.STREAK, 0))
  const [xp, setXP] = useState(() => getItem(KEYS.XP, 0))
  const [totalDays, setTotalDays] = useState(() => getItem(KEYS.TOTAL_DAYS, 0))
  const [lessons, setLessons] = useState(() => getItem(KEYS.LESSONS, {}))
  const [badges, setBadges] = useState(() => getItem(KEYS.BADGES, []))
  const [newBadges, setNewBadges] = useState([])

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setItem(KEYS.DARK_MODE, darkMode)
  }, [darkMode])

  // Check streak continuity on load
  useEffect(() => {
    const lastDate = getItem(KEYS.LAST_LESSON_DATE, null)
    if (!lastDate) return
    const yesterday = getYesterdayKey()
    const today = getTodayKey()
    // If last lesson wasn't yesterday or today, reset streak
    if (lastDate !== yesterday && lastDate !== today) {
      setStreak(0)
      setItem(KEYS.STREAK, 0)
    }
  }, [])

  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings)
    setItem(KEYS.SETTINGS, newSettings)
  }, [])

  const saveLesson = useCallback((dateKey, lessonData) => {
    const updated = { ...lessons, [dateKey]: lessonData }
    setLessons(updated)
    setItem(KEYS.LESSONS, updated)
  }, [lessons])

  const completeLesson = useCallback((dateKey) => {
    const today = getTodayKey()
    const lastDate = getItem(KEYS.LAST_LESSON_DATE, null)

    // Don't double-complete
    if (lessons[dateKey]?.completed) return { xpEarned: 0, newBadgesEarned: [] }

    // Update lesson
    const updatedLessons = {
      ...lessons,
      [dateKey]: { ...lessons[dateKey], completed: true, completedAt: new Date().toISOString() }
    }
    setLessons(updatedLessons)
    setItem(KEYS.LESSONS, updatedLessons)

    // Update streak
    let newStreak = streak
    const yesterday = getYesterdayKey()
    if (lastDate === yesterday || lastDate === null) {
      newStreak = streak + 1
    } else if (lastDate !== today) {
      newStreak = 1
    }
    setStreak(newStreak)
    setItem(KEYS.STREAK, newStreak)
    setItem(KEYS.LAST_LESSON_DATE, today)

    // Calculate XP
    const streakBonus = Math.min(newStreak - 1, 10) * XP_PER_STREAK_BONUS
    const xpEarned = XP_PER_LESSON + streakBonus
    const newXP = xp + xpEarned
    setXP(newXP)
    setItem(KEYS.XP, newXP)

    // Update total days
    const newTotal = totalDays + 1
    setTotalDays(newTotal)
    setItem(KEYS.TOTAL_DAYS, newTotal)

    // Check badges
    const stats = { streak: newStreak, xp: newXP, totalDays: newTotal }
    const earnedIds = badges.map(b => b.id)
    const newlyEarned = checkNewBadges(stats, earnedIds)
    if (newlyEarned.length > 0) {
      const updatedBadges = [...badges, ...newlyEarned]
      setBadges(updatedBadges)
      setItem(KEYS.BADGES, updatedBadges)
      setNewBadges(newlyEarned)
    }

    return { xpEarned, newBadgesEarned: newlyEarned }
  }, [lessons, streak, xp, totalDays, badges])

  const dismissNewBadges = useCallback(() => setNewBadges([]), [])

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), [])

  return {
    darkMode, toggleDarkMode,
    settings, saveSettings,
    streak, xp, totalDays,
    lessons, saveLesson, completeLesson,
    badges, newBadges, dismissNewBadges,
  }
}
