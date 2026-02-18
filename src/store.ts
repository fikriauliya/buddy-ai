// ===== STATE MANAGEMENT WITH EFFECT TS =====
import * as Effect from "effect/Effect";
import * as Ref from "effect/Ref";
import type { Profile, Topic, Word } from "./data";

export interface ProgressData {
  wordsLearned: Record<string, string[]>; // topicId -> word[]
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  streak: number;
  lastPlayed: string;
}

export interface AppState {
  screen: "profiles" | "home" | "topics" | "lesson" | "game" | "progress";
  profile: Profile | null;
  currentTopic: Topic | null;
  currentWordIndex: number;
  gameWords: Word[];
  gameCorrectWord: Word | null;
  gameScore: number;
  progress: Record<string, ProgressData>; // profileId -> data
}

const STORAGE_KEY = "buddy-ai-progress";

function loadProgress(): Record<string, ProgressData> {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : {};
  } catch { return {}; }
}

function saveProgress(p: Record<string, ProgressData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

const initialState: AppState = {
  screen: "profiles",
  profile: null,
  currentTopic: null,
  currentWordIndex: 0,
  gameWords: [],
  gameCorrectWord: null,
  gameScore: 0,
  progress: loadProgress(),
};

// Effect Ref for state
let stateRef: Ref.Ref<AppState>;
let listeners: Array<(s: AppState) => void> = [];

export const initStore = Effect.gen(function* () {
  stateRef = yield* Ref.make(initialState);
  return stateRef;
});

export function subscribe(fn: (s: AppState) => void) {
  listeners.push(fn);
}

export const getState = Effect.gen(function* () {
  return yield* Ref.get(stateRef);
});

export function updateState(fn: (s: AppState) => AppState) {
  return Effect.gen(function* () {
    yield* Ref.update(stateRef, fn);
    const s = yield* Ref.get(stateRef);
    // Persist progress
    saveProgress(s.progress);
    // Notify
    listeners.forEach(l => l(s));
    return s;
  });
}

export function getProgress(state: AppState, profileId: string): ProgressData {
  return state.progress[profileId] || {
    wordsLearned: {},
    gamesPlayed: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    lastPlayed: "",
  };
}

export function markWordLearned(profileId: string, topicId: string, word: string) {
  return updateState(s => {
    const p = { ...getProgress(s, profileId) };
    const topicWords = new Set(p.wordsLearned[topicId] || []);
    topicWords.add(word);
    p.wordsLearned = { ...p.wordsLearned, [topicId]: [...topicWords] };
    p.lastPlayed = new Date().toISOString();
    return { ...s, progress: { ...s.progress, [profileId]: p } };
  });
}

export function recordGameAnswer(profileId: string, correct: boolean) {
  return updateState(s => {
    const p = { ...getProgress(s, profileId) };
    p.totalAnswers++;
    if (correct) { p.correctAnswers++; p.streak++; }
    else { p.streak = 0; }
    p.lastPlayed = new Date().toISOString();
    return { ...s, progress: { ...s.progress, [profileId]: p } };
  });
}

export function recordGamePlayed(profileId: string) {
  return updateState(s => {
    const p = { ...getProgress(s, profileId) };
    p.gamesPlayed++;
    return { ...s, progress: { ...s.progress, [profileId]: p } };
  });
}

// Run an effect synchronously (since all our effects are sync)
export function run<A>(effect: Effect.Effect<A>): A {
  return Effect.runSync(effect);
}
