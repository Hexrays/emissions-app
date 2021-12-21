import * as React from 'react';
import { MetaFunction, LoaderFunction } from 'remix';
import { useLoaderData, json } from 'remix';
import invariant from 'tiny-invariant';
import type { Vehicle, Trip } from '~/types';
import { getGasGuzzler, getInputs, getTrip } from '~/utils/csv.server';
import {
  calculateSavings,
  calculateEmissionsDifference,
  thousandsFormatter,
} from '~/utils/conversions';
import BarGraph from '~/components/bar-graph';
import { MONTHS } from '~/constants';

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
  const ice = await getGasGuzzler();
  const vehicle = inputs[params.slug];
  const trip = await getTrip(params.slug);
  if (!trip) {
    throw new Response('Trip Not Found', {
      status: 404,
      statusText: 'Trip Not Found',
    });
  }
  return json({ ice, vehicle, trip });
};

export function CatchBoundary() {
  return (
    <div>
      <h2>We couldn't find that page! Select another trip.</h2>
    </div>
  );
}

export default function Slug() {
  let inputs = useLoaderData<LoaderData>();
  const [chartType, setChartType] = React.useState<'cost' | 'carbon'>('cost');
  const { trip, vehicle, ice } = inputs;

  const totalMiles = MONTHS.reduce(
    (total, month) => total + parseInt(trip[month], 10),
    0
  );

  return (
    <div className="trips">
      <BarGraph trip={trip} vehicle={vehicle} ice={ice} chartType={chartType} />

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
          Total savings for {thousandsFormatter.format(totalMiles)} miles
          traveled:{' '}
          {chartType === 'cost'
            ? calculateSavings(
                totalMiles,
                parseFloat(vehicle['Miles per kWh']),
                parseFloat(ice['Miles per gallon'])
              )
            : `${calculateEmissionsDifference(
                totalMiles,
                parseFloat(vehicle['Miles per kWh']),
                parseFloat(ice['Miles per gallon'])
              )} lbs CO2`}
        </div>
      </div>
    </div>
  );
}
