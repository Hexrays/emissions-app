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
import { formatResponse } from '~/utils/conversions';

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
  const data = React.useMemo(
    () => formatResponse(trip, vehicle, ice),
    [trip, vehicle, ice]
  );

  return (
    <Bar
      options={{
        responsive: true,
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
  );
}
