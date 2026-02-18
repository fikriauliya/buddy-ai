// ===== SPACED REPETITION SYSTEM =====

export interface WordHistory {
  word: string
  topicId: string
  timesSeen: number
  timesCorrect: number
  timesWrong: number
  lastSeen: number // timestamp
  nextReview: number // timestamp
  interval: number // days
  difficulty: number // 0-1, higher = harder
}

export interface SRData {
  words: Record<string, WordHistory>
  reviewSessionsCompleted: number
  reviewCorrectStreak: number
  maxReviewCorrectStreak: number
}

const INTERVALS = [1, 3, 7, 14, 30] // days

export function loadSRData(profileId: string): SRData {
  const key = `buddy_sr_${profileId}`
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw)
  return { words: {}, reviewSessionsCompleted: 0, reviewCorrectStreak: 0, maxReviewCorrectStreak: 0 }
}

export function saveSRData(profileId: string, data: SRData) {
  localStorage.setItem(`buddy_sr_${profileId}`, JSON.stringify(data))
}

function getWordKey(topicId: string, word: string) {
  return `${topicId}:${word}`
}

export function recordWordSeen(data: SRData, topicId: string, word: string, correct: boolean): SRData {
  const key = getWordKey(topicId, word)
  const now = Date.now()
  const existing = data.words[key] || {
    word, topicId, timesSeen: 0, timesCorrect: 0, timesWrong: 0,
    lastSeen: now, nextReview: now, interval: 0, difficulty: 0.3
  }

  existing.timesSeen++
  existing.lastSeen = now

  if (correct) {
    existing.timesCorrect++
    // Advance interval
    const currentIdx = INTERVALS.indexOf(existing.interval)
    const nextIdx = Math.min((currentIdx < 0 ? 0 : currentIdx) + 1, INTERVALS.length - 1)
    existing.interval = INTERVALS[nextIdx]
    existing.difficulty = Math.max(0, existing.difficulty - 0.1)
  } else {
    existing.timesWrong++
    // Reset interval
    existing.interval = INTERVALS[0]
    existing.difficulty = Math.min(1, existing.difficulty + 0.2)
  }

  existing.nextReview = now + existing.interval * 24 * 60 * 60 * 1000
  data.words[key] = existing
  return data
}

export function getWordsDueForReview(data: SRData, topicId?: string): WordHistory[] {
  const now = Date.now()
  return Object.values(data.words)
    .filter(w => w.nextReview <= now && w.timesSeen > 0)
    .filter(w => !topicId || w.topicId === topicId)
    .sort((a, b) => b.difficulty - a.difficulty)
}

export function getAllLearnedWords(data: SRData): WordHistory[] {
  return Object.values(data.words).filter(w => w.timesSeen > 0)
}

export function isWordDueForReview(data: SRData, topicId: string, word: string): boolean {
  const key = getWordKey(topicId, word)
  const h = data.words[key]
  if (!h) return false
  return h.nextReview <= Date.now() && h.timesSeen > 0
}
