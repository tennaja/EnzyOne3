'use client';
import { useState } from 'react';
import TabNavigation from '../components/TabNavigation';
import Summary from './Summary.js';
import Production from '../components/Production';
import Consumption from '../components/Consumption';
import CustomGraph from '../components/CustomGraph';

const tabConfig = [
  { id: 'summary', label: 'Summary' },
  { id: 'production', label: 'Production' },
  { id: 'consumption', label: 'Consumption' },
  { id: 'customgraph', label: 'Custom Graph' },
];

export default function LoadConsumption() {
  const [activeTab, setActiveTab] = useState('summary');

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return <Summary />;
      case 'production':
        return <Production />;
      case 'consumption':
        return <Consumption />;
      case 'customgraph':
        return <CustomGraph />;
      default:
        return <Summary />;
    }
  };

  return (
    <div>
    <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200">
    <div className="flex justify-between items-center">
        <span className="font-semibold text-xl text-enzy-dark">Load & Consumption Breakdown</span>
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
