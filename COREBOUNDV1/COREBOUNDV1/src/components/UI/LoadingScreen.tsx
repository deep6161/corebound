import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 800);
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 14) + 6;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`loading-screen-container ${isFadingOut ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #100628 0%, #03010c 100%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto'
      }}
    >
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: '28px',
          right: '36px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          color: '#e9d5ff',
          padding: '8px 16px',
          borderRadius: '100px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.15em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <span>SKIP INTRO</span>
        <ArrowRight size={14} />
      </button>

      {/* Center Awakening Brand */}
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 20px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #a855f7 0%, rgba(168, 85, 247, 0.1) 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.7)'
          }}
        >
          <Sparkles size={32} color="#ffffff" />
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '32px',
            fontWeight: 900,
            letterSpacing: '0.35em',
            background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}
        >
          COREBOUND
        </h1>

        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            color: 'rgba(216, 180, 254, 0.75)',
            textTransform: 'uppercase',
            marginBottom: '32px'
          }}
        >
          THE CORE IS AWAKENING...
        </p>

        {/* Animated Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '14px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #9333ea, #a855f7, #38bdf8)',
              borderRadius: '10px',
              transition: 'width 0.15s ease-out',
              boxShadow: '0 0 15px #a855f7'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(192, 132, 252, 0.6)' }}>
          <span>SYNCHRONIZING CELESTIAL REALMS</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
