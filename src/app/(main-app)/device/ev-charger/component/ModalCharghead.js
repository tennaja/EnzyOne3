"use client";
import React, { useState ,useMemo, useEffect} from 'react';
import { Modal } from '@mantine/core';
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const ChargeHeadModal = ({ chargers, opened, onClose }) => {
    console.log("chargers", chargers);
  const [searchChargingQuery, setSearchChargingQuery] = useState('');
  const [chargingSortConfig, setChargingSortConfig] = useState({
    key: 'displayIndex',
    direction: 'asc',
  });
  const [chargingCurrentPage, setChargingCurrentPage] = useState(1);
  const [chargingRowsPerPage, setChargingRowsPerPage] = useState(10);

  // Handle Search Input
  const handleSearchChargingquery = (e) => {
    setSearchChargingQuery(e.target.value);
    setChargingCurrentPage(1); // Reset page to 1 when searching
  };

  
  // Handle Pagination
  const handleChangeChargingPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalChargingPages) {
      setChargingCurrentPage(newPage);
    }
  };

  const handleRowsPerChargingPageChange = (e) => {
    setChargingRowsPerPage(Number(e.target.value));
    setChargingCurrentPage(1); // Reset page to 1 when changing rows per page
  };

  const filteredChargingList = chargers
  ?.map((item, index) => ({ ...item, displayIndex: index + 1 })) // เพิ่มลำดับเลขให้แต่ละ item
  .filter(
    (charger) =>
    charger.name.toLowerCase().includes(searchChargingQuery.toLowerCase()) ||
    charger.status.toLowerCase().includes(searchChargingQuery.toLowerCase()) ||
    charger.displayIndex.toString().includes(searchChargingQuery)
  );
// Handle Sorting
const handleSortCharging = (column) => {
    let direction = "asc";
    if (
      chargingSortConfig.key === column &&
      chargingSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setChargingSortConfig({ key: column, direction });
  };
  const sortedChargingList = useMemo(() => {
    if (!Array.isArray(filteredChargingList)) return [];
  
    const sorted = [...filteredChargingList];
    sorted.sort((a, b) => {
      const valueA = a[chargingSortConfig.key];
      const valueB = b[chargingSortConfig.key];
  
      if (valueA < valueB)
        return chargingSortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB)
        return chargingSortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  
    return sorted;
  }, [filteredChargingList, chargingSortConfig]);
  
  const totalChargingPages = Math.ceil((filteredChargingList?.length || 0) / chargingRowsPerPage);

  const chargingIndexOfLastItem = chargingCurrentPage * chargingRowsPerPage;  
  const chargingIndexOfFirstItem = chargingIndexOfLastItem - chargingRowsPerPage;
  const currentChargingData = sortedChargingList.slice(
    chargingIndexOfFirstItem,
    chargingIndexOfLastItem
  );

  const highlightText = (text) => {
    if (!text || !searchChargingQuery) return text;
    const textString = String(text);
    const parts = textString.split(
      new RegExp(`(${searchChargingQuery})`, 'gi')
    );
    return parts.map((part, i) =>
      part.toLowerCase() === searchChargingQuery.toLowerCase() ? (
        <span key={i} className="bg-yellow-300 dark:bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  useEffect(() => {
    setChargingCurrentPage(1); // Reset page to 1 when chargers change
  }
  , [chargers]);
  useEffect(() => {
    setChargingRowsPerPage(10); // Reset rows per page when chargers change
  }, [chargers]);
  useEffect(() => {
    setSearchChargingQuery(''); // Reset search query when chargers change
  }, [chargers]);
  useEffect(() => {
    setChargingSortConfig({
      key: 'displayIndex',
      direction: 'asc',
    }); // Reset sort config when chargers change
  }, [chargers]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Charge Head"
      size="xl"
      withCloseButton={false}
      closeOnClickOutside={false}
      centered
        style={{ zIndex: 9999}}
        styles={{ 
        body: { borderRadius: "12px" },
        title: { fontSize: '18px', fontWeight: 600 }
    }}


    ><>
      <div className="flex justify-between items-center mb-2 mt-3">
        <span className="text-xs font-semibold">
        {chargers?.length ?? 0} records
        </span>
        <input
          type="text"
          placeholder="ค้นหา"
          value={searchChargingQuery}
          onChange={handleSearchChargingquery}
          className="border border-gray-300 p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        />
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="text-xs text-black border-b border-gray-300 dark:text-white">
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => handleSortCharging('displayIndex')}
              >
                #
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    marginLeft: '4px',
                  }}
                >
                  <ArrowDropUpIcon
                    style={{
                      fontSize: '14px',
                      opacity:
                        chargingSortConfig.key === 'displayIndex' &&
                        chargingSortConfig.direction === 'asc'
                          ? 1
                          : 0.3,
                      marginBottom: '-2px',
                    }}
                  />
                  <ArrowDropDownIcon
                    style={{
                      fontSize: '14px',
                      opacity:
                        chargingSortConfig.key === 'displayIndex' &&
                        chargingSortConfig.direction === 'desc'
                          ? 1
                          : 0.3,
                      marginTop: '-2px',
                    }}
                  />
                </div>
              </th>
              <th
                className="px-2 py-1 text-center"
                onClick={() => handleSortCharging('name')}
              >
                Name
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    marginLeft: '4px',
                  }}
                >
                  <ArrowDropUpIcon
                    style={{
                      fontSize: '14px',
                      opacity:
                        chargingSortConfig.key === 'name' &&
                        chargingSortConfig.direction === 'asc'
                          ? 1
                          : 0.3,
                      marginBottom: '-2px',
                    }}
                  />
                  <ArrowDropDownIcon
                    style={{
                      fontSize: '14px',
                      opacity:
                        chargingSortConfig.key === 'name' &&
                        chargingSortConfig.direction === 'desc'
                          ? 1
                          : 0.3,
                      marginTop: '-2px',
                    }}
                  />
                </div>
              </th>
              <th
                className="px-2 py-1 text-center"
                onClick={() => handleSortCharging('status')}
              >
                Status
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    marginLeft: '4px',
                  }}
                >
                  <ArrowDropUpIcon
                    style={{
                      fontSize: '14px',
                      opacity:
                        chargingSortConfig.key === 'status' &&
                        chargingSortConfig.direction === 'asc'
                          ? 1
                          : 0.3,
                      marginBottom: '-2px',
                    }}
                  />
                  <ArrowDropDownIcon
                    style={{
                      fontSize: '14px',
                      opacity:
                        chargingSortConfig.key === 'status' &&
                        chargingSortConfig.direction === 'desc'
                          ? 1
                          : 0.3,
                      marginTop: '-2px',
                    }}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {
            currentChargingData.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-2 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Data not found
                  </td>
                </tr>
              ) : (
            currentChargingData.map((charger, index) => (
              <tr key={charger.id || charger.displayIndex}
              className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                charger.displayIndex % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-100 dark:bg-gray-900"
              }`}
              style={{ borderBottom: "1px solid #e0e0e0" }}
            >
                <td className="px-2 py-1 text-left">{highlightText(charger.displayIndex)}</td>
                <td className="px-2 py-1 text-center">
                  {highlightText(charger.name)}
                </td>
                <td className="px-2 py-1 text-center font-bold"
                style={{
                    color:
                    charger?.status === 'Available' ? '#12B981' :
                    charger?.status === 'Charging' ? '#259AE6' :
                    charger?.status === 'Out of Order' ? '#DF4667' :
                    charger?.status === 'Reserved' ? '#9747FF' :
                    charger?.status === 'Maintenance' ? '#8A99AF' :
                      'black'
                  }}
                >{highlightText(charger.status)}</td>
              </tr>
            )))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="text-xs">Rows per page: </span>
            <select
              className="border border-gray-300 p-1 text-sm ml-2"
              value={chargingRowsPerPage}
              onChange={handleRowsPerChargingPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

          <div className="flex items-center">
            <button
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
              onClick={() => handleChangeChargingPage(chargingCurrentPage - 1)}
              disabled={chargingCurrentPage === 1}
            >
              <ArrowBackIosNewIcon style={{ fontSize: "10px" }} />
            </button>
            <span className="px-2 text-xs">
              {chargingCurrentPage} / {totalChargingPages}
            </span>
            <button
              className="px-2 py-1 text-sm bg-gray-200 rounded-lg disabled:opacity-50"
              onClick={() => handleChangeChargingPage(chargingCurrentPage + 1)}
              disabled={chargingCurrentPage === totalChargingPages}
            >
              <ArrowForwardIosOutlinedIcon style={{ fontSize: "10px" }} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
      <button
  type="button"
  className="px-4 py-1 w-auto rounded-md bg-[#f1f2f3] border text-black font-semibold text-md shadow-sm hover:bg-[#e2e3e5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f1f2f3]"
  onClick={() => (onClose())}

>
  Close
</button>
</div>
      </>
    </Modal>
  );
};

export default ChargeHeadModal;
