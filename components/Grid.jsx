"use client";
import React from 'react';

const GridBackground = ({
  gridColor = '#2a2a2a',
  gridSize = 80,
  gridOpacity = 0.7,
  gradientColor = 'rgba(51, 97, 234, 0.3)',
  className = ''
}) => {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          opacity: gridOpacity,
          mask: 'linear-gradient(to bottom, black 70%, transparent)',
          WebkitMask: 'linear-gradient(to bottom, black 70%, transparent)'
        }}
      />

      {/* Top left gradient */}
      <div
        className="absolute top-0 left-0 w-[200px] h-[200px] animate-pulse"
        style={{
          background: `radial-gradient(circle at 25% 25%,
            ${gradientColor} 0%,
            transparent 70%
          )`,
          animation: 'twinkle 4s ease-in-out infinite',
          animationDelay: '0s'
        }}
      />

      {/* Top right gradient */}
      <div
        className="absolute top-0 right-0 w-[100px] h-[100px] animate-pulse"
        style={{
          background: `radial-gradient(circle at 75% 25%,
            ${gradientColor} 0%,
            transparent 70%
          )`,
          animation: 'twinkle 4s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default GridBackground;