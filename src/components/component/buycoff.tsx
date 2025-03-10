'use client';

import React from 'react';

export function BuyCoffee() {
  return (
    <div>
      {/* Hidden image */}
      <img 
        src="https://raw.githubusercontent.com/immanuelk1m/kgf-web/master/public/ogimage.jpg" 
        alt="Hidden OG Image" 
        style={{ display: 'none' }} 
      />
      
      {/* Visible Coupang banner 
      <a href="https://link.coupang.com/a/cigd7h" target="_blank" referrerPolicy="unsafe-url">
        <img src="https://ads-partners.coupang.com/banners/845712?subId=&traceId=V0-301-879dd1202e5c73b2-I845712&w=300&h=250" alt="Coupang Banner" />
      </a>*/}
      <p style={{ color: 'gray' }}>해당 광고는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</p>
    </div>
  );
}

export default BuyCoffee;