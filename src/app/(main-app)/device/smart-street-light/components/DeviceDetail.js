import { useState ,useEffect} from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Switch } from "@headlessui/react";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
const DeviceDetail = ({ device , setActiveTab}) => {
  console.log(device)
    const [powerOn, setPowerOn] = useState(true);
    const [dimming, setDimming] = useState(device?.percentDimming || 10);
    const [deviceStatus, setDeviceStatus] = useState(device?.status);

    useEffect(() => {
      setDimming(device?.percentDimming || 10);
    }, [device]);

    useEffect(() => {
      setDeviceStatus(device?.status === "on");
    }, [device]);

    const handleStatusChange = (newStatus) => {
      setDeviceStatus(newStatus);
      console.log(newStatus)
      // You can call a function here to update the device status on the server or in the backend
      // For example, updateStatus(device.id, newStatus);
    };
  return (
    <div>
      <div className="flex items-center justify-start gap-4 w-full">
  <button
    onClick={setActiveTab}
    className="text-sm text-[#33BFBF] hover:text-[#33BFBF] flex items-center"
  >
    <ArrowBackIosNewIcon style={{ fontSize: "14px" }} />
  </button>
  <h2 className="text-sm font-semibold">{device?.name}</h2>
</div>


      
      <table className="w-full mt-5 text-sm">
        <tbody>
        <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Device Name</strong></td>
            <td className="px-4 py-2 font-bold">{device?.name}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Description</strong></td>
            <td className="px-4 py-2 font-bold">{device?.description}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Site</strong></td>
            <td className="px-4 py-2 font-bold">{device?.siteName}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Group</strong></td>
            <td className="px-4 py-2 font-bold">{device?.groupName}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Active Power (kW)</strong></td>
            <td className="px-4 py-2 font-bold">{device?.kW}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Energy Usage (kWh)</strong></td>
            <td className="px-4 py-2 font-bold">{device?.kWh}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Running Hrs</strong></td>
            <td className="px-4 py-2 font-bold">{device?.runningHour}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Status</strong></td>
            <td className={`px-4 py-2 font-bold ${
                            device?.status === "on"
                              ? "text-[#12B981]"
                              : device?.status === "offline"
                              ? "text-[#FF3D4B]"
                              : "text-[#9DA9B9]"
                          }`}>{device?.status}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Connection Status</strong></td>
            <td className={`px-4 py-2 font-bold ${
                            device?.connectionStatus === "connected"
                              ? "text-[#12B981]"
                              : "text-[#FF3D4B]"
                          }`}>{device?.connectionStatus}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>% Dimming</strong></td>
            <td className="px-4 py-2 font-bold">{device?.percentDimming}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA]"><strong>Last Updated</strong></td>
            <td className="px-4 py-2 font-bold">{device?.lastUpdated}</td>
          </tr>
        </tbody>
      </table>

      <div className="w-full mt-5">
      <h2 className="text-sm font-semibold mb-3">Device Control</h2>
              <div className="border p-4 rounded mt-3">
              <div className="flex items-center m-2">
  <span className="text-sm mr-32">Status</span> {/* ข้อความ Status จะห่างจากปุ่ม */}
  <button
    onClick={() => handleStatusChange(!deviceStatus)}
    className={`${
      deviceStatus ? "bg-[#5eead4]" : "bg-gray-300"
    } text-white font-semibold py-2 px-2 rounded-full flex items-center gap-2 transition-colors duration-300 ml-4`} 
  >
    <PowerSettingsNewIcon style={{ fontSize: 20 }} />
  </button>
  <span className="ml-2 font-semibold text-sm">{deviceStatus ? "on" : "off"}</span>
</div>

                </div>
                <div className="border p-4 rounded mt-3">
                <div className="flex items-center m-2">
                  <span className="text-sm mr-32">Dimming Level</span>
                  <input
        type="range"
        min="0"
        max="100"
        value={dimming}
        step="1"
        onChange={(e) => setDimming(e.target.value)}
        list="tickmarks"
        className="w-full h-1 accent-[#33BFBF] bg-gray-300 range-sm"
      />
      <datalist id="tickmarks">
        <option value="0" />
        <option value="25" />
        <option value="50" />
        <option value="75" />
        <option value="100" />
      </datalist>
                  <div className="text-right text-xs">{dimming}%</div>
                </div>
                
              </div>
              <button className="w-20 bg-[#33BFBF] text-white py-2 rounded text-sm mt-3">Execute</button>
            </div>
    </div>
    
  );
};

export default DeviceDetail;
