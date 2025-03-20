'use client';
import React from 'react';
import AdsenseOnheader from '@/components/component/adsensehd';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-700 dark:to-teal-600 rounded-xl shadow-md overflow-hidden">
      <div className="flex flex-col items-center justify-center p-4 min-h-[250px]">
        <h1 className="text-3xl font-extrabold text-white mb-6 hidden">코스피 공포 & 탐욕 지수</h1>
        <AdsenseOnheader />
      </div>
    </header>
  );
};

export default Header;