"use client";
import React from "react";
import Link from "next/link";
import Header from "./component/Header";


export default function EvChargerLayout({ children }) {
  return (
    <div className="min-h-screen flex w-full text-enzy-dark dark:text-slate-200">
      <main className="p-4 lg:p-8 flex flex-1 flex-col bg-[#EDF2F8] dark:bg-dark-base">
        <Header />
        {/* หน้าอื่น ๆ ที่ถูก Render */}
        {children}
      </main>
    </div>
  );
}
