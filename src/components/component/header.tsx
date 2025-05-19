'use client';
import React from 'react';
import AdsenseOnheader from '@/components/component/adsensehd';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 py-4 shadow-sm">
      <div className="container mx-auto flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 hidden">코스피 공포 & 탐욕 지수</h1>
        <AdsenseOnheader />
      </div>
    </header>
  );
};

export default Header;