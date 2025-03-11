import { useState ,useEffect} from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Switch } from "@headlessui/react";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import {
  DeviceControl
} from "@/utils/api";
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
const DeviceDetail = ({ device , setActiveTab}) => {
  console.log(device)
    const [powerOn, setPowerOn] = useState(true);
    const [dimming, setDimming] = useState(device?.percentDimming || 10);
    const [deviceStatus, setDeviceStatus] = useState(device?.status);
    const [openModalconfirm,setopenModalconfirm] =useState(false)
    const [openModalsuccess,setopenModalsuccess] =useState(false)
    const [openModalfail,setopenModalfail] =useState(false)
    const [modalConfirmProps, setModalConfirmProps] = useState(null);
    const [modalErrorProps, setModalErorProps] = useState(null);
    const [modalSuccessProps, setModalSuccessProps] = useState(null);
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

    const handleOpenModalconfirm = () => {
      setopenModalconfirm(true);
      setModalConfirmProps({
        onCloseModal: handleClosePopup,
        onClickConfirmBtn: handleSubmit,
        title: "Confirm Execution",
        content: `
  <div class="mx-auto w-fit px-4 text-left">
    <p>Device: ${device?.name}</p>
    <p>Status: ${deviceStatus ? "on" : "off"}</p>
    <p>%Dimming: ${deviceStatus ? dimming : ""}%</p>
  </div>
`
,
        buttonTypeColor: "primary",
      });
    };
    
    const handleSubmit = async () => {
        const Param = {
          id: device?.id,
          action: deviceStatus ? "on" : "off",
          dimming:Number(dimming)
        };
        const res = await DeviceControl(Param);
    
        if (res.status === 200) {
          setopenModalconfirm(false)
          setopenModalsuccess(true)
          setModalSuccessProps({
            onCloseModal: handleClosePopup,
            title: res?.data?.title,
            content: res?.data?.message,
            buttonTypeColor: "primary",
          });
          console.log("เข้าาาาาาาาาาาาาาาาา")
          setTimeout(() => {
            setopenModalsuccess(false);
          }, 3000); // 3000 milliseconds = 3 seconds
        
    
        } else {
          setopenModalconfirm(false)
          setopenModalfail(true)
          setModalErorProps({
            onCloseModal: handleClosePopup,
            title: res?.title,
            content: res?.message,
            buttonTypeColor: "danger",
          });
          console.log(res)
        }
      };
      const handleClosePopup = () => {
        setopenModalconfirm(false)
        setopenModalsuccess(false)
        setopenModalfail(false)
      }
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

      <div className="lg:w-full w-full p-2">
  <h2 className="text-sm font-semibold mb-3">Device Control</h2>
  
  {/* Power Status */}
  <div className="border p-4 rounded mt-3">
    <div className="flex items-center m-2">
      <span className="text-sm mr-14">Power Status</span>
      <button
        onClick={() => handleStatusChange(!deviceStatus)}
        disabled={device?.status === "offline"}
        className={`${
          device?.status === "offline"
            ? "bg-gray-300 cursor-not-allowed"
            : deviceStatus
            ? "bg-[#5eead4]"
            : "bg-gray-300"
        } text-white font-semibold py-2 px-2 rounded-full flex items-center gap-2 transition-colors duration-300 ml-4`} 
      >
        <PowerSettingsNewIcon style={{ fontSize: 20 }} />
      </button>
      <span className="ml-2 font-semibold text-sm">{deviceStatus ? "on" : "off"}</span>
    </div>
  </div>
  
  {/* Dimming Level */}
  <div className="border p-4 rounded mt-3">
    <div className="flex items-center m-2">
      <p className="text-sm mr-14">Dimming Level</p>
      <div className="flex items-center w-80">
        <input
          type="range"
          min="0"
          max="100"
          value={dimming}
          step="1"
          onChange={(e) => setDimming(e.target.value)}
          list="tickmarks"
          disabled={device?.status === "offline"}
          className="w-full h-1 accent-[#33BFBF] bg-gray-300 range-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="text-xs">{dimming}%</div>
      </div>
    </div>
  </div>
  
  {/* Execute Button */}
  <div className="flex justify-start mt-3">
    <button
      onClick={handleOpenModalconfirm}
      disabled={device?.status === "offline"}
      className={`w-32 py-2 rounded text-sm ${
        device?.status === "offline"
          ? "bg-gray-300 cursor-not-allowed text-gray-500"
          : "bg-[#33BFBF] text-white"
      }`}
    >
      Execute
    </button>
  </div>
</div>

            {openModalconfirm && <ModalConfirm {...modalConfirmProps}/>}
            {openModalsuccess && <ModalDone {...modalSuccessProps}/>}
            {openModalfail && <ModalFail {...modalErrorProps}/>}
            
    </div>
   
  );
};

export default DeviceDetail;




