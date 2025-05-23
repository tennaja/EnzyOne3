import { useState ,useEffect,useImperativeHandle, forwardRef} from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Switch } from "@headlessui/react";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import {
  DeviceControl
} from "@/utils/api";
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import this for default styling
import ModalConfirm from "./Popupconfirm";
import ModalDone from "./Popupcomplete";
import ModalFail from "./PopupFali";
const DeviceDetail = forwardRef (
  (
    {
       device , 
       setActiveTab,
       onhandleOpenPopupconfirm,
       OnsubmitControl
      }
      ,ref
    ) => {
  console.log(device?.status)
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
            ${deviceStatus && dimming ? `<p>% Dimming: ${dimming}%</p>` : ""}
          </div>
        `,
        buttonTypeColor: "primary",
      });
    };
    
    useImperativeHandle(ref, () => ({
        triggerExecute: async () => {
          const param = {
            id: device?.id,
            action: deviceStatus ? "on" : "off",
            dimming:deviceStatus ? Number(dimming) : 0
          };
          try {
            await OnsubmitControl(param);
            console.log("✅ Schedule ถูกอัปเดตสำเร็จ!");
          } catch (error) {
            console.error("❌ เกิดข้อผิดพลาดในการอัปเดต Schedule:", error);
          }
        }
      }));


    const handleSubmit = async () => {
        const Param = {
          id: device?.id,
          action: deviceStatus ? "on" : "off",
          dimming:deviceStatus ? Number(dimming) : 0
        };
        const res = await DeviceControl(Param);
    
        if (res.status === 200) {
          setopenModalconfirm(false)
          setopenModalconfirm(false);
            notifySuccess(res?.data?.title,res?.data?.message);
        
    
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

      const notifySuccess = (title,message) =>
              toast.success(
                <div className="px-2">
                <div className="flex flex-row font-bold">{title}</div>
                <div className="flex flex-row text-xs">{message}</div>
                </div>,
                {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                }
              );
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
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Device Name</strong></td>
            <td className="px-4 py-2 font-bold">{device?.name}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Description</strong></td>
            <td className="px-4 py-2 font-bold">{device?.description}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Site</strong></td>
            <td className="px-4 py-2 font-bold">{device?.siteName}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Group</strong></td>
            <td className="px-4 py-2 font-bold">{device?.groupName}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Active Power (kW)</strong></td>
            <td className="px-4 py-2 font-bold">{device?.kW}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Energy Usage (kWh)</strong></td>
            <td className="px-4 py-2 font-bold">{device?.kWh}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Running Hours</strong></td>
            <td className="px-4 py-2 font-bold">{device?.runningHour}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Status</strong></td>
            <td className={`px-4 py-2 font-bold ${
                            device?.status === "on"
                              ? "text-[#12B981]"
                              : device?.status === "offline"
                              ? "text-[#FF3D4B]"
                              : "text-[#9DA9B9]"
                          }`}>{device?.status}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200 ">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Connection Status</strong></td>
            <td className={`px-4 py-2 font-bold ${
                            device?.connectionStatus === "connected"
                              ? "text-[#12B981]"
                              : "text-[#FF3D4B]"
                          }`}>{device?.connectionStatus}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>% Dimming</strong></td>
            <td className="px-4 py-2 font-bold">{device?.percentDimming}</td>
          </tr>
          <tr className="text-xs  border-b border-gray-200">
            <td className="px-4 py-2 bg-[#F2FAFA] dark:bg-gray-900 dark:text-white"><strong>Last Updated</strong></td>
            <td className="px-4 py-2 font-bold">{device?.lastUpdated}</td>
          </tr>
        </tbody>
      </table>

      <div className="lg:w-full w-full p-2 mt-3">
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
  {deviceStatus ? 
  <div className="border p-4 rounded mt-3">
  <div className="flex items-center m-2">
    <p className="text-sm mr-14">Dimming Level</p>
    <div className="flex items-center w-80">
    <div className="w-full">
    <input
      type="range"
      min="0"
      max="100"
      value={dimming}
      step="1"
      list="tickmarks"
      onChange={(e) => {
        const value = Number(e.target.value);
        if (value >= 10 || dimming > 10) {
          setDimming(value);
        } else {
          setDimming(10); // ถ้าเลื่อนต่ำกว่า 10 แล้วปล่อย จะเด้งกลับไป 10
        }
      }}
      disabled={device?.status === "offline"}
      className={`w-full h-1 accent-[#33BFBF] bg-gray-300 range-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
    />
    {/* Tick Marks */}
    <datalist id="tickmarks" className="w-full flex justify-between text-xs text-gray-600 dark:text-white">
      <option value="0" label="0"></option>
      <option value="25" label="25"></option>
      <option value="50" label="50"></option>
      <option value="75" label="75"></option>
      <option value="100" label="100"></option>
    </datalist>
  </div>
  <div className="text-xs text-center ml-2">{dimming}%</div>
    </div>
  </div>
</div>
  :
  ""
  }
  
  
  {/* Execute Button */}
  <div className="flex justify-start mt-3">
    <button
      onClick={() => onhandleOpenPopupconfirm(device?.name,deviceStatus,dimming)}
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

    </div>
   
  );
})

export default DeviceDetail;




