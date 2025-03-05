import { useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Switch } from "@headlessui/react";
const DeviceDetail = ({ device , setActiveTab}) => {
  console.log(device)
  const [powerOn, setPowerOn] = useState(true);
    const [dimming, setDimming] = useState(10);
  return (
    <div>
      <div className="flex items-center justify-start gap-4 w-full">
  <button
    onClick={setActiveTab}
    className="text-sm text-[#33BFBF] hover:text-[#33BFBF] flex items-center"
  >
    <ArrowBackIosNewIcon style={{ fontSize: "14px" }} />
  </button>
  <h2 className="text-sm font-semibold">{device.device}</h2>
</div>


      
      <table className="w-full mt-5 text-sm">
        <tbody>
        <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Device Name</strong></td>
            <td className="px-4 py-2 font-bold">{device.device}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Description</strong></td>
            <td className="px-4 py-2 font-bold">{device.description}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Site</strong></td>
            <td className="px-4 py-2 font-bold">{device.site}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Group</strong></td>
            <td className="px-4 py-2 font-bold">{device.group}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Active Power (kW)</strong></td>
            <td className="px-4 py-2 font-bold">{device.kW}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Energy Usage (kWh)</strong></td>
            <td className="px-4 py-2 font-bold">{device.kWh}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Running Hrs</strong></td>
            <td className="px-4 py-2 font-bold">{device.runningHrs}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Status</strong></td>
            <td className={`px-4 py-2 font-bold ${
                            device.status === "On"
                              ? "text-[#33BFBF]"
                              : device.status === "Offline"
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}>{device.status}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Connection Status</strong></td>
            <td className={`px-4 py-2 font-bold ${
                            device.connection === "On"
                              ? "text-[#33BFBF]"
                              : device.connection === "Offline"
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}>{device.connection}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>% Dimming</strong></td>
            <td className="px-4 py-2 font-bold">{device.dimming}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-green-50"><strong>Last Updated</strong></td>
            <td className="px-4 py-2 font-bold">{device.lastupdate}</td>
          </tr>
        </tbody>
      </table>

      <div className="w-full mt-5">
      <h2 className="text-sm font-semibold mb-3">Device Control</h2>
              <div className="border p-4 rounded mt-3">
                <div className="flex justify-between items-center m-2">
                  <span className="text-sm">Status</span>
                  <Switch
                    checked={powerOn}
                    onChange={setPowerOn}
                    className={`${powerOn ? "bg-green-500" : "bg-gray-300"} relative inline-flex items-center h-5 rounded-full w-10`}
                  >
                    <span className="sr-only">Toggle Power</span>
                    <span className={`transform transition ease-in-out duration-200 ${powerOn ? "translate-x-5" : "translate-x-1"} inline-block w-3 h-3 bg-white rounded-full`} />
                  </Switch>
                </div>
                </div>
                <div className="border p-4 rounded mt-3">
                <div className="flex justify-between items-center m-2">
                  <span className="text-sm">Dimming Level</span>
                  <input
        type="range"
        min="0"
        max="100"
        value={dimming}
        step="1"
        onChange={(e) => setDimming(e.target.value)}
        list="tickmarks"
        className="w-full"
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
