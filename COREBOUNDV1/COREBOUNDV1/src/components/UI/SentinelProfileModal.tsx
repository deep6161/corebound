import React from 'react';
import {
  X,
  ShieldCheck,
  Zap,
  RotateCcw,
  LogOut,
  Sparkles,
  Download,
  Calendar,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';
import { SentinelUser, GuardianPreferences } from '../../types/auth';
import { audioManager } from '../../utils/audioManager';
import { downloadPreferencesJSON } from '../../utils/authStorage';

interface SentinelProfileModalProps {
  isOpen: boolean;
  user: SentinelUser | null;
  preferences: GuardianPreferences;
  onClose: () => void;
  onOpenCalibration: () => void;
  onLogout: () => void;
}

export const SentinelProfileModal: React.FC<SentinelProfileModalProps> = ({
  isOpen,
  user,
  preferences,
  onClose,
  onOpenCalibration,
  onLogout
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="cb-modal-overlay" onClick={onClose}>
      <div className="cb-profile-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Glow Orbs */}
        <div className="cb-glow-orb cb-glow-orb-cyan"></div>
        <div className="cb-glow-orb cb-glow-orb-purple"></div>

        {/* Header */}
        <div className="cb-modal-header">
          <div className="cb-header-branding">
            <div className="cb-crest-glow-badge">
              <ShieldCheck size={18} className="cb-neon-icon" />
            </div>
            <div className="cb-title-text-group">
              <span className="cb-header-kicker">GUARDIAN DOSSIER MAINFRAME</span>
              <h2 className="cb-modal-heading">SENTINEL CODEX STATUS</h2>
            </div>
          </div>

          <button
            className="cb-close-btn"
            onClick={() => {
              audioManager.playHover(300);
              onClose();
            }}
            aria-label="Close Dossier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Card Main */}
        <div className="cb-profile-main-dossier">
          <div className="cb-profile-hero-badge">
            <div className="cb-hero-avatar-box">
              <Sparkles size={28} className="cb-avatar-spark" />
            </div>
            <div className="cb-hero-user-details">
              <div className="cb-hero-user-name">{user.codexId}</div>
              <div className="cb-hero-user-email">{user.email}</div>
              <div className="cb-hero-rank-tag">
                <Award size={14} />
                <span>{user.rankTitle}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="cb-profile-stats-grid">
            <div className="cb-p-stat-card">
              <span className="cb-p-stat-label">COMBAT XP</span>
              <span className="cb-p-stat-val text-cyan">{user.xp}</span>
            </div>
            <div className="cb-p-stat-card">
              <span className="cb-p-stat-label">AETHER CREDITS</span>
              <span className="cb-p-stat-val text-gold">{user.credits}</span>
            </div>
            <div className="cb-p-stat-card">
              <span className="cb-p-stat-label">NEURAL STATUS</span>
              <span className="cb-p-stat-val text-purple">
                {user.isCalibrated ? 'SYNCHRONIZED' : 'UNCALIBRATED'}
              </span>
            </div>
          </div>

          {/* Calibration Summary */}
          <div className="cb-profile-calib-box">
            <div className="cb-calib-box-header">
              <span className="cb-calib-box-title">ACTIVE CALIBRATION MATRIX</span>
              <button
                type="button"
                className="cb-recalib-trigger-btn"
                onClick={() => {
                  audioManager.playCyberClick();
                  onOpenCalibration();
                }}
              >
                <RotateCcw size={13} />
                <span>RE-CALIBRATE</span>
              </button>
            </div>

            <div className="cb-calib-tags-row">
              <span className="cb-calib-tag">
                🎯 {preferences.primaryGoal.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="cb-calib-tag">
                💼 {preferences.targetRole.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="cb-calib-tag">
                ⚔️ {preferences.skillLevel.toUpperCase()} TIER
              </span>
              <span className="cb-calib-tag">
                ⏱️ {preferences.dailyCommitment.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="cb-calib-tag">
                ⚙️ {preferences.difficultyPreference.toUpperCase()} ENGINE
              </span>
            </div>

            {/* Active Topics */}
            <div className="cb-topics-sublist">
              <span className="cb-topics-label">Disciplines:</span>
              <div className="cb-topics-chips">
                {preferences.practiceTopics.map((t) => (
                  <span key={t} className="cb-topic-chip-sm">
                    {t.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="cb-profile-footer">
          <button
            type="button"
            className="cb-export-schema-btn"
            onClick={() => {
              audioManager.playSelect(700);
              downloadPreferencesJSON(preferences, user);
            }}
          >
            <Download size={14} />
            <span>EXPORT DOSSIER JSON</span>
          </button>

          <button
            type="button"
            className="cb-logout-btn"
            onClick={() => {
              audioManager.playCyberClick();
              onLogout();
            }}
          >
            <LogOut size={14} />
            <span>TERMINATE NEURAL LINK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
