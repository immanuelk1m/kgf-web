'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, MenuIcon, XIcon, TrendingUpIcon, InfoIcon } from 'lucide-react'; // 아이콘 추가
// import AdsenseOnheader from '@/components/component/adsensehd';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: '홈', icon: <HomeIcon className="w-4 h-4" /> },
    { href: '/#fear-greed-index', label: '공포탐욕지수', icon: <TrendingUpIcon className="w-4 h-4" /> },
    { href: '/about', label: '소개', icon: <InfoIcon className="w-4 h-4" /> }, // 예시: 소개 페이지
  ];

  return (
    <header className="w-full bg-white dark:bg-gray-800 py-4 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* 로고 또는 서비스명 영역 */}
        <Link href="/" className="flex items-center">
          {/* <img src="/logo.svg" alt="로고" className="h-8 w-auto mr-3" /> */}
          <span className="text-xl font-semibold text-gray-800 dark:text-white">코스피 공포 & 탐욕 지수</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          ))}
          {/* <AdsenseOnheader /> */} {/* 기존 광고 컴포넌트 위치 유지 (주석 처리) */}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 모바일 네비게이션 (드롭다운) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
          <nav className="container mx-auto px-4 py-2 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)} // 링크 클릭 시 메뉴 닫기
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
            {/* <div className="pt-2">
              <AdsenseOnheader />
            </div> */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;