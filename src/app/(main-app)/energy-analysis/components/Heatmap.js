import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const hours = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

const getDaysInMonth = (year, month) => {
  return Array.from(
    { length: dayjs(`${year}-${month}-01`).daysInMonth() },
    (_, i) => (i + 1).toString().padStart(2, '0')
  );
};

const getColor = (value, min, max) => {
  const percent = (value - min) / (max - min || 1);
  if (percent < 0.2) return '#006d5b';
  if (percent < 0.4) return '#61ad89';
  if (percent < 0.6) return '#cbe385';
  if (percent < 0.8) return '#f6c143';
  return '#f95b3c';
};

export default function HeatmapPage({ externalData, year, month, sourceType }) {
  const days = getDaysInMonth(year, month);
  const [data, setData] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [hoverInfo, setHoverInfo] = useState(null);

  const cellWidth = 41;
  const cellHeight = 18;
  const leftPadding = 60;
  const bottomPadding = 30;

  useEffect(() => {
    const filteredData = externalData.filter(
      (entry) =>
        entry.year === year &&
        entry.month === month &&
        (sourceType === 'All' || entry.sourceType === sourceType)
    );

    const rows = hours.map((hour) => {
      const row = { hour };
      days.forEach((day) => {
        const matchedEntry = filteredData.find(
          (entry) => entry.hour === hour && entry[day] !== undefined
        );
        row[day] = matchedEntry ? matchedEntry[day] : 0;
      });
      return row;
    });

    const allValues = rows.flatMap((row) => days.map((day) => row[day]));
    setMin(Math.min(...allValues));
    setMax(Math.max(...allValues));
    setData(rows);
  }, [year, month, sourceType, externalData]);

  const reversedData = [...data].reverse();
  const svgWidth = days.length * cellWidth + leftPadding + 10;
  const svgHeight = reversedData.length * cellHeight + bottomPadding;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Heatmap */}
      <div style={{ overflowX: 'auto', marginTop: 0 }}>
        <svg width={svgWidth} height={svgHeight}>
          {/* Grid lines */}
          {reversedData.map((_, rowIndex) => (
            <line
              key={`h-line-${rowIndex}`}
              x1={leftPadding}
              y1={rowIndex * cellHeight}
              x2={days.length * cellWidth + leftPadding}
              y2={rowIndex * cellHeight}
              stroke="#ccc"
              strokeWidth={0.5}
            />
          ))}
          {days.map((_, colIndex) => (
            <line
              key={`v-line-${colIndex}`}
              x1={colIndex * cellWidth + leftPadding}
              y1={0}
              x2={colIndex * cellWidth + leftPadding}
              y2={reversedData.length * cellHeight}
              stroke="#ccc"
              strokeWidth={0.5}
            />
          ))}

          {/* Rectangles */}
          {reversedData.map((row, rowIndex) =>
            days.map((day, colIndex) => {
              const value = row[day];
              const x = colIndex * cellWidth + leftPadding;
              const y = rowIndex * cellHeight;

              return (
                <rect
                  key={`${row.hour}-${day}`}
                  x={x}
                  y={y}
                  width={cellWidth}
                  height={cellHeight}
                  fill={getColor(value, min, max)}
                  stroke="#fff"
                  onMouseEnter={(e) => {
                    const bounds = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                    const svgLeft = bounds.left;
                    const svgTop = bounds.top;
                    setHoverInfo({
                      x: e.clientX - svgLeft,
                      y: e.clientY - svgTop,
                      hour: row.hour,
                      day,
                      value,
                    });
                  }}
                  onMouseLeave={() => setHoverInfo(null)}
                />
              );
            })
          )}

          {/* Y-axis labels */}
          {reversedData.map((row, rowIndex) => (
            <text
              key={`y-label-${row.hour}`}
              x={leftPadding - 6}
              y={rowIndex * cellHeight + cellHeight / 2 + 4}
              textAnchor="end"
              fontSize="11"
              fill="currentColor"
              className="text-black dark:text-white"
            >
              {row.hour}
            </text>
          ))}

          {/* X-axis labels */}
          {days.map((day, colIndex) => (
            <text
              key={`x-label-${day}`}
              x={colIndex * cellWidth + leftPadding + cellWidth / 2}
              y={reversedData.length * cellHeight + 15}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              className="text-black dark:text-white"
            >
              {day}
            </text>
          ))}
        </svg>
      </div>

      {/* Tooltip */}
      {hoverInfo && (
        <div
          style={{
            position: 'absolute',
            left: hoverInfo.x + 10,
            top: hoverInfo.y + 10,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 8px',
            fontSize: 12,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          <div><strong>Hour:</strong> {hoverInfo.hour}</div>
          <div><strong>Day:</strong> {hoverInfo.day}</div>
          <div><strong>Value:</strong> {hoverInfo.value}</div>
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
