'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ReferenceLine,
  Brush,
  CartesianGrid,
} from 'recharts';

const rawData = [];

for (let day = 1; day <= 3; day++) {
  const time = `${day.toString().padStart(2, '0')}`;

  rawData.push({
    day: time,
    gen1: 40 + Math.floor(Math.random() * 50),
    gen2: 50 + Math.floor(Math.random() * 50),
    gen3: 30 + Math.floor(Math.random() * 50),
    forecastGen1: 45 + Math.floor(Math.random() * 40),
    forecastGen2: 55 + Math.floor(Math.random() * 30),
    forecastGen3: 35 + Math.floor(Math.random() * 30),
  });
}

const data = rawData.map(item => ({ ...item }));

const maxY = Math.max(
  ...data.flatMap(item => [
    item.gen1,
    item.gen2,
    item.gen3,
    item.forecastGen1,
    item.forecastGen2,
    item.forecastGen3,
  ])
);

export default function EnergyTrendChart3({ type }) {
  const isSummaryType = type === 'month' || type === 'year' || type === 'lifetime';

  const renderUnitLabel = () => (
    <text
    x={40}
    y={15}
    fontSize={15}
    fontWeight="bold"
    fill="currentColor"
    className="text-black dark:text-white"
  >
    kWh
  </text>
  );

  if (isSummaryType) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} barCategoryGap={10} margin={{ top: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, maxY]} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
          {renderUnitLabel()}

          {/* Load Bars */}
          <Bar dataKey="gen1" stackId="load" name="Load 1" fill="#FFB74D" />
          <Bar dataKey="gen2" stackId="load" name="Load 2" fill="#81C784" />
          <Bar dataKey="gen3" stackId="load" name="Load 3" fill="#4FC3F7" />

          {/* Baseline Load Bars */}
          <Bar dataKey="forecastGen1" stackId="baseline" name="Baseline Load A" fill="#FFD54F" />
          <Bar dataKey="forecastGen2" stackId="baseline" name="Baseline Load B" fill="#AED581" />
          <Bar dataKey="forecastGen3" stackId="baseline" name="Baseline Load C" fill="#81D4FA" />

          <Brush dataKey="day" height={30} stroke="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[0, maxY]} />
        <Tooltip />
        <Legend wrapperStyle={{ marginBottom: -20 }} />
        <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
        {renderUnitLabel()}

        {/* Only Load Lines */}
        <Line type="monotone" dataKey="gen1" stroke="#FB8C00" strokeWidth={2} name="Load 1" />
        <Line type="monotone" dataKey="gen2" stroke="#008001" strokeWidth={2} name="Load 2" />
        <Line type="monotone" dataKey="gen3" stroke="#03A9F4" strokeWidth={2} name="Load 3" />

        <Brush dataKey="day" height={30} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
