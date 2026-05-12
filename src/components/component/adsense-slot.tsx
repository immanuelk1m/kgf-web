'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdsenseSlotProps = {
  slot: string;
  className?: string;
  minHeight?: number;
};

export default function AdsenseSlot({ slot, className = '', minHeight = 90 }: AdsenseSlotProps) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // Ad blockers or delayed AdSense script loading should not break page rendering.
    }
  }, []);

  return (
    <div className={`w-full ${className}`} aria-label="Advertisement">
      <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
        Advertisement
      </div>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: 'block', minHeight }}
        data-ad-client="ca-pub-7656508177587264"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
