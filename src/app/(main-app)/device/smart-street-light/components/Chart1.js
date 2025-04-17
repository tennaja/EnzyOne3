import React, { useMemo, useState, useCallback, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, ReferenceArea } from "recharts";

const MyChart = ({ graphdata }) => {
  const [visibleLines, setVisibleLines] = useState({
    kw: true,
    dimming: true,
    status: true,
  });

  const [hoveredLegend, setHoveredLegend] = useState(null);
  const [zoomDomain, setZoomDomain] = useState(null);
  const [startZoom, setStartZoom] = useState(null);
  const [tempDomain, setTempDomain] = useState(null);
  const [chartKey, setChartKey] = useState(0); // เพิ่ม state เพื่อเปลี่ยน key ของ chart

  // Reset zoomDomain when graphdata changes & force re-render
  useEffect(() => {
    setZoomDomain(null);
    setChartKey((prevKey) => prevKey + 1); // บังคับให้ chart re-render
  }, [graphdata]);

  const data = useMemo(() => {
    if (!graphdata || !graphdata.timestamp) return [];
    return graphdata.timestamp.map((time, index) => ({
      timestamp: time,
      kw: graphdata.kw?.[index] ?? 0,
      dimming: graphdata.dimming?.[index] ?? 0,
      status: graphdata.status?.[index] ?? 0,
    }));
  }, [graphdata]);

  const selectLine = (e) => {
    setVisibleLines((prevState) => ({
      ...prevState,
      [e.dataKey]: !prevState[e.dataKey],
    }));
  };

  const getLegendStyle = (dataKey) => ({
    color: visibleLines[dataKey] ? "black" : "gray",
    fontWeight: hoveredLegend === dataKey ? "bold" : "normal",
    cursor: "pointer",
  });

  const handleMouseDown = useCallback((event) => {
    if (event.activeLabel) {
      setStartZoom(event.activeLabel);
      setTempDomain([event.activeLabel, event.activeLabel]);
    }
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (startZoom !== null && event.activeLabel) {
        const newDomain = [startZoom, event.activeLabel].sort();
        setTempDomain(newDomain);
      }
    },
    [startZoom]
  );

  const handleMouseUp = useCallback(() => {
    if (tempDomain) {
      setZoomDomain(tempDomain);
      setTempDomain(null);
      setStartZoom(null);
    }
  }, [tempDomain]);

  const handleDoubleClick = useCallback(() => {
    setZoomDomain(null);
  }, []);

  const filteredData = useMemo(() => {
    if (!zoomDomain) return data;
    return data.filter((d) => d.timestamp >= zoomDomain[0] && d.timestamp <= zoomDomain[1]);
  }, [data, zoomDomain]);

  return (
    <div style={{ userSelect: "none", width: "100%", textAlign: "left" }}>
      <button onClick={handleDoubleClick} className="border-2 border-gray-400 rounded-lg p-1">
        Zoom Out
      </button>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          key={chartKey} // ใช้ key เพื่อบังคับให้ component re-render
          data={filteredData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} domain={zoomDomain || ["dataMin", "dataMax"]} allowDataOverflow={true} />
          <YAxis yAxisId="left" orientation="left" label={{ value: "kW", position: "top", offset: 15, angle: 0 }} />
          <YAxis yAxisId="statusAxis" orientation="left" domain={[0, 1]} tickCount={2} label={{ value: "Status", position: "top", offset: 15, angle: 0 }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "%", position: "top", offset: 15, angle: 0 }} />
          <Tooltip
            formatter={(value, name) => {
              const nameMapping = {
                "Power (kW)": "Power (kW)",
                "Dimming (%)": "Dimming (%)",
                "Status (On/Off)": "Status (On/Off)",
              };
              return [value, nameMapping[name] || name]; // เปลี่ยนชื่อใน Tooltip
            }}
          />
          {visibleLines.kw && <Line type="monotone" dataKey="kw" stroke="blue" strokeWidth={2} yAxisId="left" dot name="Power (kW)" />}
          {visibleLines.dimming && <Line type="monotone" dataKey="dimming" stroke="#FFCC33" strokeWidth={2} yAxisId="right" name="Dimming (%)" />}
          {visibleLines.status && <Line type="stepAfter" dataKey="status" stroke="green" strokeWidth={2} yAxisId="statusAxis" dot name="Status (On/Off)" />}
          

          <Legend
            onClick={selectLine}
            onMouseEnter={(e) => setHoveredLegend(e.dataKey)}
            onMouseLeave={() => setHoveredLegend(null)}
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 20 }}
            payload={[
              { value: "Power (kW)", type: "line", color: visibleLines.kw ? "blue" : "gray", dataKey: "kw", style: getLegendStyle("kw") },
              { value: "Dimming (%)", type: "line", color: visibleLines.dimming ? "#FFCC33" : "gray", dataKey: "dimming", style: getLegendStyle("dimming") },
              { value: "Status (On/Off)", type: "line", color: visibleLines.status ? "green" : "gray", dataKey: "status", style: getLegendStyle("status") },
            ]}
          />

          {tempDomain && tempDomain.length === 2 && tempDomain[0] !== tempDomain[1] && (
            <ReferenceArea x1={tempDomain[0]} x2={tempDomain[1]} stroke="red" strokeOpacity={1} strokeWidth={2} fill="rgba(255, 0, 0, 0.3)" fillOpacity={0.6} ifOverflow="hidden" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyChart;
