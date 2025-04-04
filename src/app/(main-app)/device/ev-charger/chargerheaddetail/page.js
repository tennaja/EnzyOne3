'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ChargerHeadDetail = () => {
  const router = useRouter();

  const [chargerName, setChargerName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [stationName, setStationName] = useState('');
  const [chargerHeadId, setChargerHeadId] = useState('');
  const [chargerHeadName, setChargerHeadName] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    setChargerName(searchParams.get('chargerName') || localStorage.getItem('chargerName') || 'Default Charger Name');
    setSiteName(searchParams.get('siteName') || localStorage.getItem('siteName') || 'Default Site Name');
    setStationName(searchParams.get('stationName') || localStorage.getItem('stationName') || 'Default Station Name');
    setChargerHeadId(searchParams.get('chargerHeadId') || localStorage.getItem('chargerHeadId') || 'default-charger-head-id');
    setChargerHeadName(searchParams.get('chargerHeadName') || localStorage.getItem('chargerHeadName') || 'Default Charger Head Name');
  }, []);

  return (
    <div>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
        
        <div className="flex items-center gap-4">
          <ArrowBackIosNewIcon style={{ fontSize: '15px' }} onClick={() => router.push('chargerdetail')} />
          <div className="flex flex-col">
              <strong>{chargerHeadName}</strong>
              <div className="flex items-center space-x-2">
                <Link href={'./'} className="text-blue-500 hover:underline">
                  {siteName}
                </Link>
                <span>/</span>
                <Link href={'stationdetail'} className="text-blue-500 hover:underline">
                  {stationName}
                </Link>
                <span>/</span>
                <Link href={'chargerdetail'} className="text-blue-500 hover:underline">
                  {chargerName}
                </Link>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChargerHeadDetail;
