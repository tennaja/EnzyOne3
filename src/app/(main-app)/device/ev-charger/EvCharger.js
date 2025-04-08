"use client";
import React from "react";
import dynamic from "next/dynamic";
import Dashboard from "./dashboard/page";

// const CardDashboard = dynamic(() => import("./component/Card"), {
//   ssr: false,
// });

export default function EvCharger() {
  return (
    <div >
 
        <Dashboard />
      
    </div>
  );
}
