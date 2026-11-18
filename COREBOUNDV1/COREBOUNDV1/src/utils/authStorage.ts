import { SentinelUser, GuardianPreferences } from '../types/auth';
import { DEFAULT_PREFERENCES } from '../data/calibrationQuestions';

const USER_STORAGE_KEY = 'corebound_sentinel_user';
const PREFS_STORAGE_KEY = 'corebound_guardian_prefs';

const MOCK_DEMO_USER: SentinelUser = {
  id: 'usr_sentinel_prime_01',
  codexId: 'CIPHER-NEXUS-07',
  email: 'guardian@corebound.io',
  rankTitle: 'SENTINEL PRIME',
  avatarSeed: 'AetheriaGuardian',
  xp: 2450,
  credits: 840,
  isCalibrated: false,
  createdAt: new Date().toISOString(),
  neuralLinkActive: true
};

export const getStoredSentinelUser = (): SentinelUser | null => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredSentinelUser = (user: SentinelUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
};

export const getStoredPreferences = (): GuardianPreferences => {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

export const setStoredPreferences = (prefs: GuardianPreferences): void => {
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
};

export const generateSentinelCodename = (username: string, role: string, tier: string): string => {
  const prefixes = ['AEGIS', 'VALKYRIE', 'NEXUS', 'VORTEX', 'AETHER', 'CYBER', 'SOLAR', 'CHRONO', 'KINESIS'];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const cleanUser = (username || 'GUARDIAN').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'SENTINEL';
  const num = Math.floor(100 + Math.random() * 900);
  return `${p}-${cleanUser}-${num}`;
};

export const downloadPreferencesJSON = (prefs: GuardianPreferences, user?: SentinelUser | null) => {
  const payload = {
    system: 'COREBOUND SENTINEL CODEX',
    version: '2.4.0',
    exportedAt: new Date().toISOString(),
    sentinel: {
      codexId: user?.codexId || 'GUARDIAN-INITIATE',
      email: user?.email || 'unlinked',
      rank: user?.rankTitle || 'SENTINEL INITIATE'
    },
    calibrationMatrix: prefs
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `corebound_sentinel_calibration_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export { MOCK_DEMO_USER };
