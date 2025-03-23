import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReactDOMServer from "react-dom/server";

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
  selectedStatus,
  SiteId,
  GroupId,
  className = "w-[450px] h-500px] rounded-lg shadow-md overflow-hidden",
}) => {
  const mapRef = useRef(null);
  const prevSiteIdRef = useRef(SiteId);
  const prevGroupIdRef = useRef(GroupId);
  const [selectedMarker, setSelectedMarker] = useState(null);

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
        mapRef.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 15, animate: true });
      }
      setSelectedMarker(null);
    }
  }, [selectedLocation, locationList]);

  useEffect(() => {
    if (!mapRef.current) return;
  
    // ตรวจสอบโดยใช้ String() เพื่อแก้ไขปัญหาชนิดข้อมูลไม่ตรงกัน
    if (String(prevSiteIdRef.current) !== String(SiteId) || String(prevGroupIdRef.current) !== String(GroupId)) {
      setActiveTab("table");
      setSelectedMarker(null);
      setSelectedLocation(null);
  
      const validLocations = locationList.filter((loca) => loca.lat && loca.lng);
      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(validLocations.map((loca) => [loca.lat, loca.lng]));
        mapRef.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 15, animate: true });
      }
    }
  
    prevSiteIdRef.current = SiteId;
    prevGroupIdRef.current = GroupId;
  }, [SiteId, GroupId, locationList, setActiveTab]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "on": return "#12B981";
      case "offline": return "#FF3D4B";
      case "off": return "#9DA8B9";
      default: return "#000";
    }
  }, []);

  const getMuiIcon = useMemo(() => (isSelected, status) => {
    const color = isSelected && selectedStatus ? getStatusColor(selectedStatus) : getStatusColor(status);
    const size = isSelected ? 50 : 30;
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
  }, [selectedStatus, getStatusColor]);

  const handleMarkerClick = useCallback(
    (loca) => {
      setSelectedLocation(loca);
      setSelectedMarker(loca);
      setActiveTab("detail");
      if (onDeviceClick) onDeviceClick(loca);
    },
    [setSelectedLocation, setActiveTab, onDeviceClick]
  );

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
            { label: "on", color: "bg-[#12B981]", count: statusCount.on },
            { label: "off", color: "bg-[#9DA8B9]", count: statusCount.off },
            { label: "offline", color: "bg-[#FF3D4B]", count: statusCount.offline },
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
          const isSelected = selectedMarker?.lat === loca.lat && selectedMarker?.lng === loca.lng;

          return (
            <Marker
              key={index}
              position={[loca.lat, loca.lng]}
              icon={getMuiIcon(isSelected, loca.status)}
              eventHandlers={{ click: () => handleMarkerClick(loca) }}
              keepInView={false}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default React.memo(MapTH);
