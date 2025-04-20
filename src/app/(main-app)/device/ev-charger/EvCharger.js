"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import StationDetail from "./component/StationDetail";
import Dashboard from "./component/Dashboard";
import ChargerDetail from "./component/ChargerDetail";
import ChargerHeadDetail from "./component/ChargeHead";

function EVChargerPageContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    const pageParam = searchParams?.get("page");
    setPage(pageParam);
  }, [searchParams]);

  if (page === "stationdetail") {
    return <StationDetail />;
  }
  if (page === "chargerdetail") {
    return <ChargerDetail />;
  }
  if (page === "chargeheaddetail") {
    return <ChargerHeadDetail />;
  }

  return <Dashboard />;
}

export default function EVChargerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EVChargerPageContent />
    </Suspense>
  );
}
