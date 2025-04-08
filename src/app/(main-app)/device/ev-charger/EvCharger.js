"use client";
import React from "react";
import dynamic from "next/dynamic";


const Dashboard = dynamic(() => import("./dashboard/page"), {
  ssr: false,
});

export default function EvCharger() {
  return (
    <div >
        <Dashboard />
    </div>
  );
}
