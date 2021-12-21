import * as React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import type { Vehicle, Trip, ChartType } from '~/types';
import { formatAccumulationData } from '~/utils/conversions';
import useWindowSize from '~/hooks/useWindowSize';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

export default function LineChart({
  ice,
  vehicle,
  trip,
  chartType,
}: BarGraphProps) {
  const { width: windowWidth } = useWindowSize();
  const data = React.useMemo(
    () => formatAccumulationData(trip, vehicle, ice),
    [trip, vehicle, ice]
  );

  return (
    <div className="chart-container">
      <Line
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
