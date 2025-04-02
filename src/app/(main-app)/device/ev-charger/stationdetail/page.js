'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
const StationDetail = () => {
  const [siteName, setSiteName] = useState('');
  const [stationId, setStationId] = useState('');
  const [stationName, setStationName] = useState('');
  const [breadcrumb, setBreadcrumb] = useState([]);
  const router = useRouter();

  // Mock data for chargers
  const chargers = [
    { id: 'charger-1', name: 'Charger 1', status: 'Active' },
    { id: 'charger-2', name: 'Charger 2', status: 'Inactive' },
    { id: 'charger-3', name: 'Charger 3', status: 'Active' },
  ];

  useEffect(() => {
    // ดึงข้อมูลจาก Local Storage
    const storedSiteName = localStorage.getItem('siteName');
    const storedStationId = localStorage.getItem('stationId');
    const storedStationName = localStorage.getItem('stationName');

    if (storedSiteName) setSiteName(storedSiteName);
    if (storedStationId) setStationId(storedStationId);
    if (storedStationName)setStationName(storedStationName)
  }, []);

  const handleChargerClick = (chargerId,chargerName) => {
    localStorage.setItem('chargerId', chargerId);
    localStorage.setItem('chargerName', chargerName);
    router.push('chargerdetail');
  };

  return (
    <div>
        <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
        
        <div className="flex items-center gap-4">
    <ArrowBackIosNewIcon style={{ fontSize: '15px' }} onClick={() => router.push('./')} />
    <div className="flex flex-col">
        <strong>{stationName}</strong>
        <Link href={'./'} className="text-blue-500 hover:underline">
            {siteName}
        </Link>
    </div>
</div>


          
        </div>
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Charger Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {chargers.map((charger) => (
              <tr key={charger.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{charger.name}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    charger.status === 'Active' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {charger.status}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleChargerClick(charger.id,charger.name)}
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

export default StationDetail;