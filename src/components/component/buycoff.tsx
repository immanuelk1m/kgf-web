'use client';

import React from 'react';

export function BuyCoffee() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hidden image */}
      <img 
        src="https://raw.githubusercontent.com/immanuelk1m/kgf-web/master/public/ogimage.jpg" 
        alt="Hidden OG Image" 
        className="hidden" 
      />
      
      <a 
        href="https://link.coupang.com/a/cigd7h" 
        target="_blank" 
        referrerPolicy="unsafe-url"
        className="transition-transform duration-300 hover:scale-105 rounded-lg overflow-hidden shadow-md"
      >
        <img 
          src="https://ads-partners.coupang.com/banners/845712?subId=&traceId=V0-301-879dd1202e5c73b2-I845712&w=300&h=250" 
          alt="Coupang Banner"
          className="w-full h-auto"
        />
      </a>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
        해당 광고는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}

export default BuyCoffee;