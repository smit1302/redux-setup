import React, { useEffect, useRef } from 'react';
import Title from './Title';
import ApexCharts from 'apexcharts';

// Generate Sales Data
function createData(time: string, amount: number | null) {
  return { x: time, y: amount };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', null),
];

export default function Chart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        },
        height: '100%', 
        animations: {
          enabled: false 
        }
      },
      series: [{
        name: 'Sales',
        data: data.map(point => ({ x: point.x, y: point.y === null ? undefined : point.y }))
      }],
      xaxis: {
        categories: data.map(point => point.x),
        tickAmount: 2,
        labels: {
          style: {
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            colors: 'inherit'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (val: number) { 
            return "$" + val;
          },
          style: {
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            colors: 'inherit'
          }
        },
        max: 2500,
        tickAmount: 3
      },
      stroke: {
        width: 2
      },
      colors: ['#007bff'], 
      markers: {
        size: 0 
      },
      dataLabels: {
        enabled: false 
      }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <React.Fragment>
      <Title>Today</Title>
      <div ref={chartRef} style={{ width: '100%', height: '240px' }} />
    </React.Fragment>
  );
}






