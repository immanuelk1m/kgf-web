'use client';
import React from 'react';
import AdsenseOnheader from '@/components/component/adsensehd';

const Header: React.FC = () => {
  return (
    <div style={{ height: 'auto', minHeight: '300px' }}>
      <div className="bg-[#F2FBF7] h-full" style={{ textAlign: 'center' }}>
        <AdsenseOnheader />
      </div>
    </div>
  );
};

export default Header;