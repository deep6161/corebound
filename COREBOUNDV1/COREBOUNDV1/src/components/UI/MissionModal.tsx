import React from 'react';
import { SectorData } from '../../types/world';
import { KNOWLEDGE_DOMAINS } from '../../data/worldData';
import {
  X,
  Star,
  Play,
  Lock,
  Sparkles,
  Leaf,
  BookOpen,
  Database,
  MessageSquare,
  Compass,
  Cpu,
  Scale,
  Flame,
  Share2
} from 'lucide-react';

interface MissionModalProps {
  sector: SectorData | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSectorById: (id: string) => void;
}

const renderIcon = (iconName: string, size = 32) => {
  switch (iconName) {
    case 'leaf':
      return <Leaf size={size} />;
    case 'book':
      return <BookOpen size={size} />;
    case 'database':
      return <Database size={size} />;
    case 'message-square':
      return <MessageSquare size={size} />;
    case 'compass':
      return <Compass size={size} />;
    case 'cpu':
      return <Cpu size={size} />;
    case 'scale':
      return <Scale size={size} />;
    case 'flame':
      return <Flame size={size} />;
    case 'share-2':
      return <Share2 size={size} />;
    case 'sparkles':
    default:
      return <Sparkles size={size} />;
  }
};

export const MissionModal: React.FC<MissionModalProps> = ({
  sector,
  isOpen,
  onClose,
  onSelectSectorById
}) => {
  if (!sector) return null;

  const isCore = sector.id === 'core';

  return (
    <div
      id="briefingModalOverlay"
      className={isOpen ? 'active' : ''}
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'briefingModalOverlay') {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <aside
        className="briefing-panel"
        style={
          {
            '--modal-color': sector.color,
            '--modal-glow': sector.glow
          } as React.CSSProperties
        }
      >
        {/* Header */}
        <div className="panel-header">
          <div className="panel-title-area">
            <span className="panel-chapter-tag">{sector.chapter}</span>
            <h2 className="panel-sector-title">{sector.name}</h2>
            <div className="panel-subtitle-tag" style={{ color: sector.color, fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}>
              {sector.subtitle}
            </div>
          </div>
          <button className="close-btn" type="button" onClick={onClose} aria-label="Close Panel">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="panel-body">
          {/* Hero Badge */}
          <div className="sector-hero-badge">
            {renderIcon(sector.iconSvg, 48)}
          </div>

          {/* Description & Lore */}
          <div className="sector-desc-text">
            <p style={{ marginBottom: '8px' }}>{sector.description}</p>
            <p style={{ fontStyle: 'italic', fontSize: '12px', color: 'rgba(216, 180, 254, 0.7)' }}>
              "{sector.lore}"
            </p>
          </div>

          {/* Standard Missions (for regular islands) */}
          {!isCore && (
            <div className="missions-section">
              <div className="missions-section-title">
                <span>AVAILABLE MISSIONS</span>
                <span className="missions-progress-count">{sector.missions.length} TRIALS</span>
              </div>
              <div className="missions-list">
                {sector.missions.map((m, idx) => (
                  <div key={`mission-${idx}`} className="mission-item">
                    <div className="mission-left">
                      <span className="mission-idx">{idx + 1}</span>
                      <div>
                        <div className="mission-name">{m.name}</div>
                        <div className="mission-difficulty">{m.diff}</div>
                      </div>
                    </div>
                    <div className="sector-stars">
                      {[1, 2, 3].map((starNum) => (
                        <Star
                          key={`star-${starNum}`}
                          size={13}
                          className={m.stars >= starNum ? '' : 'empty'}
                          fill={m.stars >= starNum ? '#eab308' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Domains Matrix (for The Core) */}
          {isCore && (
            <div className="missions-section">
              <div className="missions-section-title">
                <span>KNOWLEDGE DOMAINS</span>
                <span className="missions-progress-count">9 SECTORS</span>
              </div>
              <div className="missions-list" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {KNOWLEDGE_DOMAINS.map((domain, idx) => (
                  <div
                    key={`domain-${idx}`}
                    className="mission-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectSectorById(domain.sectorId)}
                  >
                    <div className="mission-left">
                      <span className="mission-idx" style={{ background: domain.unlocked ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)' }}>
                        {renderIcon(domain.icon, 12)}
                      </span>
                      <div>
                        <div className="mission-name" style={{ fontSize: '13px' }}>{domain.name}</div>
                        <div className="mission-difficulty" style={{ fontSize: '10px' }}>{domain.description}</div>
                      </div>
                    </div>
                    <div>
                      {domain.unlocked ? (
                        <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>ACTIVE</span>
                      ) : (
                        <Lock size={12} color="rgba(255,255,255,0.3)" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="panel-footer">
          {sector.unlocked ? (
            <a href={sector.playUrl} className="launch-sector-btn">
              <span>{isCore ? 'COMMUNE WITH CORE' : 'ENTER SECTOR'}</span>
              <Play size={17} fill="currentColor" />
            </a>
          ) : (
            <div className="launch-sector-btn disabled">
              <Lock size={16} />
              <span>SECTOR LOCKED</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
