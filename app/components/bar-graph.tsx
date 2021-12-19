import * as React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Vehicle, Trip, ChartType } from '~/types';
import { formatBarData } from '~/utils/conversions';
import useWindowSize from '~/hooks/useWindowSize';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarGraphProps {
  ice: Vehicle;
  vehicle: Vehicle;
  trip: Trip;
  chartType: ChartType;
}

export default function BarGraph({
  ice,
  vehicle,
  trip,
  chartType,
}: BarGraphProps) {
  const { width: windowWidth } = useWindowSize();
  const data = React.useMemo(
    () => formatBarData(trip, vehicle, ice),
    [trip, vehicle, ice]
  );

  return (
    <div className="chart-container">
      <Bar
        options={{
          responsive: true,
          aspectRatio: windowWidth && windowWidth < 600 ? 1 : 1.5,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text:
                chartType === 'cost'
                  ? 'Cost Per Month'
                  : 'LBS CO2 Emitted Per Month',
            },
          },
        }}
        data={chartType === 'carbon' ? data.carbon : data.cost}
      />
    </div>
  );
}
