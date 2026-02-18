// ===== VOCABULARY DATA =====
export interface WordItem {
  word: string
  emoji: string
}

export interface Topic {
  id: string
  name: string
  emoji: string
  color: string
  words: WordItem[]
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
    id: 'alphabet', name: 'Alphabet', emoji: '🔤', color: '#E74C3C',
    words: [
      { word: 'A - Apple', emoji: '🍎' }, { word: 'B - Bear', emoji: '🐻' },
      { word: 'C - Cat', emoji: '🐱' }, { word: 'D - Dog', emoji: '🐶' },
      { word: 'E - Egg', emoji: '🥚' }, { word: 'F - Fish', emoji: '🐟' },
      { word: 'G - Grape', emoji: '🍇' }, { word: 'H - Hat', emoji: '🎩' },
      { word: 'I - Ice cream', emoji: '🍦' }, { word: 'J - Juice', emoji: '🧃' },
      { word: 'K - Kite', emoji: '🪁' }, { word: 'L - Lion', emoji: '🦁' },
      { word: 'M - Moon', emoji: '🌙' }, { word: 'N - Nest', emoji: '🪺' },
      { word: 'O - Orange', emoji: '🍊' }, { word: 'P - Penguin', emoji: '🐧' },
      { word: 'Q - Queen', emoji: '👑' }, { word: 'R - Rainbow', emoji: '🌈' },
      { word: 'S - Sun', emoji: '☀️' }, { word: 'T - Tree', emoji: '🌳' },
      { word: 'U - Umbrella', emoji: '☂️' }, { word: 'V - Violin', emoji: '🎻' },
      { word: 'W - Water', emoji: '💧' }, { word: 'X - Xylophone', emoji: '🎵' },
      { word: 'Y - Yacht', emoji: '⛵' }, { word: 'Z - Zebra', emoji: '🦓' }
    ]
  },
  {
    id: 'shapes', name: 'Shapes', emoji: '🔷', color: '#1ABC9C',
    words: [
      { word: 'circle', emoji: '⭕' }, { word: 'square', emoji: '🟥' },
      { word: 'triangle', emoji: '🔺' }, { word: 'star', emoji: '⭐' },
      { word: 'heart', emoji: '❤️' }, { word: 'diamond', emoji: '💎' },
      { word: 'rectangle', emoji: '▬' }, { word: 'oval', emoji: '🥚' }
    ]
  },
  {
    id: 'math', name: 'Math', emoji: '🧮', color: '#F39C12',
    words: [
      { word: '1 + 1 = 2', emoji: '🍎🍎' }, { word: '2 + 1 = 3', emoji: '🍎🍎🍎' },
      { word: '1 + 2 = 3', emoji: '⭐⭐⭐' }, { word: '2 + 2 = 4', emoji: '🟡🟡🟡🟡' },
      { word: '3 + 1 = 4', emoji: '🔵🔵🔵🔵' }, { word: '3 + 2 = 5', emoji: '🍎🍎🍎🍎🍎' },
      { word: '4 + 1 = 5', emoji: '⭐⭐⭐⭐⭐' }, { word: '2 + 3 = 5', emoji: '🟢🟢🟢🟢🟢' },
      { word: '5 + 5 = 10', emoji: '🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴' },
      { word: '3 + 3 = 6', emoji: '🟡🟡🟡🟡🟡🟡' }
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
