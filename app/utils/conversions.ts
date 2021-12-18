import * as constants from '../constants';
import type { Trip, Vehicle } from '~/types';

export const LBS_CO2_PER_KWH = 0.9;

export const LBS_CO2_PER_GAL_GAS = 19.59;

export function CO2EmissionsPerMileEV(miles: number, mpk: number) {
  return (miles / mpk) * constants.LBS_CO2_PER_KWH;
}

export function CO2EmissionsPerMileGas(miles: number, mpg: number) {
  return (miles / mpg) * constants.LBS_CO2_PER_GAL_GAS;
}

export function costPerMileKwh(miles: number, mpk: number) {
  return (miles / mpk) * constants.DOLLARS_PER_KWH;
}
export function costPerMileGas(miles: number, mpg: number) {
  return (miles / mpg) * constants.DOLLARS_PER_GAL_GAS;
}

export function roundFloat(float: number, places: number) {
  const factor = Math.pow(10, places);
  return Math.round(float * factor) / factor;
}

export function roundFloat2(float: number) {
  return roundFloat(float, 2);
}

export const thousandsFormatter = new Intl.NumberFormat('en-US');
export const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function calculateSavings(
  miles: number,
  vehicleMpk: number,
  iceMpg: number
) {
  return dollarFormatter.format(
    costPerMileGas(miles, iceMpg) - costPerMileKwh(miles, vehicleMpk)
  );
}

export function calculateEmissionsDifference(
  miles: number,
  vehicleMpk: number,
  iceMpg: number
) {
  return thousandsFormatter.format(
    Math.round(
      CO2EmissionsPerMileGas(miles, iceMpg) -
        CO2EmissionsPerMileEV(miles, vehicleMpk)
    )
  );
}

export function formatResponse(trip: Trip, vehicle: Vehicle, ice: Vehicle) {
  const miles = constants.MONTHS.map(month => parseInt(trip[month], 10));
  const vehicleMpk = parseFloat(vehicle['Miles per kWh']);
  const iceMpg = parseFloat(ice['Miles per gallon']);

  const labels = constants.MONTHS.map(
    (month, i) => `${month}: ${trip[month]} miles`
  );
  const cost = {
    labels,
    datasets: [
      {
        label: `EV - ${vehicle.Year} ${vehicle.Make} ${vehicle.Model}`,
        data: miles.map(miles =>
          roundFloat2(costPerMileKwh(miles, vehicleMpk))
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: `ICE - ${ice.Year} ${ice.Make} ${ice.Model}`,
        data: miles.map(miles => roundFloat2(costPerMileGas(miles, iceMpg))),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  const carbon = {
    labels,
    datasets: [
      {
        label: `EV - ${vehicle.Year} ${vehicle.Make} ${vehicle.Model}`,
        data: miles.map(miles =>
          Math.round(CO2EmissionsPerMileEV(miles, vehicleMpk))
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: `ICE - ${ice.Year} ${ice.Make} ${ice.Model}`,
        data: miles.map(miles =>
          Math.round(CO2EmissionsPerMileGas(miles, iceMpg))
        ),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return {
    cost,
    carbon,
  };
}
