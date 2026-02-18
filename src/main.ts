import { TOPICS, PROFILES, Profile, Topic, WordItem, loadProgress, saveProgress, ProfileProgress } from './data'
import { createBuddySVG, setBuddyState } from './buddy-svg'
import { speak, listen, hasSpeechRecognition } from './speech'
import { initParticles, burstConfetti, burstStars } from './particles'

// ===== APP STATE =====
let currentProfile: Profile | null = null
let progress: ProfileProgress = { stars: 0, streak: 0, lastPlayed: '', topicProgress: {} }
let currentTopic: Topic | null = null
let lessonWords: WordItem[] = []
let lessonIndex = 0
let lessonStars = 0

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

function showScreen(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  setTimeout(() => {
    const el = document.getElementById(id)
    if (el) el.classList.add('active')
  }, 50)
}

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
  if (!tp.wordsLearned.includes(word)) tp.wordsLearned.push(word)
  progress.topicProgress[currentTopic.id] = tp
  saveProgress(currentProfile.id, progress)
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
  // Update streak
  const today = new Date().toDateString()
  if (progress.lastPlayed !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    progress.streak = progress.lastPlayed === yesterday ? progress.streak + 1 : 1
    progress.lastPlayed = today
    saveProgress(p.id, progress)
  }
  showHome()
}

// ===== SCREEN: HOME =====
function showHome() {
  const p = currentProfile!
  app.innerHTML = `
    <div class="screen active" id="screen-home">
      <div class="home-header">
        <div class="home-greeting">${p.greeting}</div>
        <div class="home-sub">⭐ ${progress.stars} stars · 🔥 ${progress.streak} day streak</div>
      </div>
      <div class="buddy-container" id="home-buddy"></div>
      <div class="topics-grid" id="topics-grid"></div>
      <div class="home-bottom">
        <button class="btn btn-green" id="btn-games">🎮 Games</button>
        <button class="btn btn-purple" id="btn-progress">📊 Progress</button>
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

  // Buddy greets
  speak(p.greeting)
  setBuddyState('talking')
  setTimeout(() => setBuddyState('idle'), 3000)
}

// ===== SCREEN: LESSON =====
function startLesson(topic: Topic) {
  currentTopic = topic
  const tp = progress.topicProgress[topic.id]
  const learned = tp ? tp.wordsLearned : []
  // Pick 5 words: prioritize unlearned
  const unlearned = topic.words.filter(w => !learned.includes(w.word))
  const review = topic.words.filter(w => learned.includes(w.word))
  const pool = [...shuffle(unlearned).slice(0, 4), ...shuffle(review).slice(0, 1)]
  lessonWords = shuffle(pool.length > 0 ? pool : shuffle(topic.words).slice(0, 5))
  lessonIndex = 0
  lessonStars = 0
  showLessonWarmup()
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
  document.getElementById('lesson-back')!.onclick = () => showHome()
  // Insert buddy if placeholder exists
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
  renderLessonShell(`
    <div class="buddy-container" id="lesson-buddy"></div>
    <div class="flashcard">
      <div class="flashcard-emoji">${word.emoji}</div>
      <div class="flashcard-word">${word.word}</div>
    </div>
    <div class="buddy-says" id="buddy-msg">This is "${word.word}"! Can you say it?</div>
    ${hasSpeechRecognition()
      ? `<button class="mic-btn" id="mic-btn">🎤</button>`
      : `<button class="btn btn-green" id="tap-btn">I said it! ✓</button>`
    }
  `, pct)

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

async function celebrateCorrect(word: WordItem) {
  setBuddyState('celebrating')
  burstConfetti()
  addStars(1)
  markWordLearned(word.word)

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

// ===== PRACTICE ROUND (Point to the word) =====
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
  // Get 3 distractors
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
        setBuddyState('celebrating')
        await speak('Yes!')
        await delay(600)
        practiceIndex++
        showPracticeQuestion()
      } else {
        card.classList.add('wrong')
        setBuddyState('encouraging')
        await speak(`That's ${opt.word}. Try again!`)
        setBuddyState('idle')
        setTimeout(() => card.classList.remove('wrong'), 400)
      }
    }
    choicesEl.appendChild(card)
  })
}

// ===== QUIZ (What is this?) =====
let quizIndex = 0

function showQuiz() {
  quizIndex = 0
  showQuizQuestion()
}

async function showQuizQuestion() {
  if (quizIndex >= lessonWords.length) {
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
    // Tap quiz buttons
    document.querySelectorAll('.quiz-option').forEach(el => {
      (el as HTMLElement).onclick = async () => {
        const w = (el as HTMLElement).dataset.word!
        if (w === word.word) {
          (el as HTMLElement).classList.add('correct')
          await celebrateQuiz(word)
        } else {
          (el as HTMLElement).classList.add('wrong')
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
  const buddyMsg = document.getElementById('buddy-msg')
  if (buddyMsg) buddyMsg.textContent = `Yes! It's ${word.word}! 🎉`
  await speak(`Yes! It's ${word.word}!`)
  await delay(600)
  quizIndex++
  showQuizQuestion()
}

async function retryQuiz(word: WordItem, heard: string) {
  setBuddyState('encouraging')
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

  app.innerHTML = `
    <div class="screen active" id="screen-complete">
      <div class="buddy-container" id="lesson-buddy"></div>
      <div class="welcome-title">🎉 Lesson Complete!</div>
      <div style="font-size:3rem;margin:10px 0">${'⭐'.repeat(Math.min(lessonStars, 10))}</div>
      <div class="buddy-says">You earned ${lessonStars} stars! Amazing work, ${currentProfile!.name}!</div>
      <div style="display:flex;gap:12px;margin-top:20px">
        <button class="btn btn-blue" id="btn-home">🏠 Home</button>
        <button class="btn btn-green" id="btn-next">Next Lesson ▶</button>
      </div>
    </div>
  `
  const bc = document.getElementById('lesson-buddy')
  if (bc) { bc.appendChild(createBuddySVG()); setBuddyState('celebrating') }

  await speak(`You earned ${lessonStars} stars! Amazing work, ${currentProfile!.name}!`)

  document.getElementById('btn-home')!.onclick = () => showHome()
  document.getElementById('btn-next')!.onclick = () => startLesson(currentTopic!)
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
  const words = shuffle(topic.words).slice(0, 6)
  // Create pairs: word card + emoji card
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
      // Flip
      card.classList.add('flipped')
      card.textContent = c.content
      flipped.push(idx)

      if (flipped.length === 2) {
        locked = true
        const [i1, i2] = flipped
        const c1 = shuffled[i1], c2 = shuffled[i2]
        if (c1.word === c2.word && c1.type !== c2.type) {
          // Match!
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
              speak('You matched them all! Amazing!')
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
      speak('You popped them all! Great job!')
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

  app.innerHTML = `
    <div class="screen active" id="screen-progress">
      <div class="welcome-title">📊 ${currentProfile!.name}'s Progress</div>
      <div class="big-stars">⭐ ${progress.stars}</div>
      <div class="progress-card">
        <div class="progress-stat">
          <span>🔥 Streak</span>
          <span class="progress-value">${progress.streak} days</span>
        </div>
        ${topicRows}
      </div>
      <button class="btn btn-blue" id="btn-back" style="margin-top:20px">← Back</button>
    </div>
  `
  document.getElementById('btn-back')!.onclick = () => showHome()
}
