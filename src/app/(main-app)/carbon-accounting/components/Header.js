'use client';
import { useState } from 'react';
import TabNavigation from './TabNavigation';
import Dashboard from './Dashboard.js';
import Detail from './Detail';
import CustomGraph from './CustomGraph';

const tabConfig = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'detail', label: 'Detail' },
  { id: 'customchart', label: 'Custom Chart' },
];

export default function Header() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'detail':
        return <Detail />;
      case 'customchart':
        return <CustomGraph />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
    <div className="flex justify-between items-center">
        <span className="font-semibold text-xl text-enzy-dark">Carbon Accounting</span>
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabConfig}
            showBreadcrumb={false} // เราจะไม่แสดง breadcrumb ที่นี่
          />
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          {
            // ดึง breadcrumb ด้วยการ slice tabConfig จาก 0 ถึง activeTab
            tabConfig
              .slice(0, tabConfig.findIndex(t => t.id === activeTab) + 1)
              .map((tab, index, arr) => (
                <span key={tab.id} className="inline-flex items-center">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className="text-teal-600 hover:underline"
                  >
                    {tab.label}
                  </button>
                  {index < arr.length - 1 && (
                    <span className="mx-1 text-gray-400">/</span>
                  )}
                </span>
              ))
          }
        </div>
        </div>
        
        {renderContent()}
      </div>
  );
}
