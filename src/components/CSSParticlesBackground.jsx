import React from 'react';

const CSSParticlesBackground = ({ isDarkMode, reduceMotion }) => {
  if (reduceMotion) return null;

  const lightColors = ['#93C5FD', '#A7F3D0', '#FDE68A'];
  const darkColors = ['#60A5FA', '#34D399', '#F59E0B'];
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 320 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 5 + 3}px`,
            height: `${Math.random() * 5 + 3}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            opacity: isDarkMode ? 0.7 : 0.6,
            animationDelay: `${Math.random() * 25}s`,
            animationDuration: `${12 + Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  );
};

export default CSSParticlesBackground;
