import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server";
import { debounce } from "lodash"; // นำเข้า debounce จาก lodash

const defaultCenter = { lat: 15.8700, lng: 100.9925 };

const ZoomToMarker = ({ selectedMarker }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedMarker) {
      map.setView([selectedMarker.lat, selectedMarker.lng], 18, { animate: true });
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
  SiteId,
  GroupId,
  isSearchClicked,
  className = "w-[auto] h-500px] rounded-lg shadow-md overflow-hidden",
}) => {
  const mapRef = useRef(null);
  const prevSearchClickedRef = useRef(isSearchClicked);
  const prevSiteIdRef = useRef(SiteId);
  const prevGroupIdRef = useRef(GroupId);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null); // สถานะสำหรับ hover
  const hoveredMarkerRef = useRef(null); // ใช้ useRef แทน useState
  console.log(selectedLocation);

  // ฟังก์ชัน debounce สำหรับ handleMarkerHover
  const debouncedHandleMarkerHover = useMemo(
    () =>
      debounce((loca) => {
        if (
          hoveredMarkerRef.current?.lat !== loca.lat ||
          hoveredMarkerRef.current?.lng !== loca.lng
        ) {
          hoveredMarkerRef.current = loca; // อัปเดตค่าใน useRef
          setHoveredMarker(loca); // อัปเดตสถานะ
        }
      }, 100), // หน่วงเวลา 100ms
    []
  );

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.invalidateSize();

    if (selectedLocation) {
      setSelectedMarker(selectedLocation);
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 18, { animate: true });
    } else {
      const validLocations = locationList.filter(loca => loca.lat && loca.lng);
      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(validLocations.map(loca => [loca.lat, loca.lng]));
        mapRef.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 17, animate: true });
      }
      setSelectedMarker(null);
    }
  }, [selectedLocation, locationList]);

  useEffect(() => {
    if (!mapRef.current) return;
  
    // ตรวจสอบโดยใช้ String() เพื่อแก้ไขปัญหาชนิดข้อมูลไม่ตรงกัน
    if (String(prevSearchClickedRef.current) !== String(isSearchClicked)) {
      setActiveTab("table");
      setSelectedMarker(null);
      setSelectedLocation(null);
  
      const validLocations = locationList.filter((loca) => loca.lat && loca.lng);
      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(validLocations.map((loca) => [loca.lat, loca.lng]));
        mapRef.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 17, animate: true });
      }
    }
    prevSearchClickedRef.current = isSearchClicked;
  }, [isSearchClicked,locationList, setActiveTab]);

  // รีเซ็ต hoveredMarker เมื่อ locationList หรือ selectedMarker เปลี่ยน
  useEffect(() => {
    setHoveredMarker(null);
  }, [locationList, selectedMarker]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "on": return "#12B981";
      case "offline": return "#FF3D4B";
      case "off": return "#9DA8B9";
      default: return "#000";
    }
  }, []);

  const getMuiIcon = useMemo(() => (isSelected, status) => {
    const color = getStatusColor(status);
    const size = isSelected ? 50 : 30; // ขนาดหมุดจะเปลี่ยนเฉพาะเมื่อ selected เท่านั้น
    const anchor = isSelected ? [25, 50] : [15, 30];

    const iconHTML = ReactDOMServer.renderToString(
      <LocationOnIcon style={{ fontSize: size, color }} />
    );

    return L.divIcon({
      html: `<div style="display: flex; justify-content: center; align-items: center;">${iconHTML}</div>`,
      className: "custom-mui-marker",
      iconSize: [size, size],
      iconAnchor: anchor,
    });
  }, [getStatusColor]);

  const handleMarkerClick = useCallback(
    (loca) => {
      setSelectedLocation(loca);
      setSelectedMarker(loca);
      setActiveTab("detail");
      if (onDeviceClick) onDeviceClick(loca);
    },
    [setSelectedLocation, setActiveTab, onDeviceClick]
  );

  const handleMarkerHover = useCallback(
    (loca) => {
      debouncedHandleMarkerHover(loca); // เรียกใช้ debounce
    },
    [debouncedHandleMarkerHover]
  );

  const handleMarkerOut = useCallback(() => {
    hoveredMarkerRef.current = null; // ล้างค่าใน useRef
    setHoveredMarker(null); // ล้างสถานะ
  }, []);

  const statusCount = useMemo(
    () =>
      locationList.reduce(
        (acc, loca) => {
          acc[loca.status] = (acc[loca.status] || 0) + 1;
          return acc;
        },
        { on: 0, offline: 0, off: 0 }
      ),
    [locationList]
  );

  return (
    <div className="relative w-full h-full">
      {!selectedMarker && (
       <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-md shadow-md z-[1000] flex flex-col gap-1">
       {[
         { label: "on", labelColor: "bg-[#12B981]", countColor: "bg-[#c9e9dd]", count: statusCount.on },
         { label: "off", labelColor: "bg-[#9DA8B9]", countColor: "bg-[#e1e5e9]", count: statusCount.off },
         { label: "offline", labelColor: "bg-[#FF3D4B]", countColor: "bg-[#f8d1d4]", count: statusCount.offline },
       ].map(({ label, labelColor, countColor, count }) => (
         <div key={label} className="flex items-center justify-between w-24">
           <div className="flex items-center gap-1">
             <span className={`w-3 h-3 rounded-full ${labelColor}`}></span>
             <span className="text-gray-700 text-xs">{label}</span>
           </div>
           <span
             className={`px-2 py-0.5 text-gray-900 rounded-md text-xs ${countColor}`}
           >
             {count}
           </span>
         </div>
       ))}
     </div>
     
      )}

      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={14}
        className={className}
        touchZoom={isCanZoom}
        scrollWheelZoom={isCanZoom}
        doubleClickZoom={isCanZoom}
        whenCreated={(map) => (mapRef.current = map)}
        style={{
          zIndex: 1, // Ensure the modal is always on top
          // Fixed position so it stays on top of the page
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomToMarker selectedMarker={selectedMarker} />

        {locationList.map((loca, index) => {
          const isSelected =
            selectedLocation?.id === loca.id &&
            selectedLocation?.lat === loca.lat &&
            selectedLocation?.lng === loca.lng;

          const isHovered =
            hoveredMarker?.id === loca.id &&
            hoveredMarker?.lat === loca.lat &&
            hoveredMarker?.lng === loca.lng;

          return (
            <Marker
              key={`${loca.id}-${isSelected ? "selected" : "normal"}`}
              position={[loca.lat, loca.lng]}
              icon={getMuiIcon(isSelected, loca.status)}
              zIndexOffset={isSelected ? 9999 : isHovered ? 2000 : 0}
              eventHandlers={{
                click: () => handleMarkerClick(loca),
                mouseover: () => handleMarkerHover(loca),
                mouseout: handleMarkerOut,
                add: (e) => {
                  if (isSelected) {
                    e.target.getElement()?.parentNode?.bringToFront?.(); // บังคับให้ Marker ที่ถูกเลือกอยู่ด้านหน้าสุด
                  }
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent={false}>
                <div>
                  <span className="font-bold">{loca.name}</span>
                </div>
                <div>
                  <span>{loca.siteName}</span> - <span>{loca.groupName}</span>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default React.memo(MapTH);
