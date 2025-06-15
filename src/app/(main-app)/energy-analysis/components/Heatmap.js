import React, { useEffect, useState, useRef } from 'react';
import { ResponsiveContainer, Surface, Rectangle } from 'recharts';
import { Spin } from 'antd';

import dayjs from 'dayjs';

const getColor = (value, min, max) => {
  if (min === max) return '#006d5b';
  const percent = (value - min) / (max - min);
  if (percent < 0.2) return '#006d5b';
  if (percent < 0.4) return '#61ad89';
  if (percent < 0.6) return '#cbe385';
  if (percent < 0.8) return '#f6c143';
  return '#f95b3c';
};

export default function HeatmapPage({ data = { timestamp: [], value: []} , Energytype}) {
  const [gridData, setGridData] = useState({ rows: [], days: [] });
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const cellHeight = 20;
  const paddingLeft = 40;
  const minCellWidth = 30;

  useEffect(() => {
    setLoading(true);
    if (!Array.isArray(data.timestamp) || !Array.isArray(data.value) || !data.timestamp.length || !data.value.length) {
      setGridData({ rows: [], days: [] });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const raw = data.timestamp.map((ts, i) => ({
        day: dayjs(ts).format('DD'),
        fullDate: dayjs(ts).format('YYYY/MM/DD'),
        hour: parseInt(dayjs(ts).format('H')),
        value: parseFloat(data.value[i]),
      }));

      const values = raw.map(d => d.value);
      setMin(Math.min(...values));
      setMax(Math.max(...values));

      const grouped = {};
      raw.forEach(({ day, hour, value, fullDate }) => {
        if (!grouped[day]) grouped[day] = {};
        grouped[day][hour] = { value, fullDate };
      });

      const days = Object.keys(grouped).sort();
      const rows = [];

      for (let hour = 0; hour < 24; hour++) {
        const row = { hour };
        days.forEach(day => {
          row[day] = grouped[day][hour] ?? null;
        });
        rows.push(row);
      }

      setGridData({ rows, days });
      setLoading(false);
    }, 300); // Delay สำหรับแสดง loading effect
  }, [data]);

  const hasNoData =
    !Array.isArray(data.timestamp) ||
    !Array.isArray(data.value) ||
    !data.timestamp.length ||
    !data.value.length ||
    !gridData.rows.length ||
    !gridData.days.length;

  if (loading) {
    return (
      <div
  style={{
    width: '100%',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <Spin tip="Loading heatmap..." size="large" />
</div>

    );
  }

  if (hasNoData) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          color: '#888',
          borderRadius: 12,
          border: '1px solid #ddd',
        }}
      >
        No data available
      </div>
    );
  }

  const dayCount = gridData.days.length;
  const containerWidth = containerRef.current?.offsetWidth || 1000;
  const cellWidth = Math.max((containerWidth - paddingLeft) / dayCount, minCellWidth);
  const graphWidth = cellWidth * dayCount + paddingLeft;
  const height = 24 * cellHeight + 40;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 'auto', // ใช้ความสูงเต็มหน้าจอ
        overflow: 'hidden', // ปิดการ scroll ทั้งแนวนอนและแนวตั้ง
        position: 'relative',
      }}
    >
      <div style={{ width: graphWidth }}>
        <ResponsiveContainer width="100%" height={height}>
          <Surface>
            {/* Y-Axis (Hours) */}
            {gridData.rows.map((row, rowIndex) => (
              <text
                key={`hour-label-${rowIndex}`}
                x={0}
                y={(24 - 1 - rowIndex) * cellHeight + 15}
                fontSize={10}
                fill="#444"
              >
                {row.hour}:00
              </text>
            ))}
  
            {/* Grid Cells */}
            {gridData.rows.map((row, rowIndex) =>
              gridData.days.map((day, colIndex) => {
                const cell = row[day];
                const value = cell?.value ?? null;
                const fullDate = cell?.fullDate;
                const color = value != null ? getColor(value, min, max) : '#eee';
  
                const x = colIndex * cellWidth + paddingLeft;
                const y = (24 - 1 - rowIndex) * cellHeight;
  
                return (
                  <Rectangle
                    key={`cell-${rowIndex}-${colIndex}`}
                    x={x}
                    y={y}
                    width={cellWidth}
                    height={cellHeight}
                    fill={color}
                    stroke="#fff"
                    onMouseEnter={(e) => {
                      const bounds = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                      setHoverInfo({
                        x: e.clientX - bounds.left + 10,
                        y: e.clientY - bounds.top + 10,
                        value,
                        hour: row.hour,
                        day: fullDate,
                      });
                    }}
                    onMouseLeave={() => setHoverInfo(null)}
                  />
                );
              })
            )}
  
            {/* X-Axis (Days) */}
            {gridData.days.map((day, colIndex) => (
              <text
                key={`day-label-${day}`}
                x={colIndex * cellWidth + paddingLeft + cellWidth / 2}
                y={24 * cellHeight + 10}
                fontSize={10}
                textAnchor="middle"
                fill="#444"
              >
                {day}
              </text>
            ))}
          </Surface>
        </ResponsiveContainer>
      </div>
  
     {hoverInfo && (
  <div
    style={{
      position: 'absolute',
      left: Math.max(
        Math.min(hoverInfo.x, containerRef.current?.offsetWidth - 200), // Prevent overflow on the right
        0 // Prevent overflow on the left
      ),
      top: Math.max(
        Math.min(
          hoverInfo.y, 
          containerRef.current?.offsetHeight - 80 // Adjust to prevent overflow at the bottom
        ),
        0 // Prevent overflow at the top
      ),
      background: 'white',
      padding: '8px 12px',
      fontSize: 14,
      borderRadius: 8,
      border: '1px solid #ccc',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
      pointerEvents: 'none',
      zIndex: 10,
      whiteSpace: 'nowrap',
    }}
  >
    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Day: {hoverInfo.day}</div>
    <div>Hour: {hoverInfo.hour}:00</div>
    <div>{Energytype}: {hoverInfo.value} kWh</div>
  </div>
)}
  
      {/* Legend */}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Less</span>
        <div
          style={{
            width: 200,
            height: 20,
            margin: '0 10px',
            background: 'linear-gradient(to right, #006d5b, #61ad89, #cbe385, #f6c143, #f95b3c)',
            borderRadius: 4,
          }}
        />
        <span>More</span>
      </div>
    </div>
  );
}
