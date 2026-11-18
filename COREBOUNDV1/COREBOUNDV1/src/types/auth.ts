export type AuthMode = 'login' | 'register';

export type SkillLevelTier = 'beginner' | 'intermediate' | 'advanced';
export type DifficultyEngine = 'adaptive' | 'easy' | 'medium' | 'hard';
export type LearningStyle = 'story' | 'practice' | 'balanced' | 'challenge';

export interface GuardianPreferences {
  primaryGoal: string;
  customGoal?: string;
  targetRole: string;
  customRole?: string;
  skillLevel: SkillLevelTier;
  practiceTopics: string[];
  dailyCommitment: string;
  difficultyPreference: DifficultyEngine;
  learningStyle: LearningStyle;
  calibratedAt: string;
}

export interface SentinelUser {
  id: string;
  codexId: string;
  email: string;
  rankTitle: string;
  avatarSeed: string;
  xp: number;
  credits: number;
  isCalibrated: boolean;
  calibrationData?: GuardianPreferences;
  createdAt: string;
  neuralLinkActive: boolean;
}

export interface CalibrationQuestionOption {
  id: string;
  title: string;
  description: string;
  badge?: string;
  icon?: string;
  tier?: 'I' | 'II' | 'III';
  glowColor?: 'cyan' | 'purple' | 'gold';
  highlight?: boolean;
}

export interface CalibrationPhaseMeta {
  phaseNumber: number;
  key: keyof GuardianPreferences;
  title: string;
  subtitle: string;
  loreBriefing: string;
  selectionType: 'single' | 'multi';
  minSelections?: number;
  options: CalibrationQuestionOption[];
  allowCustom?: boolean;
  customPlaceholder?: string;
}
