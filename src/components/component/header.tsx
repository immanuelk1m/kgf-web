'use client';

import React from 'react';
import AdsenseOnheader from '@/components/component/adsensehd';

const Ad = () => (
  <div className="bg-[#F2FBF7] h-full justify-center">
    <AdsenseOnheader/>
  </div>
);

const Header: React.FC = () => {
  return (
    <div style={{ height: 'auto', minHeight: '300px' }}>
      <Ad />
    </div>
  );
};

export default Header;