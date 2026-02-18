// ===== SPEECH SERVICES =====

export function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) { resolve(); return }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.85
    utter.pitch = 1.2
    // Try to get an English voice
    const voices = window.speechSynthesis.getVoices()
    const eng = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
      || voices.find(v => v.lang.startsWith('en'))
    if (eng) utter.voice = eng
    utter.onend = () => resolve()
    utter.onerror = () => resolve()
    window.speechSynthesis.speak(utter)
    // Safety timeout
    setTimeout(resolve, 5000)
  })
}

export function listen(): Promise<string> {
  return new Promise((resolve) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { resolve(''); return }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 3
    rec.onresult = (e: any) => {
      const results: string[] = []
      for (let i = 0; i < e.results[0].length; i++) {
        results.push(e.results[0][i].transcript.toLowerCase().trim())
      }
      resolve(results[0] || '')
    }
    rec.onerror = () => resolve('')
    rec.onend = () => {} // resolve handled by onresult or onerror
    rec.start()
    setTimeout(() => { try { rec.stop() } catch {} resolve('') }, 5000)
  })
}

export function hasSpeechRecognition(): boolean {
  return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
}

// Preload voices
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}
