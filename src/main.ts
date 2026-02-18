import { TOPICS, PROFILES, Profile, Topic, WordItem, loadProgress, saveProgress, ProfileProgress } from './data'
import { createBuddySVG, setBuddyState } from './buddy-svg'
import { speak, listen, hasSpeechRecognition } from './speech'
import { initParticles, burstConfetti, burstStars } from './particles'
import { SRData, loadSRData, saveSRData, recordWordSeen, getWordsDueForReview, getAllLearnedWords, isWordDueForReview } from './spaced-repetition'
import { BADGES, loadEarnedBadges, loadGameStats, saveGameStats, checkNewBadges, GameStats } from './collectibles'
import { TOPIC_STORIES, getTransition } from './stories'

// ===== APP STATE =====
let currentProfile: Profile | null = null
let progress: ProfileProgress = { stars: 0, streak: 0, lastPlayed: '', topicProgress: {} }
let srData: SRData = { words: {}, reviewSessionsCompleted: 0, reviewCorrectStreak: 0, maxReviewCorrectStreak: 0 }
let gameStats: GameStats = { memoryWins: 0, bubbleWins: 0, daysPlayed: 0, maxWordsInSession: 0, perfectQuizzes: 0, topicsStarted: [] }
let currentTopic: Topic | null = null
let lessonWords: (WordItem & { isReview?: boolean })[] = []
let lessonIndex = 0
let lessonStars = 0
let lessonWordsLearnedThisSession = 0
let quizCorrectCount = 0
let quizTotalCount = 0

const app = document.getElementById('app')!

// ===== INIT =====
initParticles()
showWelcome()

// ===== HELPERS =====
function $(html: string): HTMLElement {
  const div = document.createElement('div')
  div.innerHTML = html.trim()
  return div.firstElementChild as HTMLElement
}

function showScreen(_id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  setTimeout(() => {
    const el = document.getElementById(_id)
    if (el) el.classList.add('active')
  }, 50)
}

void showScreen // keep linter happy

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function addStars(n: number) {
  lessonStars += n
  progress.stars += n
  if (currentTopic) {
    const tp = progress.topicProgress[currentTopic.id] || { wordsLearned: [], starsEarned: 0 }
    tp.starsEarned += n
    progress.topicProgress[currentTopic.id] = tp
  }
  saveProgress(currentProfile!.id, progress)
}

function markWordLearned(word: string) {
  if (!currentTopic || !currentProfile) return
  const tp = progress.topicProgress[currentTopic.id] || { wordsLearned: [], starsEarned: 0 }
  if (!tp.wordsLearned.includes(word)) {
    tp.wordsLearned.push(word)
    lessonWordsLearnedThisSession++
  }
  progress.topicProgress[currentTopic.id] = tp
  saveProgress(currentProfile.id, progress)
}

function trackWordSR(topicId: string, word: string, correct: boolean) {
  if (!currentProfile) return
  srData = recordWordSeen(srData, topicId, word, correct)
  saveSRData(currentProfile.id, srData)
}

function doCheckBadges() {
  if (!currentProfile) return
  const newBadges = checkNewBadges(currentProfile.id, progress, srData, gameStats)
  if (newBadges.length > 0) {
    // Show popup for first new badge (queue others)
    showBadgePopup(newBadges)
  }
}

function showBadgePopup(badges: { name: string, emoji: string }[]) {
  const badge = badges[0]
  burstConfetti()
  const popup = $(`
    <div class="badge-popup">
      <div class="badge-popup-inner">
        <div class="badge-popup-emoji">${badge.emoji}</div>
        <div class="badge-popup-title">New Sticker!</div>
        <div class="badge-popup-name">${badge.name}</div>
        <button class="btn btn-yellow badge-popup-close">Awesome! 🎉</button>
      </div>
    </div>
  `)
  document.body.appendChild(popup)
  popup.querySelector('.badge-popup-close')!.addEventListener('click', () => {
    popup.remove()
    if (badges.length > 1) showBadgePopup(badges.slice(1))
  })
}

function updateDaysPlayed() {
  if (!currentProfile) return
  const key = `buddy_days_${currentProfile.id}`
  const raw = localStorage.getItem(key)
  const days: string[] = raw ? JSON.parse(raw) : []
  const today = new Date().toDateString()
  if (!days.includes(today)) {
    days.push(today)
    localStorage.setItem(key, JSON.stringify(days))
  }
  gameStats.daysPlayed = days.length
  saveGameStats(currentProfile.id, gameStats)
}

// ===== SCREEN: WELCOME =====
function showWelcome() {
  app.innerHTML = `
    <div class="screen active" id="screen-welcome">
      <div class="welcome-title">🤖 Buddy AI</div>
      <div class="welcome-sub">Who's learning today?</div>
      <div class="profiles" id="profiles"></div>
    </div>
  `
  const container = document.getElementById('profiles')!
  PROFILES.forEach(p => {
    const card = $(`
      <div class="profile-card">
        <div class="profile-avatar">${p.avatar}</div>
        <div class="profile-name">${p.name}</div>
        <div class="profile-age">Age ${p.age} · ${p.level}</div>
      </div>
    `)
    card.onclick = () => selectProfile(p)
    container.appendChild(card)
  })
}

function selectProfile(p: Profile) {
  currentProfile = p
  progress = loadProgress(p.id)
  srData = loadSRData(p.id)
  gameStats = loadGameStats(p.id)
  // Update streak
  const today = new Date().toDateString()
  if (progress.lastPlayed !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    progress.streak = progress.lastPlayed === yesterday ? progress.streak + 1 : 1
    progress.lastPlayed = today
    saveProgress(p.id, progress)
  }
  updateDaysPlayed()
  showHome()
}

// ===== SCREEN: HOME =====
function showHome() {
  const p = currentProfile!
  const earned = loadEarnedBadges(p.id)
  const reviewDue = getWordsDueForReview(srData)

  app.innerHTML = `
    <div class="screen active" id="screen-home">
      <div class="home-header">
        <div class="home-greeting">${p.greeting}</div>
        <div class="home-sub">⭐ ${progress.stars} stars · 🔥 ${progress.streak} day streak · 🎖️ ${earned.length} stickers</div>
      </div>
      <div class="buddy-container" id="home-buddy"></div>
      <div class="topics-grid" id="topics-grid"></div>
      <div class="home-bottom">
        ${reviewDue.length > 0 ? `<button class="btn btn-orange" id="btn-review">🧠 Review (${reviewDue.length})</button>` : ''}
        <button class="btn btn-green" id="btn-games">🎮 Games</button>
        <button class="btn btn-purple" id="btn-collection">🎖️ Stickers</button>
        <button class="btn btn-blue" id="btn-progress">📊 Progress</button>
      </div>
    </div>
  `
  // Insert buddy
  const buddyEl = document.getElementById('home-buddy')!
  buddyEl.appendChild(createBuddySVG())
  setBuddyState('idle')

  // Topics
  const grid = document.getElementById('topics-grid')!
  TOPICS.forEach(t => {
    const tp = progress.topicProgress[t.id]
    const learned = tp ? tp.wordsLearned.length : 0
    const total = t.words.length
    const pct = Math.round((learned / total) * 100)
    const stars = tp ? tp.starsEarned : 0
    const bubble = $(`
      <div class="topic-bubble">
        <div class="topic-emoji">${t.emoji}</div>
        <div class="topic-name">${t.name}</div>
        <div class="topic-stars">⭐ ${stars}</div>
        <div class="topic-progress"><div class="topic-progress-fill" style="width:${pct}%"></div></div>
      </div>
    `)
    bubble.onclick = () => startLesson(t)
    grid.appendChild(bubble)
  })

  document.getElementById('btn-games')!.onclick = () => showGamesMenu()
  document.getElementById('btn-progress')!.onclick = () => showProgress()
  document.getElementById('btn-collection')!.onclick = () => showCollection()
  const reviewBtn = document.getElementById('btn-review')
  if (reviewBtn) reviewBtn.onclick = () => startReviewMode()

  // Buddy greets
  speak(p.greeting)
  setBuddyState('talking')
  setTimeout(() => setBuddyState('idle'), 3000)
}

// ===== SCREEN: LESSON =====
function startLesson(topic: Topic) {
  currentTopic = topic
  lessonWordsLearnedThisSession = 0
  quizCorrectCount = 0
  quizTotalCount = 0

  // Track topic started
  if (!gameStats.topicsStarted.includes(topic.id)) {
    gameStats.topicsStarted.push(topic.id)
    saveGameStats(currentProfile!.id, gameStats)
  }

  const tp = progress.topicProgress[topic.id]
  const learned = tp ? tp.wordsLearned : []
  // Pick 5 words: prioritize unlearned, mix in ~30% review words from SR
  const unlearned = topic.words.filter(w => !learned.includes(w.word))
  const reviewDue = getWordsDueForReview(srData, topic.id)
  const reviewWords = shuffle(reviewDue.map(rw => {
    const w = topic.words.find(tw => tw.word === rw.word)
    return w ? { ...w, isReview: true } : null
  }).filter(Boolean) as (WordItem & { isReview: boolean })[]).slice(0, 2)

  const newWords = shuffle(unlearned).slice(0, Math.max(3, 5 - reviewWords.length))
  const pool = [...newWords.map(w => ({ ...w, isReview: false })), ...reviewWords]
  lessonWords = shuffle(pool.length > 0 ? pool : shuffle(topic.words).slice(0, 5).map(w => ({ ...w, isReview: false })))
  lessonIndex = 0
  lessonStars = 0
  showStoryIntro()
}

// ===== STORY INTRO =====
async function showStoryIntro() {
  const story = TOPIC_STORIES[currentTopic!.id]
  if (!story) { showLessonWarmup(); return }

  const pct = 0
  renderLessonShell(`
    <div class="buddy-container" id="lesson-buddy"></div>
    <div class="story-bubble">
      <div class="story-text">${story.intro}</div>
    </div>
    <button class="btn btn-blue" id="btn-start">Let's Go! 🚀</button>
  `, pct)
  setBuddyState('talking')
  await speak(story.intro)
  setBuddyState('idle')
  document.getElementById('btn-start')!.onclick = () => showFlashcard()
}

function renderLessonShell(content: string, progressPct: number) {
  app.innerHTML = `
    <div class="screen active" id="screen-lesson">
      <div class="lesson-top">
        <button class="lesson-back" id="lesson-back">←</button>
        <div class="lesson-progress-bar"><div class="lesson-progress-fill" style="width:${progressPct}%"></div></div>
        <div class="lesson-stars-count">⭐ ${lessonStars}</div>
      </div>
      <div class="lesson-content" id="lesson-content">
        ${content}
      </div>
    </div>
  `
  document.getElementById('lesson-back')!.onclick = () => { doCheckBadges(); showHome() }
  const bc = document.getElementById('lesson-buddy')
  if (bc) {
    bc.appendChild(createBuddySVG())
    setBuddyState('idle')
  }
}

async function showLessonWarmup() {
  const pct = 0
  renderLessonShell(`
    <div class="buddy-container" id="lesson-buddy"></div>
    <div class="buddy-says" id="buddy-msg">Hi ${currentProfile!.name}! Ready to learn ${currentTopic!.name}?</div>
    <button class="btn btn-blue" id="btn-start">Let's Go! 🚀</button>
  `, pct)
  setBuddyState('talking')
  await speak(`Hi ${currentProfile!.name}! Ready to learn about ${currentTopic!.name}?`)
  setBuddyState('idle')
  document.getElementById('btn-start')!.onclick = () => showFlashcard()
}

async function showFlashcard() {
  if (lessonIndex >= lessonWords.length) {
    showPracticeRound()
    return
  }
  const word = lessonWords[lessonIndex]
  const pct = (lessonIndex / (lessonWords.length * 2)) * 100

  // Story transition between cards (not on first card)
  const storyTransition = lessonIndex > 0 ? getTransition(currentTopic!.id, lessonIndex - 1) : ''

  renderLessonShell(`
    <div class="buddy-container" id="lesson-buddy"></div>
    ${storyTransition ? `<div class="story-bubble"><div class="story-text">${storyTransition}</div></div>` : ''}
    <div class="flashcard">
      ${word.isReview ? '<div class="review-badge">📖 Review</div>' : ''}
      <div class="flashcard-emoji">${word.emoji}</div>
      <div class="flashcard-word">${word.word}</div>
    </div>
    <div class="buddy-says" id="buddy-msg">This is "${word.word}"! Can you say it?</div>
    ${hasSpeechRecognition()
      ? `<button class="mic-btn" id="mic-btn">🎤</button>`
      : `<button class="btn btn-green" id="tap-btn">I said it! ✓</button>`
    }
  `, pct)

  if (storyTransition) {
    setBuddyState('talking')
    await speak(storyTransition)
  }

  setBuddyState('talking')
  await speak(`This is ${word.word}`)
  setBuddyState('idle')

  if (hasSpeechRecognition()) {
    const micBtn = document.getElementById('mic-btn')!
    micBtn.onclick = async () => {
      micBtn.classList.add('listening')
      setBuddyState('listening')
      document.getElementById('buddy-msg')!.textContent = "I'm listening... 👂"
      const result = await listen()
      micBtn.classList.remove('listening')

      if (result && (result.includes(word.word) || word.word.includes(result))) {
        await celebrateCorrect(word)
      } else if (result) {
        await encourageRetry(word, result)
      } else {
        await encourageRetry(word, '')
      }
    }
  } else {
    document.getElementById('tap-btn')!.onclick = () => celebrateCorrect(word)
  }
}

async function celebrateCorrect(word: WordItem & { isReview?: boolean }) {
  setBuddyState('celebrating')
  burstConfetti()
  addStars(1)
  markWordLearned(word.word)
  trackWordSR(currentTopic!.id, word.word, true)

  const msgs = ["Amazing! 🎉", "Great job! ⭐", "You're awesome! 🌟", "Perfect! 🏆", "Wonderful! 💫"]
  const msg = msgs[Math.floor(Math.random() * msgs.length)]

  const buddyMsg = document.getElementById('buddy-msg')
  if (buddyMsg) buddyMsg.textContent = msg
  await speak(msg.replace(/[^a-zA-Z ]/g, ''))
  await delay(800)
  lessonIndex++
  showFlashcard()
}

async function encourageRetry(word: WordItem, heard: string) {
  setBuddyState('encouraging')
  const msg = heard
    ? `I heard "${heard}". Try again: "${word.word}"!`
    : `Let's try again! Say "${word.word}"!`
  const buddyMsg = document.getElementById('buddy-msg')
  if (buddyMsg) buddyMsg.textContent = msg
  await speak(`Try again! Say ${word.word}`)
  setBuddyState('idle')
}

// ===== PRACTICE ROUND =====
let practiceIndex = 0

function showPracticeRound() {
  practiceIndex = 0
  showPracticeQuestion()
}

async function showPracticeQuestion() {
  if (practiceIndex >= lessonWords.length) {
    showQuiz()
    return
  }
  const target = lessonWords[practiceIndex]
  const allWords = currentTopic!.words
  const distractors = shuffle(allWords.filter(w => w.word !== target.word)).slice(0, 3)
  const options = shuffle([target, ...distractors])

  const pct = 50 + (practiceIndex / lessonWords.length) * 25
  renderLessonShell(`
    <div class="buddy-container" id="lesson-buddy"></div>
    <div class="buddy-says" id="buddy-msg">Point to the ${target.word}! 👆</div>
    <div class="choices" id="choices"></div>
  `, pct)

  setBuddyState('talking')
  await speak(`Point to the ${target.word}`)
  setBuddyState('idle')

  const choicesEl = document.getElementById('choices')!
  options.forEach(opt => {
    const card = $(`
      <div class="choice-card" data-word="${opt.word}">
        ${opt.emoji}
        <div class="choice-label">${opt.word}</div>
      </div>
    `)
    card.onclick = async () => {
      if (opt.word === target.word) {
        card.classList.add('correct')
        burstStars(card.getBoundingClientRect().left + 50, card.getBoundingClientRect().top)
        addStars(1)
        trackWordSR(currentTopic!.id, target.word, true)
        setBuddyState('celebrating')
        await speak('Yes!')
        await delay(600)
        practiceIndex++
        showPracticeQuestion()
      } else {
        card.classList.add('wrong')
        trackWordSR(currentTopic!.id, target.word, false)
        setBuddyState('encouraging')
        await speak(`That's ${opt.word}. Try again!`)
        setBuddyState('idle')
        setTimeout(() => card.classList.remove('wrong'), 400)
      }
    }
    choicesEl.appendChild(card)
  })
}

// ===== QUIZ =====
let quizIndex = 0

function showQuiz() {
  quizIndex = 0
  quizCorrectCount = 0
  quizTotalCount = lessonWords.length
  showQuizQuestion()
}

async function showQuizQuestion() {
  if (quizIndex >= lessonWords.length) {
    // Check perfect quiz
    if (quizCorrectCount === quizTotalCount) {
      gameStats.perfectQuizzes++
      saveGameStats(currentProfile!.id, gameStats)
    }
    // Update max words in session
    if (lessonWordsLearnedThisSession > gameStats.maxWordsInSession) {
      gameStats.maxWordsInSession = lessonWordsLearnedThisSession
      saveGameStats(currentProfile!.id, gameStats)
    }
    showLessonComplete()
    return
  }
  const word = lessonWords[quizIndex]
  const pct = 75 + (quizIndex / lessonWords.length) * 25
  renderLessonShell(`
    <div class="buddy-container" id="lesson-buddy"></div>
    <div class="flashcard">
      <div class="flashcard-emoji">${word.emoji}</div>
    </div>
    <div class="buddy-says" id="buddy-msg">What is this? 🤔</div>
    ${hasSpeechRecognition()
      ? `<button class="mic-btn" id="mic-btn">🎤</button>`
      : renderTapQuiz(word)
    }
  `, pct)

  setBuddyState('thinking')
  await speak('What is this?')
  setBuddyState('listening')

  if (hasSpeechRecognition()) {
    document.getElementById('mic-btn')!.onclick = async () => {
      const btn = document.getElementById('mic-btn')!
      btn.classList.add('listening')
      document.getElementById('buddy-msg')!.textContent = "I'm listening... 👂"
      const result = await listen()
      btn.classList.remove('listening')
      if (result && (result.includes(word.word) || word.word.includes(result))) {
        await celebrateQuiz(word)
      } else {
        await retryQuiz(word, result)
      }
    }
  } else {
    document.querySelectorAll('.quiz-option').forEach(el => {
      (el as HTMLElement).onclick = async () => {
        const w = (el as HTMLElement).dataset.word!
        if (w === word.word) {
          (el as HTMLElement).classList.add('correct')
          await celebrateQuiz(word)
        } else {
          (el as HTMLElement).classList.add('wrong')
          trackWordSR(currentTopic!.id, word.word, false)
          setBuddyState('encouraging')
          await speak(`That's not it. It's ${word.word}!`)
          setBuddyState('idle')
          setTimeout(() => (el as HTMLElement).classList.remove('wrong'), 400)
        }
      }
    })
  }
}

function renderTapQuiz(target: WordItem): string {
  const distractors = shuffle(currentTopic!.words.filter(w => w.word !== target.word)).slice(0, 3)
  const opts = shuffle([target, ...distractors])
  return `<div class="choices">${opts.map(o =>
    `<div class="choice-card quiz-option" data-word="${o.word}">${o.emoji}<div class="choice-label">${o.word}</div></div>`
  ).join('')}</div>`
}

async function celebrateQuiz(word: WordItem) {
  setBuddyState('celebrating')
  burstConfetti()
  addStars(2)
  quizCorrectCount++
  trackWordSR(currentTopic!.id, word.word, true)
  const buddyMsg = document.getElementById('buddy-msg')
  if (buddyMsg) buddyMsg.textContent = `Yes! It's ${word.word}! 🎉`
  await speak(`Yes! It's ${word.word}!`)
  await delay(600)
  quizIndex++
  showQuizQuestion()
}

async function retryQuiz(word: WordItem, heard: string) {
  setBuddyState('encouraging')
  trackWordSR(currentTopic!.id, word.word, false)
  const msg = heard ? `I heard "${heard}". It's "${word.word}"! Try once more!` : `It's "${word.word}"! Try saying it!`
  document.getElementById('buddy-msg')!.textContent = msg
  await speak(`It's ${word.word}. Try again!`)
  setBuddyState('idle')
}

// ===== LESSON COMPLETE =====
async function showLessonComplete() {
  burstConfetti()
  burstConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4)
  burstConfetti(window.innerWidth * 0.7, window.innerHeight * 0.4)

  // Story conclusion
  const story = TOPIC_STORIES[currentTopic!.id]
  const conclusion = story ? story.conclusion : ''

  app.innerHTML = `
    <div class="screen active" id="screen-complete">
      <div class="buddy-container" id="lesson-buddy"></div>
      <div class="welcome-title">🎉 Lesson Complete!</div>
      <div style="font-size:3rem;margin:10px 0">${'⭐'.repeat(Math.min(lessonStars, 10))}</div>
      <div class="buddy-says">You earned ${lessonStars} stars! Amazing work, ${currentProfile!.name}!</div>
      ${conclusion ? `<div class="story-bubble" style="margin-top:12px"><div class="story-text">${conclusion}</div></div>` : ''}
      <div style="display:flex;gap:12px;margin-top:20px">
        <button class="btn btn-blue" id="btn-home">🏠 Home</button>
        <button class="btn btn-green" id="btn-next">Next Lesson ▶</button>
      </div>
    </div>
  `
  const bc = document.getElementById('lesson-buddy')
  if (bc) { bc.appendChild(createBuddySVG()); setBuddyState('celebrating') }

  const speakText = conclusion
    ? `You earned ${lessonStars} stars! ${conclusion}`
    : `You earned ${lessonStars} stars! Amazing work, ${currentProfile!.name}!`
  await speak(speakText)

  doCheckBadges()

  document.getElementById('btn-home')!.onclick = () => showHome()
  document.getElementById('btn-next')!.onclick = () => startLesson(currentTopic!)
}

// ===== ACTIVE RETRIEVAL / REVIEW MODE =====
let reviewWords: { word: string, emoji: string, topicId: string }[] = []
let reviewIndex = 0
let reviewCorrect = 0

function startReviewMode() {
  const allLearned = getAllLearnedWords(srData)
  if (allLearned.length === 0) {
    speak("You haven't learned any words yet! Try a lesson first.")
    return
  }

  // Prioritize due words, then random learned words
  const due = getWordsDueForReview(srData)
  const notDue = allLearned.filter(w => !due.find(d => d.word === w.word && d.topicId === w.topicId))

  const pool = [...shuffle(due), ...shuffle(notDue)].slice(0, 10)

  reviewWords = pool.map(wh => {
    const topic = TOPICS.find(t => t.id === wh.topicId)
    const wordItem = topic?.words.find(w => w.word === wh.word)
    return { word: wh.word, emoji: wordItem?.emoji || '❓', topicId: wh.topicId }
  })

  reviewIndex = 0
  reviewCorrect = 0
  showReviewQuestion()
}

async function showReviewQuestion() {
  if (reviewIndex >= reviewWords.length) {
    showReviewSummary()
    return
  }

  const target = reviewWords[reviewIndex]
  const topic = TOPICS.find(t => t.id === target.topicId)
  const allTopicWords = topic ? topic.words : []
  const distractors = shuffle(allTopicWords.filter(w => w.word !== target.word)).slice(0, 3)
  const options = shuffle([{ word: target.word, emoji: target.emoji }, ...distractors])

  app.innerHTML = `
    <div class="screen active" id="screen-review">
      <div class="lesson-top">
        <button class="lesson-back" id="lesson-back">←</button>
        <div class="lesson-progress-bar"><div class="lesson-progress-fill" style="width:${(reviewIndex / reviewWords.length) * 100}%"></div></div>
        <div class="lesson-stars-count">${reviewIndex + 1}/${reviewWords.length}</div>
      </div>
      <div class="lesson-content">
        <div class="buddy-container" id="review-buddy"></div>
        <div class="buddy-says" id="buddy-msg">Do you remember this?</div>
        <div class="flashcard">
          <div class="review-badge">🧠 Review</div>
          <div class="flashcard-emoji">${target.emoji}</div>
        </div>
        <div class="choices" id="choices"></div>
      </div>
    </div>
  `
  document.getElementById('lesson-back')!.onclick = () => showHome()
  const bc = document.getElementById('review-buddy')!
  bc.appendChild(createBuddySVG())
  setBuddyState('thinking')
  await speak('Do you remember this?')
  setBuddyState('idle')

  const choicesEl = document.getElementById('choices')!
  options.forEach(opt => {
    const card = $(`
      <div class="choice-card" data-word="${opt.word}">
        <div class="choice-label">${opt.word}</div>
      </div>
    `)
    card.onclick = async () => {
      if (opt.word === target.word) {
        card.classList.add('correct')
        burstStars(card.getBoundingClientRect().left + 50, card.getBoundingClientRect().top)
        reviewCorrect++
        trackWordSR(target.topicId, target.word, true)
        srData.reviewCorrectStreak++
        if (srData.reviewCorrectStreak > srData.maxReviewCorrectStreak) {
          srData.maxReviewCorrectStreak = srData.reviewCorrectStreak
        }
        saveSRData(currentProfile!.id, srData)
        setBuddyState('celebrating')
        await speak('Yes! Great memory!')
        await delay(500)
        reviewIndex++
        showReviewQuestion()
      } else {
        card.classList.add('wrong')
        trackWordSR(target.topicId, target.word, false)
        srData.reviewCorrectStreak = 0
        saveSRData(currentProfile!.id, srData)
        setBuddyState('encouraging')
        await speak(`That's ${opt.word}. This is ${target.word}!`)
        const buddyMsg = document.getElementById('buddy-msg')
        if (buddyMsg) buddyMsg.textContent = `This is "${target.word}"!`
        await delay(1000)
        reviewIndex++
        showReviewQuestion()
      }
    }
    choicesEl.appendChild(card)
  })
}

async function showReviewSummary() {
  srData.reviewSessionsCompleted++
  saveSRData(currentProfile!.id, srData)

  burstConfetti()
  app.innerHTML = `
    <div class="screen active" id="screen-review-done">
      <div class="buddy-container" id="review-buddy"></div>
      <div class="welcome-title">🧠 Review Complete!</div>
      <div style="font-size:2rem;margin:16px 0">You remembered ${reviewCorrect}/${reviewWords.length}!</div>
      <div class="buddy-says">${reviewCorrect >= 8 ? 'Amazing memory! 🌟' : reviewCorrect >= 5 ? 'Good job! Keep practicing! 💪' : "Don't worry, practice makes perfect! 🌱"}</div>
      <button class="btn btn-blue" id="btn-home" style="margin-top:20px">🏠 Home</button>
    </div>
  `
  const bc = document.getElementById('review-buddy')!
  bc.appendChild(createBuddySVG())
  setBuddyState('celebrating')

  await speak(`You remembered ${reviewCorrect} out of ${reviewWords.length}!`)
  doCheckBadges()

  document.getElementById('btn-home')!.onclick = () => showHome()
}

// ===== COLLECTION SCREEN =====
function showCollection() {
  const earned = loadEarnedBadges(currentProfile!.id)

  let badgeHTML = ''
  BADGES.forEach(b => {
    const isEarned = earned.includes(b.id)
    badgeHTML += `
      <div class="badge-card ${isEarned ? 'badge-earned' : 'badge-locked'}">
        <div class="badge-card-emoji">${isEarned ? b.emoji : '❓'}</div>
        <div class="badge-card-name">${isEarned ? b.name : '???'}</div>
        <div class="badge-card-hint">${isEarned ? '' : b.hint}</div>
      </div>
    `
  })

  app.innerHTML = `
    <div class="screen active" id="screen-collection">
      <div class="welcome-title">🎖️ My Stickers</div>
      <div class="welcome-sub">${earned.length}/${BADGES.length} collected</div>
      <div class="badge-grid">${badgeHTML}</div>
      <button class="btn btn-blue" id="btn-back" style="margin-top:20px">← Back</button>
    </div>
  `
  document.getElementById('btn-back')!.onclick = () => showHome()
}

// ===== GAMES MENU =====
function showGamesMenu() {
  app.innerHTML = `
    <div class="screen active" id="screen-games">
      <div class="welcome-title">🎮 Games</div>
      <div class="welcome-sub">Pick a game to play!</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
        <div class="profile-card" id="game-memory">
          <div class="profile-avatar">🃏</div>
          <div class="profile-name">Memory Match</div>
        </div>
        <div class="profile-card" id="game-bubbles">
          <div class="profile-avatar">🫧</div>
          <div class="profile-name">Bubble Pop</div>
        </div>
      </div>
      <button class="btn btn-blue" id="btn-back" style="margin-top:20px">← Back</button>
    </div>
  `
  document.getElementById('game-memory')!.onclick = () => showTopicPicker('memory')
  document.getElementById('game-bubbles')!.onclick = () => showTopicPicker('bubbles')
  document.getElementById('btn-back')!.onclick = () => showHome()
}

function showTopicPicker(game: string) {
  app.innerHTML = `
    <div class="screen active" id="screen-topic-pick">
      <div class="welcome-title">Pick a topic</div>
      <div class="topics-grid" id="tp-grid"></div>
      <button class="btn btn-blue" id="btn-back" style="margin-top:20px">← Back</button>
    </div>
  `
  const grid = document.getElementById('tp-grid')!
  TOPICS.forEach(t => {
    const b = $(`<div class="topic-bubble"><div class="topic-emoji">${t.emoji}</div><div class="topic-name">${t.name}</div></div>`)
    b.onclick = () => {
      if (game === 'memory') startMemoryGame(t)
      else startBubbleGame(t)
    }
    grid.appendChild(b)
  })
  document.getElementById('btn-back')!.onclick = () => showGamesMenu()
}

// ===== MEMORY MATCH GAME =====
function startMemoryGame(topic: Topic) {
  currentTopic = topic
  const words = shuffle(topic.words).slice(0, 6)
  const cards: { id: number, content: string, word: string, type: 'emoji' | 'text' }[] = []
  let id = 0
  words.forEach(w => {
    cards.push({ id: id++, content: w.emoji, word: w.word, type: 'emoji' })
    cards.push({ id: id++, content: w.word, word: w.word, type: 'text' })
  })
  const shuffled = shuffle(cards)

  let flipped: number[] = []
  let matched: Set<string> = new Set()
  let locked = false

  app.innerHTML = `
    <div class="screen active" id="screen-memory">
      <div class="welcome-title">🃏 Memory Match</div>
      <div class="memory-grid" id="mem-grid"></div>
      <button class="btn btn-blue" id="btn-back" style="margin-top:20px">← Back</button>
    </div>
  `
  const grid = document.getElementById('mem-grid')!

  shuffled.forEach((c, idx) => {
    const card = $(`<div class="memory-card" data-idx="${idx}">❓</div>`)
    card.onclick = () => {
      if (locked || flipped.includes(idx) || matched.has(c.word + c.type)) return
      card.classList.add('flipped')
      card.textContent = c.content
      flipped.push(idx)

      if (flipped.length === 2) {
        locked = true
        const [i1, i2] = flipped
        const c1 = shuffled[i1], c2 = shuffled[i2]
        if (c1.word === c2.word && c1.type !== c2.type) {
          setTimeout(() => {
            const cards = grid.querySelectorAll('.memory-card')
            cards[i1].classList.add('matched')
            cards[i2].classList.add('matched')
            matched.add(c1.word + c1.type)
            matched.add(c2.word + c2.type)
            burstStars(window.innerWidth / 2, window.innerHeight / 2, 4)
            addStars(1)
            flipped = []
            locked = false
            if (matched.size === shuffled.length) {
              burstConfetti()
              gameStats.memoryWins++
              saveGameStats(currentProfile!.id, gameStats)
              speak('You matched them all! Amazing!')
              doCheckBadges()
              setTimeout(() => showHome(), 2000)
            }
          }, 300)
        } else {
          setTimeout(() => {
            const cards = grid.querySelectorAll('.memory-card')
            cards[i1].classList.remove('flipped');
            (cards[i1] as HTMLElement).textContent = '❓'
            cards[i2].classList.remove('flipped');
            (cards[i2] as HTMLElement).textContent = '❓'
            flipped = []
            locked = false
          }, 800)
        }
      }
    }
    grid.appendChild(card)
  })

  document.getElementById('btn-back')!.onclick = () => showGamesMenu()
}

// ===== BUBBLE POP GAME =====
function startBubbleGame(topic: Topic) {
  currentTopic = topic
  const words = shuffle(topic.words).slice(0, 6)
  let targetIdx = 0

  app.innerHTML = `
    <div class="screen active" id="screen-bubbles">
      <div class="buddy-says" id="bubble-prompt" style="margin-bottom:10px">Tap the bubble!</div>
      <div class="bubbles-area" id="bubble-area"></div>
      <button class="btn btn-blue" id="btn-back" style="margin-top:10px">← Back</button>
    </div>
  `

  function renderBubbles() {
    if (targetIdx >= words.length) {
      burstConfetti()
      gameStats.bubbleWins++
      saveGameStats(currentProfile!.id, gameStats)
      speak('You popped them all! Great job!')
      doCheckBadges()
      setTimeout(() => showHome(), 2000)
      return
    }
    const target = words[targetIdx]
    const prompt = document.getElementById('bubble-prompt')!
    prompt.textContent = `Tap: "${target.word}" ${target.emoji}`
    speak(`Tap ${target.word}`)

    const area = document.getElementById('bubble-area')!
    area.innerHTML = ''
    const displayWords = shuffle(words)
    displayWords.forEach((w, i) => {
      const x = 20 + (i % 3) * 35 + Math.random() * 10
      const y = 10 + Math.floor(i / 3) * 45 + Math.random() * 10
      const bubble = $(`<div class="bubble" style="left:${x}%;top:${y}%">${w.emoji}<br><span style="font-size:0.7rem">${w.word}</span></div>`)
      bubble.style.animationDelay = `${Math.random() * 2}s`
      bubble.onclick = async () => {
        if (w.word === target.word) {
          bubble.classList.add('popped')
          burstStars(bubble.getBoundingClientRect().left + 45, bubble.getBoundingClientRect().top + 45, 4)
          addStars(1)
          await delay(400)
          targetIdx++
          renderBubbles()
        } else {
          bubble.style.transform = 'scale(0.8)'
          setTimeout(() => bubble.style.transform = '', 200)
          speak(`That's ${w.word}. Find ${target.word}!`)
        }
      }
      area.appendChild(bubble)
    })
  }

  renderBubbles()
  document.getElementById('btn-back')!.onclick = () => showGamesMenu()
}

// ===== PROGRESS SCREEN =====
function showProgress() {
  let topicRows = ''
  TOPICS.forEach(t => {
    const tp = progress.topicProgress[t.id]
    const learned = tp ? tp.wordsLearned.length : 0
    const total = t.words.length
    const stars = tp ? tp.starsEarned : 0
    topicRows += `
      <div class="progress-stat">
        <span>${t.emoji} ${t.name}</span>
        <span class="progress-value">${learned}/${total} words · ⭐${stars}</span>
      </div>
    `
  })

  const dueCount = getWordsDueForReview(srData).length
  const totalLearned = getAllLearnedWords(srData).length

  app.innerHTML = `
    <div class="screen active" id="screen-progress">
      <div class="welcome-title">📊 ${currentProfile!.name}'s Progress</div>
      <div class="big-stars">⭐ ${progress.stars}</div>
      <div class="progress-card">
        <div class="progress-stat">
          <span>🔥 Streak</span>
          <span class="progress-value">${progress.streak} days</span>
        </div>
        <div class="progress-stat">
          <span>🧠 Words learned (SR)</span>
          <span class="progress-value">${totalLearned}</span>
        </div>
        <div class="progress-stat">
          <span>📖 Due for review</span>
          <span class="progress-value">${dueCount}</span>
        </div>
        ${topicRows}
      </div>
      <button class="btn btn-blue" id="btn-back" style="margin-top:20px">← Back</button>
    </div>
  `
  document.getElementById('btn-back')!.onclick = () => showHome()
}
