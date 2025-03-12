// components/BarChart.js

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data }) => {
  // Combine the timestamp and kwh into a single array of objects
  const chartData = data.timestamp.map((time, index) => ({
    timestamp: time,
    kwh: data.kwh[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timestamp" 
          angle={-45} 
          textAnchor="end" 
          fontSize={10}
          interval={0} // Ensure all labels are displayed
          height={100} // Increase height for better label visibility
        />
        <YAxis />
        <Tooltip />
        <Legend 
          layout="horizontal" 
          align="center" 
          verticalAlign="top"
          wrapperStyle={{ marginBottom: 20 }} // Add margin on top of the legend
        />
        <Bar dataKey="kwh" fill="#4bc0c0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
