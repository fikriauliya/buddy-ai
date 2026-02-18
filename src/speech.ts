// ===== SPEECH (TTS + Recognition) =====

export function speak(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    u.pitch = 1.1;
    // Try to pick a nice voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Samantha")) 
      || voices.find(v => v.lang === "en-US" && v.name.includes("Female"))
      || voices.find(v => v.lang.startsWith("en"));
    if (preferred) u.voice = preferred;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export interface ListenResult {
  transcript: string;
  confidence: number;
}

export function listen(timeoutMs = 5000): Promise<ListenResult | null> {
  return new Promise((resolve) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { resolve(null); return; }
    
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    let resolved = false;

    const timer = setTimeout(() => {
      if (!resolved) { resolved = true; rec.stop(); resolve(null); }
    }, timeoutMs);

    rec.onresult = (e: any) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      const result = e.results[0][0];
      resolve({ transcript: result.transcript, confidence: result.confidence });
    };

    rec.onerror = () => {
      if (!resolved) { resolved = true; clearTimeout(timer); resolve(null); }
    };
    rec.onend = () => {
      if (!resolved) { resolved = true; clearTimeout(timer); resolve(null); }
    };

    rec.start();
  });
}

export function matchWord(transcript: string, target: string): boolean {
  const t = transcript.toLowerCase().trim();
  const w = target.toLowerCase().trim();
  // Direct match or contains
  if (t === w || t.includes(w) || w.includes(t)) return true;
  // Levenshtein-ish: allow 1-2 char diff for short words
  if (w.length <= 4 && levenshtein(t, w) <= 1) return true;
  if (w.length > 4 && levenshtein(t, w) <= 2) return true;
  return false;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return d[m][n];
}
