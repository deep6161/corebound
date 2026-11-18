import { SectorData, KnowledgeDomain } from '../types/world';

export const SECTORS: SectorData[] = [
  {
    id: 'origin',
    chapter: 'Chapter 1 • Aptitude',
    name: 'ORIGIN',
    tag: 'ORIGIN',
    subtitle: 'The Root of All Beginnings',
    domain: 'Pattern Recognition & Aptitude',
    color: '#10b981',
    secondaryColor: '#34d399',
    glow: 'rgba(16, 185, 129, 0.75)',
    border: 'rgba(16, 185, 129, 0.6)',
    position: [-76, 14, 26],
    radius: 15,
    height: 22,
    theme: 'origin',
    iconSvg: 'leaf',
    description:
      'The Prediction Engine has fallen silent. Decipher ancestral patterns, numerical sequences, and geometric matrices to uncover the first clue about the NULL anomaly.',
    lore:
      'Ancient monoliths entwined with bioluminescent flora house the genesis seeds of computational logic and foundational thinking.',
    unlocked: true,
    stars: 3,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'Number Series Decryption', diff: 'Novice', stars: 3 },
      { name: 'Geometric Pattern Matrix', diff: 'Adept', stars: 2 },
      { name: 'Analogous Clockworks', diff: 'Master', stars: 0 }
    ]
  },
  {
    id: 'scripture',
    chapter: 'Chapter 3 • Programming',
    name: 'SCRIPTURE',
    tag: 'SCRIPTURE',
    subtitle: 'Cathedral of Sacred Code',
    domain: 'Syntax, Memory & OOP Architecture',
    color: '#f59e0b',
    secondaryColor: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.8)',
    border: 'rgba(245, 158, 11, 0.65)',
    position: [-46, 33, -56],
    radius: 17,
    height: 25,
    theme: 'scripture',
    iconSvg: 'book',
    description:
      'Inscribe sacred code scrolls across golden cathedrals. Master variables, memory pointers, and object-oriented paradigms to construct enduring digital monuments.',
    lore:
      'Golden spires reflect the eternal dawn, where algorithms are etched into floating stone tablets by celestial compilers.',
    unlocked: true,
    stars: 1,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'Control Flow Labyrinth', diff: 'Novice', stars: 2 },
      { name: 'Pointer & Memory Sanctum', diff: 'Adept', stars: 0 },
      { name: 'OOP Architecture Fortress', diff: 'Master', stars: 0 }
    ]
  },
  {
    id: 'history',
    chapter: 'Chapter 5 • SQL & DBMS',
    name: 'HISTORY',
    tag: 'HISTORY',
    subtitle: 'The Eternal Database Vault',
    domain: 'Relational Schemas, ACID & Queries',
    color: '#38bdf8',
    secondaryColor: '#7dd3fc',
    glow: 'rgba(56, 189, 248, 0.75)',
    border: 'rgba(56, 189, 248, 0.6)',
    position: [-10, 36, -86],
    radius: 14,
    height: 21,
    theme: 'history',
    iconSvg: 'database',
    description:
      'Unseal the relational archives of civilization. Formulate complex queries, execute multi-table joins, and maintain integrity across millennia of stored truth.',
    lore:
      'Crystalline database pillars store every action ever recorded in the multiverse, awaiting structured queries to reveal hidden histories.',
    unlocked: false,
    stars: 0,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'Relational Queries Sanctum', diff: 'Novice', stars: 0 },
      { name: 'Indexing & Normalization', diff: 'Adept', stars: 0 },
      { name: 'ACID Transaction Crucible', diff: 'Master', stars: 0 }
    ]
  },
  {
    id: 'language',
    chapter: 'Chapter 8 • Communication',
    name: 'LANGUAGE',
    tag: 'LANGUAGE',
    subtitle: 'Palace of Arcane Glyphs',
    domain: 'Grammar, Verbal Reasoning & Resonance',
    color: '#a855f7',
    secondaryColor: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.8)',
    border: 'rgba(168, 85, 247, 0.65)',
    position: [44, 31, -62],
    radius: 16,
    height: 23,
    theme: 'language',
    iconSvg: 'message-square',
    description:
      'Hone linguistic resonance, master semantic precision, and overcome behavioral interview simulations within the amethyst spires of speech.',
    lore:
      'Holographic runes rotate suspended in mid-air, echoing words that possess the power to shape physical reality.',
    unlocked: false,
    stars: 0,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'Behavioral Resonance Chamber', diff: 'Novice', stars: 0 },
      { name: 'Technical Articulation Matrix', diff: 'Adept', stars: 0 },
      { name: 'Stress Simulation Arena', diff: 'Master', stars: 0 }
    ]
  },
  {
    id: 'philosophy',
    chapter: 'Final Chapter • Placement Arena',
    name: 'PHILOSOPHY',
    tag: 'PHILOSOPHY',
    subtitle: 'The Grand Acropolis',
    domain: 'Comprehensive Synthesis & Problem Solving',
    color: '#3b82f6',
    secondaryColor: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.75)',
    border: 'rgba(59, 130, 246, 0.6)',
    position: [78, 20, -22],
    radius: 17,
    height: 25,
    theme: 'philosophy',
    iconSvg: 'compass',
    description:
      'The pinnacle of the Knowledge Realms. A grand trial synthesizing every discipline into unified mastery to confront NULL and achieve Guardian Coronation.',
    lore:
      'A marble temple bathed in celestial azure starlight where the greatest minds test their ultimate synthesis of logic, code, and reason.',
    unlocked: false,
    stars: 0,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'The Grand Aptitude Synthesis', diff: 'Master', stars: 0 },
      { name: 'Full-Stack Architecture Defense', diff: 'Grandmaster', stars: 0 },
      { name: 'Guardian Coronation Exam', diff: 'Legendary', stars: 0 }
    ]
  },
  {
    id: 'essence',
    chapter: 'Chapter 6 • Operating Systems',
    name: 'ESSENCE',
    tag: 'ESSENCE',
    subtitle: 'Kernel of Life & Systems',
    domain: 'Concurrency, Memory & CPU Scheduling',
    color: '#06b6d4',
    secondaryColor: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.8)',
    border: 'rgba(6, 182, 212, 0.6)',
    position: [-62, -6, -12],
    radius: 14,
    height: 20,
    theme: 'essence',
    iconSvg: 'cpu',
    description:
      'Descend into the kernel vaults. Prevent thread deadlocks, synchronize concurrent routines, and manage memory paging before system panic occurs.',
    lore:
      'Pulsing cyan conduits pump operating system lifeblood through floating clockwork engines and crystal memory chips.',
    unlocked: true,
    stars: 0,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'CPU Scheduler Ring', diff: 'Adept', stars: 0 },
      { name: 'Mutex & Semaphore Locks', diff: 'Adept', stars: 0 },
      { name: 'Virtual Paging Sanctuary', diff: 'Master', stars: 0 }
    ]
  },
  {
    id: 'balance',
    chapter: 'Chapter 2 • Logic',
    name: 'BALANCE',
    tag: 'BALANCE',
    subtitle: 'Sanctuary of Equilibrium',
    domain: 'Boolean Algebra, Venn & Deductions',
    color: '#84cc16',
    secondaryColor: '#a3e635',
    glow: 'rgba(132, 204, 22, 0.75)',
    border: 'rgba(132, 204, 22, 0.6)',
    position: [-48, -20, 64],
    radius: 14,
    height: 19,
    theme: 'balance',
    iconSvg: 'scale',
    description:
      'Calibrate truth tables, resolve logical paradoxes, and balance boolean equations across the tranquil floating garden of equilibrium.',
    lore:
      'Sacred water flows in flawless symmetry between binary gates that uphold the balance between truth and falsehood.',
    unlocked: true,
    stars: 2,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'Truth Table Sanctum', diff: 'Novice', stars: 3 },
      { name: 'Venn Diagram Enigma', diff: 'Adept', stars: 1 },
      { name: 'Deductive Proof Trials', diff: 'Master', stars: 0 }
    ]
  },
  {
    id: 'resonance',
    chapter: 'Chapter 4 • DSA',
    name: 'RESONANCE',
    tag: 'RESONANCE',
    subtitle: 'The Algorithmic Forge',
    domain: 'Data Structures & Dynamic Programming',
    color: '#ef4444',
    secondaryColor: '#f87171',
    glow: 'rgba(239, 68, 68, 0.85)',
    border: 'rgba(239, 68, 68, 0.65)',
    position: [50, -22, 48],
    radius: 15,
    height: 22,
    theme: 'resonance',
    iconSvg: 'flame',
    description:
      'Channel volcanic algorithmic heat. Balance red-black trees, traverse complex graph labyrinths, and conquer dynamic programming crucibles.',
    lore:
      'Cracked obsidian crust reveals flowing magma of pure algorithmic power, continuously forged under intense heat.',
    unlocked: false,
    stars: 0,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'Graph Traversal Crucible', diff: 'Adept', stars: 0 },
      { name: 'Dynamic Programming Forge', diff: 'Master', stars: 0 },
      { name: 'Segment Tree Trial', diff: 'Grandmaster', stars: 0 }
    ]
  },
  {
    id: 'connection',
    chapter: 'Chapter 7 • Networks',
    name: 'CONNECTION',
    tag: 'CONNECTION',
    subtitle: 'The Orbital Grid',
    domain: 'OSI Protocol, TCP/IP & Network Routing',
    color: '#f97316',
    secondaryColor: '#fb923c',
    glow: 'rgba(249, 115, 22, 0.8)',
    border: 'rgba(249, 115, 22, 0.6)',
    position: [82, -1, 24],
    radius: 14,
    height: 20,
    theme: 'connection',
    iconSvg: 'share-2',
    description:
      'Repair broken orbital conduits. Inspect TCP packet handshakes, configure subnet topologies, and guard security firewalls from NULL invaders.',
    lore:
      'Rotating brass rings and satellite nodes transmit beams of light across the vast emptiness, linking minds together.',
    unlocked: false,
    stars: 0,
    totalStars: 5,
    playUrl: 'ch1_missions.html',
    missions: [
      { name: 'Subnet Routing Conduits', diff: 'Novice', stars: 0 },
      { name: 'TCP Handshake Integrity', diff: 'Adept', stars: 0 },
      { name: 'Firewall Defense Matrix', diff: 'Master', stars: 0 }
    ]
  }
];

export const CORE_DATA: SectorData = {
  id: 'core',
  chapter: 'Nexus • Heart of Wisdom',
  name: 'THE CORE',
  tag: 'CORE',
  subtitle: 'The Source of All Multiversal Knowledge',
  domain: 'The Omniscient Nexus',
  color: '#c084fc',
  secondaryColor: '#e9d5ff',
  glow: 'rgba(192, 132, 252, 0.95)',
  border: 'rgba(233, 213, 255, 0.8)',
  position: [0, 0, 0],
  radius: 28,
  height: 32,
  theme: 'core',
  iconSvg: 'sparkles',
  description:
    'The crystalline heart of wisdom radiating energy conduits to all surrounding sectors. Awaken and harmonize all domains to seal the NULL anomaly forever.',
  lore:
    'A colossal radiant crystal cluster suspended above ancient stepped dais, pulsing with the combined knowledge of all reality.',
  unlocked: true,
  stars: 4,
  totalStars: 5,
  playUrl: 'ch1_missions.html',
  missions: [
    { name: 'Conduit Resonance Calibration', diff: 'Adept', stars: 3 },
    { name: 'Nexus Harmonic Alignment', diff: 'Master', stars: 1 }
  ]
};

export const KNOWLEDGE_DOMAINS: KnowledgeDomain[] = [
  {
    name: 'Aptitude & Patterns',
    description: 'Number series, visual puzzles, geometric logic',
    icon: 'leaf',
    sectorId: 'origin',
    unlocked: true
  },
  {
    name: 'Logic & Deduction',
    description: 'Boolean gates, truth tables, syllogisms',
    icon: 'scale',
    sectorId: 'balance',
    unlocked: true
  },
  {
    name: 'Programming Fundamentals',
    description: 'Control flow, memory pointers, OOP paradigms',
    icon: 'book',
    sectorId: 'scripture',
    unlocked: true
  },
  {
    name: 'Data Structures & Algorithms',
    description: 'Trees, graphs, dynamic programming, sorting',
    icon: 'flame',
    sectorId: 'resonance',
    unlocked: false
  },
  {
    name: 'Database Management Systems',
    description: 'SQL queries, relational normalization, ACID',
    icon: 'database',
    sectorId: 'history',
    unlocked: false
  },
  {
    name: 'Operating Systems',
    description: 'Process scheduling, deadlocks, virtual memory',
    icon: 'cpu',
    sectorId: 'essence',
    unlocked: true
  },
  {
    name: 'Computer Networks',
    description: 'OSI layers, TCP/IP, routing, firewalls',
    icon: 'share-2',
    sectorId: 'connection',
    unlocked: false
  },
  {
    name: 'Communication & Verbal',
    description: 'Technical presentation, behavioral response',
    icon: 'message-square',
    sectorId: 'language',
    unlocked: false
  },
  {
    name: 'Placement Arena',
    description: 'Grand comprehensive trial and guardian coronation',
    icon: 'compass',
    sectorId: 'philosophy',
    unlocked: false
  }
];
