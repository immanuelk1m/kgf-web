import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-neutral-900 bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-red-700 text-sm font-black">K</div>
          <div>
            <div className="text-sm font-black tracking-tight">KOSPI Fear & Greed</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">Markets sentiment dashboard</div>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.16em] text-neutral-300 md:flex">
          <span>Overview</span>
          <span>Timeline</span>
          <span>Indicators</span>
          <span>FAQ</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
