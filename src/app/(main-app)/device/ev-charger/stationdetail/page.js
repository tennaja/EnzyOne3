'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import  MapTH  from "../MapSmSt";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getStationbyId } from "@/utils/api";


const StationDetail = () => {
  const [siteName, setSiteName] = useState('');
  const [station, setStation] = useState({});
  const [stationId, setStationId] = useState('');
  const [stationName, setStationName] = useState('');
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [mapZoomLevel, setMapZoomLevel] = useState(15);
  const [selectedLocation, setSelectedLocation] = useState(null); 
  const [stationDropdwonlist, setStationDropdwonlist] = useState([]);
  const router = useRouter();

//   // Mock data for chargers
//   const chargers = [
//     { id: 'charger-1', name: 'Charger 1', status: 'Active' },
//     { id: 'charger-2', name: 'Charger 2', status: 'Inactive' },
//     { id: 'charger-3', name: 'Charger 3', status: 'Active' },
//   ];

  useEffect(() => {
    // ดึงข้อมูลจาก Local Storage
    const storedSiteName = localStorage.getItem('siteName');
    const storedStationId = localStorage.getItem('stationId');
    const storedStationName = localStorage.getItem('stationName');

    if (storedSiteName) setSiteName(storedSiteName);
    if (storedStationId) setStationId(storedStationId);
    if (storedStationName)setStationName(storedStationName)
    GetStationbyId(storedStationId);
  }, []);
 
  const GetStationbyId = async (id) => {
    console.log("station Id:", id);
    try {
      const result = await getStationbyId(id);
      console.log("Group List Result:", result);

      if (result) {
        setStation(result);

        // ตั้งค่า selectedLocation ด้วย latitude และ longitude
        if (result.latitude && result.longitude) {
          setSelectedLocation({
            lat: result.latitude,
            lng: result.longitude,
          });
        }
      } else {
        console.log("No Stations found!");
      }
    } catch (error) {
      console.error("Error fetching station data:", error);
    }
  };

  const handleChargerClick = (chargerId,chargerName) => {
    localStorage.setItem('chargerId', chargerId);
    localStorage.setItem('chargerName', chargerName);
    router.push('chargerdetail');
  };

  return (
    <div>
        <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-5">
        
        <div className="flex items-center gap-4">
        <ArrowBackIosNewIcon
  style={{
    fontSize: '20px',
    color: '#33BFBF',
    cursor: 'pointer',
    '&:hover': {
      color: '#2aa7a7',
    },
  }}
  onClick={() => router.push('./')}
/>


    <div className="flex flex-col">
        <strong>{stationName}</strong>
        <Link
  href="./"
  className="text-sm text-gray-500 hover:text-[#1aa7a7] hover:underline transition-colors duration-200"
>
  {siteName}
</Link>


         </div>
    </div>
 </div>

 <div className="grid rounded-xl bg-white p-5 shadow-default dark:border-slate-800 dark:bg-dark-box dark:text-slate-200 mt-3">
 <span className="text-lg font-bold block mb-2">Station Information</span>
 
 <div className="flex flex-col lg:flex-row gap-3">
      <div className="w-full lg:w-[450px]">
        <div className="flex justify-center w-full h-[500px] justify-items-center overflow-hidden mt-5 mb-7">
         
          <MapTH
  locationList={
    station && station.latitude && station.longitude
      ? [
          {
            id: station.id,
            name: station.name,
            status: station.status,
            lat: station.latitude, // ใช้ latitude จาก station
            lng: station.longitude, // ใช้ longitude จาก station
          },
        ]
      : [] // ถ้าไม่มีข้อมูล ให้ส่งอาร์เรย์ว่าง
  }
  className={"w-full h-[500px] justify-items-center"}
  zoom={mapZoomLevel}
  selectedLocation={selectedLocation} // ใช้ selectedLocation เพื่อแสดงตำแหน่งที่เลือก
  setSelectedLocation={setSelectedLocation}
/>
        </div>
      </div>

      <div className="w-full lg:w-60 flex-1">
        <div className="flex-1 ml-6">
        <table className="w-full mt-5 text-sm">
        <tbody>
        <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Station Name</strong></td>
            <td className="px-4 py-2 font-bold">{station?.name}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Description</strong></td>
            <td className="px-4 py-2 font-bold">{station?.description}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Brand Name</strong></td>
            <td className="px-4 py-2 font-bold">{station?.brand}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Currency</strong></td>
            <td className="px-4 py-2 font-bold">{station?.currency}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Station Status</strong></td>
            <td className={`px-4 py-2 font-bold ${
                            station?.status === "open"
                              ? "text-[#12B981]"
                              : "text-[#FF3D4B]"
                              
                          }`}>{station?.status}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Address</strong></td>
            <td className="px-4 py-2 font-bold">{station?.address}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Country</strong></td>
            <td className="px-4 py-2 font-bold">{station?.country}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Province</strong></td>
            <td className="px-4 py-2 font-bold">{station?.province}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Postal Code</strong></td>
            <td className="px-4 py-2 font-bold">{station?.postalCode}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Latitude / Longitude</strong></td>
            <td className="px-4 py-2 font-bold">{station?.latitude},{station?.longitude}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Opening Hours</strong></td>
            <td className="px-4 py-2 font-bold">{station?.monOpeningTime}</td>
          </tr>
        </tbody>
      </table>
        </div>
      </div>
      </div>
      </div>
    

     
    </div>
  );
};

export default StationDetail;