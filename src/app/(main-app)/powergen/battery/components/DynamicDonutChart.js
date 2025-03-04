import React, { useRef, useEffect } from "react";
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const DynamicDonutChart = ({ value, color }) => {
  const chartRef = useRef(null);
  Chart.register(ChartDataLabels);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              data: [value, 100 - value],
              backgroundColor: [color, "#eaeaea"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: "60%",
          legend: {
            display: false,
          },
          events: [],
          plugins: {
            tooltip: false,
            hover: false,
            datalabels: {
              display: false,
              color: "#000",
              font: {
                size: "16",
                weight: "bold",
              },
              formatter: (value) => {
                return value + "%";
              },
              anchor: 'center',
              align: 'center',
              offset: 0,
            },
          },
          animation: {
            onComplete: function () {
              
              // Add the center label manually
              var canvasBounds = chartRef.current?.getBoundingClientRect();
              const centerX = canvasBounds?.width / 2;
              const centerY = canvasBounds?.height / 2;

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = color;
              ctx.font = "bold 20pt inter";
              ctx.fillText(value, centerX, centerY);
            }
          }
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [value, color]);

  return <canvas ref={chartRef} />;
};

export default DynamicDonutChart;
