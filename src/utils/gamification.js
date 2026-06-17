export const XP_PER_LESSON = 50
export const XP_PER_STREAK_BONUS = 10 // extra per streak day

export const LEVELS = [
  { level: 1, title: '沉默的学生', english: 'Silent Student', minXP: 0, maxXP: 200 },
  { level: 2, title: '声调学徒', english: 'Tone Apprentice', minXP: 200, maxXP: 500 },
  { level: 3, title: '汉字猎手', english: 'Hanzi Hunter', minXP: 500, maxXP: 1000 },
  { level: 4, title: '词汇探索者', english: 'Vocab Explorer', minXP: 1000, maxXP: 1800 },
  { level: 5, title: '对话者', english: 'Conversationalist', minXP: 1800, maxXP: 3000 },
  { level: 6, title: '流利追求者', english: 'Fluency Seeker', minXP: 3000, maxXP: 5000 },
  { level: 7, title: '普通话大师', english: 'Mandarin Master', minXP: 5000, maxXP: Infinity },
]

export function getLevelForXP(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getXPProgress(xp) {
  const level = getLevelForXP(xp)
  if (level.maxXP === Infinity) return 100
  const range = level.maxXP - level.minXP
  const progress = xp - level.minXP
  return Math.min(100, Math.round((progress / range) * 100))
}

export const BADGES = [
  { id: 'first_lesson', icon: '🌱', name: 'First Step', desc: 'Complete your first lesson', condition: (s) => s.totalDays >= 1 },
  { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: '3-day streak', condition: (s) => s.streak >= 3 },
  { id: 'streak_7', icon: '⚡', name: 'Week Warrior', desc: '7-day streak', condition: (s) => s.streak >= 7 },
  { id: 'streak_30', icon: '🏆', name: 'Month Master', desc: '30-day streak', condition: (s) => s.streak >= 30 },
  { id: 'lessons_10', icon: '📚', name: 'Bookworm', desc: '10 lessons completed', condition: (s) => s.totalDays >= 10 },
  { id: 'lessons_50', icon: '🎓', name: 'Graduate', desc: '50 lessons completed', condition: (s) => s.totalDays >= 50 },
  { id: 'xp_500', icon: '💎', name: 'Diamond Mind', desc: 'Earn 500 XP', condition: (s) => s.xp >= 500 },
  { id: 'xp_1000', icon: '👑', name: 'Scholar King', desc: 'Earn 1000 XP', condition: (s) => s.xp >= 1000 },
  { id: 'level_3', icon: '🗡️', name: 'Hanzi Hunter', desc: 'Reach level 3', condition: (s) => getLevelForXP(s.xp).level >= 3 },
  { id: 'level_5', icon: '🐉', name: 'Dragon Tongue', desc: 'Reach level 5', condition: (s) => getLevelForXP(s.xp).level >= 5 },
]

export function checkNewBadges(stats, earnedBadgeIds) {
  return BADGES.filter(b => !earnedBadgeIds.includes(b.id) && b.condition(stats))
}

// Curriculum progression
export const CURRICULUM_STAGES = [
  { days: [1, 7], stage: 'foundations', label: 'Foundations', desc: 'Greetings, tones, numbers 1–10, yes/no' },
  { days: [8, 21], stage: 'introductions', label: 'Getting Started', desc: 'Introductions, family, food ordering, basic questions' },
  { days: [22, 45], stage: 'daily_life', label: 'Daily Life', desc: 'Shopping, directions, time, days and months' },
  { days: [46, 90], stage: 'expression', label: 'Expression', desc: 'Opinions, feelings, past and future, storytelling' },
  { days: [91, 999], stage: 'fluency', label: 'Fluency', desc: 'Complex conversations, formal speech, idioms' },
]

export function getCurriculumStage(dayNumber) {
  for (const s of CURRICULUM_STAGES) {
    if (dayNumber >= s.days[0] && dayNumber <= s.days[1]) return s
  }
  return CURRICULUM_STAGES[CURRICULUM_STAGES.length - 1]
}
