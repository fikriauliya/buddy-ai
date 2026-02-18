// ===== VOCABULARY DATA =====
export interface WordItem {
  word: string
  emoji: string
  /** For alphabet: the letter */
  letter?: string
  /** For alphabet: phonics sound description */
  phonics?: string
  /** For alphabet: example word */
  example?: string
  /** For math: the answer number */
  answer?: number
}

export interface Topic {
  id: string
  name: string
  emoji: string
  color: string
  words: WordItem[]
  /** Special topic type for custom lesson flow */
  type?: 'vocabulary' | 'alphabet' | 'shapes' | 'math'
}

export const TOPICS: Topic[] = [
  {
    id: 'animals', name: 'Animals', emoji: '🐾', color: '#FF8C42',
    words: [
      { word: 'cat', emoji: '🐱' }, { word: 'dog', emoji: '🐶' },
      { word: 'fish', emoji: '🐟' }, { word: 'bird', emoji: '🐦' },
      { word: 'horse', emoji: '🐴' }, { word: 'cow', emoji: '🐮' },
      { word: 'pig', emoji: '🐷' }, { word: 'duck', emoji: '🦆' },
      { word: 'rabbit', emoji: '🐰' }, { word: 'frog', emoji: '🐸' },
      { word: 'elephant', emoji: '🐘' }, { word: 'lion', emoji: '🦁' },
      { word: 'monkey', emoji: '🐵' }, { word: 'bear', emoji: '🐻' },
      { word: 'butterfly', emoji: '🦋' }
    ]
  },
  {
    id: 'colors', name: 'Colors', emoji: '🎨', color: '#9B59B6',
    words: [
      { word: 'red', emoji: '🔴' }, { word: 'blue', emoji: '🔵' },
      { word: 'green', emoji: '🟢' }, { word: 'yellow', emoji: '🟡' },
      { word: 'orange', emoji: '🟠' }, { word: 'purple', emoji: '🟣' },
      { word: 'pink', emoji: '🩷' }, { word: 'black', emoji: '⚫' },
      { word: 'white', emoji: '⚪' }, { word: 'brown', emoji: '🟤' }
    ]
  },
  {
    id: 'numbers', name: 'Numbers', emoji: '🔢', color: '#4A9EE0',
    words: [
      { word: 'one', emoji: '1️⃣' }, { word: 'two', emoji: '2️⃣' },
      { word: 'three', emoji: '3️⃣' }, { word: 'four', emoji: '4️⃣' },
      { word: 'five', emoji: '5️⃣' }, { word: 'six', emoji: '6️⃣' },
      { word: 'seven', emoji: '7️⃣' }, { word: 'eight', emoji: '8️⃣' },
      { word: 'nine', emoji: '9️⃣' }, { word: 'ten', emoji: '🔟' }
    ]
  },
  {
    id: 'food', name: 'Food', emoji: '🍽️', color: '#6BCB77',
    words: [
      { word: 'apple', emoji: '🍎' }, { word: 'banana', emoji: '🍌' },
      { word: 'milk', emoji: '🥛' }, { word: 'bread', emoji: '🍞' },
      { word: 'egg', emoji: '🥚' }, { word: 'water', emoji: '💧' },
      { word: 'rice', emoji: '🍚' }, { word: 'chicken', emoji: '🍗' },
      { word: 'cake', emoji: '🎂' }, { word: 'cookie', emoji: '🍪' },
      { word: 'juice', emoji: '🧃' }, { word: 'pizza', emoji: '🍕' }
    ]
  },
  {
    id: 'body', name: 'Body', emoji: '🧍', color: '#FF6B9D',
    words: [
      { word: 'head', emoji: '🗣️' }, { word: 'eyes', emoji: '👀' },
      { word: 'nose', emoji: '👃' }, { word: 'mouth', emoji: '👄' },
      { word: 'ears', emoji: '👂' }, { word: 'hands', emoji: '🤲' },
      { word: 'feet', emoji: '🦶' }, { word: 'arms', emoji: '💪' },
      { word: 'legs', emoji: '🦵' }, { word: 'hair', emoji: '💇' }
    ]
  },
  {
    id: 'alphabet', name: 'ABCs', emoji: '🔤', color: '#E74C3C', type: 'alphabet',
    words: [
      { word: 'A', emoji: '🍎', letter: 'A', phonics: 'ah', example: 'Apple' },
      { word: 'B', emoji: '🐻', letter: 'B', phonics: 'buh', example: 'Bear' },
      { word: 'C', emoji: '🐱', letter: 'C', phonics: 'kuh', example: 'Cat' },
      { word: 'D', emoji: '🐶', letter: 'D', phonics: 'duh', example: 'Dog' },
      { word: 'E', emoji: '🥚', letter: 'E', phonics: 'eh', example: 'Egg' },
      { word: 'F', emoji: '🐟', letter: 'F', phonics: 'fuh', example: 'Fish' },
      { word: 'G', emoji: '🍇', letter: 'G', phonics: 'guh', example: 'Grape' },
      { word: 'H', emoji: '🎩', letter: 'H', phonics: 'huh', example: 'Hat' },
      { word: 'I', emoji: '🍦', letter: 'I', phonics: 'ih', example: 'Ice cream' },
      { word: 'J', emoji: '🧃', letter: 'J', phonics: 'juh', example: 'Juice' },
      { word: 'K', emoji: '🪁', letter: 'K', phonics: 'kuh', example: 'Kite' },
      { word: 'L', emoji: '🦁', letter: 'L', phonics: 'luh', example: 'Lion' },
      { word: 'M', emoji: '🌙', letter: 'M', phonics: 'muh', example: 'Moon' },
      { word: 'N', emoji: '🪺', letter: 'N', phonics: 'nuh', example: 'Nest' },
      { word: 'O', emoji: '🍊', letter: 'O', phonics: 'oh', example: 'Orange' },
      { word: 'P', emoji: '🐧', letter: 'P', phonics: 'puh', example: 'Penguin' },
      { word: 'Q', emoji: '👑', letter: 'Q', phonics: 'kwuh', example: 'Queen' },
      { word: 'R', emoji: '🌈', letter: 'R', phonics: 'ruh', example: 'Rainbow' },
      { word: 'S', emoji: '☀️', letter: 'S', phonics: 'sss', example: 'Sun' },
      { word: 'T', emoji: '🌳', letter: 'T', phonics: 'tuh', example: 'Tree' },
      { word: 'U', emoji: '☂️', letter: 'U', phonics: 'uh', example: 'Umbrella' },
      { word: 'V', emoji: '🎻', letter: 'V', phonics: 'vuh', example: 'Violin' },
      { word: 'W', emoji: '💧', letter: 'W', phonics: 'wuh', example: 'Water' },
      { word: 'X', emoji: '🎵', letter: 'X', phonics: 'ks', example: 'Xylophone' },
      { word: 'Y', emoji: '⛵', letter: 'Y', phonics: 'yuh', example: 'Yacht' },
      { word: 'Z', emoji: '🦓', letter: 'Z', phonics: 'zzz', example: 'Zebra' }
    ]
  },
  {
    id: 'shapes', name: 'Shapes', emoji: '🔷', color: '#1ABC9C', type: 'shapes',
    words: [
      { word: 'circle', emoji: '⭕' },
      { word: 'square', emoji: '🟥' },
      { word: 'triangle', emoji: '🔺' },
      { word: 'star', emoji: '⭐' },
      { word: 'heart', emoji: '❤️' },
      { word: 'diamond', emoji: '💎' },
      { word: 'rectangle', emoji: '▬' },
      { word: 'oval', emoji: '🥚' }
    ]
  },
  {
    id: 'math', name: 'Math', emoji: '🧮', color: '#F39C12', type: 'math',
    words: [
      { word: '1 + 1', emoji: '🍎🍎', answer: 2 },
      { word: '2 + 1', emoji: '⭐⭐⭐', answer: 3 },
      { word: '1 + 2', emoji: '🔵🔵🔵', answer: 3 },
      { word: '2 + 2', emoji: '🟡🟡🟡🟡', answer: 4 },
      { word: '3 + 1', emoji: '🍎🍎🍎🍎', answer: 4 },
      { word: '3 + 2', emoji: '🟢🟢🟢🟢🟢', answer: 5 },
      { word: '4 + 1', emoji: '⭐⭐⭐⭐⭐', answer: 5 },
      { word: '2 + 3', emoji: '🔴🔴🔴🔴🔴', answer: 5 },
      { word: '3 + 3', emoji: '🟡🟡🟡🟡🟡🟡', answer: 6 },
      { word: '4 + 2', emoji: '🍎🍎🍎🍎🍎🍎', answer: 6 },
      { word: '4 + 3', emoji: '⭐⭐⭐⭐⭐⭐⭐', answer: 7 },
      { word: '4 + 4', emoji: '🔵🔵🔵🔵🔵🔵🔵🔵', answer: 8 },
      { word: '5 + 4', emoji: '🟢🟢🟢🟢🟢🟢🟢🟢🟢', answer: 9 },
      { word: '5 + 5', emoji: '🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴', answer: 10 }
    ]
  }
]

// ===== PROFILES =====
export interface Profile {
  id: string
  name: string
  avatar: string
  age: number
  level: 'beginner' | 'intermediate' | 'advanced'
  greeting: string
}

export const PROFILES: Profile[] = [
  { id: 'yusuf', name: 'Yusuf', avatar: '🦸‍♂️', age: 10, level: 'advanced', greeting: "Hey Yusuf! Let's master new words!" },
  { id: 'ibrahim', name: 'Ibrahim', avatar: '🚀', age: 7, level: 'intermediate', greeting: "Hi Ibrahim! Ready for fun?" },
  { id: 'fatih', name: 'Fatih', avatar: '🧸', age: 2, level: 'beginner', greeting: "Hello Fatih! Let's play!" }
]

// ===== PROGRESS =====
export interface ProfileProgress {
  stars: number
  streak: number
  lastPlayed: string
  topicProgress: Record<string, { wordsLearned: string[], starsEarned: number }>
}

export function loadProgress(profileId: string): ProfileProgress {
  const key = `buddy_progress_${profileId}`
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw)
  return { stars: 0, streak: 0, lastPlayed: '', topicProgress: {} }
}

export function saveProgress(profileId: string, progress: ProfileProgress) {
  localStorage.setItem(`buddy_progress_${profileId}`, JSON.stringify(progress))
}
