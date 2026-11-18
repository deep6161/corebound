import React, { useState, useEffect, useCallback } from 'react';
import { SECTORS, CORE_DATA } from './data/worldData';
import { SectorData } from './types/world';
import { SentinelUser, GuardianPreferences, AuthMode } from './types/auth';
import { audioManager } from './utils/audioManager';
import {
  getStoredSentinelUser,
  setStoredSentinelUser,
  getStoredPreferences,
  setStoredPreferences
} from './utils/authStorage';
import { SectorMap2D } from './components/Map/SectorMap2D';
import { TopNavBar } from './components/UI/TopNavBar';
import { BottomDock } from './components/UI/BottomDock';
import { MissionModal } from './components/UI/MissionModal';
import { ControlsHint } from './components/UI/ControlsHint';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { AuthModal } from './components/Auth/AuthModal';
import { CalibrationWizard } from './components/Calibration/CalibrationWizard';
import { SentinelProfileModal } from './components/UI/SentinelProfileModal';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Auth & Calibration States
  const [currentUser, setCurrentUser] = useState<SentinelUser | null>(() => getStoredSentinelUser());
  const [preferences, setPreferences] = useState<GuardianPreferences>(() => getStoredPreferences());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Total stars calculation
  const totalStars = SECTORS.reduce((acc, curr) => acc + curr.stars, CORE_DATA.stars);
  const maxStars = SECTORS.length * 5 + 5;

  const handleSelectSector = useCallback((sector: SectorData) => {
    setSelectedSector(sector);
    if (sector.id === 'core') {
      audioManager.playCoreChime();
    } else {
      audioManager.playSelect();
    }
  }, []);

  const handleSelectSectorById = useCallback((sectorId: string) => {
    if (sectorId === 'core') {
      handleSelectSector(CORE_DATA);
    } else {
      const found = SECTORS.find((s) => s.id === sectorId);
      if (found) handleSelectSector(found);
    }
  }, [handleSelectSector]);

  const handleResetView = useCallback(() => {
    setSelectedSector(null);
    audioManager.playHover(300);
  }, []);

  const handleToggleSound = useCallback(() => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    audioManager.startAmbient();
    setTimeout(() => {
      setIsIntroPlaying(false);
    }, 3200);
  }, []);

  // Auth Handlers
  const handleOpenAuth = useCallback((mode: AuthMode = 'login') => {
    audioManager.playCyberClick();
    setAuthMode(mode);
    setIsAuthOpen(true);
  }, []);

  const handleAuthSuccess = useCallback((user: SentinelUser, shouldCalibrate: boolean) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    if (shouldCalibrate) {
      setTimeout(() => {
        setIsCalibrationOpen(true);
      }, 400);
    }
  }, []);

  const handleOpenCalibration = useCallback(() => {
    audioManager.playCyberClick();
    setIsProfileOpen(false);
    setIsCalibrationOpen(true);
  }, []);

  const handleCalibrationComplete = useCallback((newPrefs: GuardianPreferences, updatedUser: SentinelUser) => {
    setPreferences(newPrefs);
    setCurrentUser(updatedUser);
    setIsCalibrationOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    setStoredSentinelUser(null);
    setCurrentUser(null);
    setIsProfileOpen(false);
    audioManager.playCyberClick();
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAuthOpen) setIsAuthOpen(false);
        else if (isCalibrationOpen) setIsCalibrationOpen(false);
        else if (isProfileOpen) setIsProfileOpen(false);
        else handleResetView();
      } else if (!isAuthOpen && !isCalibrationOpen && !isProfileOpen) {
        if (e.key >= '1' && e.key <= '9') {
          const idx = parseInt(e.key) - 1;
          if (SECTORS[idx]) {
            handleSelectSector(SECTORS[idx]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleResetView, handleSelectSector, isAuthOpen, isCalibrationOpen, isProfileOpen]);

  return (
    <div className="aetheria-world-container">
      {/* 1. Cinematic Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* 2. Top Navigation & Stats Bar */}
      <TopNavBar
        totalStars={totalStars}
        maxStars={maxStars}
        isMuted={isMuted}
        currentUser={currentUser}
        onToggleSound={handleToggleSound}
        onResetView={handleResetView}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenCalibration={handleOpenCalibration}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 3. 2D Interactive Sector Constellation Map */}
      <SectorMap2D
        hoveredId={hoveredId}
        selectedSector={selectedSector}
        onHover={(id) => {
          setHoveredId(id);
          if (id) audioManager.playHover();
        }}
        onSelect={handleSelectSector}
        onResetView={handleResetView}
        isIntroPlaying={isIntroPlaying}
      />

      {/* 4. Controls Interaction Hint */}
      {!isLoading && <ControlsHint />}

      {/* 5. Bottom Chapter & Sector Quick Dock */}
      <BottomDock
        sectors={SECTORS}
        coreData={CORE_DATA}
        selectedId={selectedSector?.id || null}
        onSelect={handleSelectSector}
      />

      {/* 6. Slide-out Mission Briefing & Lore Modal */}
      <MissionModal
        sector={selectedSector}
        isOpen={!!selectedSector}
        onClose={() => setSelectedSector(null)}
        onSelectSectorById={handleSelectSectorById}
      />

      {/* 7. AAA Sentinel Login & Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* 8. 7-Phase Guardian Calibration & Preferences Wizard */}
      <CalibrationWizard
        isOpen={isCalibrationOpen}
        user={currentUser}
        onClose={() => setIsCalibrationOpen(false)}
        onComplete={handleCalibrationComplete}
      />

      {/* 9. Sentinel Profile & Codex Dossier Modal */}
      <SentinelProfileModal
        isOpen={isProfileOpen}
        user={currentUser}
        preferences={preferences}
        onClose={() => setIsProfileOpen(false)}
        onOpenCalibration={handleOpenCalibration}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
