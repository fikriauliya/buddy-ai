// ===== STORYTELLING WRAPPER =====

export interface TopicStory {
  intro: string
  transitions: string[]
  conclusion: string
}

export const TOPIC_STORIES: Record<string, TopicStory> = {
  animals: {
    intro: "Buddy is visiting the zoo! Help him learn the names of all the animals he meets.",
    transitions: [
      "Great! Now Buddy walks to the next area of the zoo and sees a...",
      "Wow! Buddy is so excited! He runs to the next cage and finds a...",
      "Amazing! Buddy hears a sound nearby. He looks over and spots a...",
      "Buddy claps his hands! Let's keep exploring. Next he sees a...",
      "The zookeeper waves at Buddy. Look, over there is a..."
    ],
    conclusion: "Buddy visited all the animals at the zoo! What an amazing adventure! 🦁🐘🐵"
  },
  colors: {
    intro: "Buddy is painting a picture! Help him find all the colors he needs.",
    transitions: [
      "Beautiful! Buddy dips his brush and picks up a new color...",
      "What a masterpiece! Now Buddy needs another color...",
      "Buddy's painting is looking amazing! The next color is...",
      "Splash! Buddy adds more color. Now he reaches for...",
      "Almost done! Buddy needs one more color..."
    ],
    conclusion: "Buddy finished his painting! It's the most colorful picture ever! 🎨🖼️✨"
  },
  numbers: {
    intro: "Buddy is counting treasures in a magical cave! Help him count them all.",
    transitions: [
      "Buddy found more treasure! Let's keep counting...",
      "The cave sparkles with gems! Buddy counts the next one...",
      "Amazing! Buddy digs deeper and finds more to count...",
      "Buddy's treasure bag is getting full! Next number is...",
      "The magical cave glows brighter! Buddy counts..."
    ],
    conclusion: "Buddy counted all the treasures in the magical cave! He's a counting champion! 💎🏆✨"
  },
  food: {
    intro: "Buddy is cooking a big dinner! Help him learn the names of all the ingredients.",
    transitions: [
      "Yummy! Buddy stirs the pot and grabs the next ingredient...",
      "The kitchen smells delicious! Buddy reaches for...",
      "Buddy puts on his chef hat. The next ingredient is...",
      "Almost ready! Buddy needs one more thing...",
      "Buddy checks the recipe. Next he needs..."
    ],
    conclusion: "Buddy cooked an amazing dinner! Everything looks so delicious! 👨‍🍳🍽️⭐"
  },
  body: {
    intro: "Buddy is building a robot friend! Help him learn the parts he needs.",
    transitions: [
      "Great work! Buddy attaches the next part to his robot...",
      "The robot is taking shape! Now Buddy adds the...",
      "Buddy uses his tools carefully. The next part is...",
      "Almost done building! Buddy picks up the...",
      "The robot friend is looking great! Next part is..."
    ],
    conclusion: "Buddy built his robot friend! They high-five and dance together! 🤖🎉💃"
  },
  alphabet: {
    intro: "Buddy is reading a magical book! Each page has a special letter. Let's discover them all!",
    transitions: [
      "Buddy turns the page and finds a new letter!",
      "What letter is on the next page? Let's see!",
      "The magical book glows! Another letter appears...",
      "Buddy is so excited! He flips to the next letter...",
      "The book sparkles! Here comes another letter..."
    ],
    conclusion: "Buddy read the whole magical book! He knows all his ABCs now! 🔤📖✨"
  },
  shapes: {
    intro: "Buddy is exploring a shape world! Everything here has a special shape. Can you help him name them?",
    transitions: [
      "Buddy walks further into shape world and spots a new shape!",
      "Look! Another shape is floating in the sky!",
      "Buddy picks up something interesting. What shape is it?",
      "The shape world is full of surprises! Here's another one...",
      "Can you find shapes like this around you? Here's the next one..."
    ],
    conclusion: "Buddy explored the whole shape world! He can spot shapes everywhere now! 🔷⭐🔺"
  },
  math: {
    intro: "Buddy found a treasure chest! Help him count the gems inside. Let's do some math!",
    transitions: [
      "Buddy reaches into the chest and pulls out more gems!",
      "The treasure chest glows! More gems appear...",
      "Buddy loves counting! Let's try another one...",
      "How many gems does Buddy have now? Let's count!",
      "The magical chest has more surprises inside..."
    ],
    conclusion: "Buddy counted all the treasures! He's a real math wizard! 🧮💎🏆"
  }
}

export function getTransition(topicId: string, index: number): string {
  const story = TOPIC_STORIES[topicId]
  if (!story) return ""
  return story.transitions[index % story.transitions.length]
}
