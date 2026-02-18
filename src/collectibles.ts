// ===== COLLECTIBLES & STICKER REWARDS =====
import { TOPICS, ProfileProgress } from './data'
import { SRData } from './spaced-repetition'

export interface Badge {
  id: string
  name: string
  emoji: string
  hint: string
  check: (progress: ProfileProgress, sr: SRData, stats: GameStats) => boolean
}

export interface GameStats {
  memoryWins: number
  bubbleWins: number
  daysPlayed: number
  maxWordsInSession: number
  perfectQuizzes: number
  topicsStarted: string[]
}

export function loadGameStats(profileId: string): GameStats {
  const key = `buddy_stats_${profileId}`
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw)
  return { memoryWins: 0, bubbleWins: 0, daysPlayed: 0, maxWordsInSession: 0, perfectQuizzes: 0, topicsStarted: [] }
}

export function saveGameStats(profileId: string, stats: GameStats) {
  localStorage.setItem(`buddy_stats_${profileId}`, JSON.stringify(stats))
}

export function loadEarnedBadges(profileId: string): string[] {
  const key = `buddy_badges_${profileId}`
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw)
  return []
}

export function saveEarnedBadges(profileId: string, badges: string[]) {
  localStorage.setItem(`buddy_badges_${profileId}`, JSON.stringify(badges))
}

function totalWordsLearned(progress: ProfileProgress): number {
  let total = 0
  for (const tp of Object.values(progress.topicProgress)) {
    total += tp.wordsLearned.length
  }
  return total
}

function totalWordsAvailable(): number {
  return TOPICS.reduce((sum, t) => sum + t.words.length, 0)
}

function allWordsInTopic(progress: ProfileProgress, topicId: string): boolean {
  const topic = TOPICS.find(t => t.id === topicId)
  if (!topic) return false
  const tp = progress.topicProgress[topicId]
  if (!tp) return false
  return tp.wordsLearned.length >= topic.words.length
}

export const BADGES: Badge[] = [
  { id: 'first_words', name: 'First Words', emoji: '🌟', hint: 'Complete your first lesson',
    check: (p) => totalWordsLearned(p) >= 1 },
  { id: 'animal_friend', name: 'Animal Friend', emoji: '🐾', hint: 'Learn all animal words',
    check: (p) => allWordsInTopic(p, 'animals') },
  { id: 'color_master', name: 'Color Master', emoji: '🎨', hint: 'Learn all color words',
    check: (p) => allWordsInTopic(p, 'colors') },
  { id: 'number_ninja', name: 'Number Ninja', emoji: '🔢', hint: 'Learn all number words',
    check: (p) => allWordsInTopic(p, 'numbers') },
  { id: 'foodie', name: 'Foodie', emoji: '🍕', hint: 'Learn all food words',
    check: (p) => allWordsInTopic(p, 'food') },
  { id: 'body_expert', name: 'Body Expert', emoji: '🧍', hint: 'Learn all body words',
    check: (p) => allWordsInTopic(p, 'body') },
  { id: 'streak_star', name: 'Streak Star', emoji: '🔥', hint: '3-day streak',
    check: (p) => p.streak >= 3 },
  { id: 'super_streak', name: 'Super Streak', emoji: '⚡', hint: '7-day streak',
    check: (p) => p.streak >= 7 },
  { id: 'word_collector', name: 'Word Collector', emoji: '📚', hint: 'Learn 25 words total',
    check: (p) => totalWordsLearned(p) >= 25 },
  { id: 'word_master', name: 'Word Master', emoji: '📖', hint: 'Learn 50 words total',
    check: (p) => totalWordsLearned(p) >= 50 },
  { id: 'perfect_score', name: 'Perfect Score', emoji: '💯', hint: 'Get 100% on a quiz',
    check: (_p, _sr, s) => s.perfectQuizzes >= 1 },
  { id: 'memory_champ', name: 'Memory Champ', emoji: '🧩', hint: 'Win memory match game',
    check: (_p, _sr, s) => s.memoryWins >= 1 },
  { id: 'bubble_popper', name: 'Bubble Popper', emoji: '🫧', hint: 'Win bubble pop game',
    check: (_p, _sr, s) => s.bubbleWins >= 1 },
  { id: 'review_pro', name: 'Review Pro', emoji: '🧠', hint: 'Complete 5 review sessions',
    check: (_p, sr) => sr.reviewSessionsCompleted >= 5 },
  { id: 'sharp_mind', name: 'Sharp Mind', emoji: '🎯', hint: '10 review words correct in a row',
    check: (_p, sr) => sr.maxReviewCorrectStreak >= 10 },
  { id: 'abc_master', name: 'ABC Master', emoji: '🔤', hint: 'Learn all 26 letters',
    check: (p) => allWordsInTopic(p, 'alphabet') },
  { id: 'shape_finder', name: 'Shape Finder', emoji: '🔷', hint: 'Learn all shapes',
    check: (p) => allWordsInTopic(p, 'shapes') },
  { id: 'math_wizard', name: 'Math Wizard', emoji: '🧮', hint: 'Complete all math lessons',
    check: (p) => allWordsInTopic(p, 'math') },
  { id: 'explorer', name: 'Explorer', emoji: '🗺️', hint: 'Start lessons in all topics',
    check: (_p, _sr, s) => s.topicsStarted.length >= TOPICS.length },
  { id: 'half_way', name: 'Half Way', emoji: '🏃', hint: 'Learn 50% of all words',
    check: (p) => totalWordsLearned(p) >= totalWordsAvailable() / 2 },
  { id: 'champion', name: 'Champion', emoji: '🏆', hint: 'Learn ALL words',
    check: (p) => totalWordsLearned(p) >= totalWordsAvailable() },
  { id: 'consistent', name: 'Consistent', emoji: '📅', hint: 'Play 10 days total',
    check: (_p, _sr, s) => s.daysPlayed >= 10 },
  { id: 'speed_learner', name: 'Speed Learner', emoji: '⚡', hint: 'Learn 10 words in one session',
    check: (_p, _sr, s) => s.maxWordsInSession >= 10 },
]

export function checkNewBadges(
  profileId: string, progress: ProfileProgress, sr: SRData, stats: GameStats
): Badge[] {
  const earned = loadEarnedBadges(profileId)
  const newBadges: Badge[] = []
  for (const badge of BADGES) {
    if (!earned.includes(badge.id) && badge.check(progress, sr, stats)) {
      earned.push(badge.id)
      newBadges.push(badge)
    }
  }
  if (newBadges.length > 0) saveEarnedBadges(profileId, earned)
  return newBadges
}
