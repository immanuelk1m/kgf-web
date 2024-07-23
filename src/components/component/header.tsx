'use client';

import React from 'react';
import AdsenseOnheader from '@/components/component/adsensehd';
const Ad = () => (
  <div className="bg-[#F2FBF7] text-white h-full transition-all duration-300">0
    <AdsenseOnheader/>
  </div>
);

const Header: React.FC = () => {

  return (
    <div style={{ height: `${280}px`, overflow: 'hidden', transition: 'height 0.3s' }}>
      <Ad />
    </div>
  );
};

export default Header;
