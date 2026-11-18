import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Download,
  RotateCcw,
  Zap,
  Shield,
  Layers,
  Award,
  Terminal,
  Cpu,
  GraduationCap,
  Briefcase,
  Trophy,
  BookOpen,
  Layout,
  Server,
  Code2,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
  CloudLightning,
  Sprout,
  Swords,
  Crown,
  Target,
  Clock,
  Flame,
  Rocket,
  Compass,
  Skull,
  Scale
} from 'lucide-react';
import { GuardianPreferences, SentinelUser } from '../../types/auth';
import { CALIBRATION_PHASES, DEFAULT_PREFERENCES } from '../../data/calibrationQuestions';
import { audioManager } from '../../utils/audioManager';
import {
  setStoredPreferences,
  setStoredSentinelUser,
  downloadPreferencesJSON,
  generateSentinelCodename
} from '../../utils/authStorage';

interface CalibrationWizardProps {
  isOpen: boolean;
  user?: SentinelUser | null;
  onClose: () => void;
  onComplete: (preferences: GuardianPreferences, updatedUser: SentinelUser) => void;
}

export const CalibrationWizard: React.FC<CalibrationWizardProps> = ({
  isOpen,
  user,
  onClose,
  onComplete
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0); // 0 to 6 are phases 1-7, 7 is matrix synthesis confirmation
  const [preferences, setPreferences] = useState<GuardianPreferences>(() => {
    return user?.calibrationData || DEFAULT_PREFERENCES;
  });
  const [customGoalText, setCustomGoalText] = useState(preferences.customGoal || '');
  const [customRoleText, setCustomRoleText] = useState(preferences.customRole || '');
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPhases = CALIBRATION_PHASES.length; // 7
  const isSynthesisPhase = currentPhaseIndex === totalPhases;
  const currentPhase = CALIBRATION_PHASES[currentPhaseIndex];

  // Animated progress bar percentage
  const progressPercent = isSynthesisPhase
    ? 100
    : Math.round(((currentPhaseIndex) / totalPhases) * 100);

  // Icon mapping helper
  const renderOptionIcon = (iconName?: string, size = 20) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap size={size} />;
      case 'Briefcase': return <Briefcase size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Trophy': return <Trophy size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Layout': return <Layout size={size} />;
      case 'Server': return <Server size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'Code2': return <Code2 size={size} />;
      case 'BarChart3': return <BarChart3 size={size} />;
      case 'BrainCircuit': return <BrainCircuit size={size} />;
      case 'ShieldCheck': return <ShieldCheck size={size} />;
      case 'CloudLightning': return <CloudLightning size={size} />;
      case 'Sprout': return <Sprout size={size} />;
      case 'Swords': return <Swords size={size} />;
      case 'Crown': return <Crown size={size} />;
      case 'Target': return <Target size={size} />;
      case 'Clock': return <Clock size={size} />;
      case 'Flame': return <Flame size={size} />;
      case 'Rocket': return <Rocket size={size} />;
      case 'Compass': return <Compass size={size} />;
      case 'Shield': return <Shield size={size} />;
      case 'Skull': return <Skull size={size} />;
      case 'Terminal': return <Terminal size={size} />;
      case 'Scale': return <Scale size={size} />;
      default: return <Cpu size={size} />;
    }
  };

  const handleSingleSelect = (optionId: string, glowColor: 'cyan' | 'purple' | 'gold' = 'cyan') => {
    audioManager.playCardSelect(glowColor);
    setErrorAlert(null);
    setPreferences((prev) => ({
      ...prev,
      [currentPhase.key]: optionId
    }));
  };

  const handleMultiSelectToggle = (topicId: string) => {
    audioManager.playCyberClick();
    setErrorAlert(null);
    setPreferences((prev) => {
      const currentList = prev.practiceTopics || [];
      const exists = currentList.includes(topicId);
      let updated: string[];
      if (exists) {
        updated = currentList.filter((t) => t !== topicId);
      } else {
        updated = [...currentList, topicId];
      }
      return {
        ...prev,
        practiceTopics: updated
      };
    });
  };

  const validateCurrentPhase = (): boolean => {
    if (isSynthesisPhase) return true;

    if (currentPhase.selectionType === 'single') {
      const val = preferences[currentPhase.key as keyof GuardianPreferences];
      if (!val) {
        audioManager.playErrorBuzz();
        setErrorAlert(`Please choose an option to advance Phase ${currentPhase.phaseNumber}.`);
        return false;
      }
      if (val === 'other_goal' && !customGoalText.trim()) {
        audioManager.playErrorBuzz();
        setErrorAlert('Please enter your custom prime directive goal.');
        return false;
      }
      if (val === 'other_role' && !customRoleText.trim()) {
        audioManager.playErrorBuzz();
        setErrorAlert('Please specify your custom target specialization role.');
        return false;
      }
    } else if (currentPhase.selectionType === 'multi') {
      const list = preferences.practiceTopics || [];
      if (list.length === 0) {
        audioManager.playErrorBuzz();
        setErrorAlert('Please select at least 1 focus practice topic to calibrate the matrix.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentPhase()) return;

    if (currentPhaseIndex < totalPhases) {
      const nextIndex = currentPhaseIndex + 1;
      audioManager.playPhaseTransition('next');
      setCurrentPhaseIndex(nextIndex);
      setErrorAlert(null);

      if (nextIndex === totalPhases) {
        audioManager.playCalibrationComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentPhaseIndex > 0) {
      audioManager.playPhaseTransition('prev');
      setCurrentPhaseIndex(currentPhaseIndex - 1);
      setErrorAlert(null);
    }
  };

  const handleJumpToPhase = (index: number) => {
    if (index <= currentPhaseIndex || isSynthesisPhase) {
      audioManager.playTabSwitch();
      setCurrentPhaseIndex(index);
      setErrorAlert(null);
    }
  };

  const handleFinalizeCalibration = () => {
    audioManager.playCoreChime();

    const finalizedPrefs: GuardianPreferences = {
      ...preferences,
      customGoal: customGoalText.trim() || undefined,
      customRole: customRoleText.trim() || undefined,
      calibratedAt: new Date().toISOString()
    };

    setStoredPreferences(finalizedPrefs);

    const rankTitle =
      finalizedPrefs.skillLevel === 'advanced'
        ? 'ARCHON GUARDIAN'
        : finalizedPrefs.skillLevel === 'intermediate'
        ? 'SENTINEL PRIME'
        : 'GUARDIAN INITIATE';

    const updatedUser: SentinelUser = {
      ...(user || {
        id: `usr_${Date.now()}`,
        codexId: generateSentinelCodename('GUARDIAN', finalizedPrefs.targetRole, finalizedPrefs.skillLevel),
        email: 'guardian@corebound.io',
        avatarSeed: 'AetheriaSentinel',
        xp: 1500,
        credits: 500,
        createdAt: new Date().toISOString(),
        neuralLinkActive: true
      }),
      rankTitle,
      isCalibrated: true,
      calibrationData: finalizedPrefs
    };

    setStoredSentinelUser(updatedUser);
    onComplete(finalizedPrefs, updatedUser);
  };

  const handleExportJSON = () => {
    audioManager.playSelect(750);
    downloadPreferencesJSON(preferences, user);
  };

  return (
    <div className="cb-modal-overlay" onClick={onClose}>
      <div className="cb-calibration-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Ambient Cosmic Orbs */}
        <div className="cb-glow-orb cb-glow-orb-cyan"></div>
        <div className="cb-glow-orb cb-glow-orb-gold"></div>

        {/* Header HUD */}
        <div className="cb-calib-header">
          <div className="cb-header-branding">
            <div className="cb-crest-glow-badge">
              <Sparkles size={18} className="cb-neon-icon" />
            </div>
            <div className="cb-title-text-group">
              <span className="cb-header-kicker">NEURAL LINK CALIBRATION PROTOCOL</span>
              <h2 className="cb-modal-heading">GUARDIAN CALIBRATION & PREFERENCES</h2>
            </div>
          </div>

          <button
            className="cb-close-btn"
            onClick={() => {
              audioManager.playHover(300);
              onClose();
            }}
            aria-label="Close Wizard"
          >
            <X size={20} />
          </button>
        </div>

        {/* Phase Stepper Breadcrumbs Bar */}
        <div className="cb-stepper-breadcrumbs">
          {CALIBRATION_PHASES.map((phase, idx) => {
            const isCompleted = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;
            return (
              <button
                key={phase.phaseNumber}
                type="button"
                className={`cb-step-pill ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleJumpToPhase(idx)}
                title={`Phase ${phase.phaseNumber}: ${phase.title}`}
              >
                <div className="cb-step-dot">
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : phase.phaseNumber}
                </div>
                <span className="cb-step-pill-label">P0{phase.phaseNumber}</span>
              </button>
            );
          })}

          <button
            type="button"
            className={`cb-step-pill ${isSynthesisPhase ? 'active' : ''}`}
            onClick={() => isSynthesisPhase && handleJumpToPhase(totalPhases)}
            title="Matrix Synthesis"
          >
            <div className="cb-step-dot">
              <Award size={12} />
            </div>
            <span className="cb-step-pill-label">MATRIX</span>
          </button>
        </div>

        {/* Segmented Laser Progress Bar */}
        <div className="cb-laser-progress-container">
          <div className="cb-laser-track">
            <div
              className="cb-laser-fill"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="cb-laser-spark-tip"></div>
              <div className="cb-laser-glow-sheen"></div>
            </div>
          </div>
          <div className="cb-laser-meta">
            <span className="cb-laser-tag">
              {isSynthesisPhase
                ? 'SYNTHESIS COMPLETE • READY TO INITIALIZE'
                : `PHASE ${currentPhase.phaseNumber} OF ${totalPhases} • ${currentPhase.title.toUpperCase()}`}
            </span>
            <span className="cb-laser-percent">{progressPercent}% SYNCHRONIZED</span>
          </div>
        </div>

        {/* Holographic Error Alert */}
        {errorAlert && (
          <div className="cb-hologram-alert cb-alert-danger">
            <Zap size={16} className="cb-alert-icon" />
            <span className="cb-alert-text">{errorAlert}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="cb-calib-content-body">
          {!isSynthesisPhase ? (
            <div className="cb-phase-pane">
              {/* Phase Title & Lore Briefing */}
              <div className="cb-phase-briefing">
                <div className="cb-phase-badge-row">
                  <span className="cb-phase-num-badge">PHASE 0{currentPhase.phaseNumber}</span>
                  <span className="cb-phase-select-type">
                    {currentPhase.selectionType === 'single' ? 'SINGLE DIRECTIVE' : 'MULTI-DOMAIN MATRIX'}
                  </span>
                </div>
                <h3 className="cb-phase-title">{currentPhase.title}</h3>
                <p className="cb-phase-subtitle">{currentPhase.subtitle}</p>
                <div className="cb-phase-lore-card">
                  <Terminal size={15} className="cb-lore-icon" />
                  <span className="cb-lore-text">{currentPhase.loreBriefing}</span>
                </div>
              </div>

              {/* Options Grid / Selection Matrix */}
              <div
                className={`cb-options-grid ${
                  currentPhase.key === 'targetRole'
                    ? 'grid-3-col'
                    : currentPhase.key === 'practiceTopics'
                    ? 'grid-pills-layout'
                    : currentPhase.key === 'skillLevel'
                    ? 'grid-tier-cards'
                    : 'grid-2-col'
                }`}
              >
                {currentPhase.options.map((opt) => {
                  const isSelected =
                    currentPhase.selectionType === 'single'
                      ? preferences[currentPhase.key as keyof GuardianPreferences] === opt.id
                      : (preferences.practiceTopics || []).includes(opt.id);

                  const glowCls = opt.glowColor ? `glow-${opt.glowColor}` : 'glow-cyan';

                  return (
                    <div
                      key={opt.id}
                      className={`cb-choice-card ${isSelected ? 'selected' : ''} ${glowCls} ${
                        opt.highlight ? 'recommended-highlight' : ''
                      }`}
                      onClick={() => {
                        if (currentPhase.selectionType === 'single') {
                          handleSingleSelect(opt.id, opt.glowColor);
                        } else {
                          handleMultiSelectToggle(opt.id);
                        }
                      }}
                      onMouseEnter={() => audioManager.playHover(isSelected ? 600 : 450)}
                    >
                      {/* Chamfered Tech Brackets */}
                      <div className="cb-card-bracket bracket-tl"></div>
                      <div className="cb-card-bracket bracket-br"></div>

                      <div className="cb-card-top-row">
                        <div className="cb-card-icon-crest">
                          {renderOptionIcon(opt.icon, 20)}
                        </div>

                        {opt.badge && (
                          <span className={`cb-opt-badge badge-${opt.glowColor || 'cyan'}`}>
                            {opt.badge}
                          </span>
                        )}

                        <div className={`cb-card-check ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                      </div>

                      <div className="cb-card-info">
                        <h4 className="cb-opt-title">{opt.title}</h4>
                        <p className="cb-opt-desc">{opt.description}</p>
                      </div>

                      {/* Tier buffs indicator if Phase 3 */}
                      {opt.tier && (
                        <div className="cb-tier-stat-strip">
                          <span className="tier-tag">TIER {opt.tier}</span>
                          <span className="tier-buff">
                            {opt.tier === 'I'
                              ? '+15% XP GAIN ON FUNDAMENTALS'
                              : opt.tier === 'II'
                              ? '+25% REPUTATION REWARDS'
                              : '+50% ARENA OVERCLOCK BOOST'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Custom Input for 'Other' option in Phase 1 or 2 */}
              {currentPhase.allowCustom &&
                ((currentPhase.key === 'primaryGoal' && preferences.primaryGoal === 'other_goal') ||
                  (currentPhase.key === 'targetRole' && preferences.targetRole === 'other_role')) && (
                  <div className="cb-custom-input-box">
                    <label className="cb-input-label">
                      <span>CUSTOM DIRECTIVE PARAMETER</span>
                      <span className="cb-label-tag">CUSTOM CODEX</span>
                    </label>
                    <div className="cb-input-wrapper">
                      <input
                        type="text"
                        className="cb-cyber-input"
                        placeholder={currentPhase.customPlaceholder}
                        value={currentPhase.key === 'primaryGoal' ? customGoalText : customRoleText}
                        onChange={(e) => {
                          if (currentPhase.key === 'primaryGoal') {
                            setCustomGoalText(e.target.value);
                          } else {
                            setCustomRoleText(e.target.value);
                          }
                        }}
                        autoFocus
                      />
                      <div className="cb-corner-bracket cb-corner-tl"></div>
                      <div className="cb-corner-bracket cb-corner-br"></div>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            /* Phase 8 / Final Holographic Matrix Synthesis Screen */
            <div className="cb-synthesis-dossier">
              <div className="cb-dossier-header-crest">
                <div className="cb-dossier-aura"></div>
                <Award size={48} className="cb-dossier-emblem" />
                <h3 className="cb-dossier-title">SENTINEL CALIBRATION COMPLETE</h3>
                <p className="cb-dossier-subtitle">
                  Neural matrix tuned. Your personalized combat curriculum and daily trials have been generated.
                </p>
              </div>

              <div className="cb-dossier-grid">
                {/* Sentinel Codex Card */}
                <div className="cb-dossier-card cb-sentinel-badge-card">
                  <div className="cb-card-bracket bracket-tl"></div>
                  <div className="cb-card-bracket bracket-br"></div>
                  <span className="cb-card-kicker">GUARDIAN PROFILE</span>
                  <div className="cb-sentinel-name-hero">
                    {user?.codexId || 'SENTINEL-VALKYRIE-07'}
                  </div>
                  <div className="cb-sentinel-rank-badge">
                    {preferences.skillLevel === 'advanced'
                      ? '👑 ARCHON GUARDIAN • TIER III'
                      : preferences.skillLevel === 'intermediate'
                      ? '⚔️ SENTINEL PRIME • TIER II'
                      : '🌱 GUARDIAN INITIATE • TIER I'}
                  </div>

                  <div className="cb-stat-metrics-list">
                    <div className="cb-metric-item">
                      <span className="cb-m-label">PRIMARY DIRECTIVE</span>
                      <span className="cb-m-val">
                        {preferences.primaryGoal === 'other_goal'
                          ? customGoalText || 'Custom Exploration'
                          : preferences.primaryGoal.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="cb-metric-item">
                      <span className="cb-m-label">DESIGNATED ROLE</span>
                      <span className="cb-m-val">
                        {preferences.targetRole === 'other_role'
                          ? customRoleText || 'Specialist'
                          : preferences.targetRole.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="cb-metric-item">
                      <span className="cb-m-label">DAILY ROTATION</span>
                      <span className="cb-m-val">{preferences.dailyCommitment.replace(/_/g, ' ').toUpperCase()}</span>
                    </div>

                    <div className="cb-metric-item">
                      <span className="cb-m-label">CHALLENGE ENGINE</span>
                      <span className="cb-m-val" style={{ color: '#00e5ff' }}>
                        {preferences.difficultyPreference.toUpperCase()} MATRIX
                      </span>
                    </div>

                    <div className="cb-metric-item">
                      <span className="cb-m-label">LEARNING HARMONY</span>
                      <span className="cb-m-val">{preferences.learningStyle.toUpperCase()} ORIENTED</span>
                    </div>
                  </div>
                </div>

                {/* Selected Practice Disciplines Card */}
                <div className="cb-dossier-card cb-disciplines-card">
                  <div className="cb-card-bracket bracket-tl"></div>
                  <div className="cb-card-bracket bracket-br"></div>
                  <span className="cb-card-kicker">ACTIVE TRAINING TOPICS ({preferences.practiceTopics.length})</span>

                  <div className="cb-active-topics-cloud">
                    {preferences.practiceTopics.map((topicId) => (
                      <span key={topicId} className="cb-active-topic-chip">
                        <Sparkles size={12} />
                        <span>{topicId.replace(/_/g, ' ').toUpperCase()}</span>
                      </span>
                    ))}
                  </div>

                  <div className="cb-sync-guarantee-note">
                    <Check size={16} className="cb-sync-check" />
                    <span>Dynamic problem sets & mission lore tuned to your calibration matrix.</span>
                  </div>

                  {/* Schema Export Button */}
                  <button
                    type="button"
                    className="cb-export-schema-btn"
                    onClick={handleExportJSON}
                    title="Export your calibration preferences as JSON schema"
                  >
                    <Download size={15} />
                    <span>EXPORT CALIBRATION JSON SCHEMA</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="cb-calib-footer">
          <div className="cb-footer-left">
            {currentPhaseIndex > 0 && !isSynthesisPhase && (
              <button
                type="button"
                className="cb-chamfer-nav-btn btn-nav-back"
                onClick={handleBack}
              >
                <ArrowLeft size={16} />
                <span>PREV PHASE</span>
              </button>
            )}

            {isSynthesisPhase && (
              <button
                type="button"
                className="cb-chamfer-nav-btn btn-nav-recalib"
                onClick={() => handleJumpToPhase(0)}
              >
                <RotateCcw size={15} />
                <span>RE-CALIBRATE MATRIX</span>
              </button>
            )}
          </div>

          <div className="cb-footer-right">
            {!isSynthesisPhase ? (
              <button
                type="button"
                className="cb-chamfer-nav-btn btn-nav-next"
                onClick={handleNext}
              >
                <span>
                  {currentPhaseIndex === totalPhases - 1
                    ? 'FINALIZE CALIBRATION'
                    : 'NEXT PHASE'}
                </span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="cb-chamfer-nav-btn btn-nav-engage"
                onClick={handleFinalizeCalibration}
              >
                <span className="cb-btn-sheen"></span>
                <Sparkles size={17} />
                <span>ENGAGE NEURAL LINK & ENTER AETHERIA</span>
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
