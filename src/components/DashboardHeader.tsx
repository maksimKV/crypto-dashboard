import React from 'react';

interface Tab {
  name: string;
  key: string;
}

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function DashboardHeader({ title, subtitle, tabs, activeTab, onTabChange }: DashboardHeaderProps) {
  return (
    <div className="relative mb-10 rounded-2xl shadow-lg px-6 pt-8 pb-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden border border-blue-100">
      {/* Decorative background icon */}
      <svg className="absolute right-4 top-4 w-16 h-16 opacity-10 text-blue-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
        {title}
      </h1>
      {subtitle && (
        <div className="text-lg text-blue-900/70 font-medium mb-6 mt-1">
          {subtitle}
        </div>
      )}
      <nav className="flex flex-wrap gap-3 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
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
      <div className="h-1 w-full bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-100 rounded-full opacity-60" />
    </div>
  );
} 