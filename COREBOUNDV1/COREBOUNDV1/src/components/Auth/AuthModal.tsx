import React, { useState, useMemo } from 'react';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Sparkles,
  Globe,
  MessageSquare,
  ArrowRight,
  Check
} from 'lucide-react';
import { AuthMode, SentinelUser } from '../../types/auth';
import { audioManager } from '../../utils/audioManager';
import { setStoredSentinelUser, generateSentinelCodename, MOCK_DEMO_USER } from '../../utils/authStorage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onSuccess: (user: SentinelUser, shouldCalibrate: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberNeuralLink, setRememberNeuralLink] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotKeyOpen, setIsForgotKeyOpen] = useState(false);
  const [forgotKeyEmail, setForgotKeyEmail] = useState('');
  const [forgotKeyStatus, setForgotKeyStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'No Cipher Key', color: 'rgba(255,255,255,0.2)' };
    let s = 0;
    if (password.length >= 6) s += 1;
    if (password.length >= 10) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;

    if (s <= 1) return { score: 20, label: 'Unshielded Cipher (Weak)', color: '#ef4444' };
    if (s === 2) return { score: 45, label: 'Standard Sentinel (Moderate)', color: '#f59e0b' };
    if (s === 3 || s === 4) return { score: 80, label: 'Sentinel-Grade (Strong)', color: '#00e5ff' };
    return { score: 100, label: 'Quantum Overclocked (Invulnerable)', color: '#8b5cf6' };
  }, [password]);

  if (!isOpen) return null;

  const handleTabSwitch = (newMode: AuthMode) => {
    audioManager.playTabSwitch();
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleDemoAutofill = () => {
    audioManager.playSelect();
    setUsername('AegisRunner');
    setEmail('aegis.runner@corebound.io');
    setPassword('CyberMatrix#2026');
    setConfirmPassword('CyberMatrix#2026');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (mode === 'register') {
      if (!username.trim()) {
        audioManager.playErrorBuzz();
        setErrorMessage('Codex ID / Username is required to initialize your Sentinel.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        audioManager.playErrorBuzz();
        setErrorMessage('Valid Quantum Comms Email is required for neural verification.');
        return;
      }
      if (password.length < 6) {
        audioManager.playErrorBuzz();
        setErrorMessage('Secret Key must be at least 6 characters in complexity.');
        return;
      }
      if (password !== confirmPassword) {
        audioManager.playErrorBuzz();
        setErrorMessage('Cipher verification failed: Passwords do not match.');
        return;
      }
    } else {
      if (!email.trim()) {
        audioManager.playErrorBuzz();
        setErrorMessage('Enter your registered Email or Sentinel Codex ID.');
        return;
      }
      if (!password) {
        audioManager.playErrorBuzz();
        setErrorMessage('Enter your Secret Access Key to authenticate.');
        return;
      }
    }

    setIsSubmitting(true);
    audioManager.playSelect(700);

    setTimeout(() => {
      setIsSubmitting(false);

      if (mode === 'register') {
        const newUser: SentinelUser = {
          id: `usr_${Date.now()}`,
          codexId: generateSentinelCodename(username, 'General', 'I'),
          email: email.trim(),
          rankTitle: 'SENTINEL INITIATE',
          avatarSeed: username.trim(),
          xp: 500,
          credits: 200,
          isCalibrated: false,
          createdAt: new Date().toISOString(),
          neuralLinkActive: rememberNeuralLink
        };
        setStoredSentinelUser(newUser);
        audioManager.playCalibrationComplete();
        setSuccessMessage('SENTINEL IDENTITY INITIALIZED • ROUTING TO CALIBRATION MATRIX...');
        setTimeout(() => {
          onSuccess(newUser, true);
        }, 1200);
      } else {
        // Login
        const stored = localStorage.getItem('corebound_sentinel_user');
        let userToLogin: SentinelUser;
        if (stored) {
          try {
            userToLogin = JSON.parse(stored);
            userToLogin.neuralLinkActive = rememberNeuralLink;
          } catch {
            userToLogin = { ...MOCK_DEMO_USER, email: email.trim(), neuralLinkActive: rememberNeuralLink };
          }
        } else {
          userToLogin = {
            ...MOCK_DEMO_USER,
            email: email.trim(),
            codexId: email.split('@')[0].toUpperCase() + '-07',
            neuralLinkActive: rememberNeuralLink
          };
        }

        setStoredSentinelUser(userToLogin);
        audioManager.playSelect(880);
        setSuccessMessage('ACCESS LINK ESTABLISHED • WELCOME BACK GUARDIAN');
        setTimeout(() => {
          onSuccess(userToLogin, !userToLogin.isCalibrated);
        }, 1000);
      }
    }, 850);
  };

  const handleSocialAuth = (provider: 'Google' | 'GitHub' | 'Discord') => {
    audioManager.playCyberClick();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const socialUser: SentinelUser = {
        id: `usr_${provider.toLowerCase()}_${Date.now()}`,
        codexId: `${provider.toUpperCase()}-LINK-${Math.floor(100 + Math.random() * 900)}`,
        email: `guardian.${provider.toLowerCase()}@corebound.io`,
        rankTitle: 'GUARDIAN INITIATE',
        avatarSeed: provider,
        xp: 1200,
        credits: 450,
        isCalibrated: false,
        createdAt: new Date().toISOString(),
        neuralLinkActive: true
      };
      setStoredSentinelUser(socialUser);
      audioManager.playCalibrationComplete();
      setSuccessMessage(`${provider.toUpperCase()} NEURAL LINK LINKED • ROUTING TO CALIBRATION...`);
      setTimeout(() => {
        onSuccess(socialUser, true);
      }, 1000);
    }, 700);
  };

  const handleForgotKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotKeyEmail.trim() || !forgotKeyEmail.includes('@')) {
      audioManager.playErrorBuzz();
      setForgotKeyStatus('Please provide a valid Sentinel email transmission frequency.');
      return;
    }
    audioManager.playSelect();
    setForgotKeyStatus('Cipher reset transmission dispatched to your neural frequency inbox.');
    setTimeout(() => {
      setIsForgotKeyOpen(false);
      setForgotKeyStatus(null);
      setForgotKeyEmail('');
    }, 2500);
  };

  return (
    <div className="cb-modal-overlay" onClick={onClose}>
      <div className="cb-auth-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Futuristic Glowing Ambient Orbs */}
        <div className="cb-glow-orb cb-glow-orb-cyan"></div>
        <div className="cb-glow-orb cb-glow-orb-purple"></div>

        {/* Modal Header Bar with Chamfered Cyber Accents */}
        <div className="cb-modal-header">
          <div className="cb-header-branding">
            <div className="cb-crest-glow-badge">
              <Sparkles size={18} className="cb-neon-icon" />
            </div>
            <div className="cb-title-text-group">
              <span className="cb-header-kicker">COREBOUND SECURITY MAINFRAME</span>
              <h2 className="cb-modal-heading">
                {mode === 'login' ? 'SENTINEL ACCESS LINK' : 'INITIALIZE SENTINEL'}
              </h2>
            </div>
          </div>

          <button
            className="cb-close-btn"
            onClick={() => {
              audioManager.playHover(300);
              onClose();
            }}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Seamless Cyber Tabs */}
        <div className="cb-auth-tabs">
          <button
            type="button"
            className={`cb-auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            <ShieldCheck size={16} />
            <span>LOGIN (ACCESS LINK)</span>
            {mode === 'login' && <div className="cb-active-laser-bar"></div>}
          </button>

          <button
            type="button"
            className={`cb-auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            <Zap size={16} />
            <span>REGISTER (INITIALIZE SENTINEL)</span>
            {mode === 'register' && <div className="cb-active-laser-bar"></div>}
          </button>
        </div>

        {/* Demo Quick Fill Pill */}
        <div className="cb-demo-fill-row">
          <button
            type="button"
            className="cb-demo-autofill-btn"
            onClick={handleDemoAutofill}
            title="Auto-fill sample credentials for quick evaluation"
          >
            <Sparkles size={13} />
            <span>AUTOFILL DEMO CREDENTIALS</span>
          </button>
        </div>

        {/* Holographic Alerts */}
        {errorMessage && (
          <div className="cb-hologram-alert cb-alert-danger">
            <AlertTriangle size={17} className="cb-alert-icon" />
            <span className="cb-alert-text">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="cb-hologram-alert cb-alert-success">
            <Check size={17} className="cb-alert-icon" />
            <span className="cb-alert-text">{successMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form className="cb-auth-form" onSubmit={handleSubmit}>
          {/* Register: Username / Codex ID */}
          {mode === 'register' && (
            <div className="cb-input-group">
              <label className="cb-input-label">
                <span>SENTINEL CODEX ID / USERNAME</span>
                <span className="cb-label-tag">UNIQUE ID</span>
              </label>
              <div className="cb-input-wrapper">
                <span className="cb-field-icon"><User size={18} /></span>
                <input
                  type="text"
                  className="cb-cyber-input"
                  placeholder="e.g. NexusHunter, Valkyrie99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => audioManager.playHover(500)}
                  required
                />
                <div className="cb-corner-bracket cb-corner-tl"></div>
                <div className="cb-corner-bracket cb-corner-br"></div>
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="cb-input-group">
            <label className="cb-input-label">
              <span>{mode === 'login' ? 'EMAIL OR SENTINEL CODEX ID' : 'QUANTUM TRANSMISSION EMAIL'}</span>
              <span className="cb-label-tag">COMMS LINK</span>
            </label>
            <div className="cb-input-wrapper">
              <span className="cb-field-icon"><Mail size={18} /></span>
              <input
                type="email"
                className="cb-cyber-input"
                placeholder="guardian@corebound.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => audioManager.playHover(500)}
                required
              />
              <div className="cb-corner-bracket cb-corner-tl"></div>
              <div className="cb-corner-bracket cb-corner-br"></div>
            </div>
          </div>

          {/* Password / Secret Key */}
          <div className="cb-input-group">
            <div className="cb-label-flex">
              <label className="cb-input-label">
                <span>SECRET ACCESS KEY (PASSWORD)</span>
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="cb-link-btn"
                  onClick={() => {
                    audioManager.playCyberClick();
                    setIsForgotKeyOpen(true);
                  }}
                >
                  Forgot Access Key?
                </button>
              )}
            </div>

            <div className="cb-input-wrapper">
              <span className="cb-field-icon"><Lock size={18} /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="cb-cyber-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => audioManager.playHover(500)}
                required
              />
              <button
                type="button"
                className="cb-eye-toggle-btn"
                onClick={() => {
                  audioManager.playCyberClick();
                  setShowPassword(!showPassword);
                }}
                aria-label={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <div className="cb-corner-bracket cb-corner-tl"></div>
              <div className="cb-corner-bracket cb-corner-br"></div>
            </div>

            {/* Password Strength Meter (On Register or typing) */}
            {password.length > 0 && (
              <div className="cb-password-strength-bar">
                <div className="cb-strength-meter-track">
                  <div
                    className="cb-strength-meter-fill"
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color,
                      boxShadow: `0 0 10px ${passwordStrength.color}`
                    }}
                  ></div>
                </div>
                <div className="cb-strength-meta">
                  <span className="cb-strength-label">CIPHER SECURITY:</span>
                  <span className="cb-strength-val" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Register mode only) */}
          {mode === 'register' && (
            <div className="cb-input-group">
              <label className="cb-input-label">
                <span>CONFIRM SECRET ACCESS KEY</span>
                <span className="cb-label-tag">VERIFICATION</span>
              </label>
              <div className="cb-input-wrapper">
                <span className="cb-field-icon"><Lock size={18} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="cb-cyber-input"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => audioManager.playHover(500)}
                  required
                />
                <div className="cb-corner-bracket cb-corner-tl"></div>
                <div className="cb-corner-bracket cb-corner-br"></div>
              </div>
            </div>
          )}

          {/* Remember Neural Link Checkbox */}
          <div className="cb-checkbox-row">
            <label className="cb-cyber-checkbox-label">
              <input
                type="checkbox"
                checked={rememberNeuralLink}
                onChange={(e) => {
                  audioManager.playCyberClick();
                  setRememberNeuralLink(e.target.checked);
                }}
              />
              <span className="cb-custom-checkbox">
                {rememberNeuralLink && <Check size={12} strokeWidth={3} />}
              </span>
              <span className="cb-checkbox-text">
                Remember Neural Link (Persist Guardian Codex Session)
              </span>
            </label>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            className="cb-primary-submit-btn"
            disabled={isSubmitting}
            onClick={() => audioManager.playCyberClick()}
          >
            <span className="cb-btn-sheen"></span>
            <span className="cb-btn-text">
              {isSubmitting
                ? 'AUTHENTICATING NEURAL LINK...'
                : mode === 'login'
                ? 'ESTABLISH ACCESS LINK'
                : 'INITIALIZE SENTINEL & CALIBRATE'}
            </span>
            <ArrowRight size={18} className="cb-btn-arrow" />
          </button>
        </form>

        {/* Divider */}
        <div className="cb-auth-divider">
          <span className="cb-divider-line"></span>
          <span className="cb-divider-text">OR CONNECT VIA NEURAL CAPSULE</span>
          <span className="cb-divider-line"></span>
        </div>

        {/* Social / SSO Buttons */}
        <div className="cb-sso-grid">
          <button
            type="button"
            className="cb-sso-capsule-btn sso-google"
            onClick={() => handleSocialAuth('Google')}
          >
            <Globe size={18} className="cb-sso-icon" />
            <div className="cb-sso-info">
              <span className="sso-label">Google Gateway</span>
              <span className="sso-status">Quantum SSO</span>
            </div>
          </button>

          <button
            type="button"
            className="cb-sso-capsule-btn sso-github"
            onClick={() => handleSocialAuth('GitHub')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cb-sso-icon">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <div className="cb-sso-info">
              <span className="sso-label">GitHub Codex</span>
              <span className="sso-status">Repo Link</span>
            </div>
          </button>

          <button
            type="button"
            className="cb-sso-capsule-btn sso-discord"
            onClick={() => handleSocialAuth('Discord')}
          >
            <MessageSquare size={18} className="cb-sso-icon" />
            <div className="cb-sso-info">
              <span className="sso-label">Discord Comms</span>
              <span className="sso-status">Neural Relay</span>
            </div>
          </button>
        </div>

        {/* Forgot Key Modal Overlay */}
        {isForgotKeyOpen && (
          <div className="cb-nested-forgot-modal" onClick={() => setIsForgotKeyOpen(false)}>
            <div className="cb-forgot-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="cb-modal-header">
                <div className="cb-header-branding">
                  <span className="cb-header-kicker">ACCESS KEY RECOVERY PROTOCOL</span>
                  <h3 className="cb-modal-heading">RESET SECRET CIPHER</h3>
                </div>
                <button
                  className="cb-close-btn"
                  onClick={() => setIsForgotKeyOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <p className="cb-forgot-desc">
                Transmitting an encoded decryption beacon to your designated Neural Email channel will allow you to reforge your Codex Access Key.
              </p>

              {forgotKeyStatus && (
                <div className="cb-hologram-alert cb-alert-success">
                  <Check size={16} />
                  <span>{forgotKeyStatus}</span>
                </div>
              )}

              <form onSubmit={handleForgotKeySubmit}>
                <div className="cb-input-group">
                  <label className="cb-input-label">SENTINEL COMMS EMAIL</label>
                  <div className="cb-input-wrapper">
                    <span className="cb-field-icon"><Mail size={18} /></span>
                    <input
                      type="email"
                      className="cb-cyber-input"
                      placeholder="guardian@corebound.io"
                      value={forgotKeyEmail}
                      onChange={(e) => setForgotKeyEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="cb-modal-actions-row">
                  <button
                    type="button"
                    className="cb-secondary-btn"
                    onClick={() => setIsForgotKeyOpen(false)}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="cb-primary-submit-btn">
                    DISPATCH CIPHER BEACON
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
