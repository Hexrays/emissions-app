import * as React from 'react';
import type { MetaFunction, LoaderFunction, LinksFunction } from 'remix';
import { useLoaderData, json } from 'remix';
import invariant from 'tiny-invariant';
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
import type { Vehicle, Trip } from '~/types';
import { getGasGuzzler, getInputs, getTrip } from '~/utils/csv.server';
import {
  formatResponse,
  calculateSavings,
  calculateEmissionsDifference,
  thousandsFormatter,
} from '~/utils/conversions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export let meta: MetaFunction = ({ data }) => {
  const title = `⚡ ${data?.vehicle.Year} ${data?.vehicle.Make} ${data?.vehicle.Model}`;
  return {
    title: title || 'oops',
  };
};

interface LoaderData {
  ice: Vehicle;
  vehicle: Vehicle;
  trip: Trip;
}

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  const inputs = await getInputs();
  const trip = await getTrip(params.slug);
  const ice = await getGasGuzzler();
  const vehicle = inputs[params.slug];
  return json({ ice, vehicle, trip });
};

export default function Index() {
  let inputs = useLoaderData<LoaderData>();
  const [chartType, setChartType] = React.useState<'cost' | 'carbon'>('cost');
  const { trip, vehicle, ice } = inputs;

  const data = React.useMemo(
    () => formatResponse(trip, vehicle, ice),
    [trip, vehicle, ice]
  );

  return (
    <div className="trips">
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

      <div>
        <label>
          <input
            type="radio"
            value="cost"
            name="results"
            checked={chartType === 'cost'}
            onChange={e => setChartType('cost')}
          />{' '}
          Cost Per Month
        </label>{' '}
        <label>
          <input
            type="radio"
            value="carbon"
            name="results"
            checked={chartType === 'carbon'}
            onChange={e => setChartType('carbon')}
          />{' '}
          Carbon Emissions Per Month
        </label>
      </div>
      <div>
        <div>
          Total Savings for miles traveled{' '}
          {thousandsFormatter.format(data.totalMiles)}{' '}
          {chartType === 'cost'
            ? calculateSavings(
                data.totalMiles,
                parseFloat(vehicle['Miles per kWh']),
                parseFloat(ice['Miles per gallon'])
              )
            : `${calculateEmissionsDifference(
                data.totalMiles,
                parseFloat(vehicle['Miles per kWh']),
                parseFloat(ice['Miles per gallon'])
              )} lbs CO2`}
        </div>
      </div>
    </div>
  );
}
