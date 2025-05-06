"use client";
import React from "react";
export default function TabNavigation({ activeTab, onTabChange, tabs }) {
  return (
    <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`px-4 py-2 text-sm border-r last:border-r-0 border-gray-300 dark:border-gray-600 transition-all ${
          activeTab === tab.id
            ? 'bg-teal-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
  
  );
}
