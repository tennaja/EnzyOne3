"use client";

import { useState } from "react";
import StationDetail from "./component/StationDetail";
import Dashboard from "./component/Dashboard";
import ChargerDetail from "./component/ChargerDetail";
import ChargerHeadDetail from "./component/ChargeHead";

export default function EVChargerPage() {
  const [page, setPage] = useState("dashboard");

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
