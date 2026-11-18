import { CalibrationPhaseMeta } from '../types/auth';

export const CALIBRATION_PHASES: CalibrationPhaseMeta[] = [
  {
    phaseNumber: 1,
    key: 'primaryGoal',
    title: 'Primary Directive & Goal',
    subtitle: 'Define the core motivation for your Sentinel journey through Aetheria',
    loreBriefing: 'Neural synchronization requires aligning your cognitive trajectory. Choose your primary objective.',
    selectionType: 'single',
    allowCustom: true,
    customPlaceholder: 'Specify custom prime directive (e.g. Master Low-Level Systems)',
    options: [
      {
        id: 'placement_prep',
        title: 'Placement Prep',
        description: 'Campus recruitments, aptitude drills, core CS fundamentals, and screening tests.',
        badge: 'CAMPUS TRACK',
        icon: 'GraduationCap',
        glowColor: 'cyan'
      },
      {
        id: 'interview_prep',
        title: 'Interview Prep',
        description: 'Live coding simulations, system architecture defense, and technical problem solving.',
        badge: 'CAREER SPRINT',
        icon: 'Briefcase',
        glowColor: 'cyan'
      },
      {
        id: 'skill_improvement',
        title: 'Skill Improvement',
        description: 'Execution speed, algorithmic pattern recognition, refactoring, and clean code mastery.',
        badge: 'ENGINE BOOST',
        icon: 'Zap',
        glowColor: 'purple'
      },
      {
        id: 'competitive_programming',
        title: 'Competitive Programming',
        description: 'Hardcore DSA, time-bound contest circuits, micro-optimizations, and ranking ladders.',
        badge: 'COMBAT LEAGUE',
        icon: 'Trophy',
        glowColor: 'gold'
      },
      {
        id: 'academic_prep',
        title: 'Academic Prep',
        description: 'University coursework, computer science theory, discrete mathematics, and lab prep.',
        badge: 'SCHOLAR PROTOCOL',
        icon: 'BookOpen',
        glowColor: 'purple'
      },
      {
        id: 'other_goal',
        title: 'Other / Custom',
        description: 'Self-directed open exploration and custom curriculum parameters.',
        badge: 'CUSTOM MATRIX',
        icon: 'Sparkles',
        glowColor: 'cyan'
      }
    ]
  },
  {
    phaseNumber: 2,
    key: 'targetRole',
    title: 'Target Specialization Role',
    subtitle: 'Select the technical domain or engineering vocation you wish to command',
    loreBriefing: 'Your Codex will configure sector simulations and test suites tailored to your designated combat role.',
    selectionType: 'single',
    allowCustom: true,
    customPlaceholder: 'Specify custom engineering role...',
    options: [
      {
        id: 'frontend_dev',
        title: 'Frontend Developer',
        description: 'UI/UX architecture, state choreography, WebGL/Canvas rendering, and responsive design.',
        badge: 'CLIENT CORE',
        icon: 'Layout',
        glowColor: 'cyan'
      },
      {
        id: 'backend_dev',
        title: 'Backend Developer',
        description: 'Distributed microservices, API protocols, concurrency, and high-throughput pipelines.',
        badge: 'SERVER ENGINE',
        icon: 'Server',
        glowColor: 'purple'
      },
      {
        id: 'fullstack_dev',
        title: 'Full Stack Developer',
        description: 'End-to-end stack dominance spanning database schemas, APIs, and modern frontends.',
        badge: 'OMNI GUARDIAN',
        icon: 'Layers',
        glowColor: 'gold'
      },
      {
        id: 'software_dev',
        title: 'Software Developer',
        description: 'Generalist software engineering, system architecture, OOP, and algorithmic foundations.',
        badge: 'CORE ENGINEER',
        icon: 'Code2',
        glowColor: 'cyan'
      },
      {
        id: 'data_analyst',
        title: 'Data Analyst',
        description: 'SQL query optimization, statistical intelligence, KPI modeling, and telemetry dashboards.',
        badge: 'INSIGHT NEXUS',
        icon: 'BarChart3',
        glowColor: 'purple'
      },
      {
        id: 'data_scientist',
        title: 'Data Scientist / ML',
        description: 'Machine learning models, neural tensor mathematics, NLP, and predictive intelligence.',
        badge: 'SYNAPSE PRIME',
        icon: 'BrainCircuit',
        glowColor: 'gold'
      },
      {
        id: 'qa_engineer',
        title: 'QA / Automation Engineer',
        description: 'End-to-end test harnesses, fuzzing protocols, stress testing, and quality guarantees.',
        badge: 'SENTINEL SHIELD',
        icon: 'ShieldCheck',
        glowColor: 'cyan'
      },
      {
        id: 'devops_cloud',
        title: 'DevOps / Cloud Engineer',
        description: 'Kubernetes orchestration, CI/CD telemetry pipelines, Docker containers, and cloud infra.',
        badge: 'CLOUD TITAN',
        icon: 'CloudLightning',
        glowColor: 'purple'
      },
      {
        id: 'other_role',
        title: 'Other Specialization',
        description: 'Security, Mobile (iOS/Android), Game Engine, Embedded IoT, or custom field.',
        badge: 'CUSTOM PROTOCOL',
        icon: 'Cpu',
        glowColor: 'gold'
      }
    ]
  },
  {
    phaseNumber: 3,
    key: 'skillLevel',
    title: 'Current Skill Level Tier',
    subtitle: 'Calibrate your starting baseline for dynamic challenge scaling',
    loreBriefing: 'Honest self-assessment guarantees optimal experience gain and prevents cognitive overwhelm.',
    selectionType: 'single',
    options: [
      {
        id: 'beginner',
        title: 'Tier I — Beginner',
        description: 'Learning syntax, fundamentals, conditional logic, and baseline coding constructs from scratch.',
        tier: 'I',
        badge: '🌱 CYAN GLOW • INITIATE',
        icon: 'Sprout',
        glowColor: 'cyan'
      },
      {
        id: 'intermediate',
        title: 'Tier II — Intermediate',
        description: 'Building standard projects, mastering core DSA paradigms, and solving medium difficulty challenges.',
        tier: 'II',
        badge: '⚔️ PURPLE GLOW • SENTINEL',
        icon: 'Swords',
        glowColor: 'purple'
      },
      {
        id: 'advanced',
        title: 'Tier III — Advanced',
        description: 'Deep optimization, complex dynamic programming, distributed scale, and competitive mastery.',
        tier: 'III',
        badge: '👑 GOLD GLOW • ARCHON',
        icon: 'Crown',
        glowColor: 'gold'
      }
    ]
  },
  {
    phaseNumber: 4,
    key: 'practiceTopics',
    title: 'Focus Practice Topics',
    subtitle: 'Select one or more domain topics to prioritize in your daily training matrix',
    loreBriefing: 'You can choose multiple disciplines. The Quantum Core will synthesize custom mixed challenges.',
    selectionType: 'multi',
    minSelections: 1,
    options: [
      { id: 'dsa', title: 'Data Structures & Algorithms', description: 'Trees, Graphs, DP, Arrays, Heaps', badge: 'CORE DSA', glowColor: 'cyan' },
      { id: 'javascript_ts', title: 'JavaScript / TypeScript', description: 'Async/Await, Closures, Types, DOM', badge: 'WEB RUNTIME', glowColor: 'gold' },
      { id: 'python', title: 'Python', description: 'PyTorch, Scripts, Data Science, OOP', badge: 'PYTHON', glowColor: 'cyan' },
      { id: 'java', title: 'Java', description: 'JVM internals, Spring, Multithreading', badge: 'ENTERPRISE', glowColor: 'purple' },
      { id: 'cpp', title: 'C++', description: 'Pointers, STL, Memory Management, O(1)', badge: 'HIGH PERF', glowColor: 'gold' },
      { id: 'sql_db', title: 'SQL & Databases', description: 'Joins, Indexing, ACID, Query Optimization', badge: 'DATA VAULT', glowColor: 'purple' },
      { id: 'html_css', title: 'HTML / Modern CSS', description: 'Flexbox, Grid, Animations, Semantic HTML', badge: 'UI FOUNDRY', glowColor: 'cyan' },
      { id: 'backend_arch', title: 'Backend Architecture', description: 'REST, GraphQL, WebSockets, Caching', badge: 'SYSTEMS', glowColor: 'purple' },
      { id: 'frontend_frameworks', title: 'Frontend Frameworks', description: 'React, State Engines, Component Lifecycle', badge: 'REACTIVE', glowColor: 'cyan' },
      { id: 'databases_nosql', title: 'Databases (NoSQL & Redis)', description: 'MongoDB, Key-Value Caching, Sharding', badge: 'CACHE ENGINE', glowColor: 'gold' },
      { id: 'aptitude', title: 'Aptitude & Logical Reasoning', description: 'Number theory, Probability, Logic Puzzles', badge: 'LOGIC MATRIX', glowColor: 'cyan' },
      { id: 'problem_solving', title: 'Problem Solving & Clean Code', description: 'Refactoring, Debugging, Edge Cases', badge: 'SYNTHESIS', glowColor: 'purple' }
    ]
  },
  {
    phaseNumber: 5,
    key: 'dailyCommitment',
    title: 'Daily Practice Commitment',
    subtitle: 'How much neural compute time will you dedicate each rotation?',
    loreBriefing: 'Consistency maintains neural link resonance. Choose a sustainable pace for daily streaks.',
    selectionType: 'single',
    options: [
      {
        id: '15_mins',
        title: '15 Minutes',
        description: 'Micro-sprints — 1 focused problem or concept refresh per day. Ideal for busy schedules.',
        badge: '⚡ MICRO SPRINT',
        icon: 'Zap',
        glowColor: 'cyan'
      },
      {
        id: '30_mins',
        title: '30 Minutes',
        description: 'Steady progress — 2 targeted drills with instant code evaluations and feedback.',
        badge: '🎯 STEADY PACE',
        icon: 'Target',
        glowColor: 'cyan'
      },
      {
        id: '1_hour',
        title: '1 Hour',
        description: 'Standard interview preparation — 1 DSA medium + 1 domain architecture drill.',
        badge: '⚔️ STANDARD BATTLE',
        icon: 'Clock',
        glowColor: 'purple'
      },
      {
        id: '2_hours',
        title: '2 Hours',
        description: 'Deep-dive problem solving — Comprehensive coverage of theory and complex algorithms.',
        badge: '🔥 DEEP FOCUS',
        icon: 'Flame',
        glowColor: 'purple'
      },
      {
        id: '3_plus_hours',
        title: '3+ Hours',
        description: 'Hardcore grinding — Rapid conquest of high-tier sectors and competitive ladders.',
        badge: '👑 OVERCLOCK GRIND',
        icon: 'Rocket',
        glowColor: 'gold'
      }
    ]
  },
  {
    phaseNumber: 6,
    key: 'difficultyPreference',
    title: 'Challenge Engine & Difficulty',
    subtitle: 'Configure how the Singularity Core modulates problem complexity',
    loreBriefing: 'The Adaptive Engine uses real-time metrics to keep you in the optimal flow state zone.',
    selectionType: 'single',
    options: [
      {
        id: 'adaptive',
        title: 'Adaptive Engine',
        description: 'Auto-tunes difficulty dynamically based on your accuracy, speed, and streak performance.',
        badge: '★ RECOMMENDED',
        icon: 'Cpu',
        glowColor: 'cyan',
        highlight: true
      },
      {
        id: 'easy',
        title: 'Easy Pace',
        description: 'Guided pace with contextual hints, step-by-step breakdowns, and relaxed time bounds.',
        badge: 'GUIDED CRUISE',
        icon: 'Compass',
        glowColor: 'cyan'
      },
      {
        id: 'medium',
        title: 'Medium Standard',
        description: 'Standard tech company interview difficulty with standard memory & execution limits.',
        badge: 'BALANCED DEFENSE',
        icon: 'Shield',
        glowColor: 'purple'
      },
      {
        id: 'hard',
        title: 'Hardcore Mode',
        description: 'Strict execution time bounds, tricky edge cases, and high-stakes penalty modifiers.',
        badge: 'NIGHTMARE GAUNTLET',
        icon: 'Skull',
        glowColor: 'gold'
      }
    ]
  },
  {
    phaseNumber: 7,
    key: 'learningStyle',
    title: 'Cognitive Learning Style',
    subtitle: 'How do you prefer narrative and technical material presented?',
    loreBriefing: 'Finalizing neural pathway mapping. Choose your preferred learning balance.',
    selectionType: 'single',
    options: [
      {
        id: 'story',
        title: 'Story-driven Lore',
        description: 'Immersive cosmic narrative briefings, quest chronicles, and sci-fi worldbuilding.',
        badge: 'COSMIC SAGA',
        icon: 'BookOpen',
        glowColor: 'purple'
      },
      {
        id: 'practice',
        title: 'Practice-heavy Drills',
        description: 'Direct code execution, minimal dialogue, rapid test runners, and instant feedback.',
        badge: 'PURE CODE',
        icon: 'Terminal',
        glowColor: 'cyan'
      },
      {
        id: 'balanced',
        title: 'Balanced Symphony',
        description: 'A harmonious blend of rich sci-fi lore context with rigorous programming challenges.',
        badge: 'HARMONIC PRIME',
        icon: 'Scale',
        glowColor: 'gold'
      },
      {
        id: 'challenge',
        title: 'Challenge-heavy PvP',
        description: 'Competitive timed sprints, boss battles, time-attack arenas, and leaderboard climbs.',
        badge: 'GLADIATOR PROTOCOL',
        icon: 'Flame',
        glowColor: 'gold'
      }
    ]
  }
];

export const DEFAULT_PREFERENCES = {
  primaryGoal: 'interview_prep',
  targetRole: 'fullstack_dev',
  skillLevel: 'intermediate' as const,
  practiceTopics: ['dsa', 'javascript_ts', 'backend_arch', 'problem_solving'],
  dailyCommitment: '1_hour',
  difficultyPreference: 'adaptive' as const,
  learningStyle: 'balanced' as const,
  calibratedAt: new Date().toISOString()
};
