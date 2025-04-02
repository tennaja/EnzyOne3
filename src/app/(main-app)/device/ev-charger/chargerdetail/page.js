'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ChargerDetail = () => {
  const router = useRouter();
  const [chargerId, setChargerId] = useState('');
  const [chargerName, setChargerName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [stationName, setStationName] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setChargerId(searchParams.get('chargerId') || localStorage.getItem('chargerId') || 'default-charger-id');
    setChargerName(searchParams.get('chargerName') || localStorage.getItem('chargerName') || 'Default Charger Name');
    setSiteName(searchParams.get('siteName') || localStorage.getItem('siteName') || 'Default Site Name');
    setStationName(searchParams.get('stationName') || localStorage.getItem('stationName') || 'Default Station Name');
  }, []);

  // Mock data for Charger Heads
  const chargerHeads = [
    { id: 'head-1', name: 'Charger Head 1', status: 'Active' },
    { id: 'head-2', name: 'Charger Head 2', status: 'Inactive' },
    { id: 'head-3', name: 'Charger Head 3', status: 'Active' },
  ];

  const handleChargerHeadClick = (chargerHeadId, chargerHeadName) => {
    localStorage.setItem('chargerHeadId', chargerHeadId);
    localStorage.setItem('chargerHeadName', chargerHeadName); // เก็บชื่อของ Charger Head
    router.push('chargerheaddetail');
  };

  return (
    <div>
      <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
        
        <div className="flex items-center gap-4">
          <ArrowBackIosNewIcon style={{ fontSize: '15px' }} onClick={() => router.push('stationdetail')} />
          <div className="flex flex-col">
              <strong>{chargerName}</strong>
              <div className="flex items-center space-x-2">
                <Link href={'./'} className="text-blue-500 hover:underline">
                  {siteName}
                </Link>
                <span>/</span>
                <Link href={'stationdetail'} className="text-blue-500 hover:underline">
                  {stationName}
                </Link>
              </div>
          </div>
        </div>
          
      </div>

      {/* Charger Head Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Charger Head Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {chargerHeads.map((head) => (
              <tr key={head.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{head.name}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    head.status === 'Active' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {head.status}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleChargerHeadClick(head.id, head.name)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChargerDetail;
