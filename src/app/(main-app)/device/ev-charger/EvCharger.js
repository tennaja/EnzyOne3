"use client"; // ใช้สำหรับทำงานใน client-side

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearAll } from "@/redux/slicer/evchargerSlice"; // คำสั่ง clear Redux state
import { useState } from "react";
import StationDetail from "./components/StationDetail";
import Dashboard from "./components/Dashboard";
import ChargerDetail from "./components/ChargerDetail";
import ChargerHeadDetail from "./components/ChargeHead";

export default function EVChargerPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState("dashboard");

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // เช็คการรีเฟรชโดยใช้ performance.navigation.type
      const navType = performance.navigation.type;

      // ถ้าเป็นการรีเฟรชหน้า (navType === 1)
      if (navType === 1) {
        dispatch(clearAll());  // เคลียร์ Redux state
        console.log("Page is refreshed. Redux cleared.");
      } else {
        console.log("Not a refresh, skipping Redux clear.");
      }
    }
  }, []);  // ทำงานแค่ครั้งเดียวเมื่อหน้าโหลดใหม่

  const renderPage = () => {
    switch (page) {
      case "stationdetail":
        return <StationDetail onNavigate={handlePageChange} />;
      case "chargerdetail":
        return <ChargerDetail onNavigate={handlePageChange} />;
      case "chargeheaddetail":
        return <ChargerHeadDetail onNavigate={handlePageChange} />;
      default:
        return <Dashboard onNavigate={handlePageChange} />;
    }
  };

  return <>{renderPage()}</>;
}
