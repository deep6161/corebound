import React, { useRef, useEffect } from 'react';
import { SectorData } from '../../types/world';
import { SECTORS, CORE_DATA } from '../../data/worldData';
import { Zap, Sparkles, Compass, Shield, Lock } from 'lucide-react';

interface SectorMap2DProps {
  hoveredId: string | null;
  selectedSector: SectorData | null;
  onHover: (id: string | null) => void;
  onSelect: (sector: SectorData) => void;
  onResetView: () => void;
  isIntroPlaying: boolean;
}

export const SectorMap2D: React.FC<SectorMap2DProps> = ({
  hoveredId,
  selectedSector,
  onHover,
  onSelect,
  onResetView,
  isIntroPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance 2D Canvas ambient starfield & cosmic dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize ambient particles
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.6 ? '#a855f7' : Math.random() > 0.3 ? '#00d9ff' : '#6366f1'
    }));

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep space radial gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, '#0c0724');
      bgGrad.addColorStop(0.5, '#060317');
      bgGrad.addColorStop(1, '#020108');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint cybernetic grid rings
      const cx = width * 0.5;
      const cy = height * 0.5;
      const ringRadii = [140, 260, 390];

      ctx.save();
      ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(0, 217, 255, 0.12)' : 'rgba(168, 85, 247, 0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 8]);
        ctx.stroke();
      });
      ctx.restore();

      // Render cosmic particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(tick * p.pulseSpeed) * 0.2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate 2D orbital layout for the sectors
  const totalSectors = SECTORS.length;
  const sectorPositions = SECTORS.map((sector, index) => {
    // 2 orbits: inner orbit (3 items) and outer orbit (6 items)
    const isInner = index < 3;
    const countInOrbit = isInner ? 3 : totalSectors - 3;
    const orbitIdx = isInner ? index : index - 3;
    const radius = isInner ? 32 : 46; // percentage of viewport radius
    const angleOffset = isInner ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / countInOrbit;
    const angle = angleOffset + (orbitIdx * 2 * Math.PI) / countInOrbit;

    // x, y in percentages (-50% to +50% from center)
    const px = Math.cos(angle) * (radius * 0.95);
    const py = Math.sin(angle) * (radius * 0.82);

    return {
      sector,
      px,
      py
    };
  });

  return (
    <div className={`sector-map-2d-viewport ${isIntroPlaying ? 'intro-animating' : ''}`}>
      {/* Background 2D Starfield Canvas */}
      <canvas ref={canvasRef} className="sector-map-canvas" />

      {/* SVG Energy Conduits Connecting Core to Sectors */}
      <svg className="sector-energy-svg" viewBox="-500 -400 1000 800">
        <defs>
          <linearGradient id="coreEnergyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {sectorPositions.map(({ sector, px, py }) => {
          const isHovered = hoveredId === sector.id;
          const isSelected = selectedSector?.id === sector.id;
          const targetX = px * 8.5;
          const targetY = py * 7.5;

          return (
            <g key={`conduit-${sector.id}`}>
              {/* Background Beam */}
              <line
                x1="0"
                y1="0"
                x2={targetX}
                y2={targetY}
                stroke={sector.color}
                strokeOpacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.25}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                strokeDasharray={isSelected ? 'none' : '4 6'}
                filter="url(#glowFilter)"
              />

              {/* Pulsing Energy Dot */}
              {(isHovered || isSelected) && (
                <circle r="3" fill={sector.color} filter="url(#glowFilter)">
                  <animateMotion
                    path={`M 0 0 L ${targetX} ${targetY}`}
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Constellation Hub Container */}
      <div className="sector-nodes-overlay">
        {/* CENTER: The Singularity Core */}
        <div
          className={`core-node-2d ${selectedSector?.id === 'core' ? 'is-selected' : ''} ${
            hoveredId === 'core' ? 'is-hovered' : ''
          }`}
          onClick={() => onSelect(CORE_DATA)}
          onMouseEnter={() => onHover('core')}
          onMouseLeave={() => onHover(null)}
          title="The Singularity Core"
        >
          <div className="core-node-pulse-ring" />
          <div className="core-node-orbital-ring" />
          <div className="core-node-inner">
            <Zap className="core-node-icon" size={26} />
            <span className="core-node-label">THE CORE</span>
          </div>
          <div className="core-node-status-badge">
            <Shield size={12} />
            <span>{CORE_DATA.stars} / 5</span>
          </div>
        </div>

        {/* ORBITAL SECTOR NODES */}
        {sectorPositions.map(({ sector, px, py }) => {
          const isSelected = selectedSector?.id === sector.id;
          const isHovered = hoveredId === sector.id;

          return (
            <div
              key={sector.id}
              className={`sector-node-2d ${isSelected ? 'is-selected' : ''} ${
                isHovered ? 'is-hovered' : ''
              }`}
              style={{
                left: `calc(50% + ${px}%)`,
                top: `calc(50% + ${py}%)`,
                borderColor: isSelected || isHovered ? sector.color : 'rgba(255, 255, 255, 0.12)',
                boxShadow: isSelected
                  ? `0 0 30px ${sector.glow}, 0 0 15px ${sector.color}`
                  : isHovered
                  ? `0 0 20px ${sector.glow}`
                  : '0 4px 20px rgba(0, 0, 0, 0.6)'
              }}
              onClick={() => onSelect(sector)}
              onMouseEnter={() => onHover(sector.id)}
              onMouseLeave={() => onHover(null)}
            >
              {/* Sector Header / Chapter Badge */}
              <div className="sector-node-header" style={{ color: sector.secondaryColor }}>
                <span className="sector-node-chapter">{sector.chapter.split('•')[0].trim()}</span>
                <span className="sector-node-stars">
                  ★ {sector.stars}/{sector.totalStars}
                </span>
              </div>

              {/* Sector Main Content */}
              <div className="sector-node-body">
                <div
                  className="sector-node-icon-wrap"
                  style={{
                    backgroundColor: `${sector.color}22`,
                    borderColor: sector.color,
                    color: sector.color
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <div className="sector-node-info">
                  <h4 className="sector-node-name">{sector.name}</h4>
                  <span className="sector-node-domain">{sector.domain}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="sector-node-footer">
                {sector.unlocked ? (
                  <span className="status-pill unlocked" style={{ color: sector.color }}>
                    <Compass size={11} /> READY
                  </span>
                ) : (
                  <span className="status-pill locked">
                    <Lock size={11} /> LOCKED
                  </span>
                )}
                <span className="sector-node-inspect-hint">INSPECT →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorMap2D;
