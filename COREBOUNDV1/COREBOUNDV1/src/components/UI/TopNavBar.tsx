import React from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  BookOpen,
  Star,
  ShieldCheck,
  User,
  Sparkles,
  Sliders
} from 'lucide-react';
import { SentinelUser } from '../../types/auth';

interface TopNavBarProps {
  totalStars: number;
  maxStars: number;
  isMuted: boolean;
  currentUser: SentinelUser | null;
  onToggleSound: () => void;
  onResetView: () => void;
  onOpenAuth: () => void;
  onOpenCalibration: () => void;
  onOpenProfile: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  totalStars,
  maxStars,
  isMuted,
  currentUser,
  onToggleSound,
  onResetView,
  onOpenAuth,
  onOpenCalibration,
  onOpenProfile
}) => {
  return (
    <header className="top-nav-bar">
      {/* Brand & Subtitle */}
      <div className="brand-container">
        <h1 className="brand-title">COREBOUND</h1>
        <span className="brand-subtitle">AETHERIA • THE CORE WORLD</span>
      </div>

      {/* Top Stats Group */}
      <div className="top-stats-group">
        <div className="stat-pill">
          <span className="icon">
            <Star size={15} fill="currentColor" />
          </span>
          <span>{totalStars} / {maxStars} STARS</span>
        </div>

        {currentUser ? (
          <button
            type="button"
            className="stat-pill rank-pill rank-pill-interactive"
            onClick={onOpenProfile}
            title="View Guardian Codex Dossier"
          >
            <span className="icon">
              <ShieldCheck size={16} />
            </span>
            <span className="rank-name">{currentUser.rankTitle}</span>
            <span className="codex-tag">[{currentUser.codexId.slice(0, 10)}]</span>
          </button>
        ) : (
          <div className="stat-pill rank-pill">
            <span className="icon">
              <ShieldCheck size={16} />
            </span>
            <span>GUARDIAN INITIATE</span>
          </div>
        )}
      </div>

      {/* Nav Actions */}
      <div className="nav-actions">
        {/* Calibration Wizard Quick Launcher */}
        <button
          className={`cb-nav-calib-btn ${currentUser && !currentUser.isCalibrated ? 'pulsing-attention' : ''}`}
          type="button"
          onClick={onOpenCalibration}
          title="Open 7-Phase Guardian Calibration Matrix"
        >
          <Sliders size={16} />
          <span className="btn-label">CALIBRATE</span>
          {currentUser && !currentUser.isCalibrated && <span className="calib-attention-dot"></span>}
        </button>

        {/* Sentinel Auth / Profile Access Button */}
        {currentUser ? (
          <button
            className="cb-nav-user-capsule"
            type="button"
            onClick={onOpenProfile}
            title={`Logged in as ${currentUser.codexId}`}
          >
            <div className="user-avatar-pip">
              <Sparkles size={13} />
            </div>
            <span className="user-name-text">{currentUser.codexId.split('-')[0]}</span>
          </button>
        ) : (
          <button
            className="cb-nav-auth-btn"
            type="button"
            onClick={onOpenAuth}
            title="Sentinel Access Link (Login / Register)"
          >
            <User size={16} />
            <span>ACCESS LINK</span>
          </button>
        )}

        {/* Reset Camera View Button */}
        <button
          className="icon-btn"
          type="button"
          onClick={onResetView}
          aria-label="Reset Overview"
          title="Reset View (Esc)"
        >
          <Compass size={20} />
        </button>

        {/* Audio Toggle Button */}
        <button
          className={`icon-btn ${isMuted ? 'is-muted' : ''}`}
          type="button"
          onClick={onToggleSound}
          aria-label="Toggle Audio"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Story Replay Link */}
        <a
          href="story.html"
          className="icon-btn"
          title="Replay Story Cutscenes"
          aria-label="Replay Story"
        >
          <BookOpen size={19} />
        </a>
      </div>
    </header>
  );
};
