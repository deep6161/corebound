import React from 'react';
import { SectorData } from '../../types/world';

interface BottomDockProps {
  sectors: SectorData[];
  coreData: SectorData;
  selectedId: string | null;
  onSelect: (sector: SectorData) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  sectors,
  coreData,
  selectedId,
  onSelect
}) => {
  const allNodes = [
    sectors[0], // Origin (Ch 1)
    sectors[6], // Balance (Ch 2)
    sectors[1], // Scripture (Ch 3)
    sectors[7], // Resonance (Ch 4)
    coreData,   // The Core (Nexus)
    sectors[2], // History (Ch 5)
    sectors[5], // Essence (Ch 6)
    sectors[8], // Connection (Ch 7)
    sectors[3], // Language (Ch 8)
    sectors[4]  // Philosophy (Final)
  ];

  return (
    <nav className="bottom-dock" aria-label="Sector Quick Selector">
      {allNodes.map((sec, idx) => {
        const isCore = sec.id === 'core';
        const isSelected = selectedId === sec.id;
        const numLabel = isCore ? '★' : `${idx < 4 ? idx + 1 : idx}`;

        return (
          <button
            key={`dock-${sec.id}`}
            className={`dock-item ${isSelected ? 'active' : ''}`}
            onClick={() => onSelect(sec)}
            type="button"
          >
            <span className="dock-item-num">{numLabel}</span>
            <span>{sec.name}</span>
          </button>
        );
      })}
    </nav>
  );
};
