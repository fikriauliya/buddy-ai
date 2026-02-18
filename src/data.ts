// ===== TOPIC & WORD DATA =====

export interface Word {
  word: string;
  emoji: string;
  hint?: string; // e.g. Indonesian translation
}

export interface Topic {
  id: string;
  name: string;
  emoji: string;
  color: string;
  words: Word[];
}

export const TOPICS: Topic[] = [
  {
    id: "animals", name: "Animals", emoji: "🐾", color: "#FF8A65",
    words: [
      { word: "Cat", emoji: "🐱", hint: "Kucing" },
      { word: "Dog", emoji: "🐶", hint: "Anjing" },
      { word: "Bird", emoji: "🐦", hint: "Burung" },
      { word: "Fish", emoji: "🐟", hint: "Ikan" },
      { word: "Lion", emoji: "🦁", hint: "Singa" },
      { word: "Elephant", emoji: "🐘", hint: "Gajah" },
      { word: "Monkey", emoji: "🐵", hint: "Monyet" },
      { word: "Rabbit", emoji: "🐰", hint: "Kelinci" },
      { word: "Bear", emoji: "🐻", hint: "Beruang" },
      { word: "Horse", emoji: "🐴", hint: "Kuda" },
      { word: "Cow", emoji: "🐮", hint: "Sapi" },
      { word: "Chicken", emoji: "🐔", hint: "Ayam" },
      { word: "Duck", emoji: "🦆", hint: "Bebek" },
      { word: "Frog", emoji: "🐸", hint: "Katak" },
      { word: "Butterfly", emoji: "🦋", hint: "Kupu-kupu" },
    ]
  },
  {
    id: "colors", name: "Colors", emoji: "🎨", color: "#AB47BC",
    words: [
      { word: "Red", emoji: "🔴", hint: "Merah" },
      { word: "Blue", emoji: "🔵", hint: "Biru" },
      { word: "Green", emoji: "🟢", hint: "Hijau" },
      { word: "Yellow", emoji: "🟡", hint: "Kuning" },
      { word: "Orange", emoji: "🟠", hint: "Oranye" },
      { word: "Purple", emoji: "🟣", hint: "Ungu" },
      { word: "Pink", emoji: "🩷", hint: "Merah muda" },
      { word: "White", emoji: "⚪", hint: "Putih" },
      { word: "Black", emoji: "⚫", hint: "Hitam" },
      { word: "Brown", emoji: "🟤", hint: "Coklat" },
    ]
  },
  {
    id: "numbers", name: "Numbers", emoji: "🔢", color: "#42A5F5",
    words: [
      { word: "One", emoji: "1️⃣", hint: "Satu" },
      { word: "Two", emoji: "2️⃣", hint: "Dua" },
      { word: "Three", emoji: "3️⃣", hint: "Tiga" },
      { word: "Four", emoji: "4️⃣", hint: "Empat" },
      { word: "Five", emoji: "5️⃣", hint: "Lima" },
      { word: "Six", emoji: "6️⃣", hint: "Enam" },
      { word: "Seven", emoji: "7️⃣", hint: "Tujuh" },
      { word: "Eight", emoji: "8️⃣", hint: "Delapan" },
      { word: "Nine", emoji: "9️⃣", hint: "Sembilan" },
      { word: "Ten", emoji: "🔟", hint: "Sepuluh" },
    ]
  },
  {
    id: "food", name: "Food", emoji: "🍎", color: "#66BB6A",
    words: [
      { word: "Apple", emoji: "🍎", hint: "Apel" },
      { word: "Banana", emoji: "🍌", hint: "Pisang" },
      { word: "Rice", emoji: "🍚", hint: "Nasi" },
      { word: "Bread", emoji: "🍞", hint: "Roti" },
      { word: "Milk", emoji: "🥛", hint: "Susu" },
      { word: "Egg", emoji: "🥚", hint: "Telur" },
      { word: "Water", emoji: "💧", hint: "Air" },
      { word: "Cake", emoji: "🎂", hint: "Kue" },
      { word: "Ice Cream", emoji: "🍦", hint: "Es krim" },
      { word: "Orange", emoji: "🍊", hint: "Jeruk" },
      { word: "Grape", emoji: "🍇", hint: "Anggur" },
      { word: "Chicken", emoji: "🍗", hint: "Ayam" },
    ]
  },
  {
    id: "body", name: "Body", emoji: "🫀", color: "#EF5350",
    words: [
      { word: "Head", emoji: "🗣️", hint: "Kepala" },
      { word: "Eye", emoji: "👁️", hint: "Mata" },
      { word: "Ear", emoji: "👂", hint: "Telinga" },
      { word: "Nose", emoji: "👃", hint: "Hidung" },
      { word: "Mouth", emoji: "👄", hint: "Mulut" },
      { word: "Hand", emoji: "🤚", hint: "Tangan" },
      { word: "Foot", emoji: "🦶", hint: "Kaki" },
      { word: "Finger", emoji: "☝️", hint: "Jari" },
      { word: "Hair", emoji: "💇", hint: "Rambut" },
      { word: "Teeth", emoji: "🦷", hint: "Gigi" },
    ]
  }
];

export interface Profile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  color: string;
}

export const PROFILES: Profile[] = [
  { id: "yusuf", name: "Yusuf", age: 10, avatar: "🧑", color: "#42A5F5" },
  { id: "ibrahim", name: "Ibrahim", age: 7, avatar: "👦", color: "#66BB6A" },
  { id: "fatih", name: "Fatih", age: 2, avatar: "👶", color: "#FFA726" },
];
