import React, { ReactElement } from 'react';

interface Tab {
  name: string;
  key: string;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function Tabs({ tabs, activeKey, onChange }: TabsProps): ReactElement {
  return (
    <nav className="flex gap-4 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 border rounded ${
            activeKey === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          type="button"
        >
          {tab.name}
        </button>
      ))}
    </nav>
  );
}