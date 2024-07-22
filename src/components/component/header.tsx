'use client';
import React, { useState, useEffect, useCallback } from 'react';

const Ad = () => (
  <div className="bg-green-700 text-white h-full transition-all duration-300">
    <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4">
      <div className="flex items-center">
        {/* Ad content */}
      </div>
    </div>
  </div>
);

const Header: React.FC = () => {
  const [adHeight, setAdHeight] = useState(280);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    if (scrollPosition === lastScrollY) return; // Scroll이 변하지 않았으면 무시
    setLastScrollY(scrollPosition);

    const newHeight = Math.max(0, 280 - scrollPosition);
    if (newHeight !== adHeight) {
      setAdHeight(newHeight);
    }
  }, [adHeight, lastScrollY]);

  useEffect(() => {
    const onScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  return (
    <div style={{ height: `${adHeight}px`, overflow: 'hidden', transition: 'height 0.3s' }}>
      <Ad />
    </div>
  );
};

export default Header;
