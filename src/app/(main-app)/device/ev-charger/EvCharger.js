"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import StationDetail from "./component/StationDetail";
import Dashboard from "./component/Dashboard";
import ChargerDetail from "./component/ChargerDetail";
import ChargerHeadDetail from "./component/ChargeHead";

export default function EVChargerPage() {
  const searchParams = useSearchParams();
  const page = searchParams?.get("page"); // เพิ่ม optional chaining เพื่อตรวจสอบว่าค่าไม่เป็น undefined
  const router = useRouter();

  // useEffect(() => {
  //   // ตรวจสอบและล้าง localStorage เมื่อโหลดหน้า
  //   if (!page) {
  //     // ถ้าไม่มี "page" ใน URL (หมายถึงหน้าแรก)
  //     router.replace("/device/ev-charger"); // เปลี่ยน URL ไปที่หน้า Dashboard
  //     localStorage.clear(); // ล้าง localStorage
  //   }
  // }, [page, router]);

  // ตรวจสอบค่า page และ render คอมโพเนนต์ตามค่าของ "page"
  if (page === "stationdetail") {
    return <StationDetail />;
  }
  if (page === "chargerdetail") {
    return <ChargerDetail />;
  }
  if (page === "chargeheaddetail") {
    return <ChargerHeadDetail />;
  }

  // ถ้าไม่มี page หรืออยู่ที่หน้า Dashboard ให้ render หน้า Dashboard
  return <Dashboard />;
}
