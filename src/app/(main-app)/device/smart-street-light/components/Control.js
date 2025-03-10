import { useState } from "react";
import { Switch } from "@headlessui/react";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function DeviceControl() {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [powerOn, setPowerOn] = useState(true);
  const [dimming, setDimming] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Rows per page

  

  const devices = [
    { id: 1, name: "หลอด 1", description : "xxxxxxxxxxxxx",  group: "สาขาอาคาร ชั้น 2", status: "on",lastupdate:"2025-02-18 15:00:00" },
    { id: 2, name: "หลอด 2", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "offline",lastupdate:"2025-02-18 15:00:00" },
    { id: 3, name: "หลอด 3", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "off" ,lastupdate:"2025-02-18 15:00:00"},
    { id: 4, name: "หลอด 4", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "on" ,lastupdate:"2025-02-18 15:00:00"},
    { id: 5, name: "หลอด 5", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "off" ,lastupdate:"2025-02-18 15:00:00"},
    { id: 6, name: "หลอด 6", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "on" ,lastupdate:"2025-02-18 15:00:00"},
    { id: 7, name: "หลอด 7", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "on" ,lastupdate:"2025-02-18 15:00:00"},
    { id: 8, name: "หลอด 8", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "offline" ,lastupdate:"2025-02-18 15:00:00"},
    { id: 9, name: "หลอด 9", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "on" ,lastupdate:"2025-02-18 15:00:00"},
    { id: 10, name: "หลอด 10", description : "xxxxxxxxxxxxx",group: "สาขาอาคาร ชั้น 2", status: "on" ,lastupdate:"2025-02-18 15:00:00"},
  ];

  const filteredDevices = devices.filter(device =>
    device.name.includes(searchTerm) || device.group.includes(searchTerm)
  );

  const toggleDevice = (id) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length && filteredDevices.length > 0) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(device => device.id));
    }
  };

  const toggleStatus = (id) => {
    setSelectedDevices((prev) => {
      return prev.map((device) =>
        device.id === id ? { ...device, status: device.status === "on" ? "off" : "on" } : device
      );
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when rows per page change
  };

  // Calculate the devices to display for the current page
  const indexOfLastDevice = currentPage * rowsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - rowsPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredDevices.length / rowsPerPage);

  return (
    <div className="max-w-full mx-auto min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 w-full border-r p-4">
      
      <div className="flex items-center justify-between mb-3">
  <h2 className="text-sm font-semibold">10 Devices</h2>
  <input
    type="text"
    placeholder="ค้นหา"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-1/2 p-2 text-sm border rounded "
  />
</div>

        
        <table className="w-full table-auto mt-5">
  <thead>
    <tr className="text-xs text-gray-500 border-b border-gray-300">
      <th className="py-2 px-4 text-left">
        <input
          type="checkbox"
          checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
          onChange={toggleSelectAll}
          className="mr-2 accent-[#12B981]"
        />
        Device 
      </th>
      <th className="py-2 px-4 text-left">Description</th>
      <th className="py-2 px-4 text-left">Group</th>
      
      <th className="py-2 px-4 text-left">Status</th>
      <th className="py-2 px-4 text-left">Last Updated</th>
    </tr>
  </thead>
  <tbody>
    {currentDevices.map((device, index) => (
      <tr key={device.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
        <td className="py-2 px-4">
          <input
            type="checkbox"
            checked={selectedDevices.includes(device.id)}
            onChange={() => toggleDevice(device.id)}
            className="mr-2 bg-[#33BFBF]"
          />
          {device.name}
        </td>
        <td className="py-2 px-4 text-sm text-gray-600">{device.description}</td>
        <td className="py-2 px-4 text-sm text-gray-600">{device.group}</td>
        <td className="py-2 px-4 text-sm text-gray-600">
          <button
            onClick={() => toggleStatus(device.id)}
            className={`px-3 py-1 text-sm font-bold ${device.status === "on" ? "text-[#33BFBF]" : device.status === "off" ? "text-red-500" : "text-gray-400"}`}
          >
            {device.status}
          </button>
        </td>
        <td className="py-2 px-4 text-sm text-gray-600">{device.lastupdate}</td>
      </tr>
    ))}
  </tbody>
</table>


        
        {/* Pagination Controls */}
        <div className="mt-7 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <label htmlFor="rowsPerPage" className="text-sm">Rows per page</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="p-1 text-sm border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              <ArrowBackIosNewIcon style={{ fontSize: '12px' }} />
            </button>
            <span className="text-sm">{currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
            >
              <ArrowForwardIosOutlinedIcon style={{ fontSize: '12px' }} />
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 w-full p-4">
        <h2 className="text-sm font-semibold mb-3">Device Control ({selectedDevices.length} Device Selected)</h2>
        <div className="border p-4 rounded mt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Power Status</span>
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
          <div className="flex items-center">
  <p className="text-sm">Dimming Level</p>
  <div className="relative w-full">
  {/* Slider with datalist */}
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

  {/* Datalist for tickmarks */}
  <datalist id="tickmarks">
    <option value="0" style={{ color: '#33BFBF' }}/>
    <option value="25" />
    <option value="50" />
    <option value="75" />
    <option value="100" />
  </datalist>

  

  {/* แสดงค่า */}
  <div className="text-right text-xs mt-2">{dimming}%</div>
</div>

  <span className="text-sm font-semibold">{dimming}%</span>
</div>


          
        </div>
        <button className="w-20 bg-[#33BFBF] text-white py-2 rounded text-sm mt-3">Execute</button>
      </div>
    </div>
  );
}
