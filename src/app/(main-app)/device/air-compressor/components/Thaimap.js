import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_thailandHigh from '@amcharts/amcharts4-geodata/thailandHigh';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // นำเข้า MUI Icon

const Map = () => {
  useEffect(() => {
    let chart = am4core.create('chartdiv', am4maps.MapChart);
    chart.geodata = am4geodata_thailandHigh;
    chart.projection = new am4maps.projections.Miller();

    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    // สร้าง Image Series สำหรับ markers
    let markerSeries = chart.series.push(new am4maps.MapImageSeries());
    let markerTemplate = markerSeries.mapImages.template;

    // ข้อมูลตำแหน่งที่ต้องการปักไอคอน
    markerSeries.data = [
      { latitude: 13.736717, longitude: 100.523186 },  // กรุงเทพฯ
      { latitude: 18.7883, longitude: 98.9860 },      // เชียงใหม่
      { latitude: 7.8804, longitude: 98.3923 },       // ภูเก็ต
    ];

    // สร้าง div สำหรับแสดงไอคอน
    markerSeries.dataItems.each((dataItem) => {
      const marker = dataItem.mapImage;

      // สร้าง div ที่มีไอคอน
      const iconDiv = document.createElement('div');
      iconDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="red">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 3.03 2.62 6.29 6 9.56 3.38-3.27 6-6.53 6-9.56 0-3.87-3.13-7-7-7zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 8.5 12 8.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>`;

      // เพิ่ม div ที่มีไอคอนลงในตำแหน่ง marker
      marker.htmlElement.appendChild(iconDiv);

      // ตั้งค่าตำแหน่งให้ไอคอนอยู่ตรงกลาง
      iconDiv.style.position = 'absolute';
      iconDiv.style.transform = 'translate(-50%, -50%)';
      iconDiv.style.pointerEvents = 'none';  // ป้องกันไม่ให้ไอคอนขัดการทำงานของแผนที่
    });

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: '100%', height: '500px' }} />;
};

export default Map;
