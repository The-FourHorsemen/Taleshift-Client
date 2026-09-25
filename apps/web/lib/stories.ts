/**
 * Owner: unassigned.
 * TODO: replace this in-memory catalog with the real `stories` table
 * (packages/db/src/schema.ts) once Supabase is connected — this file
 * exists purely so the Reading Library UI has real, leveled content
 * to filter, preview, and assign against.
 */

export interface Story {
  id: string;
  title: string;
  level: number; // 1 (easiest) - 10 (hardest)
  genre: "Adventure" | "Fantasy" | "Science" | "Mystery" | "Animals" | "Friendship";
  vocabFocus: string;
  durationMinutes: number;
  coverEmoji: string;
  coverFrom: string;
  coverTo: string;
  summary: string;
  paragraphs: string[];
}

export const STORIES: Story[] = [
  {
    id: "the-lost-mitten",
    title: "The Lost Mitten",
    level: 1,
    genre: "Animals",
    vocabFocus: "Sight words",
    durationMinutes: 4,
    coverEmoji: "🧤",
    coverFrom: "#adc6ff",
    coverTo: "#6cf8bb",
    summary: "A little rabbit loses her mitten in the snow and asks her forest friends for help finding it.",
    paragraphs: [
      "Ruby the rabbit hopped through the snow. She had one red mitten on her paw. The other one was gone!",
      "\"Have you seen my mitten?\" Ruby asked the squirrel. The squirrel shook his head. \"Not me,\" he said.",
      "Ruby asked the owl. She asked the fox. No one had seen her mitten.",
      "Then Ruby saw something red under a bush. It was her mitten! A little mouse was using it as a warm bed.",
      "\"You can keep it,\" Ruby said with a smile. \"I have another one at home.\" The mouse squeaked a happy thank you.",
    ],
  },
  {
    id: "buzzy-the-bee",
    title: "Buzzy the Bee Learns to Share",
    level: 2,
    genre: "Animals",
    vocabFocus: "Emotion words",
    durationMinutes: 5,
    coverEmoji: "🐝",
    coverFrom: "#ffe08a",
    coverTo: "#ffb37a",
    summary: "Buzzy the bee wants all the flowers for herself, until she learns that sharing makes the whole hive happy.",
    paragraphs: [
      "Buzzy the bee loved flowers. She flew to the biggest flower in the garden and buzzed happily around it.",
      "\"This one is mine!\" she said to the other bees. The other bees looked sad. There were no more big flowers left.",
      "That night, Buzzy's honey jar was only a little full. The other bees' jars were empty too.",
      "\"If we share the flowers, we will all have honey,\" said the oldest bee. Buzzy thought about it.",
      "The next day, Buzzy showed the other bees her favorite flower. They all buzzed together, and every jar was full and golden by sunset.",
    ],
  },
  {
    id: "the-secret-garden-gate",
    title: "The Secret Garden Gate",
    level: 3,
    genre: "Adventure",
    vocabFocus: "Nature vocabulary",
    durationMinutes: 7,
    coverEmoji: "🌷",
    coverFrom: "#6cf8bb",
    coverTo: "#2170e4",
    summary: "Mia discovers a hidden gate behind her grandmother's house that leads to a garden no one has visited in years.",
    paragraphs: [
      "Behind Grandma's house, ivy covered an old stone wall. Mia noticed a small brass handle poking out from the leaves.",
      "She pulled the ivy back and found a gate, rusty and forgotten. It creaked open with a gentle push.",
      "Inside was a garden bursting with wildflowers, buzzing bees, and a stone path leading to a little pond.",
      "Mia knelt beside the pond and watched tiny fish dart between the lily pads. She had never seen anything so peaceful.",
      "She decided this would be her secret spot. Every weekend, she would visit and watch the garden slowly come back to life.",
    ],
  },
  {
    id: "the-lost-explorer",
    title: "The Lost Explorer",
    level: 4,
    genre: "Adventure",
    vocabFocus: "Descriptive adjectives",
    durationMinutes: 10,
    coverEmoji: "🧭",
    coverFrom: "#adc6ff",
    coverTo: "#0058be",
    summary: "Amelia follows an ancient map deep into the jungle, uncovering mysterious plants and strange shadows along the way.",
    paragraphs: [
      "The ancient map led them deep into the heart of the jungle. Everywhere they looked, there were strange plants and mysterious shadows dancing across the path.",
      "Amelia held her compass tight, hoping it would point the way home before the sun disappeared below the dense canopy.",
      "A troop of monkeys chattered overhead, watching the two explorers with curious eyes. Amelia smiled and waved, but kept moving forward.",
      "Just as the light began to fade, they spotted it: a crumbling stone archway, half-swallowed by vines, marking the entrance they had been searching for all day.",
      "\"We found it,\" Amelia whispered, stepping through the archway into the unknown.",
    ],
  },
  {
    id: "volcano-explorer",
    title: "Volcano Explorer",
    level: 5,
    genre: "Science",
    vocabFocus: "Science vocabulary",
    durationMinutes: 9,
    coverEmoji: "🌋",
    coverFrom: "#ffb37a",
    coverTo: "#ff8a65",
    summary: "A young scientist studies an active volcano to understand how magma, ash, and pressure shape the earth.",
    paragraphs: [
      "Dr. Reyes adjusted her thick gloves and stepped closer to the rim of the volcano. Heat rippled up from deep inside the earth.",
      "\"Magma is melted rock,\" she explained to her assistant, \"and right now, there's a huge amount of pressure building beneath us.\"",
      "A low rumble shook the ground. Ash drifted into the sky like grey snow, coating the volcanic rock in a fine powder.",
      "She lowered a temperature probe into a crack in the rock. The reading climbed higher and higher, confirming her theory.",
      "\"This volcano is very much alive,\" she said, carefully backing away. \"And it still has secrets to teach us.\"",
    ],
  },
  {
    id: "deep-sea-mystery",
    title: "Deep Sea Mystery",
    level: 5,
    genre: "Mystery",
    vocabFocus: "Ocean vocabulary",
    durationMinutes: 8,
    coverEmoji: "🐠",
    coverFrom: "#7ecbff",
    coverTo: "#2170e4",
    summary: "A submarine crew discovers strange glowing lights at the bottom of the ocean and must figure out what's causing them.",
    paragraphs: [
      "The submarine's lights flickered as it descended past a thousand meters. Outside the window, the ocean turned pitch black.",
      "\"There,\" said Captain Lin, pointing at a cluster of blue-green lights pulsing in the darkness. \"Those weren't on our last map.\"",
      "As they drifted closer, they realized the lights belonged to thousands of tiny jellyfish, glowing together in perfect rhythm.",
      "\"It's called bioluminescence,\" the marine biologist explained. \"They make their own light to talk to each other.\"",
      "The crew watched in silence as the glowing cloud drifted past the window, lighting up the dark water like a slow-moving galaxy.",
    ],
  },
  {
    id: "mars-mission-base-camp",
    title: "Mars Mission: Base Camp",
    level: 7,
    genre: "Science",
    vocabFocus: "Space vocabulary",
    durationMinutes: 11,
    coverEmoji: "🚀",
    coverFrom: "#6b4bd6",
    coverTo: "#d6336c",
    summary: "The first team of astronauts to land on Mars must build a base camp before a dust storm arrives.",
    paragraphs: [
      "The red dust of Mars stretched endlessly in every direction. Commander Osei checked the mission clock: six hours until the storm hit.",
      "\"Panels up first,\" she ordered. Her team moved quickly, unfolding the solar array that would power their new home.",
      "Every movement felt strange in the lower gravity. Tools drifted slightly if you let go of them for even a second.",
      "By hour five, the habitat dome was sealed and pressurized. Osei ran her glove along the airlock, checking for leaks one last time.",
      "As the first orange clouds of dust rolled over the horizon, the team sat inside their new home, the first humans ever to shelter on another planet.",
    ],
  },
  {
    id: "the-whispering-oak",
    title: "The Whispering Oak",
    level: 3,
    genre: "Fantasy",
    vocabFocus: "Figurative language",
    durationMinutes: 6,
    coverEmoji: "🌳",
    coverFrom: "#f6c453",
    coverTo: "#6cf8bb",
    summary: "An old oak tree in the village square is said to whisper secrets to children who listen closely enough.",
    paragraphs: [
      "In the middle of the village stood an oak tree older than anyone could remember. Its branches curled like the letters of a forgotten language.",
      "The children said if you pressed your ear against its bark and stayed very still, you could hear it whisper.",
      "Sofia decided to try. She leaned close and listened. At first, nothing. Then, a soft rustle, like a voice made of leaves.",
      "\"Patience,\" it seemed to say. \"Good things grow slowly.\" Sofia smiled, unsure if she had imagined it.",
      "From then on, whenever she felt like giving up on something hard, she remembered the oak's quiet advice, and tried just a little longer.",
    ],
  },
  {
    id: "city-of-ants",
    title: "City of Ants",
    level: 2,
    genre: "Animals",
    vocabFocus: "Community words",
    durationMinutes: 5,
    coverEmoji: "🐜",
    coverFrom: "#c2c6d6",
    coverTo: "#424754",
    summary: "A curious boy shrinks down (in his imagination) to explore how a colony of ants works together to build their home.",
    paragraphs: [
      "Leo lay on his stomach in the garden, watching a line of ants march across the dirt in a perfectly straight row.",
      "Each ant carried something: a crumb, a leaf, a tiny stick. Not one of them bumped into another.",
      "\"How do they know where to go?\" Leo wondered, imagining he could shrink down and follow them into their tunnel.",
      "Deep underground, he imagined rooms for food, rooms for eggs, and tunnels connecting it all like a busy little city.",
      "Every ant had a job, and every job mattered. Leo decided that was the real secret: nobody worked alone.",
    ],
  },
  {
    id: "the-clockmakers-riddle",
    title: "The Clockmaker's Riddle",
    level: 10,
    genre: "Mystery",
    vocabFocus: "Multisyllabic words",
    durationMinutes: 13,
    coverEmoji: "🕰️",
    coverFrom: "#8b6f47",
    coverTo: "#4a3728",
    summary: "A young apprentice must solve her late master's final riddle, hidden inside the mechanism of an impossible clock.",
    paragraphs: [
      "The old clockmaker had left behind a single, unfinished project: a clock with thirteen numbers instead of twelve.",
      "Elena, his apprentice, had inherited the workshop, the tools, and a note that read only: \"The answer ticks where you least expect it.\"",
      "She spent weeks examining the mechanism, tracing every gear and spring, searching for some hidden compartment or clue.",
      "It wasn't until she noticed the thirteenth number was slightly loose that she understood. Behind it was a tiny drawer, no bigger than a coin.",
      "Inside lay a single brass key, and a note: \"You didn't need thirteen hours. You needed patience enough to look twice.\" Elena finally smiled; the old man's riddles always taught her more than his lessons ever did.",
    ],
  },
];

export function getStoryById(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
