'use client';

import React from 'react';
import AdsenseOnheader from '@/components/component/adsensehd';

const Ad = () => (
  <div className="bg-[#F2FBF7] text-white h-full flex justify-center items-center transition-all duration-300">
    <AdsenseOnheader/>
  </div>
);

const Header: React.FC = () => {
  return (
    <div style={{ height: `${300}px`, overflow: 'hidden', transition: 'height 0.3s' }}>
      <Ad />
    </div>
  );
};

export default Header;