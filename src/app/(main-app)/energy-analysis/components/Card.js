import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import BoltIcon from "@mui/icons-material/Bolt";
import PaidIcon from "@mui/icons-material/Paid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import Co2Icon from "@mui/icons-material/Co2";
import ForestIcon from "@mui/icons-material/Forest";
import Tooltip from "@mui/material/Tooltip"; // ✅ import Tooltip

const iconMap = {
  "Current power": <FlashOnIcon fontSize="large" className="text-blue-400" />,
  "Yield today": <BoltIcon fontSize="large" className="text-green-500" />,
  "Revenue today": <PaidIcon fontSize="large" className="text-yellow-600" />,
  "Total yield": <TrendingUpIcon fontSize="large" className="text-indigo-400" />,
  "Inverter rated power": <SettingsInputComponentIcon fontSize="large" className="text-gray-500" />,
  "Rate ESS capacity": <BatteryChargingFullIcon fontSize="large" className="text-red-400" />,
  "Purchased from grid": <ElectricalServicesIcon fontSize="large" className="text-teal-500" />,
  "CO₂ avoided": <Co2Icon fontSize="large" className="text-green-600" />,
  "Equivalent tree planted": <ForestIcon fontSize="large" className="text-lime-600" />,
};

export default function Card({ title, value, unit ,tootipword = "", hasInfo = false }) {
  return (
    <div className="bg-white dark:bg-dark-box rounded-xl shadow-md p-4 flex items-center gap-4 min-h-[100px]">
    {/* Left Icon */}
    <div className="w-10 h-10 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300">
      {iconMap[title] || <FlashOnIcon />}
    </div>
  
    {/* Right Content */}
    <div className="flex flex-col justify-center">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</span>
        {unit && <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
      </div>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        {title}
        {hasInfo && (
          <Tooltip title={tootipword} arrow placement="top">
            <InfoOutlinedIcon className="text-[#33BFBF] ml-1 cursor-pointer" fontSize="small" />
          </Tooltip>
        )}
      </div>
    </div>
  </div>
  
  );
}
