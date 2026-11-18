export interface Mission {
  name: string;
  diff: 'Novice' | 'Adept' | 'Master' | 'Grandmaster' | 'Legendary';
  stars: number;
}

export type SectorTheme =
  | 'origin'
  | 'scripture'
  | 'history'
  | 'language'
  | 'philosophy'
  | 'essence'
  | 'balance'
  | 'resonance'
  | 'connection'
  | 'core';

export interface SectorData {
  id: string;
  chapter: string;
  name: string;
  tag: string;
  subtitle: string;
  domain: string;
  color: string;
  secondaryColor: string;
  glow: string;
  border: string;
  position: [number, number, number];
  radius: number;
  height: number;
  theme: SectorTheme;
  iconSvg: string;
  description: string;
  lore: string;
  unlocked: boolean;
  stars: number;
  totalStars: number;
  playUrl: string;
  missions: Mission[];
}

export interface KnowledgeDomain {
  name: string;
  description: string;
  icon: string;
  sectorId: string;
  unlocked: boolean;
}
