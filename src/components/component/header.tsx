'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // usePathname 훅 가져오기
import { HomeIcon, MenuIcon, XIcon, TrendingUpIcon, InfoIcon } from 'lucide-react'; // 아이콘 추가
// import AdsenseOnheader from '@/components/component/adsensehd';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // 현재 경로 가져오기

  const navItems = [
    { href: '/', label: '홈', icon: <HomeIcon className="w-4 h-4" /> },
    { href: '/#fear-greed-index', label: '공포탐욕지수', icon: <TrendingUpIcon className="w-4 h-4" /> },
    { href: '/about', label: '소개', icon: <InfoIcon className="w-4 h-4" /> }, // 예시: 소개 페이지
  ];

  const isActive = (href: string) => {
    // 홈페이지('/')의 경우, 정확히 '/' 이거나 '/#...' 형태일 때 활성화
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/#');
    }
    // 다른 페이지의 경우, 현재 경로가 해당 href로 시작하면 활성화
    // 예: href가 '/about'이고 pathname이 '/about' 또는 '/about#section'일 때
    return pathname === href || pathname.startsWith(href + '/#');
  };

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
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'text-primary font-semibold bg-gray-100 dark:bg-gray-700'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            );
          })}
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
      <div
        className={`
          md:hidden bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700
          absolute top-full left-0 right-0 z-40
          transition-all duration-300 ease-in-out transform
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        <nav className="container mx-auto px-4 py-2 flex flex-col space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'text-primary font-semibold bg-gray-100 dark:bg-gray-700'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)} // 링크 클릭 시 메뉴 닫기
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            );
          })}
          {/* <div className="pt-2">
            <AdsenseOnheader />
          </div> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;