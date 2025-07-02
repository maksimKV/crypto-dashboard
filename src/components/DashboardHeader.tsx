import React from 'react';
import type { Tab } from './Tabs';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, tabs, activeTab, onTabChange, children }: DashboardHeaderProps) {
  return (
    <div className="mb-10 rounded-2xl shadow-lg px-1 sm:px-6 md:px-12 pt-10 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100 flex flex-col items-center w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 pb-2 text-center bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm w-full break-words leading-normal">
          {title}
        </h1>
        {subtitle && (
          <div className="text-lg sm:text-xl md:text-2xl text-blue-900/80 font-medium mb-10 mt-1 px-4 sm:px-6 py-2 bg-blue-100/60 rounded-lg border border-blue-200 shadow-sm text-center w-full max-w-2xl">
            {subtitle}
          </div>
        )}
      </div>
      <nav className="flex flex-wrap justify-center gap-4 mb-6 w-full">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              ${activeTab === tab.key
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md scale-105'
                : 'bg-white/80 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border border-blue-100'}
            `}
            type="button"
          >
            {tab.name}
          </button>
        ))}
      </nav>
      {children && (
        <div className="w-full flex flex-col items-center mt-2">{children}</div>
      )}
    </div>
  );
} 