import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server";

// กำหนดค่ากลางของแผนที่
const defaultCenter = { lat: 13.7563, lng: 100.5018 };

// ฟังก์ชันสำหรับจัดการการซูมเข้าเมื่อเลือกหมุด
const ZoomToMarker = ({ selectedMarker }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedMarker) {
      map.setView([selectedMarker.lat, selectedMarker.lng], 16, { animate: true });
    }
  }, [selectedMarker, map]);

  return null;
};

const MapTH = ({
  locationList = [], 
  selectedLocation = null, 
  setSelectedLocation,
  isCanZoom = true, 
  onDeviceClick,
  setActiveTab, 
  className = "w-[450px] h-[250px] rounded-lg shadow-md overflow-hidden",
}) => {
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      if (selectedLocation) {
        mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 16, { animate: true });
        setSelectedMarker(selectedLocation);
      } else {
        mapRef.current.setView(defaultCenter, 14, { animate: true });
        setSelectedMarker(null);
      }
    }
  }, [selectedLocation]);

  const getStatusColor = (status) => {
    switch (status) {
      case "On": return "#12B981";
      case "Offline": return "#FF3D4B";
      case "Off" : return "#9DA8B9";
    }
  };

  const getMuiIcon = (isSelected, status) => {
    const color = getStatusColor(status);

    const iconHTML = ReactDOMServer.renderToString(
      <LocationOnIcon
        style={{
          fontSize: isSelected ? 50 : 30,
          color,
        }}
      />
    );

    return L.divIcon({
      html: `<div style="display: flex; justify-content: center; align-items: center;">${iconHTML}</div>`,
      className: "custom-mui-marker",
      iconSize: isSelected ? [50, 50] : [30, 30],
      iconAnchor: [15, 30],
    });
  };

  const statusCount = locationList.reduce(
    (acc, loca) => {
      acc[loca.status] = (acc[loca.status] || 0) + 1;
      return acc;
    },
    { On: 0, Offline: 0, Off: 0 }
  );

  return (
    <div className="relative w-full h-full">
      {/* กรอบแสดงจำนวนอุปกรณ์แต่ละสถานะ */}
      <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-md shadow-md z-[1000] flex flex-col gap-1">
  {[
    { label: "On", color: "bg-[#12B981]", count: statusCount.On },
    { label: "Off", color: "bg-[#9DA8B9]", count: statusCount.Off },
    { label: "Offline", color: "bg-[#FF3D4B]", count: statusCount.Offline },
  ].map(({ label, color, count }) => (
    <div key={label} className="flex items-center justify-between w-24">
      <div className="flex items-center gap-1">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <span className="text-gray-700 text-xs">{label}</span>
      </div>
      <span className="px-2 py-0.5 text-gray-900 bg-gray-200 rounded-md text-xs">
        {count}
      </span>
    </div>
  ))}
</div>


      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={14}
        className={className}
        touchZoom={isCanZoom}
        scrollWheelZoom={isCanZoom}
        doubleClickZoom={isCanZoom}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomToMarker selectedMarker={selectedMarker} />

        {locationList.map((loca, index) => {
          const isSelected = selectedMarker && selectedMarker.lat === loca.lat && selectedMarker.lng === loca.lng;
          
          return (
            <Marker
              key={index}
              position={[loca.lat, loca.lng]}
              icon={getMuiIcon(isSelected, loca.status)}
              eventHandlers={{
                click: () => {
                  setSelectedMarker(loca);
                  setSelectedLocation(loca);
                  setActiveTab("detail");
                  if (onDeviceClick) {
                    onDeviceClick(loca);
                  }
                },
              }}
            />
          );
        })}
      </MapContainer> 
    </div>
  );
};

export default React.memo(MapTH);
