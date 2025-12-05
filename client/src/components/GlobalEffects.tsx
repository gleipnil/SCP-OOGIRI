"use client";

import React from 'react';

export default function GlobalEffects() {
  return (
    <>
      <div
        id="global-scanlines"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 2147483647,

          // Reverting to the "Classic" subtle scanline design
          // but using inline styles to ensure it renders over the background.
          background: `
                linear-gradient(
                    to bottom,
                    rgba(18, 16, 16, 0) 50%,
                    rgba(0, 0, 0, 0.25) 50%
                ),
                linear-gradient(
                    90deg,
                    rgba(255, 0, 0, 0.06),
                    rgba(0, 255, 0, 0.02),
                    rgba(0, 0, 255, 0.06)
                )
            `,
          backgroundSize: '100% 2px, 3px 100%' // Original tight pitch
        }}
      />

      {/* Flicker Animation Layer */}
      <div
        className="flicker-animation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 2147483647,
          background: 'rgba(18, 16, 16, 0.1)',
          opacity: 0,
        }}
      />

      <style jsx global>{`
        .flicker-animation {
          animation: flicker 0.15s infinite;
        }
        @keyframes flicker {
          0% { opacity: 0.97; }
          5% { opacity: 0.95; }
          10% { opacity: 0.9; }
          15% { opacity: 0.95; }
          20% { opacity: 0.99; }
          100% { opacity: 0.94; }
        }
      `}</style>
    </>
  );
}
