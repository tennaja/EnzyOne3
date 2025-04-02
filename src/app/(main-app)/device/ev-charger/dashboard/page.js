'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  const sites = [
    { id: 'site-1', name: 'All sites' },
    { id: 'site-2', name: 'แม่ริม' },
    { id: 'site-3', name: 'เวียงบัว' },
  ];

  const stations = [
    { id: 'station-1', name: 'สถานีบริการน้ำมัน PT-1', location: 'Bangkok', status: 'Active' },
    { id: 'station-2', name: 'สถานีบริการน้ำมัน PT-2', location: 'Chiang Mai', status: 'Inactive' },
    { id: 'station-3', name: 'สถานีบริการน้ำมัน PT-3', location: 'Phuket', status: 'Active' },
    { id: 'station-4', name: 'สถานีบริการน้ำมัน PT-4', location: 'Bangkok', status: 'Active' },
    { id: 'station-5', name: 'สถานีบริการน้ำมัน PT-5', location: 'Chiang Mai', status: 'Inactive' },
  ];

  const [selectedSite, setSelectedSite] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  // โหลดค่าที่เก็บไว้ใน localStorage เมื่อหน้าโหลด
  useEffect(() => {
    const storedSite = localStorage.getItem('selectedSite');
    if (storedSite) {
      setSelectedSite(storedSite);
    }
  }, []);

  const handleSiteChange = (event) => {
    const site = event.target.value;
    setSelectedSite(site);

    // เก็บค่า selectedSite ไว้ใน localStorage
    localStorage.setItem('selectedSite', site);
  };

  const handleStationChange = (event) => {
    const station = event.target.value;
    setSelectedStation(station);
  };

  const handleStationClick = (stationId, stationName) => {
    if (!selectedSite) {
      alert('Please select a site before proceeding.');
      return;
    }

    // เก็บ siteName และ stationId ใน Local Storage
    localStorage.setItem('siteName', selectedSite);
    localStorage.setItem('stationId', stationId);
    localStorage.setItem('stationName', stationName);

    // อัปเดต Breadcrumb
    const breadcrumb = [{ label: selectedSite, path: 'ev-charger/stationdetail' }];
    localStorage.setItem('breadcrumb', JSON.stringify(breadcrumb));

    // เปลี่ยนหน้าไปยัง StationDetail
    router.push('ev-charger/stationdetail');
  };

  return (
    <div>
    

      {/* Dropdown สำหรับเลือก Site */}
      <div className="mb-4">
        <label htmlFor="site-select" className="block mb-2 font-medium">
          Select Site:
        </label>
        <select
          id="site-select"
          value={selectedSite}
          onChange={handleSiteChange}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">-- Select a Site --</option>
          {sites.map((site) => (
            <option key={site.id} value={site.name}>
              {site.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="station-select" className="block mb-2 font-medium">
          Select Station:
        </label>
        <select
          id="station-select"
          value={selectedStation}
          onChange={handleStationChange}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">-- Select a Station --</option>
          {stations.map((station) => (
            <option key={station.id} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      {/* Station Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Station Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{station.name}</td>
                <td className="border border-gray-300 px-4 py-2">{station.location}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    station.status === 'Active' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {station.status}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleStationClick(station.id, station.name)}
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

export default Dashboard;
